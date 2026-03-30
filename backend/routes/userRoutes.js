const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, updateUser, createUser, toggleBan } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getUsers)
  .post(protect, admin, createUser);

router.route('/:id')
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

router.route('/:id/ban')
  .put(protect, admin, toggleBan);

module.exports = router;
