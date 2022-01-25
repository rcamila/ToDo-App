const apiUrl = 'https://ctd-todo-api.herokuapp.com/v1/users/login';

window.addEventListener('load', function(){

    const formulario =  this.document.forms[0];
    const inputEmail = this.document.querySelector('#inputEmail');
    const inputPassword =  this.document.querySelector('#inputPassword');

    formulario.addEventListener('submit', function(event){
        event.preventDefault();
        const validacion = validar(inputEmail.value) && validar(inputPassword.value);
        if (validacion){
            const datosUsuario = normalizar(inputEmail.value, inputPassword.value)
            console.log(normalizar(inputEmail.value, inputPassword.value));
            apiLogin(apiUrl, datosUsuario);
        }else{
            console.log("Algun dato no es correcto");
        }
        formulario.reset();
    });
});

function validar(dato){
    let resultado = true;
    if (dato == ""){
        resultado = false;
    }
    return resultado;
}

function normalizar(email, password){
    const usuario = {
        email : email.toLowerCase().trim(),
        password : password.trim()
    }
    return usuario;
}

function apiLogin(url, payload){
    const config = {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(payload)
    }

    fetch(url, config)
    .then(rta => {
        console.log(rta);
        return rta.json();
    })
    .then(data => {
        console.log(data);
        console.log(data.jwt);
        if (data.jwt){
            localStorage.setItem('jwt', data.jwt);
            location.href = '/mis-tareas.html';
        }
        
    })
}



