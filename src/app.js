const express = require("express");
const errorHandler = require('./middlewares/error-handler');

const app = express();
const userRoutes = require("./routes/user-route");
const productRoutes = require("./routes/product-route");
const paymentMethodRoutes = require("./routes/payment-method-route");
const itemRoutes = require("./routes/item-route");
const installmentRoutes = require("./routes/installment-route");
const orderRoutes = require("./route/order-route");

app.use(errorHandler);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/luizao/products", productRoutes);
app.use("/luizao/payment-methods", paymentMethodRoutes);
app.use("/luizao/items", itemRoutes);
app.use("/luizao/installments", installmentRoutes);
app.use("/luizao/orders", orderRoutes);
app.use("/luizao/user", userRoutes);

module.exports = app;