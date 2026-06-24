const express = require("express");
const path = require("path");
const errorHandler = require('./middlewares/error-handler');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const paymentMethodRoutes = require("./routes/payment-method-route");
const customerRoutes = require("./routes/customer-route");
const productRoutes = require("./routes/product-route");
const userRoutes = require("./routes/user-route");
const saleRoutes = require("./routes/sale-route");
const authRoutes = require("./routes/auth-route");

app.use("/luizao/payment-methods", paymentMethodRoutes);
app.use("/luizao/customers", customerRoutes);
app.use("/luizao/products", productRoutes);
app.use("/luizao/users", userRoutes);
app.use("/luizao/sales", saleRoutes);
app.use("/luizao/auth", authRoutes);

// SPA fallback — qualquer rota não-API serve o index.html
app.use((req, res, next) => {
  if (req.path.startsWith('/luizao')) return next();

  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(errorHandler);

module.exports = app;
