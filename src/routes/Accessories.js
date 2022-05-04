const express = require('express');
const router = express.Router();

const views = {
    vehicles: false,
    accessories: true,
    distribution: false,
    sold: false,
    dbOptions: false
}
const modal = true;
router.get('/Admin', async (req, res) => {
    res.render('accessories', {layout: 'admin', modal, views, admin: true});
});
router.get('/', async (req, res) => {
    res.render('accessories', {layout: 'main', modal, views});
});

module.exports = router; 