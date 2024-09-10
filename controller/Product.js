const { Product } = require('../model/Product');

exports.createProduct = async (req, res) => {
  // this product we have to get from API body
  const product = new Product(req.body);
  try {
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.fetchAllProducts = async (req, res) => {
    // this product we have to get from API body
    let query=Product.find({deleted:{$ne:true}});
    if (req.query.category) {
        query = query.find({ category: req.query.category});
      } 
    if (req.query.brand) {
        query = query.find({ brand: req.query.brand});
      }
    if (req.query._sort && req.query._order) {
        query = query.sort({ [req.query._sort]: req.query._order });
      }
    const result=await Product.find(query).count();
    if (req.query._page && req.query._limit) {
        const pageSize = req.query._limit;
        const page = req.query._page;
        query = query.skip(pageSize * (page - 1)).limit(pageSize);
      }  
    

      try {
        const doc = await query.exec();
        res.status(201).json({products:doc,totalItems:result});
      } catch (err) {
        res.status(400).json(err);
      } 
  };

  exports.fetchProductById = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
      const product = await Product.findById(id);
      res.status(200).json(product);
    } catch (err) {
      res.status(400).json(err);
    }
  };
  
  exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
      const product = await Product.findByIdAndUpdate(id, req.body, {new:true});
      // console.log(product);
      product.discountPrice = Math.round(product.price*(1-product.discountPercentage/100))
      const updatedProduct = await product.save()
      // console.log(updatedProduct);
      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(400).json(err);
    }
  };