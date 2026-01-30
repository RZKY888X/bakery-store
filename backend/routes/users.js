const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const prisma = new PrismaClient();

// Get All Users (Admin Only)
router.get('/', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// Delete User (Admin Only)
router.delete('/:id', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting user' });
  }
});

module.exports = router;
