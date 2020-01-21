const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

mongoose.connection.on('error', err => {
    console.error('MongoDB connection error.');
    console.error(err);
    process.exit();
});

mongoose.connection.once('open', () => {
    console.log('MongoDB connect successfully');
});


const productRoutes = require('./routes/products');
const orders = require('./routes/order');
const userRoutes = require('./routes/user');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        'Origin,X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, PATCH,GET');
        return res.status(200).json({})
    }
    next();
})

app.use("/products", productRoutes);
app.use('/orders', orders);
app.use('/user', userRoutes);

//dung chung neu api tra ve loi
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;