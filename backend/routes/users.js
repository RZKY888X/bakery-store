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

// Delete User (Admin Only) - Cascade delete orders first
router.delete('/:id', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Check if trying to delete an admin
    const userToDelete = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (userToDelete.role === 'ADMIN') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }
    
    // Use transaction to delete user and all related data
    await prisma.$transaction(async (tx) => {
      // 1. Delete all order items from user's orders
      await tx.orderItem.deleteMany({
        where: {
          order: {
            userId: userId
          }
        }
      });
      
      // 2. Delete all user's orders
      await tx.order.deleteMany({
        where: { userId: userId }
      });
      
      // 3. Finally delete the user
      await tx.user.delete({
        where: { id: userId }
      });
    });
    
    res.json({ message: 'User and all related data deleted successfully' });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
});

module.exports = router;
