const express = require("express");
const productRoute = require("./routes/product-route")

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/luizao/products", productRoute);

module.exports = app;