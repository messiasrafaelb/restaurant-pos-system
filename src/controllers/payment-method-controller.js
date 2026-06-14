const service = require("../services/payment-method-service");

async function findAll(req, res) {
    try {
        const filters = {
            name: req.query.name,
            code: req.query.code
        };

        const paymentMethods = await service.findAll(filters);

        return res.json(paymentMethods);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function findById(req, res) {
    try {
        const id = req.params.id;
        const paymentMethod = await service.findByIdOrThrow(id);

        return res.json(paymentMethod);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

module.exports = {
    findAll,
    findById
};