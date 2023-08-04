const { db, dbRef } = require('../config/firebase');
const Brand = require('../models/Brand');

async function getBrands(page) {
    return new Promise((resolve) => {
        dbRef.child("Brands").get().then((snap) => {
            let brands = [];
            for (id in snap.val()) {
                const brand = new Brand(snap.child(id).val());
                brand.id = id;
                if (page == 1) {
                    if (snap.child(id).child("active").val() != false) {
                        brands.push(brand);
                    }
                } else {
                    brands.push(brand);
                }
            }
            resolve(brands);
        })
    })
}
const createBrand = (req, res) => {
    const brand = new Brand(req.body);

    dbRef.child("Brands").get().then((snap) => {
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

        db.ref('Brands/' + mayor).set(brand, (error) => {
            if (error) {
                console.log("ha ocurrido un error");
                res.end();
            } else {
                res.end(String(mayor))
            }
        });
    })
}
const updateBrand = (req, res) => {
    const id = req.body.id;
    const newName = req.body.name;
    dbRef.child("Brands").child(id).get().then((snap) => {
        if (snap.exists()) {

            // Se actualizan todas las tablas que contuvieran el nombre antiguo
            const name = snap.child("name").val();
            dbRef.child("RelTipeBrand").orderByChild("brand").equalTo(name).get().then((snapp) => {
                for (i in snapp.val()) {
                    db.ref(`RelTipeBrand/`).child(i).child("brand").set(newName);
                }
            });
            dbRef.child("Models").orderByChild("brand").equalTo(name).get().then((snapp) => {
                for (i in snapp.val()) {
                    db.ref(`Models/`).child(i).child("brand").set(newName);
                }
            });
            dbRef.child("Vehicles").orderByChild("brand").equalTo(name).get().then((snapp) => {
                for (i in snapp.val()) {
                    db.ref(`Vehicles/`).child(i).child("brand").set(newName);
                }
            });
            db.ref("Brands/").child(id).child("name").set(newName);
            res.end();
        }
    })
}
const deleteBrand = (req, res) => {
    const id = req.body.id;
    dbRef.child("Brands").get().then((snap) => {
        if (snap.exists()) {
            const name = snap.child(id).child("name").val();
            dbRef.child("Models")
            .orderByChild("brand")
            .equalTo(name).on("value", (snapp) => {
                if (snapp.exists()) {
                    console.log("No se puede eliminar una Marca si hay un modelo que la contenga");
                    res.end();
                } else {
                    db.ref('Brands/' + id).remove();
                    dbRef.child("RelTipeBrand").orderByChild("brand").equalTo(name).on("child_added", (snappp) => {
                        db.ref(`RelTipeBrand/` + snappp.key).remove();
                    })
                    res.end(id);
                }
            })
        }
    })
}
module.exports = {getBrands, createBrand, updateBrand, deleteBrand};