//#region 
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        firebase.auth().currentUser.getIdToken(true).then(function() {
            const block = document.getElementById("Blocker");
            const body = block.parentNode;
            body.removeChild(block);
          }).catch(function(error) {
            console.log(error);
          });
    } else {
        window.location.href = "../"
    }
});
//#endregion
function dbOption(button, table, option, id) {
    if (option == 1 || option == 2) {
        if (option == 2) {
            $.ajax({
                url: `/${table}/${id}`,
                type: 'delete',
                data: {id},
                success: function(id){
                    if (id != "") {
                        console.log(`${table}_${id}`);
                        document.getElementById(`${table}_${id}`).innerHTML = "";
                    }
                },
                error: function(){
                    console.log("error");
                }
            });
        } else {
            let elements = [];
            elements.push(document.getElementById(`${table}_${id}_name`))
            if (table == "Models") {
                elements.push(document.getElementById(`Models_${id}_hp`));
                elements.push(document.getElementById(`Models_${id}_cc`));
                elements.push(document.getElementById(`Models_${id}_weight`));
                elements.push(document.getElementById(`Models_${id}_width`));
                elements.push(document.getElementById(`Models_${id}_height`));
            }
            if (button.innerHTML == '<i class="fas fa-save"></i>') {
                const data = {};
                data.id = id;
                data.name = document.getElementById(`${table}_${id}_name`).innerHTML;
                if (table == "Models") {
                    data.hp = document.getElementById(`Models_${id}_hp`).innerHTML;
                    data.cc = document.getElementById(`Models_${id}_cc`).innerHTML;
                    data.width = document.getElementById(`Models_${id}_width`).innerHTML;
                    data.height = document.getElementById(`Models_${id}_height`).innerHTML;
                    data.weight = document.getElementById(`Models_${id}_weight`).innerHTML;
                    data.brand = document.getElementById(`Models_${id}_brand`).value;
                    data.tipe = document.getElementById(`Models_${id}_tipe`).value;
                }
                $.ajax({
                    url: `/${table}`,
                    type: 'put',
                    data: data,
                    success: function(){
                        //se guarda el Elemento con la nueva data 
                        if (table == "Models") {
                            document.getElementById(`Models_${id}_brand`).parentElement.id = `${table}_${id}_brand`;
                            document.getElementById(`Models_${id}_brand`).innerHTML = data.brand;
                            document.getElementById(`Models_${id}_tipe`).parentElement.id = `${table}_${id}_tipe`;
                            document.getElementById(`Models_${id}_tipe`).innerHTML = data.tipe;
                        }
                        for (i in elements) {
                            elements[i].contentEditable = false;
                            elements[i].style.outline = "none";
                        }
                        button.innerHTML = '<i class="fas fa-edit"></i>';
                    },
                    error: function(){
                        console.log("error");
                    }
                });
            } else {
                if (table == "Models") {
                    let brand = document.getElementById(`Models_${id}_brand`).innerHTML;
                    let tipe = document.getElementById(`Models_${id}_tipe`).innerHTML;
                    document.getElementById(`Models_${id}_brand`).innerHTML = 
                    `
                    <select id="Models_${id}_brand">

                    </select>
                    `;
                    document.getElementById(`Models_${id}_brand`).id = "";
                    document.getElementById(`Models_${id}_tipe`).innerHTML = 
                    `
                    <select id="Models_${id}_tipe">

                    </select>
                    `;
                    document.getElementById(`Models_${id}_tipe`).id = "";
                    dbRef.child("Brands").get().then((snap) => {
                        for (i in snap.val()) {
                            if (snap.child(i).child("name").val() == brand) {
                                document.getElementById(`Models_${id}_brand`).innerHTML +=
                            `<option selected>${snap.child(i).child("name").val()}</option>`;
                            } else {
                                document.getElementById(`Models_${id}_brand`).innerHTML +=
                            `<option>${snap.child(i).child("name").val()}</option>`;
                            }
                            
                        }
                    })
                    dbRef.child("Tipes").get().then((snap) => {
                        for (i in snap.val()) {
                            if (snap.child(i).child("name").val() == tipe) { 
                                document.getElementById(`Models_${id}_tipe`).innerHTML +=
                            `<option selected>${snap.child(i).child("name").val()}</option>`;
                            } else {
                                document.getElementById(`Models_${id}_tipe`).innerHTML +=
                            `<option>${snap.child(i).child("name").val()}</option>`;
                            }
                            
                        }
                    })
                }
                for (i in elements) {
                    elements[i].contentEditable = true;
                    elements[i].style.outline = "auto";
                }
                button.innerHTML = '<i class="fas fa-save"></i>';
            }
        }
    }
}
function modalAdd(table) {
    table = table.toString();
    document.getElementById("modalAddBody").innerHTML = "";
    //Aquí habría que editar individualmente o llamar a un elemento por el ID y colocar el innerHTML
    document.getElementById("dbAddHeader").innerHTML = `Agregar ${table.substr(0,table.length-1)}`;
    if (table == "Models") {
        document.getElementById("modalAddBody").innerHTML += 
        `
        <input type="text" name="table" class="hidden" value="${table}">
        <label>
            <h6>Nombre:</h6>
            <input type="text" name="name" class="snor-input">
        </label>
        <br>
        <label for="modalAddMarca">
            <h6>Marca:</h6>
        </label>
        <select type="text" name="brand" class="snor-input form-control w-50 mx-auto" id="modalAddMarca">
        </select>
        <label for="modalAddTipo">
            <h6>Tipo:</h6>
        </label>
        <select type="text" name="tipe" class="snor-input form-control w-50 mx-auto" id="modalAddTipo">
        </select>
        <label>
            <h6>HP:</h6>
            <input type="number" name="hp" class="snor-input">
        </label>
        <label>
            <h6>CC:</h6>
            <input type="number" name="cc" class="snor-input">
        </label>
        <label>
            <h6>Peso:</h6>
            <input type="number" name="weight" class="snor-input">
        </label>
        <label>
            <h6>Ancho:</h6>
            <input type="number" name="width" class="snor-input">
        </label>
        <label>
            <h6>Alto:</h6>
            <input type="number" name="height" class="snor-input">
        </label>
        <label>
            <h6>Video ID:</h6>
            <input type="text" name="video" class="snor-input">
        </label>
        <br>
        <label>
            <h6>Descripción:</h6>
            <textarea name="descripcion" class="snor-input"></textarea>
        </label>
        <label>
            <h6>Description Ing:</h6>
            <textarea name="description" class="snor-input"></textarea>
        </label>
        `;
        dbRef.child("Brands").get().then((snap) => {
            for (i in snap.val()) {
                document.getElementById("modalAddMarca").innerHTML +=
                `<option>${snap.child(i).child("name").val()}</option>`;
            }
        })
        dbRef.child("Tipes").get().then((snap) => {
            for (i in snap.val()) {
                document.getElementById("modalAddTipo").innerHTML +=
                `<option>${snap.child(i).child("name").val()}</option>`;
            }
        })
    } else {
        document.getElementById("modalAddBody").innerHTML += 
        `
        <input type="text" name="table" class="hidden" value="${table}">
        <label>
            <h6>Nombre:</h6>
            <input type="text" name="name" class="snor-input" autofocus>
        </label>
        `;
    }
}
function dbAdd() {

    // aquí creo que podría usar el serialize, ya que no estoy pasando parametros en mi función
    // u obtener los datos del form de alguna otra manera; 
    const data = {};
    const table = document.forms[0].table.value;
    data.name = document.forms[0].name.value;

    if (table == "Models") {
        data.brand = document.forms[0].brand.value;
        data.tipe = document.forms[0].tipe.value;
        data.hp = document.forms[0].hp.value;
        data.cc = document.forms[0].cc.value;
        data.weight = document.forms[0].weight.value;
        data.width = document.forms[0].width.value;
        data.height = document.forms[0].height.value;
        data.description = document.forms[0].description.value;
        data.descripcion = document.forms[0].descripcion.value;
        data.video = document.forms[0].video.value;
    }

    console.log(data)
    
    $.post(`/${table}`, data, function(ID){
        if (ID != "Error") {
            $("#ModalAdd").modal("hide");
            if (table == "Models") {
                document.getElementById(`Models_tbody`).innerHTML += 
                `
                <tr id="Models_${ID}">
                    <th scope="row">${ID}</th>
                    <td><div type="text" id="Models_${ID}_name" contenteditable="false">${data.name}</div></td>
                    <td><div id="Models_${ID}_brand" contenteditable="false">${data.brand}</div></td>
                    <td><div id="Models_${ID}_tipe" contenteditable="false">${data.tipe}</div></td>
                    <td><div id="Models_${ID}_hp" contenteditable="false">${data.hp}</div></td>
                    <td><div id="Models_${ID}_cc" contenteditable="false">${data.cc}</div></td>
                    <td><div id="Models_${ID}_weight" contenteditable="false">${data.weight}</div></td>
                    <td><div id="Models_${ID}_width" contenteditable="false">${data.width}</div></td>
                    <td><div id="Models_${ID}_height" contenteditable="false">${data.height}</div></td>
                    <td>
                        <button type="button" class="snor-btn" onclick="dbOption(this, 'Models', 1, ${ID})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="snor-btn" data-toggle="modal" data-target="#ModalDelete" onclick="dbDelete('Models', ${ID}")>
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
                `;
            } else {
                document.getElementById(`${table}_tbody`).innerHTML += 
                `
                <tr id="${table}_${ID}">
                    <th scope="row">${ID}</th>
                    <td><div type="text" id="${table}_${ID}_name" contenteditable="false">${data.name}</div></td>
                    <td>
                        <button type="button" class="snor-btn" onclick="dbOption(this, '${table}', 1, ${ID})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="snor-btn" data-toggle="modal" data-target="#ModalDelete" onclick="dbDelete('${table}', ${ID})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
                `;
            }
        }
    })
    .fail(function() {
        console.log("error");
    })
}
function dbDelete(table, id) {
    document.getElementById("footerDelete").innerHTML = 
    `
    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
    <button type="button" class="btn btn-success" data-dismiss="modal" onclick="dbOption(null, '${table}', 2, ${id})">Aceptar</button>
    `;
}

/* Vehiculos */
async function addVehicle() {
    console.log("Agregando vehiculo")
    const form = document.getElementById("addVehicleForm");
    const data = {};
    data.model = form.model.value;
    data.price = form.price.value;
    data.km = form.km.value;
    data.year = form.year.value;
    data.color = form.color.value;
    const imgFile = document.querySelector('#imageFile').files[0];
    const datosImg = await AddImg(imgFile);
    data.img = datosImg[0];

    console.log(data);
    $.post('/Vehicles', data, function(id){
        $("#ModalAddVehicle").modal("hide");

        document.getElementById("snor-deck").innerHTML += 
        `
        <div id="${id}">
                <div class="snor-card">
                    <div class="box">
                        <a href="./${id}">
                            <img src="${data.img}" alt="...">
                        </a>
                    </div>
                    
                    <div class="p-4 row">
                        <div class="col-10">
                            <h5>$${data.price}</h5>
                                ${data.year} | ${data.km}km
                            <p class="card-text mt-2">${data.model}</p>
                        </div>
                        <div class="col-2 my-auto">
                            <button type="button" class="snor-btn" onclick="deleteVehicle('${id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
        `;
    })
    .fail(function() {
        console.log("error");
    })
}
function deleteVehicle(id) {
    $.ajax({
        url: `/Vehicles/${id}`,
        type: 'DELETE',
        success: function() {
            const card = document.getElementById(id);	
            if (!card){
                alert("El elemento selecionado no existe");
            } else {
                // eliminar las imágenes relacionadas con el vehiculo
                dbRef.child("RelVehicleImage").child(id).get().then((snap) => {
                    for (i in snap.val()) {
                        const imgName = i; 
                        const resStorage = firebase.storage().ref();
                        resStorage.child(`${imgName}.jpg`).delete().then(() => {
                            db.ref(`RelVehicleImage/${id}/${imgName}`).remove()
                        }).catch((error) => {
                            if (error) {
                                console.log("ha orirrido un error");
                            } 
                        });
                    }
                })
                let deck = card.parentNode;
                deck.removeChild(card);
            }
        }
    });
}
function editVehicle(id) {
    document.getElementById("data_price").contentEditable = true;
    //document.getElementById("data_km").contentEditable = true;
    document.getElementById("data_year").contentEditable = true;
    document.getElementById("contactButton").innerHTML = 
    `
    <button class="snor-btn" onclick="saveVehicle('${id}')">
        Guardar
    </button>
    `;
    console.log(id)
}
function saveVehicle(id) {
    const price = document.getElementById("data_price");
    //const km = document.getElementById("data_km"); 
    const year = document.getElementById("data_year"); 

    const data = {
        id, 
        price: price.innerHTML,
        //km: km.innerHTML,
        year: year.innerHTML
    }
    $.ajax({
        url: `/Vehicles`,
        type: 'PUT',
        data: data, 
        success: function(result) {
            if (result != "error") {
                price.contentEditable = false;
                //km.contentEditable = false;
                year.contentEditable = false;
                document.getElementById("contactButton").innerHTML = 
                `
                <button class="snor-btn" onclick="editVehicle('${id}')">
                    Editar
                </button>
                `;
            } else {
                console.log("Error");
            }
            
        }
    });

    
}
// Imagenes vehiculo
// sustituir la tabla por la tabla en ingles

async function addVehicleImg(id) {
    console.log(id);
    const imgFiles = document.querySelector('#imageFile').files;
    const images = [];
    for (let i = 0; i < imgFiles.length; i++) {
        const datos = await AddImg(imgFiles[i])
        const url = datos[0];
        const now = datos[1];
        const nombre = String(imgFiles[i].name).slice(0, -4)+String(now); 
        images.push([nombre, url])
    }
    if (id != null && id != "" && id != undefined) {
        for (k in images) {
            const nombre = images[k][0];
            const url = images[k][1];
            db.ref(`RelVehicleImage/${id}/${nombre}`).set({
                url 
            }, (error) => {
                if (error) {
                    console.log(`Error en la imagen: ${nombre}`);
                } else {
                    document.getElementById("imgCarousel").innerHTML += 
                    `
                    <div class="carousel-item">
                        <div class="box mx-auto">
                            <img src="${url}" alt="${nombre}">
                        </div>
                    </div>
                    `;
                    $("#modalAdd").modal("hide");
                }
            });
        }
        $("#modalPictures").modal("hide");
    }
}
async function AddImg(imgFile) {
    return new Promise((resolve) => {

    if (imgFile != null) {
        const resStorage = firebase.storage().ref();
        const now = new Date().getTime();
        const name = String(imgFile.name).slice(0, -4)+String(now)+".jpg"; 
        const metadata = {
            contentType: imgFile.type
        }
        const task = resStorage.child(name).put(imgFile, metadata);
        task.then((snap) => snap.ref.getDownloadURL())
        .then( url => {
            resolve([String(url), now]);
        })
    } else {
        console.log("No se ha seleccionado ninguna imagen")
        resolve(false);
    }
    });
}
function deleteImg(vehicleID) { 
    const imgId = document.getElementsByClassName("carousel-item active")[0].id;
    if (imgId && vehicleID) {
        console.log(imgId, vehicleID);
        // eliminar la imagen de la nube
        const resStorage = firebase.storage().ref();
        resStorage.child(`${imgId}.jpg`).delete().then(() => {
            // eliminar la imagen de la relación vehiculoImagen
            db.ref(`RelVehicleImage/${vehicleID}/${imgId}`).remove().then(() => {
                // recibir la respuesta
                const itemImg = document.getElementById(imgId);	
                const carousell = itemImg.parentNode;
                carousell.removeChild(itemImg);
                $("#modalDelete").modal("hide");
            });
        }).catch((error) => {
            if (error) {
                console.log("ha orirrido un error");
            } 
        });
    }
}