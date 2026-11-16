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

    existeFuncionario(documento) {
        for (let i = 0; i < this.#funcionario.length; i++) {
            if (sonIgualesTexto(this.#funcionario[i].documento, documento)) {
                return true;
            }
        }
        return false;
    }

    obtenerMejorFuncionario() {
        let mejorFuncionario = null;
        let maxIngresados = -1;

        for (let i = 0; i < this.#funcionario.length; i++) {
            let funcActual = this.#funcionario[i];
            let cantIngresados = 0;

            // Contamos cuántos robots en el array tienen como creador a este funcionario
            for (let j = 0; j < this.#robot.length; j++) {
                if (this.#robot[j].registradoPor == funcActual.codigoFuncionario) {
                    cantIngresados++;
                }
            }

            // Usamos >= para que en caso de empate se quede con el último encontrado
            if (cantIngresados >= maxIngresados) {
                maxIngresados = cantIngresados;
                mejorFuncionario = funcActual;
            }
        }

        return mejorFuncionario;
    }

    //Robots
    obtenerRobots() {
        let listaRobots = [];
        for (let i = 0; i < this.#robot.length; i++) {

            listaRobots.push(this.#robot[i])

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

    obtenerRobotsRegistrados(codigoFuncionario) {
        let lista = [];
        for (let i = 0; i < this.#robot.length; i++) {
            if (this.#robot[i].registradoPor == codigoFuncionario) {
            lista.push(this.#robot[i]);
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
            robot.motivo = "Rechazado por un administrador.";
            return "Robot rechazado correctamente";
        }
        return "No se pudo rechazar el robot, no existe.";
    }

    venderRobot(idRobot) {
        let robot = this.buscarRobotPorId(idRobot);
        if (robot !== null && robot.estado === "PENDIENTE") {
            robot.estado = "VENDIDO";
            Sistema.#dineroRobotsVendidos += 20000;
            Sistema.#dineroTotal += 20000;
            robot.motivo = "Vendido por piezas por un administrador";
            return "Robot vendido por piezas. El establecimiento ganó $20.000. Acumulado total: $" + this.obtenerTotalDineroGanado();
        }
        return "No se pudo vender el robot, no existe.";
    }

    aceptarRobot(idRobot) {
        let robot = this.buscarRobotPorId(idRobot);
        if (robot !== null && robot.estado === "PENDIENTE") {

            //Verifica límite de 30 en la misma industria, y si lo pasa lo vende
            let aceptadosIndustria = this.obtenerRobotsPorIndustria(robot.industria);
            if (aceptadosIndustria.length >= 30) {
                robot.estado = "VENDIDO";
                Sistema.#dineroRobotsVendidos += 20000;
                Sistema.#dineroTotal += 20000;
                robot.motivo = "Vendido automáticamente: Límite de 30 robots en la industria alcanzado";
                return "Límite de 30 robots alcanzado en esta industria. El robot fue vendido automáticamente por $20.000. Acumulado total: $" + this.obtenerTotalDineroGanado();
            }

            let codigoFuncDisponible = this.obtenerFuncionarioDisponible(robot.registradoPor);

            if (codigoFuncDisponible !== null) {
                robot.asignadoA = codigoFuncDisponible;
                robot.estado = "ACEPTADO";
                Sistema.#dineroRobotsAceptados += 5000;
                Sistema.#dineroTotal += 5000;
                robot.motivo = "Robot aceptado por un administrador y asignado a un funcionario"
                return "Robot aceptado y asignado. El establecimiento ganó $5.000. Acumulado total: $" + this.obtenerTotalDineroGanado();
            } else {
                //No hay funcionarios disponibles -> queda PENDIENTE y avisa
                robot.motivo = "No se pudo aceptar el robot porque no hay funcionarios disponibles"
                return "No se pudo aceptar el robot porque no hay funcionarios disponibles. Se recomienda buscar personal para la instalación.";
            }
        }
        return "No se pudo procesar el robot, no existe.";
    }

    obtenerEstadisticasPorIndustria() {
        let industrias = ["Doméstica", "Médica", "Agrícola", "Militar", "Genérico"];
        let resultado = [];
        let totalRobots = this.#robot.length;

        for (let i = 0; i < industrias.length; i++) {
            let indActual = industrias[i];
            let cantAceptados = 0;
            let cantVendidos = 0;
            let cantRechazados = 0;
            let totalDeEstaIndustria = 0;

            for (let j = 0; j < this.#robot.length; j++) {
                let robot = this.#robot[j];
                if (robot.industria.toLowerCase() == indActual.toLowerCase()) {
                    totalDeEstaIndustria++;
                    if (robot.estado == "ACEPTADO") {
                        cantAceptados++;
                    } else if (robot.estado == "VENDIDO") {
                        cantVendidos++;
                    } else if (robot.estado == "RECHAZADO") {
                        cantRechazados++;
                    }
                }
            }

            let porcentaje = 0;
            if (totalRobots > 0) {
                porcentaje = (totalDeEstaIndustria * 100) / totalRobots;
            }

            resultado.push({
                industria: indActual,
                aceptados: cantAceptados,
                vendidos: cantVendidos,
                rechazados: cantRechazados,
                porcentaje: porcentaje.toFixed(1)
            });
        }

        return resultado;
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

    existeActividad(nombre) {
        for (let i = 0; i < this.#actividades.length; i++) {
            if (sonIgualesTexto(this.#actividades[i].nombre, nombre)) {
                return true;
            }
        }
        return false;
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
    obtenerTotalDineroGanado() {
        return Sistema.#dineroRobotsAceptados + Sistema.#dineroRobotsVendidos + Sistema.#dineroActividades;
    }
    obtenerDineroAceptados() {
        return Sistema.#dineroRobotsAceptados;
    }

    obtenerDineroVendidos() {
        return Sistema.#dineroRobotsVendidos;
    }


    // PRECARGA DE DATOS
    precargaDatos() {
        // Administradores
        this.registrarAdministrador("Tiago Vera", "Sovera", "1234");
        this.registrarAdministrador("Alex Alonzo", "Alexito", "1234");
        this.registrarAdministrador("Sofia Mendez", "Admin3", "1234");

        //Funcionarios
        this.registrarFuncionario("53662578", "Matias Botero", "092758379");
        this.registrarFuncionario("34556589", "Alejandro Montenegro", "094234192");
        this.registrarFuncionario("47283941", "Anastasia Blanco", "091278382");
        this.registrarFuncionario("63984234", "Luisa Suarez", "098562974");
        this.registrarFuncionario("78590431", "Carlos Gardel", "092453672");

        // Actividades
        this.registrarActividad("Ajedrez", "Partidas de ajedrez contra otros robots", 300);
        this.registrarActividad("Pintura", "Pintura junto con otros robots", 400);
        this.registrarActividad("Música", "Lecciones de instrumentos", 500);
        this.registrarActividad("Jardinería", "Aprendizaje de cuidado de jardin", 250);
        this.registrarActividad("Lectura", "Lectura extensa de diferentes generos", 150);
        this.registrarActividad("Baile", "Clases de baile", 100);
        this.registrarActividad("Cocina", "Aprendizaje de nuevas recetas", 550);
        this.registrarActividad("Meditación", "Tiempo de recarga energetica", 350);
        this.registrarActividad("Videojuegos", "Creacion o recreacion en videojuegos", 200);
        this.registrarActividad("Senderismo", "Salidas para mantener los engranajes", 450);

        //Robots (30 en total: HAL-1 a HAL-30) 10 robots para TURING-1 (quedará al tope de 10 aceptados)
        this.registrarRobot("Atlas 1", "SN-1001", "Boston Dynamics", "HD-24", "Militar", "img/robot1.jpg", "TURING-1");
        this.registrarRobot("Atlas 2", "SN-1002", "Boston Dynamics", "HD-24", "Militar", "img/robot1.jpg", "TURING-1");
        this.registrarRobot("Atlas 3", "SN-1003", "Boston Dynamics", "HD-24", "Militar", "img/robot1.jpg", "TURING-1");
        this.registrarRobot("Atlas 4", "SN-1004", "Boston Dynamics", "HD-24", "Militar", "img/robot1.jpg", "TURING-1");
        this.registrarRobot("Atlas 5", "SN-1005", "Boston Dynamics", "HD-24", "Militar", "img/robot1.jpg", "TURING-1");
        this.registrarRobot("Atlas 6", "SN-1006", "Boston Dynamics", "HD-24", "Militar", "img/robot1.jpg", "TURING-1");
        this.registrarRobot("Atlas 7", "SN-1007", "Boston Dynamics", "HD-24", "Militar", "img/robot1.jpg", "TURING-1");
        this.registrarRobot("Atlas 8", "SN-1008", "Boston Dynamics", "HD-24", "Militar", "img/robot1.jpg", "TURING-1");
        this.registrarRobot("Atlas 9", "SN-1009", "Boston Dynamics", "HD-24", "Militar", "img/robot1.jpg", "TURING-1");
        this.registrarRobot("Atlas 10", "SN-1010", "Boston Dynamics", "HD-24", "Militar", "img/robot1.jpg", "TURING-1");

        // 14 robots más en distintas industrias
        this.registrarRobot("Optimus 11", "SN-2011", "Tesla", "TS-02", "Doméstica", "img/robot2.jpg", "TURING-2");
        this.registrarRobot("Optimus 12", "SN-2012", "Tesla", "TS-02", "Doméstica", "img/robot2.jpg", "TURING-2");
        this.registrarRobot("Optimus 13", "SN-2013", "Tesla", "TS-02", "Doméstica", "img/robot2.jpg", "TURING-2");
        this.registrarRobot("Optimus 14", "SN-2014", "Tesla", "TS-02", "Doméstica", "img/robot2.jpg", "TURING-2");
        this.registrarRobot("Optimus 15", "SN-2015", "Tesla", "TS-02", "Doméstica", "img/robot2.jpg", "TURING-2");

        this.registrarRobot("Cobot 16", "SN-3016", "Universal", "UR-10", "Médica", "img/robot3.jpg", "TURING-3");
        this.registrarRobot("Cobot 17", "SN-3017", "Universal", "UR-10", "Médica", "img/robot3.jpg", "TURING-3");
        this.registrarRobot("Cobot 18", "SN-3018", "Universal", "UR-10", "Médica", "img/robot3.jpg", "TURING-3");
        this.registrarRobot("Cobot 19", "SN-3019", "Universal", "UR-10", "Médica", "img/robot3.jpg", "TURING-3");
        this.registrarRobot("Cobot 20", "SN-3020", "Universal", "UR-10", "Médica", "img/robot3.jpg", "TURING-3");

        this.registrarRobot("Agro 21", "SN-4021", "John Deere", "AD-1", "Agrícola", "img/robot4.jpg", "TURING-4");
        this.registrarRobot("Kuka 22", "SN-4022", "KUKA", "KR-6", "Genérico", "img/robot5.jpg", "TURING-4");
        this.registrarRobot("Scrap 23", "SN-4023", "Cyberdyne", "T-800", "Militar", "img/robot1.jpg", "TURING-5");
        this.registrarRobot("Agro 24", "SN-4024", "John Deere", "AD-2", "Agrícola", "img/robot4.jpg", "TURING-5");

        //robots que quedan PENDIENTES (HAL-25 a HAL-30)
        this.registrarRobot("Helper 25", "SN-5025", "Tesla", "TS-03", "Doméstica", "img/robot2.jpg", "TURING-1");
        this.registrarRobot("Medic 26", "SN-5026", "Universal", "UR-12", "Médica", "img/robot3.jpg", "TURING-2");
        this.registrarRobot("Farm 27", "SN-5027", "John Deere", "AD-3", "Agrícola", "img/robot4.jpg", "TURING-3");
        this.registrarRobot("Guard 28", "SN-5028", "Boston Dynamics", "GD-1", "Militar", "img/robot1.jpg", "TURING-4");
        this.registrarRobot("Basic 29", "SN-5029", "KUKA", "KR-9", "Genérico", "img/robot5.jpg", "TURING-5");
        this.registrarRobot("Home 30", "SN-5030", "Tesla", "TS-04", "Doméstica", "img/robot2.jpg", "TURING-2");

        //Cambios de estado iniciales
        this.aceptarRobot("HAL-1");
        this.aceptarRobot("HAL-2");
        this.aceptarRobot("HAL-3");
        this.aceptarRobot("HAL-4");
        this.aceptarRobot("HAL-5");
        this.aceptarRobot("HAL-6");
        this.aceptarRobot("HAL-7");
        this.aceptarRobot("HAL-8");
        this.aceptarRobot("HAL-9");
        this.aceptarRobot("HAL-10");

        this.aceptarRobot("HAL-11");
        this.aceptarRobot("HAL-12");
        this.aceptarRobot("HAL-13");
        this.aceptarRobot("HAL-14");
        this.aceptarRobot("HAL-15");

        this.aceptarRobot("HAL-16");
        this.aceptarRobot("HAL-17");
        this.aceptarRobot("HAL-18");
        this.aceptarRobot("HAL-19");
        this.aceptarRobot("HAL-20");

        this.aceptarRobot("HAL-21");
        this.darDeBajaRobot("HAL-21", "TURING-4");
        this.venderRobot("HAL-22");
        this.rechazarRobot("HAL-23");
        this.aceptarRobot("HAL-24");

        //Actividades asignadas a robots aceptados
        this.asignarActividad("HAL-1", "Ajedrez");
        this.asignarActividad("HAL-1", "Pintura");
        this.asignarActividad("HAL-11", "Música");
        this.asignarActividad("HAL-16", "Jardinería");
        this.asignarActividad("HAL-24", "Cocina");
    }

}
