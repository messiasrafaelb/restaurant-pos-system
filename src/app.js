const express = require("express");
const path = require("path");
const productRoute = require("./routes/product-route")

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.send("Api funcionando");
});
app.use("/luizao/products", productRoute);

module.exports = app;