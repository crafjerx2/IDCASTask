import Swal from 'sweetalert2'
import axios from 'axios'

const btnDelete = document.querySelector('#eliminar-projecto')

if ( btnDelete ) {
    btnDelete.addEventListener('click', e => {

        const id = e.target.dataset.id

        Swal.fire({
            title: 'Deseas eliminar el proyecrto?',
            text: "Un proyecto eliminado no se puede recuperar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'No, Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const url = `${window.location.origin}/proyecto/destroy/${id}`

                axios.delete(url, { params: {id} })
                .then(res => {
                    console.log(res)
                    Swal.fire(
                        'Proyecto eliminado!',
                        res.data,
                        'success'
                    )
                    setTimeout(() => {
                        window.location.href = '/'
                    }, 3000);
                })
                .catch(() => {
                    Swal.fire({
                        icon: 'error',
                        title:  'Hubo un error',
                        text: 'No se ha podido eliminar el proyecto'
                    })
                })
            }
        })
    })
}

export default btnDelete;