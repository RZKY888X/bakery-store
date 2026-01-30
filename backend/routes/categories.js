const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const prisma = new PrismaClient();

// Get All Categories
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching categories' });
  }
});

// Create Category (Admin Only)
router.post('/', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const { name } = req.body;
    
    // Check if exists
    const existing = await prisma.category.findUnique({ where: { name } });
    if (existing) {
        return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await prisma.category.create({
      data: { name },
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating category' });
  }
});

// Delete Category (Admin Only)
router.delete('/:id', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    await prisma.category.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting category' });
  }
});

module.exports = router;
