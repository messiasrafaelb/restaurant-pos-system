const repository = require("../repositories/payment-method-repository");
const { PaymentMethodDTO } = require('../dtos');

const MSG_PAYMENT_METHOD_NOT_FOUND = "Método de pagamento não encontrado.";

async function findAll(filters) {
    const paymentMethods = await repository.findAll(filters);
    return paymentMethods.map(PaymentMethodDTO.fromModel);
}

async function findByIdOrThrow(id) {
    const paymentMethod = await repository.findById(id);

    if (paymentMethod == null) {
        const err = new Error(MSG_PAYMENT_METHOD_NOT_FOUND);
        err.status = 404;
        throw err;
    }

    return PaymentMethodDTO.fromModel(paymentMethod);
}

async function inactivate(id) {
    await findByIdOrThrow(id);
    const updated = await repository.inactivate(id);
    return PaymentMethodDTO.fromModel(updated);
}

module.exports = {
    findAll,
    findByIdOrThrow,
    inactivate
};