const Product = require('../models/products');
exports.getAllProduct = (req, res, next) => {
    Product.find()
        .select('_id name price productImage')
        .exec()
        .then((docs) => {
            const response = {
                count: docs.length,
                products: docs.map((product) => {
                    return {
                        _id: product._id,
                        nameProduct: product.name,
                        priceProduct: product.price,
                        linkImage: 'http://localhost:3000/' + product.productImage,
                        url: 'http://localhost/' + product._id
                    }
                })
            }
            res.status(200).json({
                message: response
            })
        })
        .catch();
}