// const { db, dbRef } = require('../config/firebase');

const notNull = (req, res, next) => {
    const name = String(req.body.name);
    const id = String(req.body.id);
    console.log(`name: ${name}`);
    console.log(`id: ${id}`);
    if ((name != null && name != undefined && name.length > 1) || (id.length > 0 && id != null && id != undefined)) {
        next();
    } else {
        console.log("No aplicable")
        res.end("Error");
    }
}
module.exports = {notNull};