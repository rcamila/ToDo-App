    const apiUrl = 'https://ctd-todo-api.herokuapp.com/v1/users';

window.addEventListener('load', function(){

    const form = this.document.forms[0];
    const inputNombre = this.document.getElementById('inputNombre');
    const inputApellido = this.document.getElementById('inputApellido');
    const inputEmail = this.document.getElementById('inputEmail');
    const inputPw1 = this.document.getElementById('inputPw1');
    const inputPw2 = this.document.getElementById('inputPw2');

    form.addEventListener('submit', function(event){
        event.preventDefault();

        const validacion = validarNoVacio(inputNombre.value) && validarNoVacio(inputApellido.value) &&
        validarNoVacio(inputEmail.value) && validarNoVacio(inputPw1.value) && verificarPws(inputPw1.value, inputPw2.value);

        if (validacion){
            const datosNuevoUsuario = normalizar(inputNombre.value, inputApellido.value, inputEmail.value, inputPw1.value);
            console.log(datosNuevoUsuario);
            fetchApi(apiUrl, datosNuevoUsuario);
        }else{
            console.log("Algun dato no es correcto");
        }
        form.reset();
    });
});

function validarNoVacio(dato){
    let resultado = true;
    if (dato == ""){
        resultado = false;
    }
    return resultado;
}

function normalizar(nombre, apellido, email, password){
    const usuario = {
        firstName: nombre.toLowerCase().trim(),
        lastName: apellido.toLowerCase().trim(),
        email : email.toLowerCase().trim(),
        password : password.trim()
    }
    return usuario;
}

function verificarPws(pw1, pw2){
    let resultado = true;
    if (pw1 !== pw2){
        resultado = false;
    }
    return resultado;
}

function fetchApi(url, payload){
    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    }
    fetch(url, config)
    .then(rta => rta.json())
    .then(data => {
        console.log(data);
    })
    
    location.href = ('index.html');
}