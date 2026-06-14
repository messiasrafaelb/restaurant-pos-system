const repository = require('../repositories/installment-repository');
const { Installment } = require('../models/installment-model');
const { InstallmentDTO } = require('../dtos');

const MSG_INSTALLMENT_NOT_FOUND = 'Parcela não encontrada.';

async function save(request) {
    const installment = Installment.from(request);
    const saved = await repository.save(installment);
    return InstallmentDTO.fromModel(saved);
}

async function findAll(filters = {}) {
    const installments = await repository.findAll(filters);
    return installments.map(InstallmentDTO.fromModel);
}

async function findByIdOrThrow(id) {
    const installment = await repository.findById(id);

    if (!installment) {
        const err = new Error(MSG_INSTALLMENT_NOT_FOUND);
        err.status = 404;
        throw err;
    }

    return InstallmentDTO.fromModel(installment);
}

async function updateStatus(id) {
    const installment = await repository.findById(id);

    if (!installment) {
        const err = new Error(MSG_INSTALLMENT_NOT_FOUND);
        err.status = 404;
        throw err;
    }

    const nextStatus = installment.status && installment.status.toUpperCase() === 'ATIVO' ? 'INATIVO' : 'ATIVO';
    const updated = await repository.updateStatus(id, nextStatus);

    return InstallmentDTO.fromModel(updated);
}

module.exports = {
    save,
    findAll,
    findByIdOrThrow,
    updateStatus
};
