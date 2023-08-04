let ubicacionPrincipal = window.pageYOffset;
window.onscroll = function() {
    let Desplazamiento_Actual;
    if(ubicacionPrincipal >= Desplazamiento_Actual){
        document.getElementsByClassName('snor-header')[0].style.top = '0';
    }
    else{
        document.getElementsByClassName('snor-header')[0].style.top = '-104px';
    }
    ubicacionPrincipal = Desplazamiento_Actual;
}
function TurnImg(imagen) {
    document.getElementById("img-big").src = imagen.src;
    document.getElementsByClassName("carousel-item active")[0].className = "carousel-item";
    document.getElementById(`${imagen.name}`).className = "carousel-item active";
}
function showFilter() {
    let filtroSB = document.getElementsByClassName("snor-sidebar")[0].innerHTML;
    document.getElementById("filterArea").innerHTML = filtroSB;
    document.getElementsByClassName("snor-sidebar")[0].innerHTML= null;
}
function closeFilter() {
    let filtroModal = document.getElementById("filterArea").innerHTML;
    document.getElementsByClassName("snor-sidebar")[0].innerHTML = filtroModal;
    document.getElementById("filterArea").innerHTML = null;
}


let globall = "";
async function Filter(table, name) {
    const checkBoxes = document.getElementsByClassName("btn-check");
    console.log(" ");

    if (document.getElementById(`${table}-${name}`).checked) {
        console.log(`Se desactiva ${table} con el atributo ${name}`);
        const boxesChecked = [];
        for (let i = 0; i < checkBoxes.length; i++) {
            if (checkBoxes[i].id != `${table}-${name}`) {
                if (checkBoxes[i].checked) {
                    boxesChecked.push([checkBoxes[i].name, checkBoxes[i].value]);
                    checkBoxes[i].checked = false;
                }
                checkBoxes[i].disabled = false;
            }
        }
        
        for (i in boxesChecked) {
            globall = `${table}-${name}`;
            await Filter(boxesChecked[i][0], boxesChecked[i][1]);
            document.getElementById(`${boxesChecked[i][0]}-${boxesChecked[i][1]}`).checked = true;
        }
    } else {
        console.log(`Se activa ${table} con el atributo ${name}`);

        let modelos = [];
        const elementos = [];

        const marcas = document.getElementsByName("Brand"); 
        const marcasChecked = [];
        for (let i = 0; i<marcas.length; i++) {
            if (marcas[i].checked && marcas[i].id != globall) {
                marcasChecked.push(marcas[i].value)
            }
        }
        const tipes = document.getElementsByName("Tipe"); 
        const tiposChecked = [];
        for (let i = 0; i<tipes.length; i++) {
            if (tipes[i].checked && tipes[i].id != globall) {
                tiposChecked.push(tipes[i].value)
            }
        }


        
        for (let i = 0; i<checkBoxes.length; i++) {
            if (checkBoxes[i].disabled == false) {
                if (checkBoxes[i].name == table) {
                    continue
                } else if (checkBoxes[i].name == "Model") {
                    modelos.push(checkBoxes[i]);
                } else {
                    elementos.push(checkBoxes[i]);
                }
            }
        }

        if (table == "Brand") {
            if (marcasChecked.length > 0) {
                modelos = [];
                let allModelos = document.getElementsByName("Model");
                if (tiposChecked == 0) {
                    for (let i = 0; i<allModelos.length; i++) {
                        if (allModelos[i].disabled == true) {
                            modelos.push(allModelos[i]);
                        }
                    }
                } else {
                    for (let i = 0; i<allModelos.length; i++) {
                        for (let k = 0; k<tiposChecked.length; k++) {
                            if (allModelos[i].disabled == true && allModelos[i].getAttribute("Tipe") == tiposChecked[k]) {
                                modelos.push(allModelos[i]);
                            }
                        }
                    }
                }
            }
        } else {
            if (tiposChecked.length > 0) {
                modelos = [];
                let allModelos = document.getElementsByName("Model");
                if (marcasChecked == 0) {
                    for (let i = 0; i<allModelos.length; i++) {
                        if (allModelos[i].disabled == true) {
                            modelos.push(allModelos[i]);
                        }
                    }
                } else {
                    for (let i = 0; i<allModelos.length; i++) {
                        for (let k = 0; k<marcasChecked.length; k++) {
                            console.log(allModelos[i].getAttribute("Brand"))
                            if (allModelos[i].disabled == true && allModelos[i].getAttribute("Brand") == marcasChecked[k]) {
                                modelos.push(allModelos[i]);
                            }
                        }
                    }
                }
            }
        }

        await SetOption(modelos, elementos, table, name, true);
        await disableCB(table, modelos)
    }
}
async function SetOption(modelos, elementos, atributo, nombre, valor) {
    // console.log(`Se pone option ${valor} a los modelos que tengan ${nombre} en el atributo ${atributo}`)

        // Poner option = true a los modelos que coincidan;
        for (let j = 0; j < modelos.length; j++) {
            if (modelos[j].getAttribute(`${atributo}`) == nombre) {
                modelos[j].setAttribute("option", valor);
                 console.log(`El modelo ${modelos[j].id} se pone true`)
            } else {
                modelos[j].setAttribute("option", "false");
            }
        }

        if (atributo == "Brand") {
            // console.log("desbloquear tipos que coincidan");
            /* 
            Obtener el atributo tipo de la brand
            convertir el atributo en arreglo
            listar el arreglo de tipos
            desbloquear los tipos que coincidan
            */
            const elemento = document.getElementById(`Brand-${nombre}`);
            const tipes = elemento.getAttribute("tipe").split(',');
            const tiposCheck = document.getElementsByName("Tipe");
            for (let i = 0; i < tiposCheck.length; i++) {
                tiposCheck[i].setAttribute("option", "false");
                for (k in tipes) {
                    if (tiposCheck[i].value == tipes[k]) {
                        tiposCheck[i].setAttribute("option", valor);
                    }
                }
            }
        } else {
            // console.log("desbloquear las marcas que coincidan");
            /* 
            iterar las marcas
            Obtener el atributo tipo de la marca
            listar el atributo tipo
            si el tipo coincide, desbloquear la marca
            */
            for (let j = 0; j<elementos.length; j++) {
                const tipes = elementos[j].getAttribute("tipe").split(',');
                for (k in tipes) {
                    if (tipes[k] == nombre) {
                        elementos[j].setAttribute("option", valor);
                    }
                }
            }
        }
}
async function disableCB(name, modelos) {
    console.log("Se bloquearán")
    const checkBoxes = document.getElementsByClassName("btn-check");
    for (let i = 0; i<checkBoxes.length; i++) {
        if (checkBoxes[i].getAttribute("option") != "true" && checkBoxes[i].name != name && checkBoxes[i].name != "Model") {
            console.log(checkBoxes[i].id)
            checkBoxes[i].disabled = true;
        } 
    }
    for (let i = 0; i<modelos.length; i++) {
        if (modelos[i].getAttribute("option") != "true") {
            console.log(modelos[i].id)
            modelos[i].disabled = true;
        } else {
            modelos[i].disabled = false;
        }
    }
}
$("#filterForm").submit(function(){
    console.log("Entró al AJAX")
    parametros=$(this).serialize()
    console.log(parametros)
    // ${vehiculos[i].imagen}
    $.post('/Vehicles/Filter', parametros, function(data) {
        console.log("regresó el AJAX")
        document.getElementById("snor-deck").innerHTML = "";
        const vehiculos = JSON.parse(data);
        console.log(vehiculos);
        for (i in vehiculos) {
            document.getElementById("snor-deck").innerHTML += 
            `
            <div id="${vehiculos[i].id}">
                    <div class="snor-card">
                        <div class="box">
                            <a href="./${vehiculos[i].id}">
                                <img src="${vehiculos[i].img}" alt="...">
                            </a>
                        </div>
                        <div class="p-4 row">
                            <div class="col-10">
                                <h5>$${vehiculos[i].price}</h5>
                                    ${vehiculos[i].year} | ${vehiculos[i].km}km
                                <p class="card-text mt-2">${vehiculos[i].brand} ${vehiculos[i].model}</p>
                            </div>
                            <div class="col-2 my-auto">
                                <button type="button" class="snor-btn" onclick="deleteVehicle('${vehiculos[i].id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                            
                        </div>
                    </div>
                </div>
            `;
        }
    })

    return false;
})

$("#contactForm").submit(function(){
    parametros=$(this).serialize();
    $.post('/Contact', parametros, function(data){
        if (data) {
            $("#modalContact").modal("hide");
        }
    })

    return false;
})


$("#suscriptionForm").submit(function() {
    const data = $(this).serialize();
    new Promise(resolve => {
		$.ajax({
			url: `/Suscription`,
			dataType: "json",
			type: 'post',
			data: data,
			success: function (value) {
                console.log(value)
				resolve( value );
			},
			error: function (error) {
				console.log(error.responseText);
				resolve( error.responseText );
			}
		})
	})
    document.getElementById("subscription_email").value = "";
    return false;
})