const SECCIONES = ["IniciarSesion", "registroFuncionario"];
const sistema = new Sistema()
sistema.precargaDatos()
mostrarSeccion("IniciarSesion");

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
                    <td>${funcionarios[i].id}</td>
                    <td>${funcionarios[i].nombre}</td>
                    <td>${funcionarios[i].robotsAceptados}</td>
                    <td><button id="btnHistorial_${i}">Ver Historial</button></td>
                    <td></td>
                </tr>`;
    }

    html += '</table>'

    
    document.querySelector("#divTabla").innerHTML = html;
}
