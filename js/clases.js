class administrador {
    static #ultimoId = 0;
    constructor(nombre, usuario, contraseña) {
        this.id = administrador.#ultimoId++;
        this.nombre = nombre;
        this.usuario = usuario;
        this.contraseña = contraseña;
    }

}

class funcionario {
    static #ultimoId = 1;
    constructor(documento, nombre, telefono) {
        this.codigoFuncionario = "TURING-" + funcionario.#ultimoId++;
        this.documento = documento;
        this.nombre = nombre;
        this.telefono = telefono;
        this.contraseña = "pass-" + documento;
        this.robotsAceptados = 0;
    }
}

class robot {
    static #ultimoId = 1;
    constructor(nombre, numDeSerie, fabricante, modelo, industria, imagen, registradoPor) {
        this.id = "HAL-" + robot.#ultimoId++;
        this.nombre = nombre;
        this.numDeSerie = numDeSerie;
        this.fabricante = fabricante;
        this.modelo = modelo;
        this.estado = "PENDIENTE";
        this.motivo = "Registro Ingresado";
        this.industria = industria;
        this.imagen = imagen;
        this.registradoPor = registradoPor;
        this.asignadoA = null;
        this.actividades = [];
    }
}

class actividades {
    constructor(nombre, descripcion, precio) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
    }
}

class Sistema {
    #administrador = [];
    #funcionario = [];
    #robot = [];
    #actividades = [];
    static #dineroTotal = 0;
    static #dineroRobotsAceptados = 0;
    static #dineroRobotsVendidos = 0;
    static #dineroActividades = 0;
    static #mejorFuncionario = "";


    //Usuarios
    iniciarSesion(usuario, contraseña) {
        if (esFuncionario(usuario)) {

            for (let i = 0; i < this.#funcionario.length; i++) {
                let unFuncionario = this.#funcionario[i];
                if (sonIgualesTexto(unFuncionario.codigoFuncionario, usuario) && unFuncionario.contraseña == contraseña) {
                    return unFuncionario;
                }
            }

        } else {
            for (let i = 0; i < this.#administrador.length; i++) {
                let administrador = this.#administrador[i];
                if (sonIgualesTexto(administrador.usuario, usuario) && administrador.contraseña == contraseña) {
                    return administrador;
                }
            }
        }
        return null
    }

    registrarAdministrador(nombre, usuario, contraseña) {
        let nuevoAdministrador = new administrador(nombre, usuario, contraseña);
        this.#administrador.push(nuevoAdministrador);
    }

    obtenerFuncionarios() {
        let listaFuncionarios = [];
        for (let i = 0; i < this.#funcionario.length; i++) {
            listaFuncionarios.push(this.#funcionario[i])

        }
        return listaFuncionarios;
    }

    registrarFuncionario(documento, nombre, telefono) {
        let nuevoFuncionario = new funcionario(documento, nombre, telefono);
        this.#funcionario.push(nuevoFuncionario);
    }

    //Robots
    obtenerRobots() {
        let listaRobots = [];
        for (let i = 0; i < this.#robot.length; i++) {
            if (this.#robot[i].estado == "PENDIENTE") {
                listaRobots.push(this.#robot[i])
            }
        }
        return listaRobots;
    }

    existeRobot(numDeSerie, fabricante) {
        for (let i = 0; i < this.#robot.length; i++) {
            if (sonIgualesTexto(this.#robot[i].numDeSerie, numDeSerie) &&
                sonIgualesTexto(this.#robot[i].fabricante, fabricante)) {
                return true;
            }
        }
        return false;
    }

    registrarRobot(nombre, numDeSerie, fabricante, modelo, industria, imagen, registradoPor) {
        let nuevoRobot = new robot(nombre, numDeSerie, fabricante, modelo, industria, imagen, registradoPor);
        this.#robot.push(nuevoRobot);
    }


    obtenerRobotsAsignados(codigoFuncionario) {
        let lista = [];
        for (let i = 0; i < this.#robot.length; i++) {
            let unRobot = this.#robot[i];
            if (unRobot.estado == "ACEPTADO" && unRobot.asignadoA == codigoFuncionario) {
                lista.push(unRobot)
            }
        }
        return lista;
    }

    obtenerRobotsPorIndustria(industria) {
        let lista = [];
        for (let i = 0; i < this.#robot.length; i++) {
            let robot = this.#robot[i];
            if (robot.estado == "ACEPTADO" && robot.industria == industria) {
                lista.push(robot)
            }
        }
        return lista;
    }

    buscarRobotPorId(idRobot) {
        for (let i = 0; i < this.#robot.length; i++) {
            if (this.#robot[i].id == idRobot) {
                return this.#robot[i];
            }
        }
        return null;
    }

    darDeBajaRobot(idRobot, codigoFuncionario) {
        let unRobot = this.buscarRobotPorId(idRobot);
        if (unRobot == null || unRobot.estado != "ACEPTADO" || unRobot.asignadoA != codigoFuncionario) {
            return false;
        }
        unRobot.estado = "DE BAJA";
        unRobot.motivo = "Dado de baja por el funcionario";
        return true;
    }

    cambiarEstadoRobot(idRobot, estado) {
        let robot = this.buscarRobotPorId(idRobot);
        if (robot) {
            robot.estado.push(estado);
            return "ESTADO CAMBIADO A " + estado;
        }
        return null
    }

obtenerFuncionarioDisponible(codigoFuncionarioOriginal) {
    if (this.obtenerRobotsAsignados(codigoFuncionarioOriginal).length < 10) {
        return codigoFuncionarioOriginal;
    }

    //Si ya tiene 10, busca el siguiente funcionario disponible
    let codigoLibre = null;
    for (let i = 0; i < this.#funcionario.length; i++) {
        let codigoActual = this.#funcionario[i].codigoFuncionario;
        if (this.obtenerRobotsAsignados(codigoActual).length < 10) {
            codigoLibre = codigoActual;
            break;
        }
    }
    return codigoLibre; // Devuelve el código disponible o null si están todos llenos
}

rechazarRobot(idRobot) {
    let robot = this.buscarRobotPorId(idRobot);
    if (robot !== null && robot.estado === "PENDIENTE") {
        robot.estado = "RECHAZADO";
        return "Robot rechazado correctamente.";
    }
    return "No se pudo rechazar el robot.";
}

venderRobot(idRobot) {
    let robot = this.buscarRobotPorId(idRobot);
    if (robot !== null && robot.estado === "PENDIENTE") {
        robot.estado = "VENDIDO";
        Sistema.#dineroRobotsVendidos += 20000;
        Sistema.#dineroTotal += 20000;
        return "Robot vendido por piezas. El establecimiento ganó $20.000.";
    }
    return "No se pudo vender el robot.";
}

aceptarRobot(idRobot) {
    let robot = this.buscarRobotPorId(idRobot);
    if (robot !== null && robot.estado === "PENDIENTE") {
        
        //Verifica límite de 30 en la misma industria, y si lo pasa lo vende
        let aceptadosIndustria = this.obtenerRobotsPorIndustria(robot.industria);
        if (aceptadosIndustria >= 30) {
            robot.estado = "VENDIDO";
            Sistema.#dineroRobotsVendidos += 20000;
            Sistema.#dineroTotal += 20000;
            return "Límite de 30 robots alcanzado en esta industria. El robot fue vendido automáticamente por $20.000.";
        }

        let codigoFuncDisponible = this.obtenerFuncionarioDisponible(robot.asignadoA);
        
        if (codigoFuncDisponible !== null) {
            robot.asignadoA = codigoFuncDisponible; 
            robot.estado = "ACEPTADO";
            Sistema.#dineroRobotsAceptados += 5000;
            Sistema.#dineroTotal += 5000;
            return "Robot aceptado y asignado. El establecimiento ganó $5.000.";
        } else {
            //No hay funcionarios disponibles -> queda PENDIENTE y avisa
            return "No se pudo aceptar el robot porque no hay funcionarios disponibles. Se recomienda buscar personal para la instalación.";
        }
    }
    return "No se pudo procesar el robot.";
}


    //Actividades

    registrarActividad(nombre, descripcion, precio) {
        let nuevaActividad = new actividades(nombre, descripcion, precio)
        this.#actividades.push(nuevaActividad)
    }

    obtenerActividades() {
        let listaActividades = [];
        for (let i = 0; i < this.#actividades.length; i++) {
            listaActividades.push(this.#actividades[i])
        }
        return listaActividades;
    }

    buscarActividadPorNombre(nombre) {
        for (let i = 0; i < this.#actividades.length; i++) {
            if (sonIgualesTexto(this.#actividades[i].nombre, nombre)) {
                return this.#actividades[i];
            }
        }
        return null;
    }

    robotTieneActividad(unRobot, nombreActividad) {
        for (let i = 0; i < unRobot.actividades.length; i++) {
            if (sonIgualesTexto(unRobot.actividades[i].nombre, nombreActividad)) {
                return true;
            }
        }
        return false;
    }

    asignarActividad(idRobot, nombreActividad) {
        let unRobot = this.buscarRobotPorId(idRobot);
        let unaActividad = this.buscarActividadPorNombre(nombreActividad);

        if (unRobot == null) {
            return "El robot no existe";
        }
        if (unRobot.estado != "ACEPTADO") {
            return "Solo los robots ACEPTADOS pueden tener actividades";
        }
        if (unaActividad == null) {
            return "La actividad no existe";
        }
        if (this.robotTieneActividad(unRobot, nombreActividad)) {
            return "El robot ya tiene asignada una actividad";
        }
        unRobot.actividades.push(unaActividad);
        Sistema.#dineroActividades = Sistema.#dineroActividades + unaActividad.precio;
        return "";
    }

    quitarActividad(idRobot, nombreActividad) {
        let unRobot = this.buscarRobotPorId(idRobot);

        if (unRobot == null) {
        return "El robot no existe.";
        }
        if (!this.robotTieneActividad(unRobot, nombreActividad)) {
        return "El robot no tiene esa actividad.";
        }

        let nuevaLista = [];
        for (let i = 0; i < unRobot.actividades.length; i++) {
        if (!sonIgualesTexto(unRobot.actividades[i].nombre, nombreActividad)) {
            nuevaLista.push(unRobot.actividades[i]);
            }
        }
        unRobot.actividades = nuevaLista;
        return "";
    }

    obtenerDineroActividades() {
        return Sistema.#dineroActividades;
    }
    


    // PRECARGA DE DATOS
    precargaDatos() {
        //Administradores
        this.registrarAdministrador("Tiago Vera", "Sovera", "1234");
        this.registrarAdministrador("Alex Alonzo", "Alexito", "1234");

        //Funcionarios
        this.registrarFuncionario("53662578", "Matias Botero", "092758379");
        this.registrarFuncionario("34556589", "Alejandro Montenegro", "094234192");
        this.registrarFuncionario("47283941", "Anastasia Blanco", "091278382");
        this.registrarFuncionario("63984234", "Luisa Suarez", "098562974");
        this.registrarFuncionario("78590431", "Carlos Gardel", "092453672");

        //Robots
        this.registrarRobot("Atlas V1", "SN-1001", "Boston Dynamics", "HD-2024", "Militar", "https://res.cloudinary.com/tgh2fcit/image/upload/v1789766051/ChatGPT_Image_Sep_18_2026_06_13_26_PM.png", "TURING-1");
        this.registrarRobot("Optimus Gen2", "SN-1002", "Tesla", "TS-02", "Doméstica", "https://res.cloudinary.com/tgh2fcit/image/upload/v1789766177/ChatGPT_Image_Sep_18_2026_06_15_24_PM.png", "TURING-2");
        this.registrarRobot("KUKA KR-6", "SN-1003", "KUKA Systems", "KR-600", "Genérico", "https://res.cloudinary.com/tgh2fcit/image/upload/v1789767546/ChatGPT_Image_Sep_18_2026_06_36_01_PM.png", "TURING-3");
        this.registrarRobot("UR10e Cobot", "SN-1004", "Universal Robots", "UR10e", "Médica", "https://res.cloudinary.com/tgh2fcit/image/upload/v1789768114/ChatGPT_Image_Sep_18_2026_06_48_13_PM.png", "TURING-4");
        this.registrarRobot("Spot Explorer", "SN-1005", "Boston Dynamics", "Spot-V2", "Agrícola", "img/spot.jpg", "TURING-5");

        //Robots aceptados y asignados (prueba de funcionario)
        this.#robot[0].estado = "ACEPTADO";
        this.#robot[0].asignadoA = "TURING-1";
        this.#robot[1].estado = "ACEPTADO";
        this.#robot[1].asignadoA = "TURING-1";
        this.#robot[2].estado = "ACEPTADO";
        this.#robot[2].asignadoA = "TURING-1";
        this.#robot[3].estado = "ACEPTADO";
        this.#robot[3].asignadoA = "TURING-2";

        //Actividades 
        this.registrarActividad("Ajedrez", "Partidas de ajedrez contra otros robots", 300);
        this.registrarActividad("Pintura", "Pintura junto con otros robots ", 400);
        this.registrarActividad("Música", "Lecciones de instrumentos", 500);
        this.registrarActividad("Jardinería", "Aprendizaje de cuidado de jardin", 250);
        this.registrarActividad("Lectura", "Lectura extensa de diferentes generos", 150);
        this.registrarActividad("Baile", "Clases de baile", 100);
        this.registrarActividad("Cocina", "Aprendizaje de nuevas recetas", 550);
        this.registrarActividad("Meditación", "Tiempo de recarga energetica", 350);
        this.registrarActividad("Videojuegos", "Creacion de videojuegos o recreacion en videojuegos", 200);
        this.registrarActividad("Senderismo", "Salidas para matener los engranajes en funcionamiento", 450);
    }

}
