const repository = require("../repositories/user-repository");
const User = require ("../models/user-model");
const MSG_USER_NOT_FOUND = "Usuário não encontrado.";

async function findAll(filters) {
    return await repository.findAll(filters);
}

async function findByIdOrThrow(id) {
    const user = await repository.findById(id);

    if (user == null) {
        throw new Error(MSG_USER_NOT_FOUND);
    }

    return user;
}

async function save(request) {

    const user = new User({
        name = request.name,
        email = request.email,
        password = request.password,
        role = request.role,
        status = "ATIVO",
        created_at = new Date()
    })

    return await repository.save(user);
}

module.exports = {
    findAll,
    findByIdOrThrow,
    save,
};
