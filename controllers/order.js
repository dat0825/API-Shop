const Order = require('../models/order');
const Product = require('../models/products');
const mongoose = require('mongoose')

exports.getAllOrder = (req, res, next) => {
    Order.find()
        .select('_id product quantity')
        .populate('product', 'name, price')
        .exec()
        .then(result => {
            res.status(200).json({
                listOrders: result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
}

exports.createOrder = (req, res, next) => {
    Product.findById(req.body.idProduct)
        .exec()
        .then(result => {
            if (!result) {
                return (
                    res.status(404).json({
                        message: "idProduct not found"
                    })
                )
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.idProduct
            });

            return order.save();
        })
        .then(result => {
            res.status(200).json({
                message: "da ta don han thanh cong",
                createdOrder: result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
}

exports.getOrder = (req, res, next) => {
    Order.findById(req.params.idOrder)
        .exec()
        .then(order => {
            res.status(200).json({
                order: order
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.deleteOrder = (req, res, next) => {
    Order.deleteMany({ _id: req.params.idOrder })
        .exec()
        .then(() => {
            res.status(200).json({ message: "delete order success" })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}