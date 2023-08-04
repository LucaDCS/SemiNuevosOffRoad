const express = require('express');
const router = express.Router();
const { getVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle, filterVehicles } = require('../controllers/vehicles');
const { getTipes } = require('../controllers/tipes');
const { getBrands } = require('../controllers/brands');
const { getModels } = require('../controllers/models');
const views = {
    vehicles: true,
    accessories: false,
    distribution: false,
    sold: false,
    dbOptions: false
}
const modal = true;
router.get('/Admin', async (req, res) => {
    const objects = await getParams();
    res.render('vehicles', {layout: 'admin', modal, views, objects, admin: true});
});
router.get('/', async (req, res) => {
    const objects = await getParams();
    res.render('vehicles', {layout: 'main', modal, views, objects});
});

router.get('/Admin/:vehicle_ID', async (req, res) => {
    let vehicleID = req.params.vehicle_ID;

    const vehicleParams = await getVehicle(vehicleID);
    const data = vehicleParams[0];
    const images = vehicleParams[1];

    res.render('vehicle', {layout: 'admin', data, images, admin: true});
})
router.get('/:vehicle_ID', async (req, res) => {
    let vehicleID = req.params.vehicle_ID;

    const vehicleParams = await getVehicle(vehicleID);
    const data = vehicleParams[0];
    const images = vehicleParams[1];

    res.render('vehicle', {layout: 'main', data, images});
})

router.post("/", createVehicle);
router.put("/", updateVehicle);
router.delete("/:id", deleteVehicle);
router.post("/Filter", filterVehicles);

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