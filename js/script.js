const SECCIONES = ["secIniciarSesion", "secRegistroFuncionario", "secEstadosRobots","secTablaFuncionarios", "secRegistroRobot", "secRegistrarActividad", "secRobotsAsignados", "secActividadesRobot"];

let usuarioLogueado = null;
let tipoUsuario = "";

document.querySelector("#btnTablaFuncionarios").addEventListener("click", mostrarTablaFuncionarios);
document.querySelector("#btnTablaEstadosRobots").addEventListener("click", mostrarTablaEstadosDeRobots);
document.querySelector("#btnIniciarSesion").addEventListener("click", () => {
    mostrarSeccion("secIniciarSesion");
});
document.querySelector("#btnRegistrarActividad").addEventListener("click", () => {
    mostrarSeccion("secRegistrarActividad");
});
document.querySelector("#btnEnviarLogin").addEventListener("click", intentarIniciarSesion);
document.querySelector("#btnCerrarSesion").addEventListener("click", cerrarSesion);
document.querySelector("#btnRegistrarRobot").addEventListener("click", () => {
    mostrarSeccion("secRegistroRobot");
});

document.querySelector("#btnRobotsAsignados").addEventListener("click", () => {
    document.querySelector("#pMensajeBaja").innerHTML = "";
    mostrarRobotsAsignados();
});

document.querySelector("#btnRegistrarRobotForm").addEventListener("click", registrarRobotDesdeFormulario);

ocultarTodasLasSecciones();
// Se agrega mostrarSeccion("secIniciarSesion") ;actualizarMenu(); para que podamos ver correctamente el formulario de login sin eso quedaria todo vacio

mostrarSeccion("secIniciarSesion");
actualizarMenu();

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

function mostrarElemento(selector, visible) {
    if (visible) {
        document.querySelector(selector).style.display = "block";
    } else {
        document.querySelector(selector).style.display = "none";
    }
}

function actualizarMenu() {
    let haySesion = usuarioLogueado != null;
    mostrarElemento("#liIniciarSesion", !haySesion);
    mostrarElemento("#liCerrarSesion", haySesion);
    mostrarElemento("#liRegistrarRobot", tipoUsuario == "funcionario");
    mostrarElemento("#liRobotsAsignados", tipoUsuario == "funcionario");
}

function intentarIniciarSesion() {
    let usuario = document.querySelector("#usuario").value.trim().toUpperCase();
    let contraseña = document.querySelector("#contraseña").value;
    let pError = document.querySelector("#pErrorLogin");

    if (estaVacio(usuario) || estaVacio(contraseña)) {
        pError.innerHTML = "Debe ingresar usuario y contraseña.";
        return;
    }

    let encontrado = sistema.iniciarSesion(usuario, contraseña);
    if (encontrado == null) {
        pError.innerHTML = "Usuario o contraseña incorrectos.";
        return;
    }


    usuarioLogueado = encontrado;
    if (esFuncionario(usuario)) {
        tipoUsuario = "funcionario";
    } else {
        tipoUsuario = "administrador";
    }

    document.querySelector("#usuario").value = "";
    document.querySelector("#contraseña").value = "";
    pError.innerHTML = "";
    actualizarMenu();

    if (tipoUsuario == "funcionario") {
        document.querySelector("#pMensajeBaja").innerHTML = "";
        mostrarRobotsAsignados();
    }
}
    function cerrarSesion() {
        usuarioLogueado = null;
        tipoUsuario = "";
        actualizarMenu();
        mostrarSeccion("secIniciarSesion");
    }

    function validarRegistroRobot(nombre, serie, fabricante, modelo, industria, imagen) {
        if (estaVacio(nombre) || estaVacio(serie) || estaVacio(fabricante) ||
        estaVacio(modelo) || estaVacio(industria) || estaVacio(imagen)) {
        return "Todos los campos son obligatorios.";
        }
        if (superaLargo(nombre, 20)) {
        return "El nombre no puede superar los 20 caracteres.";
        }
        if (tieneEspacios(serie.trim())) {
        return "El número de serie no puede contener espacios.";
        }
        if (!tieneNumero(serie)) {
        return "El número de serie debe contener al menos un número.";
        }
        if (sistema.existeRobot(serie, fabricante)) {
        return "Ya existe un robot con ese número de serie y fabricante.";
        }
        return "";
    }

    function registrarRobotDesdeFormulario() {
        let nombre = document.querySelector("#robotNombre").value;
        let serie = document.querySelector("#robotSerie").value;
        let fabricante = document.querySelector("#robotFabricante").value;
        let modelo = document.querySelector("#robotModelo").value;
        let industria = document.querySelector("#robotIndustria").value;
        let imagen = document.querySelector("#robotImagen").value;
        let pMensaje = document.querySelector("#pMensajeRobot");

        let error = validarRegistroRobot(nombre, serie, fabricante, modelo, industria, imagen);
        if (error != "") {
        pMensaje.innerHTML = error;
        return;
        }

        sistema.registrarRobot(nombre.trim(), serie.trim(), fabricante.trim(), modelo.trim(),
                           industria, imagen.trim(), usuarioLogueado.codigoFuncionario);
        pMensaje.innerHTML = "Robot registrado correctamente. Queda PENDIENTE de aprobación.";

    document.querySelector("#robotNombre").value = "";
    document.querySelector("#robotSerie").value = "";
    document.querySelector("#robotFabricante").value = "";
    document.querySelector("#robotModelo").value = "";
    document.querySelector("#robotIndustria").value = "";
    document.querySelector("#robotImagen").value = "";
    }

    function mostrarRobotsAsignados() {
    mostrarSeccion("secRobotsAsignados");
    let robots = sistema.obtenerRobotsAsignados(usuarioLogueado.codigoFuncionario);
    let divTabla = document.querySelector("#divTablaRobotsAsignados");

    if (robots.length == 0) {
        divTabla.innerHTML = "<p>No tenés robots asignados.</p>";
        return;
    }

    let html = `<table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Modelo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>`;

    for (let i = 0; i < robots.length; i++) {
        html += `<tr>
                    <td>${robots[i].id}</td>
                    <td><img src="${robots[i].imagen}" alt="${robots[i].nombre}"></td>
                    <td>${robots[i].nombre}</td>
                    <td>${robots[i].modelo}</td>
                    <td>
                        <input type="button" value="Baja" class="btnBaja" data-id="${robots[i].id}" />
                        <input type="button" value="Actividades" class="btnActividades" data-id="${robots[i].id}" />
                    </td>
                </tr>`;
    }

    html += "</tbody></table>";
    divTabla.innerHTML = html;
    conectarBotonesBaja();
    }

    function conectarBotonesBaja() {
        let botones = document.querySelectorAll(".btnBaja");
        for (let i = 0; i < botones.length; i++) {
        botones[i].addEventListener("click", clickDarDeBaja);
        }
    }

    function clickDarDeBaja() {
        let idRobot = this.getAttribute("data-id");
        let pMensaje = document.querySelector("#pMensajeBaja");

        if (sistema.darDeBajaRobot(idRobot, usuarioLogueado.codigoFuncionario)) {
        pMensaje.innerHTML = "El robot " + idRobot + " fue dado de baja.";
        } else {
            pMensaje.innerHTML = "No se pudo dar de baja el robot " + idRobot + ".";
        }
        mostrarRobotsAsignados();
    }

    sistema.precargaDatos()

