const repository = require("../repositories/payment-method-repository");

const MSG_PAYMENT_METHOD_NOT_FOUND = "Método de pagamento não encontrado.";

async function findAll(filters) {
    return await repository.findAll(filters);
}

async function findByIdOrThrow(id) {
    const paymentMethod = await repository.findById(id);

    if (paymentMethod == null) {
        throw new Error(MSG_PAYMENT_METHOD_NOT_FOUND);
    }

    return paymentMethod;
}

module.exports = {
    findAll,
    findByIdOrThrow,
}