import axios from "axios";
import Swal from "sweetalert2";

document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector(".lista-conocimientos")
    let alertas = document.querySelector('.alerta');
    if(alertas) {
        limpiarAlertas();
    }
    if(skills) {
        skills.addEventListener('click', agregarSkills);
        skillsSeleccionados();
    }

    const vacantesListado = document.querySelector('.panel-administracion');

    if(vacantesListado) {
        vacantesListado.addEventListener('click', accionesListado);
    }
    
});

const skills = new Set();
const agregarSkills = e => {
    if(e.target.tagName == 'LI') {
        if(e.target.classList.contains('activo')) {
            skills.delete(e.target.textContent);
            e.target.classList.remove('activo');
        } else {
            skills.add(e.target.textContent);
            e.target.classList.add('activo');
        }
    } 
    const skillsArray = [...skills];
    document.querySelector('#skills').value = skillsArray;
}

const skillsSeleccionados = () => {
    const seleccionadas = document.querySelectorAll('.lista-conocimientos .activo');

    seleccionadas.forEach(seleccionada => {
        skills.add(seleccionada.textContent);
    });

    const skillsArray = [...skills];
    document.querySelector('#skills').value = skillsArray;

}

const limpiarAlertas = () => {
    const alertas = document.querySelector('.alerta');
    if(alertas.children.length > 0) {
        setInterval(() => {
            alertas.removeChild(alertas.children[0]);
        }, 3000);
    }
}

// Eliminar vacantes
const accionesListado = e => {
    e.preventDefault();
    if(e.target.dataset.eliminar) {
        
        Swal.fire({
            title: 'Deseas borrar esta vacante?',
            text: "Una vacante eliminada no se puede recuperar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Borrar!',
            cancelButtonText: 'No, Cancelar'
        }).then((result) => {
            if(result.value) {

                // Enviar petición con axios

                const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;

                axios.delete(url, { params: {url}})
                    .then(function(respuesta) {
                        if(respuesta.status === 200) {
                            Swal.fire(
                                'Vacante Eliminada!',
                                respuesta.data,
                                'success'
                            );
                            e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);
                        }
                    })
                    .catch(() => {  
                        Swal.fire({
                            type: 'error',
                            title: 'Hubo un error',
                            text: 'No se pudo eliminar'
                        })
                     })
                

            }
        });
    } else if(e.target.tagName === 'A') {
        window.location.href = e.target.href;
    }
}