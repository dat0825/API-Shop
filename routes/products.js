const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Product = require('../models/products');

const multer = require('multer');

const checkAuth = require('../middleware/check-auth');
const ProductController = require('../controllers/product');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/getAllProducts', checkAuth, ProductController.getAllProduct);

router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.nameProduct,
        price: req.body.priceProduct,
        productImage: req.file.path
    });
    product.save().then((result) => {
        console.log(result);
        res.status(200).json({
            message: 'Them mot san pham moi',
            createdProduct: {
                _id: result._id,
                name: result.name,
                price: result.price
            }
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });

});

router.get('/:idProduct', (req, res, next) => {
    const idProduct = req.params.idProduct;
    Product.findById(idProduct)
        .exec()
        .then((infoProduct) => {
            if (infoProduct) {
                res.status(200).json({
                    message: "Ban da chon san pham co ma la " + idProduct,
                    product: infoProduct
                })
            } else {
                res.status(404).json({
                    message: "Ma san pham khong hop le"
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.patch("/:idProduct", (req, res, next) => {
    const idProduct = req.params.idProduct;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: idProduct }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
})

router.delete("/:idProduct", (req, res, next) => {
    const idProduct = req.params.idProduct;
    Product.deleteMany({ _id: idProduct })
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: "da xoa thanh cong san pham"
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });
})

module.exports = router;