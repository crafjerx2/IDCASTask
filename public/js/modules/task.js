import Swal from 'sweetalert2'
import axios from 'axios'
import { updateAvance } from '../functions/avance'

const tareas = document.querySelector('.listado-pendientes')

const deleteTask = id => {
    Swal.fire({
        title: 'Deseas eliminar la tarea?',
        text: "Una tarea eliminada no se puede recuperar!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!',
        cancelButtonText: 'No, Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const url = `${window.location.origin}/task/${id}`
            axios.delete(url, { id })
            .then(res => {
                Swal.fire({
                    icon: 'success',
                    title:  'Tarea eliminada!',
                    text:  res.data,
                    showConfirmButton: false,
                })
                setTimeout(() => {
                    window.location.href = window.location.href
                }, 2000);
                updateAvance()
            })
            .catch(() => {
                Swal.fire({
                    icon: 'error',
                    title:  'Hubo un error',
                    text: 'No se ha podido eliminar el proyecto',
                    showConfirmButton: false,
                })
            })
        }
    })
}

const updateTask = id => {
    const url = `${window.location.origin}/task/${id}`

    axios({
        method: 'patch',
        url,
        data: {id}
     })
    .then(res => {
        Swal.fire({
            icon: 'success',
            title:  'Tarea actualizada!',
            text:  res.data,
            showConfirmButton: false,
        })
        setTimeout(() => {
            window.location.href = window.location.href
        }, 2000);

        updateAvance()
    })
    .catch(() => {
        Swal.fire({
            icon: 'error',
            title:  'Hubo un error',
            text: 'No se ha podido eliminar el proyecto',
            showConfirmButton: false,
        })
    })
}

if( tareas ) {
    tareas.addEventListener('click', e => {
        e.preventDefault()
        if( e.target.classList.contains('delete-tarea')) {
            const id = e.target.parentElement.parentElement.dataset.id
            deleteTask(id)
        }

        if(e.target.classList.contains('done')) {
            const id = e.target.parentElement.parentElement.dataset.id
            updateTask(id);
        }

        if(e.target.classList.contains('done_all')) {
            const id = e.target.parentElement.parentElement.dataset.id
            updateTask(id);
        }
    })
}

export default tareas
