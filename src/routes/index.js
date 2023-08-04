const { Router } = require('express');
const router = Router();
const firebase = require('firebase-admin');
const { db, dbRef } = require('../config/firebase');
const fs = require('fs');

const removeExtension = (filename) => {
    return filename.split('.').shift();
};

fs.readdirSync(__dirname).filter((file) => {
    const fileName = removeExtension(file);
    const skip = ['index'].includes(fileName);
    if (!skip) {
        router.use(`/${fileName}`, require(`./${fileName}`));
        console.log('CARGAR ------>', removeExtension(file));
    }
})

router.get('/', (req, res) => {
    res.render('index');
});
router.get('/Admin', function(req, res) {
    res.render('log-in', {layout: ''});
});
router.get('/log-in', (req, res) => {
    console.log("entro a log-in");
    if (req.headers?.authorization?.startsWith("Bearer ")) {
        const token = req.headers.authorization.split(" ")[1];
        try {
            firebase.auth().verifyIdToken(token)
            .then((decodedToken) => {
                if (decodedToken) {
                    console.log("se decodificó")
                    res.end("Vehicles/Admin/")
                }
            })
            .catch((error) => {
                if (error.code == "auth/argument-error") {
                    res.end("Token invalido")
                }
            })
        } catch (err) {
            console.log(err)
        }
    } else {
        console.log("No ingresado")
        res.end();
    }
})
router.post('/Contact', (req, res) => {
    // De esto solo exixtirá post y posteriormente 
    // mensajería en cuando se cree un nuevo objeto en DB
    // dónde debería agregarlo
    const id = String(req.body.id);
    const client = String(req.body.name);
    const email = String(req.body.mail);
    const phone = String(req.body.tel);
    const msg = String(req.body.msg);
    console.log(req.body);
    dbRef.child('Vehicles').child(id).get().then((snap) => {
        if (snap.exists()) {
            const brand = String(snap.val().brand);
            const model = String(snap.val().model);
            const price = String(snap.val().price);
            // Se obtiene la fecha
            const fecha = new Date();
            let dia = String(fecha.getDate());
            let mes = String(fecha.getMonth() + 1);
            const año = fecha.getFullYear();
            if (mes.length < 2) {
                mes = "0" + mes;
            }
            if (dia.length < 2) {
                dia = "0" + dia;
            }
            const creationDate = `${año}-${mes}-${dia}`;

            const newKey = dbRef.child('Contact').push().key;
            db.ref('Contact/' + newKey).set({
                id,
                brand,
                model,
                price,
                creationDate,
                client,
                email,
                phone,
                msg
            }, (error) => {
                if (error) {
                    console.log("ha ocurrido un error");
                    res.end()
                } else {
                    res.end("true");
                }
            });
        } else {
            res.end();
        }
    })
})
router.post('/Suscription', (req, res) => {
    const email = req.body.email;
    const newKey = dbRef.child('Suscriptions').push().key;
    db.ref('Suscriptions/' + newKey).set({
        email
    }, (error) => {
        if (error) {
            console.log("ha ocurrido un error");
            res.end();
        } else {
            res.end(newKey);
        }
    });
})
router.get('/FAQ', function(req, res) {
    res.render('faq', {layout: 'main', views: {faq: true}});
});
router.get('/Contact', function(req, res) {
    res.render('contact', {layout: 'main', views: {contact: true}});
});

module.exports = router;