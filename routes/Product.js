const express=require('express');
const {createProduct, fetchAllProducts,fetchProductById,updateProduct}=require('../controller/Product.js');

const router=express.Router();

router.post('/',createProduct).get('/',fetchAllProducts).get('/:id', fetchProductById).put('/:id', updateProduct)

exports.router=router;
