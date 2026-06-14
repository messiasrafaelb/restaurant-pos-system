const express = require("express");
const path = require("path");
const productRoute = require("./routes/product-route")

const paymentMethodRoutes = require("./routes/payment-method-routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/luizao/products", productRoute);
app.use("/luizao/payment-methods", paymentMethodRoutes);

module.exports = app;