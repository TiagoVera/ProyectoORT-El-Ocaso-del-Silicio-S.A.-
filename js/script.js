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