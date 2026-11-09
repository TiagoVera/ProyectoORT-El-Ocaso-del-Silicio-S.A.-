const SECCIONES = ["secIniciarSesion", "secRegistroFuncionario"];
document.querySelector("#btnTablaFuncionarios").addEventListener("click", mostrarTablaFuncionarios);
ocultarTodasLasSecciones();

function mostrarSeccion(idSeccion){
 ocultarTodasLasSecciones();
 document.querySelector("#" + idSeccion).style.display ="block";
}

function ocultarTodasLasSecciones(){
    for (let i = 0 ; i < SECCIONES.length ; i ++){
        document.querySelector("#" + SECCIONES[i]).style.display = "none";
    }
}


function mostrarTablaFuncionarios(){
    let funcionarios = sistema.obtenerFuncionarios()
    let html = `<table border ="1">
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Robots aceptados</th>
                </tr>`;
                
    for (let i=0 ; i < funcionarios.length; i ++ ){
        html += `<tr>
                    <td>${funcionarios[i].codigoFuncionario}</td>
                    <td>${funcionarios[i].nombre}</td>
                    <td>${funcionarios[i].robotsAceptados}</td>
                </tr>`;
    }

    html += '</table>'
    document.querySelector("#divTablaFuncionarios").innerHTML = html;
}

const sistema = new Sistema();
sistema.precargaDatos()
