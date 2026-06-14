const repository = require("../repositories/user-repository");
const { User } = require("../models/user-model");
const { UserDTO } = require("../dtos");

const MSG_USER_NOT_FOUND = "Usuário não encontrado.";

async function findAll(filters = {}) {
    const users = await repository.findAll(filters);
    return users.map(UserDTO.fromModel);
}

async function findByIdOrThrow(id) {
    const user = await repository.findById(id);

    if (user == null) {
        const err = new Error(MSG_USER_NOT_FOUND);
        err.status = 404;
        throw err;
    }

    return UserDTO.fromModel(user);
}

async function save(request) {
    const user = User.from(request);
    const saved = await repository.save(user);
    return UserDTO.fromModel(saved);
}

module.exports = {
    findAll,
    findByIdOrThrow,
    save,
};
