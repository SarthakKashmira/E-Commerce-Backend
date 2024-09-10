const express = require('express');
const { createOrder, fetchOrdersByUser, deleteOrder, updateOrder,fetchAllOrders, fetchAllOrdersByFilter } = require('../controller/Order');

const router = express.Router();
//  /orders is already added in base path
router.post('/', createOrder)
      .get('/', fetchOrdersByUser)
      .delete('/:id', deleteOrder)
      .put('/:id', updateOrder)
      .get('/all/',fetchAllOrders)
      .get('/filters/',fetchAllOrdersByFilter)


exports.router = router;