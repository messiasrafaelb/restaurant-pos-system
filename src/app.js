const express = require("express");

const productRoute = require("./routes/product-route")
const paymentMethodRoutes = require("./routes/payment-method-routes");
const installmentRoutes = require("./routes/installment-route");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/luizao/products", productRoute);
app.use("/luizao/payment-methods", paymentMethodRoutes);
app.use("/luizao/installments", installmentRoutes);

// error handler
const errorHandler = require('./middlewares/error-handler');
app.use(errorHandler);

module.exports = app;