const { db, dbRef } = require('../config/firebase');
const Tipe = require('../models/Tipe');

async function getTipes(page) {
    return new Promise((resolve)=> {
        dbRef.child("Tipes").get().then((snap) => {
            let tipes = [];
            for (id in snap.val()) {
                const tipe = new Tipe(snap.child(id).val());
                tipe.id = id;
                if (page == 1) {
                    if (snap.child(id).child("active").val() != false) {
                        tipes.push(tipe)
                    }
                } else {
                    tipes.push(tipe);
                }
            }
            resolve(tipes)
        })
    })
}
const createTipe = (req, res) => {
    const tipe = new Tipe(req.body);

    dbRef.child("Tipes").get().then((snap) => {
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

        db.ref('Tipes/' + mayor).set(tipe, (error) => {
            if (error) {
                console.log("ha ocurrido un error");
                res.end();
            } else {
                res.end(String(mayor))
            }
        });
    })
}
const updateTipe = (req, res) => {
    const id = req.body.id;
    const newName = req.body.name;
    dbRef.child("Tipes").child(id).get().then((snap) => {
        if (snap.exists()) {

            // Se actualizan todas las tablas que contuvieran el nombre antiguo
            const name = snap.child("name").val();
            dbRef.child("RelTipeBrand").orderByChild("tipe").equalTo(name).get().then((snapp) => {
                for (i in snapp.val()) {
                    db.ref(`RelTipeBrand/`).child(i).child("tipe").set(newName);
                }
            });
            dbRef.child("Models").orderByChild("tipe").equalTo(name).get().then((snapp) => {
                for (i in snapp.val()) {
                    db.ref(`Models/`).child(i).child("tipe").set(newName);
                }
            });
            dbRef.child("Vehicles").orderByChild("tipe").equalTo(name).get().then((snapp) => {
                for (i in snapp.val()) {
                    db.ref(`Vehicles/`).child(i).child("tipe").set(newName);
                }
            });
            db.ref("Tipes/").child(id).child("name").set(newName);
            res.end();
        }
    })
}
const deleteTipe = (req, res) => {
    const id = req.params.id;
    dbRef.child("Tipes").get().then((snap) => {
        if (snap.exists()) {
            const name = snap.child(id).child("name").val();
            dbRef.child("Models")
            .orderByChild("tipe")
            .equalTo(name).on("value", (snapp) => {
                if (snapp.exists()) {
                    console.log("No se puede eliminar un tipo si hay un modelo que lo contenga");
                    res.end();
                } else {
                    db.ref('Tipes/' + id).remove();
                    dbRef.child("RelTipeBrand").orderByChild("tipe").equalTo(name).on("child_added", (snappp) => {
                        db.ref(`RelTipeBrand/` + snappp.key).remove();
                    })
                    res.end(id);
                }
            })
        }
    })
}
module.exports = {getTipes, createTipe, updateTipe, deleteTipe};