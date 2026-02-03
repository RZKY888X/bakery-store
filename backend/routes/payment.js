const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');
const prisma = new PrismaClient();

const { Xendit } = require('xendit-node');

// Initialize Xendit Client
const xenditClient = new Xendit({
    secretKey: process.env.XENDIT_SECRET_KEY,
});

const { Invoice } = xenditClient;

router.post('/xendit', authMiddleware, async (req, res) => {
    try {
        const { items, total, customer, externalId } = req.body;
        const currentExternalId = externalId || `ORDER-${Date.now()}`;

        // 1. Create Order in Database first (Status: PENDING)
        // We assume req.user is populated by authMiddleware
        const order = await prisma.order.create({
            data: {
                userId: req.user.id,
                totalAmount: parseFloat(total),
                status: 'PENDING',
                shippingAddress: customer?.address || null,
                paymentMethod: 'XENDIT',
                items: {
                    create: items.map(item => ({
                        productId: item.id, // Assuming item has 'id' property from frontend cart
                        quantity: item.quantity,
                        price: parseFloat(item.price),
                    })),
                },
            },
        });

        // 2. Xendit Invoice Options
        const data = {
            amount: Math.round(total),
            invoiceDuration: 172800, // 2 days
            externalId: currentExternalId,
            description: `Order #${order.id} - ${items.length} item(s)`,
            currency: 'IDR',
            reminderTime: 1,
            customer: {
                givenNames: customer.firstName,
                surname: customer.lastName,
                mobileNumber: customer.phone,
            },
            items: items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: Math.round(item.price)
            })),
            successRedirectUrl: 'http://localhost:3000/success',
            failureRedirectUrl: 'http://localhost:3000/checkout?status=failed'
        };

        const response = await Invoice.createInvoice({ data });
        
        // 3. Return Invoice URL
        res.json({ 
            invoiceUrl: response.invoiceUrl, 
            invoiceId: response.id,
            externalId: response.externalId,
            orderId: order.id
        });

    } catch (error) {
        console.error("Payment/Order Error:", error);
        res.status(500).json({ message: error.message });
    }
});

// Mobile-specific endpoint with deep link redirects
router.post('/xendit/mobile', authMiddleware, async (req, res) => {
    try {
        const { items, total, customer, shippingAddress } = req.body;
        const currentExternalId = `ORDER-MOBILE-${Date.now()}`;

        // 1. Create Order in Database first (Status: PENDING)
        const order = await prisma.order.create({
            data: {
                userId: req.user.id,
                totalAmount: parseFloat(total),
                status: 'PENDING',
                shippingAddress: shippingAddress || '',
                items: {
                    create: items.map(item => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: parseFloat(item.price),
                    })),
                },
            },
        });

        // 2. Xendit Invoice Options with deep link redirects for mobile
        const data = {
            amount: Math.round(total),
            invoiceDuration: 172800, // 2 days
            externalId: currentExternalId,
            description: `Order #${order.id} - ${items.length} item(s)`,
            currency: 'IDR',
            reminderTime: 1,
            customer: {
                givenNames: customer.firstName,
                surname: customer.lastName,
                mobileNumber: customer.phone,
            },
            items: items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: Math.round(item.price)
            })),
            // Deep link URLs for mobile app
            successRedirectUrl: `swadista://payment/success?orderId=${order.id}`,
            failureRedirectUrl: `swadista://payment/failed?orderId=${order.id}`
        };

        const response = await Invoice.createInvoice({ data });
        
        // 3. Return Invoice URL
        res.json({ 
            invoiceUrl: response.invoiceUrl, 
            invoiceId: response.id,
            externalId: response.externalId,
            orderId: order.id
        });

    } catch (error) {
        console.error("Mobile Payment/Order Error:", error);
        res.status(500).json({ message: error.message });
    }
});

// Endpoint to Simulate Success Callback / Webhook (Simplified for Demo)
router.post('/success-callback', authMiddleware, async (req, res) => {
    try {
        const { orderId } = req.body;
        
        // Update order status to PROCESSED immediately upon payment success
        // This indicates the order is paid and currently being processed/prepared
        const order = await prisma.order.update({
            where: { id: parseInt(orderId) },
            data: { status: 'PROCESSED' } 
        });

        res.json({ message: 'Order status updated to PROCESSED', order });
    } catch (error) {
        console.error("Callback Error:", error);
        res.status(500).json({ message: 'Failed to update order status' });
    }
});

module.exports = router;
