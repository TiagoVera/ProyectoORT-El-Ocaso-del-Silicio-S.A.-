const SECCIONES = [
    "secIniciarSesion",
    "secBienvenida",
    "secEstadosRobots",
    "secTablaFuncionarios",
    "secRegistroRobot",
    "secRegistrarActividad",
    "secRobotsAsignados",
    "secActividadesRobot",
    "secRegistrarFuncionario",
    "secEstadisticasGenerales",
    "secMisRegistros",
    "secCambiarContrasena"
];

const sistema = new Sistema();
let usuarioLogueado = null;
let tipoUsuario = "";
let idRobotActual = "";

sistema.precargaDatos();
ocultarTodasLasSecciones();
mostrarSeccion("secIniciarSesion");
actualizarMenu();




document.querySelector("#btnIniciarSesion").addEventListener("click", irAIniciarSesion);
document.querySelector("#btnEnviarLogin").addEventListener("click", intentarIniciarSesion);
document.querySelector("#btnCerrarSesion").addEventListener("click", cerrarSesion);

//Administrador
document.querySelector("#linkRegistrarFuncionario").addEventListener("click", irARegistrarFuncionario);
document.querySelector("#btnRegistrarFuncionario").addEventListener("click", registrarFuncionario);
document.querySelector("#linkTablaFuncionarios").addEventListener("click", mostrarTablaFuncionarios);
document.querySelector("#linkTablaEstadosRobots").addEventListener("click", mostrarTablaEstadosDeRobots);
document.querySelector("#linkRegistrarActividad").addEventListener("click", irARegistrarActividad);
document.querySelector("#btnRegistrarActividad").addEventListener("click", registrarActividad);
document.querySelector("#linkEstadisticasGenerales").addEventListener("click", mostrarTablaEstadisticas);

//Funcionario
document.querySelector("#btnRegistrarRobot").addEventListener("click", irARegistrarRobot);
document.querySelector("#btnRegistrarRobotForm").addEventListener("click", registrarRobotDesdeFormulario);
document.querySelector("#btnRobotsAsignados").addEventListener("click", irARobotsAsignados);
document.querySelector("#btnAsignarActividad").addEventListener("click", asignarActividadSeleccionada);
document.querySelector("#btnVolverRobots").addEventListener("click", irARobotsAsignados);
document.querySelector("#btnMisRegistros").addEventListener("click", mostrarMisRegistros);
document.querySelector("#btnCambiarContrasenaMenu").addEventListener("click", irACambiarContrasena);
document.querySelector("#btnCambiarContrasena").addEventListener("click", cambiarContrasena);


function mostrarSeccion(idSeccion) {
    ocultarTodasLasSecciones();
    document.querySelector("#" + idSeccion).style.display = "block";
}

function ocultarTodasLasSecciones() {
    for (let i = 0; i < SECCIONES.length; i++) {
        document.querySelector("#" + SECCIONES[i]).style.display = "none";
    }
}

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

    //Funcionario
    mostrarElemento("#liRegistrarRobot", tipoUsuario == "funcionario");
    mostrarElemento("#liRobotsAsignados", tipoUsuario == "funcionario");
    mostrarElemento("#liMisRegistros", tipoUsuario == "funcionario");
    mostrarElemento("#liCambiarContrasena", tipoUsuario == "funcionario");

    //Administrador
    mostrarElemento("#liTablaFuncionarios", tipoUsuario == "administrador");
    mostrarElemento("#liTablaEstadosRobots", tipoUsuario == "administrador");
    mostrarElemento("#liRegistrarActividad", tipoUsuario == "administrador");
    mostrarElemento("#liRegistrarFuncionario", tipoUsuario == "administrador");
    mostrarElemento("#liEstadisticasGenerales", tipoUsuario == "administrador");
}

function irAIniciarSesion() {
    mostrarSeccion("secIniciarSesion");
}

function mostrarBienvenida() {
    mostrarSeccion("secBienvenida");
    document.querySelector("#h2Bienvenida").innerHTML = "Bienvenido/a, " + usuarioLogueado.nombre;

    if (tipoUsuario == "administrador") {
        document.querySelector("#pBienvenidaInfo").innerHTML =
            "Has iniciado sesión como <strong>Administrador</strong> (" + usuarioLogueado.usuario + "). Seleccioná una opción del menú superior para gestionar funcionarios, solicitudes de robots, actividades o estadísticas.";
    } else {
        document.querySelector("#pBienvenidaInfo").innerHTML =
            "Has iniciado sesión como <strong>Funcionario</strong> (" + usuarioLogueado.codigoFuncionario + "). Usá el menú superior para registrar nuevos robots o gestionar los que tenés asignados.";
    }
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
    mostrarBienvenida();
}

function cerrarSesion() {
    usuarioLogueado = null;
    tipoUsuario = "";
    actualizarMenu();
    mostrarSeccion("secIniciarSesion");
}

//FUNCIONALIDADES DEL ADMINISTRADOR 

function irARegistrarFuncionario() {
    mostrarSeccion("secRegistrarFuncionario");
}

function validarRegistroFuncionario(documento, nombre, telefono) {
    let esValido = true;

    if (documento.trim() == "") {
        mostrarErrorInput("El documento es obligatorio.", "documentoFuncionarioRegistro");
        mostrarErrorP("Todos los campos son obligatorios", "pMensajeFuncionario");
        esValido = false;
    }
    if (nombre.trim() == "") {
        mostrarErrorInput("El nombre completo es obligatorio.", "nombreFuncionarioRegistro");
        mostrarErrorP("Todos los campos son obligatorios", "pMensajeFuncionario");
        esValido = false;
    }
    if (telefono.trim() == "") {
        mostrarErrorInput("El teléfono es obligatorio.", "telefonoFuncionarioRegistro");
        mostrarErrorP("Todos los campos son obligatorios", "pMensajeFuncionario");
        esValido = false;
    }
    if (sistema.existeFuncionario(documento)) {
        mostrarErrorInput("Ya existe un funcionario con ese documento.", "documentoFuncionarioRegistro");
        mostrarErrorP("Ya existe un funcionario con ese documento.", "pMensajeFuncionario");
        esValido = false;
    }
    return esValido;
}

function registrarFuncionario() {
    let documento = document.querySelector("#documentoFuncionarioRegistro").value;
    let nombre = document.querySelector("#nombreFuncionarioRegistro").value;
    let telefono = document.querySelector("#telefonoFuncionarioRegistro").value;

    limpiarErrores();

    if (!validarRegistroFuncionario(documento, nombre, telefono)) {
        return;
    }

    sistema.registrarFuncionario(documento.trim(), nombre.trim(), telefono.trim());
    mostrarExito("Funcionario registrado correctamente", "pMensajeFuncionario");

    document.querySelector("#documentoFuncionarioRegistro").value = "";
    document.querySelector("#nombreFuncionarioRegistro").value = "";
    document.querySelector("#telefonoFuncionarioRegistro").value = "";
}

function mostrarTablaFuncionarios() {
    mostrarSeccion("secTablaFuncionarios");
    let funcionarios = sistema.obtenerFuncionarios();
    let html = `<table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Robots aceptados</th>
                    </tr>
                </thead>
                <tbody>`;

    for (let i = 0; i < funcionarios.length; i++) {
        let cantAceptados = sistema.obtenerRobotsAsignados(funcionarios[i].codigoFuncionario).length;
        html += `<tr>
                    <td>${funcionarios[i].codigoFuncionario}</td>
                    <td>${funcionarios[i].nombre}</td>
                    <td>${cantAceptados}</td>
                </tr>`;
    }

    html += "</tbody></table>";
    document.querySelector("#divTablaFuncionarios").innerHTML = html;
}


function mostrarTablaEstadosDeRobots() {
    document.querySelector("#pMensajeEstadoRobot").innerHTML = "";
    mostrarSeccion("secEstadosRobots");
    let robots = sistema.obtenerRobots();
    let divTabla = document.querySelector("#divTablaEstadosDeRobots");

    let html = `<table border="1">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Industria</th>
                <th>Estado</th>
                <th>Motivo</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>`;

    for (let i = 0; i < robots.length; i++) {
        if (robots[i].estado === "PENDIENTE") {
            html += `<tr>
                <td>${robots[i].id}</td>
                <td>${robots[i].nombre}</td>
                <td>${robots[i].industria}</td>
                <td>${robots[i].estado}</td>
                <td>${robots[i].motivo}</td>
                <td>
                    <input type="button" value="Aceptar" class="btnAceptar" data-id="${robots[i].id}" />
                    <input type="button" value="Rechazar" class="btnRechazar" data-id="${robots[i].id}" />
                    <input type="button" value="Vender" class="btnVender" data-id="${robots[i].id}" />
                </td>
            </tr>`;
        } else {
            html += `<tr>
                <td>${robots[i].id}</td>
                <td>${robots[i].nombre}</td>
                <td>${robots[i].industria}</td>
                <td>${robots[i].estado}</td>
                <td>${robots[i].motivo}</td>
                <td></td>
            </tr>`;
        }
    }

    html += "</tbody></table>";
    divTabla.innerHTML = html;

    conectarBotonesEstados();
}

function conectarBotonesEstados() {
    let botonesAceptar = document.querySelectorAll(".btnAceptar");
    for (let i = 0; i < botonesAceptar.length; i++) {
        botonesAceptar[i].addEventListener("click", aceptarRobot);
    }

    let botonesRechazar = document.querySelectorAll(".btnRechazar");
    for (let i = 0; i < botonesRechazar.length; i++) {
        botonesRechazar[i].addEventListener("click", rechazarRobot);
    }

    let botonesVender = document.querySelectorAll(".btnVender");
    for (let i = 0; i < botonesVender.length; i++) {
        botonesVender[i].addEventListener("click", venderRobot);
    }
}

function aceptarRobot() {
    let idRobot = this.getAttribute("data-id");
    let mensaje = sistema.aceptarRobot(idRobot);
    mostrarTablaEstadosDeRobots();
    document.querySelector("#pMensajeEstadoRobot").innerHTML = mensaje;
}

function rechazarRobot() {
    let idRobot = this.getAttribute("data-id");
    let mensaje = sistema.rechazarRobot(idRobot);
    mostrarTablaEstadosDeRobots();
    document.querySelector("#pMensajeEstadoRobot").innerHTML = mensaje;
}

function venderRobot() {
    let idRobot = this.getAttribute("data-id");
    let mensaje = sistema.venderRobot(idRobot);
    mostrarTablaEstadosDeRobots();
    document.querySelector("#pMensajeEstadoRobot").innerHTML = mensaje;
}

function irARegistrarActividad() {
    mostrarSeccion("secRegistrarActividad");
}

function validarRegistroActividad(nombre, descripcion, precio) {
    let esValido = true;

    if (nombre.trim() == "") {
        mostrarErrorInput("El nombre es obligatorio.", "nombreRegistroActividad");
        mostrarErrorP("Todos los campos son obligatorios", "pMensajeActividadRegistro");
        esValido = false;
    }
    if (descripcion.trim() == "") {
        mostrarErrorInput("La descripción es obligatoria.", "descripcionRegistroActividad");
        mostrarErrorP("Todos los campos son obligatorios", "pMensajeActividadRegistro");
        esValido = false;
    }
    if (precio.trim() == "") {
        mostrarErrorInput("El precio es obligatorio.", "precioRegistroActividad");
        mostrarErrorP("Todos los campos son obligatorios", "pMensajeActividadRegistro");
        esValido = false;
    }
    if (sistema.existeActividad(nombre.trim())) {
        mostrarErrorInput("Ya existe una actividad con ese nombre.", "nombreRegistroActividad");
        mostrarErrorP("Ya existe una actividad con ese nombre.", "pMensajeActividadRegistro");
        esValido = false;
    }
    if (isNaN(precio) || Number(precio) <= 0) {
        mostrarErrorInput("El precio debe ser un número positivo.", "precioRegistroActividad");
        mostrarErrorP("El precio debe ser un número positivo.", "pMensajeActividadRegistro");
        esValido = false;
    }
    return esValido;
}

function registrarActividad() {
    let nombre = document.querySelector("#nombreRegistroActividad").value;
    let descripcion = document.querySelector("#descripcionRegistroActividad").value;
    let precio = document.querySelector("#precioRegistroActividad").value;

    limpiarErrores();

    if (!validarRegistroActividad(nombre, descripcion, precio)) {
        return;
    }

    sistema.registrarActividad(nombre.trim(), descripcion.trim(), Number(precio));
    mostrarExito("Actividad registrada correctamente", "pMensajeActividadRegistro");

    document.querySelector("#nombreRegistroActividad").value = "";
    document.querySelector("#descripcionRegistroActividad").value = "";
    document.querySelector("#precioRegistroActividad").value = "";
}

function mostrarTablaEstadisticas() {
    mostrarSeccion("secEstadisticasGenerales");
    let datosIndustrias = sistema.obtenerEstadisticasPorIndustria();
    let html = `<table border="1">
                <thead>
                    <tr>
                        <th>Industria</th>
                        <th>Robots Aceptados</th>
                        <th>Robots Vendidos</th>
                        <th>Robots Rechazados</th>
                        <th>% del Total</th>
                    </tr>
                </thead>
                <tbody>`;

    for (let i = 0; i < datosIndustrias.length; i++) {
        html += `<tr>
            <td>${datosIndustrias[i].industria}</td>
            <td>${datosIndustrias[i].aceptados}</td>
            <td>${datosIndustrias[i].vendidos}</td>
            <td>${datosIndustrias[i].rechazados}</td>
            <td>${datosIndustrias[i].porcentaje}%</td>
        </tr>`;
    }
    html += "</tbody></table>";
    document.querySelector("#divEstadisticasGenerales").innerHTML = html;

    let totalGeneral = sistema.obtenerTotalDineroGanado();
    document.querySelector("#pTotalDinero").innerHTML = "Total de dinero ganado: $" + totalGeneral;

    document.querySelector("#pDesgloseDinero").innerHTML =
        "Ganado por robots ACEPTADOS: $" + sistema.obtenerDineroAceptados() +
        " | Por robots VENDIDOS: $" + sistema.obtenerDineroVendidos() +
        " | Por actividades: $" + sistema.obtenerDineroActividades();

    let mejor = sistema.obtenerMejorFuncionario();
    if (mejor != null) {
        document.querySelector("#pMejorFuncionario").innerHTML =
            "El mejor funcionario del momento: " + mejor.nombre + " (" + mejor.codigoFuncionario + ")";
    }
}

// ==================== FUNCIONALIDADES DEL FUNCIONARIO ====================

function irARegistrarRobot() {
    mostrarSeccion("secRegistroRobot");
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


function irARobotsAsignados() {
    document.querySelector("#pMensajeBaja").innerHTML = "";
    mostrarRobotsAsignados();
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
    conectarBotonesActividades();
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

function conectarBotonesActividades() {
    let botones = document.querySelectorAll(".btnActividades");
    for (let i = 0; i < botones.length; i++) {
        botones[i].addEventListener("click", clickActividades);
    }
}

function clickActividades() {
    idRobotActual = this.getAttribute("data-id");
    document.querySelector("#pMensajeActividad").innerHTML = "";
    mostrarActividadesRobot();
}

function mostrarActividadesRobot() {
    mostrarSeccion("secActividadesRobot");
    let unRobot = sistema.buscarRobotPorId(idRobotActual);
    document.querySelector("#pDatosRobot").innerHTML = "ID: " + unRobot.id + " | Nombre: " + unRobot.nombre;
    dibujarTablaActividades(unRobot);
    cargarSelectActividades();
}

function dibujarTablaActividades(unRobot) {
    let divTabla = document.querySelector("#divTablaActividadesRobot");

    if (unRobot.actividades.length == 0) {
        divTabla.innerHTML = "<p>El robot no tiene actividades asignadas.</p>";
        return;
    }

    let html = `<table border="1">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>`;

    for (let i = 0; i < unRobot.actividades.length; i++) {
        html += `<tr>
                    <td>${unRobot.actividades[i].nombre}</td>
                    <td>${unRobot.actividades[i].descripcion}</td>
                    <td>${unRobot.actividades[i].precio}</td>
                    <td><input type="button" value="Quitar" class="btnQuitar" data-nombre="${unRobot.actividades[i].nombre}" /></td>
                </tr>`;
    }

    html += "</tbody></table>";
    divTabla.innerHTML = html;
    conectarBotonesQuitar();
}

function conectarBotonesQuitar() {
    let botones = document.querySelectorAll(".btnQuitar");
    for (let i = 0; i < botones.length; i++) {
        botones[i].addEventListener("click", clickQuitarActividad);
    }
}

function clickQuitarActividad() {
    let nombreActividad = this.getAttribute("data-nombre");
    let pMensaje = document.querySelector("#pMensajeActividad");
    let resultado = sistema.quitarActividad(idRobotActual, nombreActividad);

    if (resultado == "") {
        pMensaje.innerHTML = "Se quitó la actividad " + nombreActividad + ".";
    } else {
        pMensaje.innerHTML = resultado;
    }
    mostrarActividadesRobot();
}

function cargarSelectActividades() {
    let todas = sistema.obtenerActividades();
    let html = "";
    for (let i = 0; i < todas.length; i++) {
        html += `<option value="${todas[i].nombre}">${todas[i].nombre} - ${todas[i].precio} USD</option>`;
    }
    document.querySelector("#selActividad").innerHTML = html;
}

function asignarActividadSeleccionada() {
    let nombreActividad = document.querySelector("#selActividad").value;
    let pMensaje = document.querySelector("#pMensajeActividad");
    let resultado = sistema.asignarActividad(idRobotActual, nombreActividad);

    if (resultado == "") {
        pMensaje.innerHTML = "Se asignó la actividad " + nombreActividad + ".";
    } else {
        pMensaje.innerHTML = resultado;
    }
    mostrarActividadesRobot();
}

function mostrarMisRegistros() {
    mostrarSeccion("secMisRegistros");
    let robots = sistema.obtenerRobotsRegistrados(usuarioLogueado.codigoFuncionario);
    let divTabla = document.querySelector("#divTablaMisRegistros");

    if (robots.length == 0) {
        divTabla.innerHTML = "<p>No registraste ningún robot.</p>";
        return;
    }

    let html = `<table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>`;

    for (let i = 0; i < robots.length; i++) {
        html += `<tr>
                    <td>${robots[i].id}</td>
                    <td>${robots[i].nombre}</td>
                    <td>${robots[i].estado}</td>
                </tr>`;
    }

    html += "</tbody></table>";
    divTabla.innerHTML = html;
}

function irACambiarContrasena() {
    document.querySelector("#contrasenaActual").value = "";
    document.querySelector("#contrasenaNueva").value = "";
    document.querySelector("#contrasenaConfirmacion").value = "";
    document.querySelector("#pMensajeContrasena").innerHTML = "";
    mostrarSeccion("secCambiarContrasena");
}

function validarCambioContrasena(actual, nueva, confirmacion) {
    if (estaVacio(actual) || estaVacio(nueva) || estaVacio(confirmacion)) {
        return "Todos los campos son obligatorios.";
    }
    if (usuarioLogueado.contraseña != actual) {
        return "La contraseña actual es incorrecta.";
    }
    if (nueva == actual) {
        return "La contraseña nueva no puede ser igual a la actual.";
    }
    if (tieneEspacios(nueva)) {
        return "La contraseña nueva no puede contener espacios.";
    }
    if (nueva != confirmacion) {
        return "La confirmación no coincide con la contraseña nueva.";
    }
    return "";
}

function cambiarContrasena() {
    let actual = document.querySelector("#contrasenaActual").value;
    let nueva = document.querySelector("#contrasenaNueva").value;
    let confirmacion = document.querySelector("#contrasenaConfirmacion").value;
    let pMensaje = document.querySelector("#pMensajeContrasena");

    let error = validarCambioContrasena(actual, nueva, confirmacion);
    if (error != "") {
        pMensaje.innerHTML = error;
        return;
    }

    if (sistema.cambiarContrasenaFuncionario(usuarioLogueado.codigoFuncionario, nueva)) {
        pMensaje.innerHTML = "Contraseña cambiada correctamente.";
    } else {
        pMensaje.innerHTML = "No se pudo cambiar la contraseña.";
    }

    document.querySelector("#contrasenaActual").value = "";
    document.querySelector("#contrasenaNueva").value = "";
    document.querySelector("#contrasenaConfirmacion").value = "";
}

// MENSAJES DE ERRORES 

function mostrarErrorP(mensaje, idP) {
    const p = document.querySelector("#" + idP);
    p.innerHTML = mensaje;
    p.setAttribute("class", "error");
}

function mostrarExito(mensaje, idP) {
    const p = document.querySelector("#" + idP);
    p.innerHTML = mensaje;
    p.setAttribute("class", "exito");
}

function mostrarErrorInput(mensaje, idInput) {
    const input = document.querySelector("#" + idInput);
    input.setAttribute("class", "error");
    input.setAttribute("placeholder", mensaje);
}

function limpiarErrores() {
    let camposConError = document.querySelectorAll(".error");
    for (let i = 0; i < camposConError.length; i++) {
        camposConError[i].classList.remove("error");
        if (camposConError[i].tagName === "INPUT") {
            camposConError[i].removeAttribute("placeholder");
        }
    }
}