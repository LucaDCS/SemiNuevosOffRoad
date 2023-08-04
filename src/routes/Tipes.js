const express = require('express');
const router = express.Router();
const { createTipe, updateTipe, deleteTipe } = require('../controllers/tipes');
const { notNull } = require('../middleware/methods');

router.post("/", notNull, createTipe);
router.put("/", updateTipe);
router.delete("/:id", notNull, deleteTipe);

module.exports = router; 