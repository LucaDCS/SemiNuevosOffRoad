const express = require('express');
const router = express.Router();
const { getTipes } = require('../controllers/tipes');
const { getBrands } = require('../controllers/brands');
const { getModels } = require('../controllers/models');

router.get('/Admin/', async (req, res) => {
    let views = {
        vehicles: false,
        accessories: false,
        distribution: false,
        sold: false,
        dbOptions: true
    }
    const objects = await getParams();
    res.render('dbOptions', {layout: 'admin', views, objects});
});

async function getParams() {
    return new Promise(async (resolve) => {
        let tipes = await getTipes(2);
        let brands = await getBrands(2);
        let models = await getModels();

        resolve({brands, tipes, models})
    })
}
module.exports = router; 