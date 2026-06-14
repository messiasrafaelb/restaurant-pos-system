const service = require("../services/user-service");

async function findAll(req, res) {
  try {
    const filters = {
      nome: req.query.name,
      status: req.query.status,
      role: req.query.role,
      createdAt: req.query.createdAt
    };

    const user = await service.findAll(filters);

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function findById(req, res) {
    try{
        const id = req.params.id;
        const user = await service.findByIdOrThrow(id);

        return res.json(user);
    } catch (error) {
        return res.status(404).json ({ message: error.message });
    }
}

async function save(req, res) {
    try{
        const response = await service.save(req.body);

        return res.json(response);
    } catch (error) {
        return res.status(404).json ({ message: error.message });
    }
}
module.exports = {
    findAll,
    findById,
    save
};


