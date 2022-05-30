const Product = require('../models/Product');
const productsDataNormalized = require('../../../helpers/productsDataNormalized');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.query;

  try {
    const data = await Product.find(
        {$text: {$search: query}},
        {score: {$meta: 'textScore'}},
    ).sort( {score: {$meta: 'textScore'}} );

    ctx.body = {products: productsDataNormalized(data)};
    ctx.status = 200;
  } catch (e) {
    ctx.status = 500;
    ctx.body = {products: []};
  }
};
