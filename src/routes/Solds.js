const express = require('express');
const router = express.Router();
const { getVehicles } = require('../controllers/solds');
const { getTipes } = require('../controllers/tipes');
const { getBrands } = require('../controllers/brands');
const { getModels } = require('../controllers/models');
const views = {
    vehicles: false,
    accessories: false,
    distribution: false,
    sold: true,
    dbOptions: false
}
const modal = true;
router.get('/Admin', async (req, res) => {
    const objects = await getParams();
    res.render('solds', {layout: 'admin', modal, views, objects, admin: true});
});
router.get('/', async (req, res) => {
    const objects = await getParams();
    res.render('solds', {layout: 'main', modal, views, objects});
});

async function getParams() {
    return new Promise(async (resolve) => {
        let vehicles = await getVehicles();
        let tipes = await getTipes(1);
        let brands = await getBrands(1);
        let models = await getModels();

        const atributos = {minPrice: vehicles[1][0], maxPrice: vehicles[1][1], minKM: vehicles[1][2], maxKM: vehicles[1][3]}
        resolve({tipes, brands, models, vehicles: vehicles[0], atributos})
    })
}
module.exports = router; 