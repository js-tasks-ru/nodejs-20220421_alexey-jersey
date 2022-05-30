module.exports = function productsDataNormalized(data) {
  if (data && data.length) {
    return data.map((product) => {
      const {_id, title, images, category, subcategory, price, description} = product;
      return {
        id: _id.toString(),
        title,
        images,
        category: category.toString(),
        subcategory: subcategory.toString(),
        price,
        description,
      };
    });
  }
  return [];
};

