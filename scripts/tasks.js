const apiUrl = 'https://ctd-todo-api.herokuapp.com/v1';

window.addEventListener('load', function(){
    AOS.init();

    const jwt = localStorage.getItem('jwt');

    const nodoUsername = this.document.querySelector('.user-info p');
    const form = this.document.forms[0];
    const inputNuevaTarea = this.document.querySelector('#nuevaTarea');
    const btnCerrar = document.querySelector('#closeApp');

    getMeApi(`${apiUrl}/users/getMe`, jwt);
    getTasksApi(`${apiUrl}/tasks`, jwt);

    form.addEventListener('submit', function(event){
        event.preventDefault();
        const nuevaTarea = {
            description: inputNuevaTarea.value,
            completed: false
        }
        postTaskApi (`${apiUrl}/tasks`, nuevaTarea, jwt);
        form.reset();
    });

    btnCerrar.addEventListener('click', function(){
        swal.fire({
            title: '¿Desea cerrar sesión?',
            icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'Cancelar'
        })
        .then((result) => {
            if (result.isConfirmed){
                localStorage.clear();
                location.replace('/');
            }
        })
        
    });

    function getMeApi(url, token){
        const config = {
            method : 'GET',
            headers : {
                authorization : token
            }        
        }
        fetch(url, config)
        .then(rta => rta.json())
        .then(data => {
            console.log(data);
            nodoUsername.innerText = data.firstName;
        });
    }

    function renderizar(listaTareas){
        const nodoTareasTerminadas = document.querySelector('.tareas-terminadas');
        const nodoTareasPtes = document.querySelector('.tareas-pendientes');

        nodoTareasTerminadas.innerHTML = "";
        nodoTareasPtes.innerHTML = "";

        const tareasTerminadas = listaTareas.filter(tarea => tarea.completed);
        const tareasPtes = listaTareas.filter(tarea => !tarea.completed);
        
        nodoTareasTerminadas.innerHTML = tareasTerminadas.map(tarea => `
                <li class="tarea" data-aos="fade-up">
                <div class="done"></div>
                <div class="descripcion">
                <p class="nombre">${tarea.description}</p>
                <div>
                <button><i id="${tarea.id}" class="fas
                fa-undo-alt change"></i></button>
                <button><i id="${tarea.id}" class="far
                fa-trash-alt"></i></button>
                </div>
                </div>
                </li>
                `).join('');

        nodoTareasPtes.innerHTML = tareasPtes.map (tarea => `
                <li class="tarea" data-aos="flip-right">
                <div class="not-done change" id="${tarea.id}"></div>
                <div class="descripcion">
                <p class="nombre">${tarea.description}</p>
                <p class="timestamp"><i class="far
                fa-calendar-alt"></i> ${dayjs(tarea.createdAt).format('DD-MM')}</p>
                </div>
                </li>
                `).join('');
            
        
        updateTaskApi();
        deleteTaskApi();
    }

    function getTasksApi(url, token){
        const config = {
            method : 'GET',
            headers : {
                authorization : token
            }        
        }
        fetch(url, config)
        .then(rta => rta.json())
        .then(data => {
            console.log(data);
            renderizar(data);
        })
    }

    function postTaskApi(url, payload, token){
        const config = {
            method : 'POST',
            headers : {
                authorization : token,
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(payload)
        }
        fetch(url, config)
        .then(res => res.json())
        .then(data => {
            console.log(data); 
            getTasksApi(`${apiUrl}/tasks`, token);
        })
    }
    function updateTaskApi(){
        const btnUpdate = document.querySelectorAll('.change');
        btnUpdate.forEach(btn => {
            btn.addEventListener('click', function(e){  
                const id = e.target.id;
                const url = `${apiUrl}/tasks/${id}`;
                const payload = {};
                
                if (e.target.classList.contains('fa-undo-alt')){
                    payload.completed = false;
                }else{
                    payload.completed = true;
                }
                const config = {
                    method : 'PUT',
                    headers : {
                        authorization : jwt,
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify(payload)
                }
                fetch(url, config)
                .then(res => {
                    getTasksApi(`${apiUrl}/tasks`, jwt);
                    return res.json()
                })
                .then(data => console.log(data));
            });           
        })
    }
    function deleteTaskApi(){
        const btnDelete = document.querySelectorAll('.fa-trash-alt');

        btnDelete.forEach(btn => {
            btn.addEventListener('click', function(e){
                const id = e.target.id;
                const url = `${apiUrl}/tasks/${id}`;

                const config = {
                    method : 'DELETE',
                    headers : {
                        authorization : jwt
                    },
                    
                }
                fetch(url, config)
                .then(res => {
                    getTasksApi(`${apiUrl}/tasks`, jwt);
                    
                    console.log(res.status);
                })
            })
        }); 
    }
});


