//#region SessionAdmin
const inputs = document.querySelectorAll(".login-input");
function addFocus() {
	let parent = this.parentNode.parentNode;
	parent.classList.add("focus");
}
function removeFocus() {
	let parent = this.parentNode.parentNode;
	if (this.value == "") {
		parent.classList.remove("focus");
	}
}
inputs.forEach(input => {
	input.addEventListener("focus", addFocus);
	input.addEventListener("blur", removeFocus);
});

const firebaseConfig = {
	apiKey: "AIzaSyD9YI4881l1Ec2nUJobq0YhTa-K1AcC48M",
	databaseURL: "https://seminuevosoffroad-default-rtdb.firebaseio.com",
};
firebase.initializeApp(firebaseConfig);

function LogIn(form) {
	let usuario = form.user.value;
	let contra = form.password.value;
	firebase.auth().signInWithEmailAndPassword(usuario, contra)
		.then(() => {
			firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
				console.log("Se mando el token");
				$.ajax({
					url: 'log-in',
					type: 'get',
					headers: {
						Authorization: `Bearer ${idToken}`
					},
					success: function(page){
						console.log("Retornó el AJAX");
						window.location.href = `/${page}`
					},
					error: function(err){
						console.log(err)
					}
				});
			  }).catch(function(error) {
				console.log(error)
			  });
		})
		.catch((error) => {
			var errorMessage = error.message;
			console.log(errorMessage);
		});
}

function LogOut() {
	firebase.auth().signOut().then(() => {
        console.log("El usuario cerró sesión");
        }).catch((error) => {
			console.log(error);
        });
}

function Prueba() {
	const db = firebase.database();
	const dbRef = db.ref();
	dbRef.child("Usuarios").get().then((snap) => {
		for (i in snap.val()) {
			console.log(snap.child(i).child("correo").val())
		}
	})
}

//#endregion