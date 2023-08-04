const { db, dbRef } = require('../config/firebase');
const Vehicle = require('../models/Vehicle');
const { strComma } = require('../middleware/methods')

async function getVehicles() {
    return new Promise((resolve)=> {
        dbRef.child("Vehicles").get().then((snap) => {
            let vehicles = [];
            let atributos = [1000000, 0, 10000, 0];
            for (id in snap.val()) {
                if (!snap.child(id).child("sold").val()) {
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
async function getVehicle(vehicleID) {
    return new Promise((resolve) => {
        dbRef.child("Vehicles").child(vehicleID).get().then((snap) => {
            if (snap.exists()) {
                // se podría crear un objeto
                const vehicle = new Vehicle(snap.val());
                vehicle.id = vehicleID;
                vehicle.price = strComma(vehicle.price)

                dbRef.child("Models").orderByChild("name").limitToFirst(1).equalTo(vehicle.model).get().then((snapp) => {
                    for (i in snapp.val()) {
                        // agregar el snapp.val() al objeto
                        // crear un vehiculo a partir del objeto 
                        vehicle.cc = snapp.child(i).val().cc;
                        vehicle.height = snapp.child(i).val().height;
                        vehicle.width = snapp.child(i).val().width;
                        vehicle.weight = snapp.child(i).val().weight;
                        vehicle.hp = snapp.child(i).val().hp;
                        vehicle.description = snapp.child(i).val().description;
                        vehicle.descripcion = snapp.child(i).val().descripcion;
                        vehicle.video = snapp.child(i).val().video;
                    }
                    const images = [];
                    // Actualizar esta tabla a ingles
                    dbRef.child("RelVehicleImage").child(vehicleID).get().then((snappp) => {
                        let contador = 0; 
                        for (k in snappp.val()) {
                            contador++; 
                            const url = snappp.child(k).child("url").val();
                            const show = contador <= 4 ? true : false;
                            images.push({name: k, url, show})
                        }
                        resolve([vehicle, images]);
                    })
                })
            }
        })
    })
}
const createVehicle = (req, res) => {
    const model = String(req.body.model);
    const data = req.body;
    console.log(data);

    dbRef.child("Models")
    .orderByChild("name")
    .equalTo(model)
    .limitToFirst(1).on("child_added", (snap) => {
        // utilizar el método on child_added puede traer consecuencias.
        if (snap.exists()) {
            data.brand = snap.val().brand;
            data.tipe = snap.val().tipe;
            // Se obtiene la fecha
            const today = new Date();
            let dia = String(today.getDate());
            let mes = String(today.getMonth() + 1);
            const año = today.getFullYear();
            if (mes.length < 2) {
                mes = "0" + mes;
            }
            if (dia.length < 2) {
                dia = "0" + dia;
            }
            const creationDate = `${año}-${mes}-${dia}`;

            const newKey = dbRef.child('Vehicles').push().key;
            const img = String(data.img);
            // aquí de nuevo se podría crear un objeto en blanco y posteriormente
            // crear un vehiculo a partir del objeto; 
            db.ref('Vehicles/' + newKey).set({
                model,
                brand: data.brand,
                tipe: data.tipe, 
                price: data.price,
                km: data.km,
                year: data.year,
                color: data.color,
                sold: false,
                img: img,
                creationDate
            }, (error) => {
                if (error) {
                    console.log("ha ocurrido un error");
                    res.end()
                } else {
                    // Se actualizan los active de todo lo involucrado con ese modelo, marca y tipo
                    const tables = [["Brands", data.brand], ["Tipes", data.tipe], ["Models", data.model]];
                    for (i in tables) {
                        const table = tables[i][0];
                        dbRef.child(tables[i][0]).orderByChild("name")
                        .equalTo(tables[i][1]).limitToFirst(1)
                        .on("child_added", (snapshot) => {
                            db.ref(`${table}/`).child(snapshot.key).child("active").set(true);
                        })
                    }
                    res.end(newKey);
                }
            });
        }
    })
}
const updateVehicle = (req, res) => {
    const data = req.body;
    let price = String(data.price);
    //let km = String(data.km);
    const year = data.year;
    let continuar = true;
    if (isNaN(price)) {
        price = price.substring(1)
        if (isNaN(price)) {
            res.end("error");
            continuar = false;
        }
    }
    /* if (continuar) {
        if (isNaN(km)) {
            km = km.substring(0, km.length-2)
            if (isNaN(km)) {
                res.end("error");
                continuar = false;
            }
        }
    } */
    if (continuar) {
        const currentYear = new Date().getFullYear();
        if (year > 2010 && year <= currentYear+1) {
            //db.ref(`Vehicles/`).child(data.id).child("km").set(km);
            db.ref(`Vehicles/`).child(data.id).child("price").set(price);
            db.ref(`Vehicles/`).child(data.id).child("year").set(year);
            res.end("ok")
        } else {
            res.end("error");
        }
    }
}
const deleteVehicle = (req, res) => {
    const id = req.params.id;
    if (id != undefined && id != null && id != ""){
        dbRef.child('Vehicles').child(id).get().then((snapshot) => {
            if (snapshot.exists()) {
                const brand = snapshot.val().brand;
                const model = snapshot.val().model;
                const tipe = snapshot.val().tipe;
                db.ref('Vehicles/' + id).remove();

                // Algoritmo
                const atributos = [["brand", brand, "Brands"], ["tipe", tipe, "Tipes"], ["model", model, "Models"]];
                for (i in atributos) {
                    const table = atributos[i][2];
                    const name = atributos[i][1];
                    dbRef.child("Vehicles").orderByChild(atributos[i][0])
                    .equalTo(atributos[i][1]).limitToFirst(1)
                    .get().then((snap) => {
                        if (!snap.exists()) {
                            dbRef.child(table).orderByChild("name").equalTo(name).limitToFirst(1)
                            .on("child_added", (snapp) => {
                                console.log(snapp.key);
                                db.ref(`${table}/`).child(snapp.key).child("active").set(false);
                            })
                        }
                    })
                }
                res.end(id);
            } else {
                res.end("Ese vehiculo no existe")
            }
        })
    }
}

// este método lo tengo que volver a analizar
const filterVehicles = async (req, res) => {
    const tipes = req.body.Tipe;
    const brands = req.body.Brand;
    const models = req.body.Model;
    const price = req.body.price; 
    const maxKM = req.body.Km_max;
    const minKM = req.body.Km_min;

    let vehiculos = await new Promise((resolve) => {
        const vehiculos = [];
        dbRef.child("Vehicles").get().then((snap) => {
            for (const i in snap.val()) {
                let agregar = false;
                if (models != undefined || brands != undefined || tipes != undefined) {
                    if (models != undefined) {
                        if (typeof(models) == "object") {
                            for (j in models) {
                                if (snap.child(i).child("model").val() == models[j]) {
                                    agregar = true;
                                }
                            }
                        } else {
                            if (snap.child(i).child("model").val() == models) {
                                agregar = true;
                            }
                        }
                    } else {
                        if (tipes != undefined) {
                            if (typeof(tipes) == "object") {
                                for (j in tipes) {
                                    if (snap.child(i).child("tipe").val() == tipes[j]) {
                                        agregar = true;
                                    }
                                }
                            } else {
                                if (snap.child(i).child("tipe").val() == tipes) {
                                    agregar = true;
                                }
                            }
                            
                        }
                        if (brands != undefined) {
                            if (typeof(brands) == "object") {
                                for (j in brands) {
                                    if (snap.child(i).child("brand").val() == brands[j]) {
                                        agregar = true;
                                    }
                                }
                            } else {
                                if (snap.child(i).child("brand").val() == brands) {
                                    agregar = true;
                                }
                            }
                        }
                    }
                } else {
                    agregar = true
                }
                if (agregar) {
                    if (price != 40000) {
                        if (snap.child(i).child("price").val() <= Number(price)) {
                            agregar = true;
                        } else {
                            agregar = false;
                        }
                    }
                    if (maxKM != "") {
                        if (snap.child(i).child("km").val() < maxKM) {
                            agregar = true;
                            if (minKM != "") {
                                if (snap.child(i).child("km").val() > minKM) {
                                    agregar = true;
                                } else {
                                    agregar = false;
                                }
                            }
                        } else {
                            agregar = false;
                        }
                    }
                }
                if (agregar) {
                    let model = snap.child(i).child("model").val();
                    let brand = snap.child(i).child("brand").val();
                    let price = snap.child(i).child("price").val();
                    price = strComma(price)
                    let year = snap.child(i).child("year").val();
                    let km = snap.child(i).child("km").val();
                    let img = snap.child(i).child("img").val();
                    vehiculos.push({id: i, img, price, model, brand, year, km});
                }
            }
            resolve(vehiculos);
        })
    })
    res.end(JSON.stringify(vehiculos))
}

module.exports = {getVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle, filterVehicles};