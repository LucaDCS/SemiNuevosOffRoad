const { db, dbRef } = require('../config/firebase');
const Vehicle = require('../models/Vehicle');
const { strComma } = require('../middleware/methods')

async function getVehicles() {
    return new Promise((resolve)=> {
        dbRef.child("Vehicles").get().then((snap) => {
            let vehicles = [];
            let atributos = [1000000, 0, 10000, 0];
            for (id in snap.val()) {
                if (snap.child(id).child("sold").val()) {
                    const vehicle = new Vehicle(snap.child(id).val());
                    vehicle.id = id;
                    
                    if (Number(vehicle.price) < Number(atributos[0])) {
                        atributos[0] = vehicle.price;
                    }
                    if (Number(vehicle.price) > Number(atributos[1])) {
                        atributos[1] = vehicle.price;
                    }
                    if (Number(vehicle.km) < atributos[2]) {
                        atributos[2] = Number(vehicle.km);
                    }
                    if (Number(vehicle.km) > atributos[3]) {
                        atributos[3] = Number(vehicle.km);
                    }
                    vehicle.price = strComma(vehicle.price)
                    vehicles.push(vehicle)
                }
            }
            resolve([vehicles, atributos])
        })
    })
}

module.exports = {getVehicles};