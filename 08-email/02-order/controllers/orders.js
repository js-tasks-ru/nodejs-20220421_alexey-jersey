const Product = require('../models/Product');
const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  if (!ctx.user) {
    ctx.status = 401;
    return next();
  }

  const {product, phone, address} = ctx.request.body;

  const order = await Order.create({
    user: ctx.user.id,
    product,
    phone,
    address,
  });

  if (!order) {
    ctx.status = 400;
    return next();
  }

  const productData = await Product.findOne({id: order.product});

  ctx.body = {
    order: order._id,
    product: product._id,
    phone: order.phone,
    address: order.address,
  };

  await sendMail({
    template: 'order-confirmation',
    locals: {id: order._id.toString(), product: productData},
    to: ctx.user.email,
    subject: 'Подтвердите заказ',
  });
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  if (!ctx.user) {
    ctx.status = 401;
    return next();
  }

  const orders = await Order.find({user: ctx.user.id}).populate('product');

  ctx.body = {orders};
};
