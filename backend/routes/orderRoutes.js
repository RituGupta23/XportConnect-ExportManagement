const express = require('express');
const { protect, authorize } = require('../middlewares/authMiddleware');
const {
  createOrder,
  getOrdersForBuyer,
  getOrdersForExporter,
  assignShipper,
  updateOrderStatus
} = require('../controllers/orderController');

const router = express.Router();

// Buyer creates an order
router.post('/', protect, authorize('buyer'), createOrder);

// Buyer views their orders
router.get('/buyer', protect, authorize('buyer'), getOrdersForBuyer);

// Exporter views incoming orders
router.get('/exporter', protect, authorize('exporter'), getOrdersForExporter);

// Exporter assigns shipper
router.patch('/:orderId/assign-shipper', protect, authorize('exporter'), assignShipper);

// Exporter order updates status
router.patch('/:orderId/status', protect, authorize('exporter'), updateOrderStatus);

module.exports = router;
