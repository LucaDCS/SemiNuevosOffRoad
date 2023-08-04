const { db, dbRef } = require('../config/firebase');
const Model = require('../models/Model');

async function getModels() {
    return new Promise((resolve) => {
        dbRef.child("Models").get().then((snap) => {
            let models = [];
            for (id in snap.val()) {
                const model = new Model(snap.child(id).val());
                model.id = id;
                models.push(model);
            }
            resolve(models)
        })
    })
}
const createModel = (req, res) => {
    const model = new Model(req.body);
    console.log(model)

    dbRef.child("Models").get().then((snap) => {

        // Esto es como un "autoincremento", 
        // no sé en dónde iría el metodo para no repetir codigo
        let mayor = 0;
        for (i in snap.val()) {
            if (i>mayor) {
                mayor = i;
            }
            if (!snap.child(String(Number(i)+1)).exists()) {
                break;
            }
        }
        mayor++;
        
        db.ref('Models/' + mayor).set(model, (error) => {
            if (error) {
                console.log("ha ocurrido un error");
                res.end();
            } else {
                //Se crea la relación de Marca Tipo
                console.log("Objeto creado")
                dbRef.child("RelTipeBrand")
                .orderByChild('brand')
                .equalTo(model.brand).get().then((snap) => {
                    if (snap.exists()) {
                        console.log("Existen ya relaciones con esa marca");
                        let existe = false; 
                        for (i in snap.val()) {
                            if (snap.child(i).child("tipe").val() == model.tipe) {
                                console.log("Existen ya relaciones con esa marca y tipo");
                                existe = true;
                            }
                        }
                        console.log(existe)
                        if (existe) {
                            res.end(String(mayor))
                        } else {
                            // no sé si tendría que crear un nuevo objeto,
                            // con su metodo put para no repetir el código o
                            // simplemente crear un método
                            console.log("se crea la relación TB al no existir relación TB");
                            const newKey = dbRef.child('RelTipeBrand').push().key;
                            db.ref('RelTipeBrand/' + newKey).set({
                                brand: model.brand,
                                tipe: model.tipe
                            }, (error) => {
                                if (error) {
                                    console.log("ha ocurrido un error");
                                    res.end()
                                } else {
                                    res.end(String(mayor))
                                }
                            });
                        }
                    } else {
                        console.log("se crea la relación MT al no existir relaciones con esa marca");
                        const newKey = dbRef.child('RelTipeBrand').push().key;
                        db.ref('RelTipeBrand/' + newKey).set({
                            brand: model.brand,
                            tipe: model.tipe
                        }, (error) => {
                            if (error) {
                                console.log("ha ocurrido un error");
                                res.end()
                            } else {
                                res.end(String(mayor))
                            }
                        });
                    }
                })
                
            }
        });
    })
}
const updateModel = (req, res) => {
    const id = req.body.id;
    const model = new Model(req.body);
    console.log(model);
    dbRef.child("Models").child(id).get().then((snap) => {
        if (snap.exists()) {
            const nombre = snap.child("name").val();
            if (nombre != model.name) {
                // Se actualizan todos los vehículos que contuvieran el nombre antiguo
                dbRef.child("Vehicles").orderByChild("model").equalTo(nombre).get().then((snapp) => {
                    for (i in snapp.val()) {
                        db.ref(`Vehicles/`).child(i).child("model").set(model.name);
                    }
                    db.ref(`Models/`).child(id).child("name").set(model.name)
                });
            }
            db.ref(`Models/`).child(id).child("brand").set(model.brand);
            db.ref(`Models/`).child(id).child("tipe").set(model.tipe);
            db.ref(`Models/`).child(id).child("hp").set(model.hp);
            db.ref(`Models/`).child(id).child("cc").set(model.cc);
            db.ref(`Models/`).child(id).child("weight").set(model.weight);
            db.ref(`Models/`).child(id).child("width").set(model.width);
            db.ref(`Models/`).child(id).child("height").set(model.height);
            res.end()
        }
    })
}
const deleteModel = (req, res) => {
    const id = req.body.id;
    dbRef.child("Models").get().then((snap) => {
        if (snap.exists()) {
            const name = snap.child(id).child("name").val();
            dbRef.child("Vehicles")
            .orderByChild("model")
            .equalTo(name).on("value", (snapp) => {
                if (snapp.exists()) {
                    console.log("No se puede eliminar un Modelo si hay un Vehiculo que lo contenga");
                    res.end();
                } else {
                    db.ref('Models/' + id).remove();
                    res.end(id);
                }
            })
        }
    })
}
module.exports = {getModels, createModel, updateModel, deleteModel};