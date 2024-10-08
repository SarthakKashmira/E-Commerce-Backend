const { response } = require('express');
const { Cart } = require('../model/Cart');

exports.fetchCartByUser=async(req,res)=>{
  const {id}=req.user;
  try{
    const cart=await Cart.find({user:id}).populate('user').populate('product');
    res.status(200).json(cart);

  }catch(err){
    res.status(400).json(err);
  }
}

exports.addToCart=async(req,res)=>{
    const {id}=req.user;
    const cart = new Cart({...req.body,user:id});
    try {
      const doc = await cart.save();
      const result=await doc.populate('product');
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json(err);
    }
}



exports.updateCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, {new:true});
    const updatedCart = await cart.save();
    const result=await updatedCart.populate('product');
    // console.log(updatedProduct);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteFromCart=async(req,res)=>{
  const {id} = req.params;
  console.log(id);
  try{
  const cart=await Cart.findByIdAndDelete(id);
  res.status(200).json(cart);
  }catch(err){
    res.status(400).json(err)
  }
}