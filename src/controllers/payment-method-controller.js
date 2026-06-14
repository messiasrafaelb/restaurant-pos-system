const service = require("../services/payment-method-service");

const PaymentMethodFilter = require("../repositories/filters/payment-method-filter");

async function findAll(req, res, next) {
    try {
        const filters = PaymentMethodFilter.parseQuery(req.query);
        const paymentMethods = await service.findAll(filters);

        return res.json(paymentMethods);
    } catch (error) {
        return next(error);
    }
}

async function findById(req, res, next) {
    try {
        const id = req.params.id;
        const paymentMethod = await service.findByIdOrThrow(id);

        return res.json(paymentMethod);
    } catch (error) {
        return next(error);
    }
}

async function inactivate(req, res, next) {
    try {
        const id = req.params.id;
        const paymentMethod = await service.inactivate(id);

        return res.json(paymentMethod);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    findAll,
    findById,
    inactivate
};