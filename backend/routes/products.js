const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const prisma = new PrismaClient();

// Get All Products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error with products' });
  }
});

// Get Favorite Products (for Home Page)
router.get('/favorites', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isFavorite: true },
      take: 5, // Limit as requested
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error with favorites' });
  }
});

// Get Single Product
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Product (Admin Only)
router.post('/', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const { name, description, price, image, category, isFavorite } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        category,
        isFavorite: isFavorite || false,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating product' });
  }
});

// Update Product (Admin Only)
router.put('/:id', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const { name, description, price, image, category, isFavorite } = req.body;
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        category,
        isFavorite,
      },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating product' });
  }
});

// Delete Product (Admin Only)
router.delete('/:id', [authMiddleware, adminMiddleware], async (req, res) => {
  const productId = parseInt(req.params.id);
  try {
    // Transaction to remove dependent data first
    await prisma.$transaction(async (tx) => {
      // 1. Delete associated OrderItems
      await tx.orderItem.deleteMany({
        where: { productId: productId },
      });

      // 2. Delete the Product
      await tx.product.delete({
        where: { id: productId },
      });
    });

    res.json({ message: 'Product deleted successfully (including history)' });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: 'Server error deleting product: ' + error.message });
  }
});

module.exports = router;
