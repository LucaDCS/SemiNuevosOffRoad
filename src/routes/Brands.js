const express = require('express');
const router = express.Router();
const { createBrand, updateBrand, deleteBrand } = require('../controllers/brands');
const { notNull } = require('../middleware/methods');

router.post("/", notNull, createBrand);
router.put("/", updateBrand);
router.delete("/:id", notNull, deleteBrand);

module.exports = router; 