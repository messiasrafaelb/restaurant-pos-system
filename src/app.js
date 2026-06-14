const express = require("express");

const paymentMethodRoutes = require("./routes/payment-method-routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/luizao/payment-methods", paymentMethodRoutes);

module.exports = app;