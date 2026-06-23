const express = require("express");
const path = require("path");
const fs = require('fs');
const errorHandler = require('./middlewares/error-handler');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const paymentMethodRoutes = require("./routes/payment-method-route");
const productRoutes = require("./routes/product-route");
const orderRoutes = require("./routes/order-route");
const userRoutes = require("./routes/user-route");
const saleRoutes = require("./routes/sale-route");
const authRoutes = require("./routes/auth-route");

app.get('/', (req, res) => res.render('register'));
app.get('/register', (req, res) => res.render('register'));
app.get(['/index', '/index.html'], (req, res) => res.render('index'));

app.get('/login', (req, res) => {
    console.log('HANDLER: GET /login -> render index');
    res.render('index');
});

app.use("/luizao/payment-methods", paymentMethodRoutes);
app.use("/luizao/products", productRoutes);
app.use("/luizao/orders", orderRoutes);
app.use("/luizao/users", userRoutes);
app.use("/luizao/sales", saleRoutes);
app.use("/luizao/auth", authRoutes);

app.use(errorHandler);

module.exports = app;