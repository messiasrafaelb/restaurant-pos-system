const installmentService = require('../services/installment-service');
const InstallmentFilter = require('../repositories/filters/installment-filter');
const { InstallmentDTO } = require('../dtos');

async function save(req, res, next) {
    try {
        const hasAmount = req.body && req.body.amount != null;
        const hasDueDate = req.body && (req.body.due_date || req.body.dueDate);
        const hasPaymentMethod = req.body && (req.body.fk_payment_method || req.body.paymentMethodId);

        if (!hasAmount || !hasDueDate || !hasPaymentMethod) {
            const err = new Error('Campos obrigatórios: amount, due_date/dueDate, fk_payment_method/paymentMethodId');
            err.status = 400;
            throw err;
        }

        const entity = InstallmentDTO.toEntity(req.body);
        const response = await installmentService.save(entity);

        res.status(201).json(response);
    } catch (err) {
        console.error(err.message);
        return next(err);
    }
}

async function findAll(req, res, next) {
    try {
        const filters = InstallmentFilter.parseQuery(req.query);
        const response = await installmentService.findAll(filters);

        res.status(200).json(response);
    } catch (err) {
        console.error(err.message);

        return next(err);
    }
}

async function findById(req, res, next) {
    try {
        const { id } = req.params;
        const response = await installmentService.findByIdOrThrow(id);

        res.status(200).json(response);
    } catch (err) {
        console.error(err.message);

        return next(err);
    }
}

async function updateStatus(req, res, next) {
    try {
        const { id } = req.params;
        const response = await installmentService.updateStatus(id);

        res.status(200).json(response);
    } catch (err) {
        console.error(err.message);

        return next(err);
    }
}

module.exports = {
    save,
    findAll,
    findById,
    updateStatus
};
