const express = require("express");
const userRoutes = require("./routes/user-route");

const paymentMethodRoutes = require("./routes/payment-method-route");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/luizao/payment-methods", paymentMethodRoutes);
app.use("/luizao/user", userRoutes);


module.exports = app;