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