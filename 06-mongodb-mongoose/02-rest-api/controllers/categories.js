const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categoriesData = await Category.find();
  let categories = [];

  if (categoriesData && categoriesData.length) {
    categories = categoriesData.map((category) => {
      return {
        id: category._id.toString(),
        title: category.title,
        subcategories: category.subcategories.map((item) => {
          return {
            id: item._id.toString(),
            title: item.title,
          };
        }),
      };
    });
  }

  ctx.body = {categories};
};
