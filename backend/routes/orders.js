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
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching all orders' });
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
