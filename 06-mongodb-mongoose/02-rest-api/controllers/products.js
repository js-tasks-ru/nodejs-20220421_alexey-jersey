const mongoose = require('mongoose');
const Product = require('../models/Product');

const productsDataNormalized = require('../helpers/productsDataNormalized');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const data = await Product.find({subcategory});
  const products = productsDataNormalized(data);

  ctx.body = {products};
};

module.exports.productList = async function productList(ctx, next) {
  const data = await Product.find();
  const products = productsDataNormalized(data);

  ctx.body = {products};
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.params;

  if (!id) return next();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    ctx.status = 400;
    ctx.body = 'invalid product id';
  }

  try {
    const data = await Product.find({_id: id});
    const product = productsDataNormalized(data)[0];

    if (!product) {
      ctx.status = 404;
      ctx.body = 'product not exist';
    }

    ctx.body = {product};
  } catch (e) {
    ctx.body = e.message;
  }
};

