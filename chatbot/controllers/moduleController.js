const moduleService = require('../services/moduleService');

// Controller function to add a new module type
async function addModuleType(req, res) {
    const { name } = req.body;
    try {
        const moduleType = await moduleService.addModuleType(name);
        res.json(moduleType);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    addModuleType
};
