const saleService = require('../services/sale-service');
const SaleFilter = require('../repositories/filters/sale-filter');

async function save(req, res, next) {
	try {
		if (!req.body || req.body.amount == null) {
			const err = new Error('Valor (amount) é obrigatório');
			err.status = 400;
			throw err;
		}

		const entity = require('../dtos').SaleDTO.toEntity(req.body);
		const response = await saleService.save(entity);

		return res.status(201).json(response);
	} catch (err) {
		console.error(err.message);
		return next(err);
	}
}

async function findById(req, res, next) {
	try {
		const { id } = req.params;
		const response = await saleService.findByIdOrThrow(id);

		return res.status(200).json(response);
	} catch (err) {
		console.error(err.message);
		return next(err);
	}
}

async function findAll(req, res, next) {
	try {
		const filters = SaleFilter.parseQuery(req.query);
		const response = await saleService.findAll(filters);

		return res.status(200).json(response);
	} catch (err) {
		console.error(err.message);
		return next(err);
	}
}

async function updateStatus(req, res, next) {
	try {
		const { id } = req.params;
		const { status } = req.body;

		if (!status) {
			const err = new Error('Status é obrigatório para atualização');
			err.status = 400;
			throw err;
		}

		const response = await saleService.updateStatus(id, status);

		return res.status(200).json(response);
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
