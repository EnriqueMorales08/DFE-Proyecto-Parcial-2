const apiUrl = 'https://653485e2e1b6f4c59046c7c7.mockapi.io/api/users/223230131/tasks';
const taskList = document.getElementById('lista-tareas');
const agregarTareaButton = document.getElementById('agregar-tarea');
const formularioTarea = document.getElementById('contenedor-formulario');
const cancelarTareaButton = document.getElementById('cancelar-tarea');
const formularioActualizar = document.getElementById('contenedor-formulario-actualizar');
const cancelarActualizarButton = document.getElementById('cancelar-actualizar');
const actualizarTareaButton = document.getElementById('actualizar-tarea');
const updateTaskText = document.getElementById('nuevo-titulo-actualizar');

let tasks = [];

function loadTasks() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            tasks = data;
            displayTasks();
        })
        .catch(error => console.error('Error al cargar tareas:', error));
}

function displayTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.title}</td>
            <td>${task.description}</td>
            <td>${task.completed ? 'Sí' : 'No'}</td>
            <td>${task.priority}</td>
            <td>${task.dueDate}</td>
            <td>${task.tag}</td>
            <td>
                <button class="editar-tarea" data-id="${task.id}">Editar</button>
                <button class="eliminar-tarea" data-id="${task.id}">Eliminar</button>
            </td>
        `;
        taskList.appendChild(row);
    });

    const editarTareas = document.querySelectorAll('.editar-tarea');
    const eliminarTareas = document.querySelectorAll('.eliminar-tarea');

    editarTareas.forEach(button => {
        button.addEventListener('click', editarTarea);
    });

    eliminarTareas.forEach(button => {
        button.addEventListener('click', eliminarTarea);
    });
}

function toggleUpdateForm() {
    formularioTarea.style.display = 'none';
    formularioActualizar.style.display = 'flex';
}
function editarTarea(event) {
    const taskId = event.target.getAttribute('data-id');
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        toggleUpdateForm();

        // Establece el valor de los campos adicionales en el formulario de actualización
        document.getElementById('nueva-descripcion-actualizar').value = task.description;
        document.getElementById('nueva-completado-actualizar').checked = task.completed;
        document.getElementById('nueva-prioridad-actualizar').value = task.priority;
        document.getElementById('nueva-fecha-vencimiento-actualizar').value = task.dueDate;
        document.getElementById('nueva-tipo-tarea-actualizar').value = task.tag;

        updateTaskText.value = task.title;
        updateTaskText.dataset.id = task.id;
    }
}

function updateTask() {
    const taskId = updateTaskText.dataset.id;

    if (taskId) {
        const updatedTitle = document.getElementById('nuevo-titulo-actualizar').value;
        const updatedDescription = document.getElementById('nueva-descripcion-actualizar').value;
        const updatedCompleted = document.getElementById('nueva-completado-actualizar').checked;
        const updatedPriority = document.getElementById('nueva-prioridad-actualizar').value;
        const updatedDueDate = document.getElementById('nueva-fecha-vencimiento-actualizar').value;
        const updatedTipoTarea = document.getElementById('nueva-tipo-tarea-actualizar').value;

        const updatedTask = {
            title: updatedTitle,
            description: updatedDescription,
            completed: updatedCompleted,
            priority: updatedPriority,
            dueDate: updatedDueDate,
            tag: updatedTipoTarea,
        };

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTask),
        };

        fetch(`${apiUrl}/${taskId}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const updatedTaskIndex = tasks.findIndex(t => t.id === taskId);
                if (updatedTaskIndex !== -1) {
                    tasks[updatedTaskIndex] = data;
                    toggleUpdateForm();
                    displayTasks();
                }
            })
            .catch(error => console.error('Error al actualizar tarea:', error));
    }
}


function eliminarTarea(event) {
    const taskId = event.target.getAttribute('data-id');
    if (taskId) {
        const requestOptions = {
            method: 'DELETE',
        };

        fetch(`${apiUrl}/${taskId}`, requestOptions)
            .then(response => {
                if (response.ok) {
                    tasks = tasks.filter(t => t.id !== taskId);
                    displayTasks();
                }
            })
            .catch(error => console.error('Error al eliminar tarea:', error));
    }
}

agregarTareaButton.addEventListener('click', () => {
    formularioTarea.style.display = 'flex';
    formularioActualizar.style.display = 'none';
});

cancelarTareaButton.addEventListener('click', () => {
    formularioTarea.style.display = 'none';
    formularioActualizar.style.display = 'none';
});

formularioTarea.addEventListener('submit', (event) => {
    event.preventDefault();

    const newTaskTitle = document.getElementById('nuevo-titulo-tarea').value;
    const newTaskDescription = document.getElementById('nueva-descripcion-tarea').value;
    const newTaskCompleted = document.getElementById('nueva-completado-tarea').checked;
    const newTaskPrioridad = document.getElementById('nueva-prioridad-tarea').value;
    const newTaskDueDate = document.getElementById('nueva-fecha-vencimiento-tarea').value;
    const newTaskTipoTarea = document.getElementById('nueva-tipo-tarea').value;

    if (newTaskTitle && newTaskDescription && newTaskDueDate) {
        const newTask = {
            title: newTaskTitle,
            description: newTaskDescription,
            completed: newTaskCompleted,
            priority: newTaskPrioridad,
            dueDate: newTaskDueDate,
            tag: newTaskTipoTarea,
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTask),
        };

        fetch(apiUrl, requestOptions)
            .then(response => response.json())
            .then(data => {
                tasks.push(data);
                displayTasks();
            })
            .catch(error => console.error('Error al agregar tarea:', error));

        formularioTarea.reset();
        formularioTarea.style.display = 'none';
    }
});

cancelarActualizarButton.addEventListener('click', () => {
    formularioActualizar.style.display = 'none';
});

formularioActualizar.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita que el formulario se envíe y recargue la página
    updateTask(); // Llama a la función de actualización de tarea

    // Restablece los campos del formulario de actualización si es necesario
    // (puedes agregar esto si deseas restablecer los campos después de la actualización)
});

loadTasks();