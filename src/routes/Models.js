const express = require('express');
const router = express.Router();
const { createModel, updateModel, deleteModel } = require('../controllers/models');
const { notNull } = require('../middleware/methods');

router.post("/", notNull, createModel);
router.put("/", updateModel);
router.delete("/:id", notNull, deleteModel);

module.exports = router; 