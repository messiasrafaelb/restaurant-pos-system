const express = require("express");

const productRoutes = require("./routes/product-route");
const paymentMethodRoutes = require("./routes/payment-method-route");
const itemRoutes = require("./routes/item-route");
const installmentRoutes = require("./routes/installment-route");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/luizao/products", productRoutes);
app.use("/luizao/payment-methods", paymentMethodRoutes);
app.use("/luizao/items", itemRoutes);
app.use("/luizao/installments", installmentRoutes);


const errorHandler = require('./middlewares/error-handler');
app.use(errorHandler);

module.exports = app;