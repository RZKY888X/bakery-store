const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const prisma = new PrismaClient();

// Create Order (Checkout)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount } = req.body; // items: [{ productId, quantity, price }]

    // Transaction to create order and order items
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        totalAmount: parseFloat(totalAmount),
        status: 'PENDING',
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: parseFloat(item.price),
          })),
        },
      },
      include: { items: true },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating order' });
  }
});

// Get My Orders
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// Get All Orders (Admin Only)
router.get('/', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: { select: { name: true, email: true } }, items: true },
      orderBy: { createdAt: 'desc' },
      take: 20 // Limit to recent 20 for list
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching all orders' });
  }
});

// Admin Stats
router.get('/stats', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const totalRevenue = await prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { status: { in: ['PAID', 'SHIPPED', 'COMPLETED'] } }
        });
        
        const totalUsers = await prisma.user.count({ where: { role: 'USER' } });
        
        const activeOrders = await prisma.order.count({
            where: { status: { in: ['PENDING', 'PAID'] } }
        });

        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true } } }
        });

        // Determine growth (mock logic for demo purposes, normally needs complex date queries)
        // In a real app, compare with previous month
        
        res.json({
            revenue: totalRevenue._sum.totalAmount || 0,
            users: totalUsers,
            activeOrders: activeOrders,
            recentOrders: recentOrders
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

// Reports Endpoint
router.get('/report', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const { range } = req.query; // today, weekly, monthly
        
        let salesData = [];
        const now = new Date();
        
        if (range === 'weekly') {
             // Last 7 Days
             const sevenDaysAgo = new Date();
             sevenDaysAgo.setDate(now.getDate() - 7);
             
             const orders = await prisma.order.groupBy({
                 by: ['createdAt'],
                 _sum: { totalAmount: true },
                 where: {
                     createdAt: { gte: sevenDaysAgo },
                     status: { in: ['PAID', 'PROCESSED', 'SHIPPED', 'COMPLETED'] }
                 },
                 orderBy: { createdAt: 'asc' }
             });

             // Process data to group by Day locally (since Prisma groupBy date truncation varies by provider)
             const map = {};
             orders.forEach(o => {
                 const day = new Date(o.createdAt).toLocaleDateString('id-ID', { weekday: 'short' });
                 map[day] = (map[day] || 0) + (o._sum.totalAmount || 0);
             });
             
             // Ensure order of days (mocking a bit simpler approach than full date sorting for now)
             salesData = Object.keys(map).map(key => ({ name: key, sales: map[key] }));
             
        } else if (range === 'monthly') {
             // Current Month by Weeks
             const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
             
             const orders = await prisma.order.findMany({
                 where: {
                     createdAt: { gte: startOfMonth },
                     status: { in: ['PAID', 'PROCESSED', 'SHIPPED', 'COMPLETED'] }
                 },
                 select: { createdAt: true, totalAmount: true }
             });

             const map = {};
             orders.forEach(o => {
                 const date = new Date(o.createdAt);
                 const weekNum = Math.ceil((date.getDate() + 6 - date.getDay()) / 7);
                 const key = `Minggu ${weekNum}`;
                 map[key] = (map[key] || 0) + o.totalAmount;
             });

             salesData = Object.keys(map).sort().map(key => ({ name: key, sales: map[key] }));

        } else {
             // Today (Hourly)
             const startOfDay = new Date();
             startOfDay.setHours(0,0,0,0);
             
             const orders = await prisma.order.findMany({
                 where: {
                     createdAt: { gte: startOfDay },
                     status: { in: ['PAID', 'PROCESSED', 'SHIPPED', 'COMPLETED'] }
                 },
                 select: { createdAt: true, totalAmount: true }
             });

             const map = {};
             orders.forEach(o => {
                 const hour = new Date(o.createdAt).getHours();
                 const key = `${hour.toString().padStart(2, '0')}:00`;
                 map[key] = (map[key] || 0) + o.totalAmount;
             });
             
             // Sort by hour
             salesData = Object.keys(map).sort().map(key => ({ name: key, sales: map[key] }));
        }

        res.json({ salesData });

    } catch(error) {
         console.error(error);
         res.status(500).json({ message: 'Error fetching report' });
    }
});

// Update Order Status (Admin Only)
router.put('/:id/status', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const { status } = req.body; // PENDING, PAID, SHIPPED, COMPLETED, CANCELLED
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating order' });
  }
});

module.exports = router;
