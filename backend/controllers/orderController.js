const Order = require('../models/orderModel');
const crypto = require('crypto');

const generateTrackingNumber = (orderId) => {
  const randomSuffix = crypto.randomBytes(2).toString('hex').toUpperCase(); // 4 chars
  return orderId.toString().slice(0, 4).toUpperCase() + randomSuffix;
};

const createOrder = async (req, res) => {
  try {
    const { exporter, products, shippingAddress } = req.body;

    const productDetails = await Promise.all(
        products.map(async ({ product, quantity }) => {
          const p = await Product.findById(product);
          return p.price * quantity;
        })
      );
    const totalAmount = productDetails.reduce((acc, val) => acc + val, 0);

    const order = await Order.create({
      buyer: req.user._id,
      exporter,
      products,
      totalAmount,
      shippingAddress
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Order creation failed', error: err.message });
  }
};

const getOrdersForBuyer = async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id }).populate('products.product exporter');
  res.json({ success: true, data: orders });
};

const getOrdersForExporter = async (req, res) => {
  const orders = await Order.find({ exporter: req.user._id }).populate('products.product buyer');
  res.json({ success: true, data: orders });
};

const assignShipper = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { shipperId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const trackingNumber = generateTrackingNumber(order._id);

    // Add tracking info after order is created
    order.trackingInfo = {
      trackingNumber,
      status: 'Pending'
    };

    order.assignedShipper = shipperId;
    await order.save();

    res.json({ success: true, message: 'Shipper assigned successfully', data: order });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning shipper', error });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (status) order.status = status;

  await order.save();
  res.json({ success: true, message: 'Order updated', data: order });
};

model.exports = {
    createOrder,
    getOrdersForBuyer,
    getOrdersForExporter,
    assignShipper,
    updateOrderStatus
}