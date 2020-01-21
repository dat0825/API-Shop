const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/products');

const checkAuth = require('../middleware/check-auth');

const OrdersControllers = require("../controllers/order");
router.get("/", checkAuth, OrdersControllers.getAllOrder);

router.post('/createOrder', checkAuth, OrdersControllers.createOrder);

router.get('/:idOrder', checkAuth, OrdersControllers.getOrder);

router.delete("/:idOrder", checkAuth, OrdersControllers.deleteOrder);

module.exports = router;