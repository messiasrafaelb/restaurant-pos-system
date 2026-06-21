const express = require("express");
const path = require("path");
const errorHandler = require('./middlewares/error-handler');

const app = express();

app.use((req, res, next) => {
	if (req.path === '/' || req.path === '/index.html' || req.path === '/index') {
		console.log('TRACE: request for', req.method, req.path);
		try {
			const fs = require('fs');
			fs.appendFileSync(path.join(__dirname, '..', 'trace.log'), `TRACE ${new Date().toISOString()} ${req.method} ${req.path}\n`);
		} catch (err) {
			console.error('Failed to write trace file', err.message);
		}
	}
	next();
});
console.log('APP.JS loaded at', __dirname);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const userRoutes = require("./routes/user-route");
const productRoutes = require("./routes/product-route");
const paymentMethodRoutes = require("./routes/payment-method-route");
const itemRoutes = require("./routes/item-route");
const installmentRoutes = require("./routes/installment-route");
const orderRoutes = require("./routes/order-route");
const saleRoutes = require("./routes/sale-route");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => res.render('cadastro'));
app.get('/cadastro', (req, res) => res.render('cadastro'));
app.get(['/index', '/index.html'], (req, res) => res.render('index'));

app.get('/entrar', (req, res) => {
	console.log('HANDLER: GET /entrar -> render index');
	res.render('index');
});

app.use(express.static(path.join(__dirname, 'public')));

app.use("/luizao/products", productRoutes);
app.use("/luizao/payment-methods", paymentMethodRoutes);
app.use("/luizao/items", itemRoutes);
app.use("/luizao/installments", installmentRoutes);
app.use("/luizao/orders", orderRoutes);
app.use("/luizao/users", userRoutes);
app.use("/luizao/sales", saleRoutes);

app.use(errorHandler);

try {
	const routes = [];
	if (app._router && app._router.stack) {
		app._router.stack.forEach(mw => {
			if (mw.route && mw.route.path) {
				routes.push(Object.keys(mw.route.methods).join(',').toUpperCase() + ' ' + mw.route.path);
			} else if (mw.name === 'router') {
			
				mw.handle.stack.forEach(r => {
					if (r.route && r.route.path) routes.push(Object.keys(r.route.methods).join(',').toUpperCase() + ' ' + r.route.path);
				});
			}
		});
	}
	console.log('REGISTERED ROUTES:\n', routes.join('\n'));
} catch (err) {
	console.error('Failed listing routes', err.message);
}

module.exports = app;
