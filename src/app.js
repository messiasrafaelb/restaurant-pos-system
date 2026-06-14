const express = require("express");

const productRoute = require("./routes/product-route")
const paymentMethodRoutes = require("./routes/payment-method-routes");
const orderRoutes = require("./routes/order-route");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/luizao/products", productRoute);
app.use("/luizao/payment-methods", paymentMethodRoutes);
app.use("/luizao/orders", orderRoutes);

module.exports = app;