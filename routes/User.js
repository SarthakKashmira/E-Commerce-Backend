const express = require('express');
const { updateUser,fetchUserById} = require('../controller/User');

const router = express.Router();
//  /brands is already added in base path
router.put('/:id', updateUser).get('/own', fetchUserById);

exports.router = router