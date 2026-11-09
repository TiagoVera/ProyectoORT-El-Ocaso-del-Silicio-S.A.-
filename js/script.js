const SECCIONES = ["secIniciarSesion", "secRegistroFuncionario", "secEstadosRobots","secTablaFuncionarios"];
document.querySelector("#btnTablaFuncionarios").addEventListener("click", mostrarTablaFuncionarios);
document.querySelector("#btnTablaEstadosRobots").addEventListener("click", mostrarTablaEstadosDeRobots);
document.querySelector("#btnIniciarSesion").addEventListener("click", () => {
    mostrarSeccion("secIniciarSesion");
});
ocultarTodasLasSecciones();

function mostrarSeccion(idSeccion) {
ocultarTodasLasSecciones();
    document.querySelector("#" + idSeccion).style.display = "block";
}

function ocultarTodasLasSecciones() {
    for (let i = 0; i < SECCIONES.length; i++) {
        document.querySelector("#" + SECCIONES[i]).style.display = "none";
    }
}


function mostrarTablaFuncionarios() {
    mostrarSeccion("secTablaFuncionarios")
    let funcionarios = sistema.obtenerFuncionarios()
    let html = `<table border ="1">
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Robots aceptados</th>
                </tr>`;

    for (let i = 0; i < funcionarios.length; i++) {
        html += `<tr>
                    <td>${funcionarios[i].codigoFuncionario}</td>
                    <td>${funcionarios[i].nombre}</td>
                    <td>${funcionarios[i].robotsAceptados}</td>
                </tr>`;
    }

    html += '</table>'
    document.querySelector("#divTablaFuncionarios").innerHTML = html;
}

function mostrarTablaEstadosDeRobots() {
    mostrarSeccion("secEstadosRobots")
    let robots = sistema.obtenerRobots()
    let html = `<table border ="1">
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>`;

    for (let i = 0; i < robots.length; i++) {
        html += `<tr>
                    <td>${robots[i].id}</td>
                    <td>${robots[i].nombre}</td>
                    <td>${robots[i].estado}</td>
                    <td><button>Aceptar</button><button>Rechazar</button><button>Vender</button></td>
                </tr>`;
    }

    html += '</table>'
    document.querySelector("#divTablaEstadosDeRobots").innerHTML = html;
}

const sistema = new Sistema();
sistema.precargaDatos()
