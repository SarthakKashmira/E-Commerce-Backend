const { Order } = require("../model/Order");
const { Product } = require("../model/Product");
const { User } = require("../model/User");


exports.fetchOrdersByUser = async (req, res) => {
    const {id} = req.user;
    console.log(id);
    try {
      const orders = await Order.find({ user: id });
      res.status(200).json(orders);
    } catch (err) {
      res.status(400).json(err);
    }
  };

  exports.createOrder = async (req, res) => {
    const order = new Order(req.body);
    try {
      const doc = await order.save();
      res.status(201).json(doc);
    } catch (err) {
      res.status(400).json(err);
    }
  };

  exports.deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
    const order = await Order.findByIdAndDelete(id);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateOrder = async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(order);
    } catch (err) {
      res.status(400).json(err);
    }
  };

  exports.fetchAllOrdersByFilter = async (req, res) => {
    // this product we have to get from API body
    let query=Order.find({deleted:{$ne:true}});
    console.log("helllllo");
    console.log(req.query);

    if (req.query._sort && req.query._order) {
        query = query.sort({ [req.query._sort]: req.query._order });
      }
    if (req.query._page && req.query._limit) {
        const pageSize = req.query._limit;
        const page = req.query._page;
        query = query.skip(pageSize * (page - 1)).limit(pageSize);
      }  
  
      try {
        const doc = await query.exec();
        res.status(201).json(doc);
      } catch (err) {
        res.status(400).json(err);
      } 
  };

  exports.fetchAllOrders=async(req,res)=>{
    try {
      const orders= await Order.find({}).exec();
      res.status(200).json(orders);
    } catch (err) {
      res.status(400).json(err);
    }
  }