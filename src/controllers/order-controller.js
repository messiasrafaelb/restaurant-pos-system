const orderService = require('../services/order-service');

async function save(req, res) {
    try {
        const response = await orderService.save(req.body);

        res.status(201).json(response);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
}

async function findById(req, res) {
    try {
        const { id } = req.params;
        const response = await orderService.findByIdOrThrow(id);

        res.status(200).json(response);
    } catch (err) {
        console.error(err.message);
        res.status(404).json({ message: err.message });
    }
}

async function findAll(req, res) {
    try {
        const { code, orderStatus, createdAt } = req.query;
        const filters = { code, orderStatus, createdAt };

        const response = await orderService.findAll(filters);

        res.status(200).json(response);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
}

async function updateStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const response = await orderService.updateStatus(id, status);

        res.status(200).json(response);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    save,
    findAll,
    findById,
    updateStatus,
};