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

    registrarFuncionario(documento, nombre, telefono) {
        let nuevoFuncionario = new funcionario(documento, nombre, telefono);
        this.#funcionario.push(nuevoFuncionario);
    }
    registrarRobot(nombre, numDeSerie, fabricante, modelo, industria, imagen, registradoPor) {
        let nuevoRobot = new robot(nombre, numDeSerie, fabricante, modelo, industria, imagen, registradoPor);
        this.#robot.push(nuevoRobot);
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
       obtenerRobots() {
        let listaRobots = [];
        for (let i = 0; i < this.#robot.length; i++) {
              if (this.#robot[i].estado == "PENDIENTE"){
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

    obtenerRobotsAsignados(codigoFuncionario) {
        let lista = [];
        for (let i=0; i < this.#robot.length; i++) {
            let unRobot = this.#robot[i];
            if (unRobot.estado == "ACEPTADO" && unRobot.asignadoA == codigoFuncionario) {
                lista.push(unRobot)
            }
        }
        return lista;
    }

    buscarRobotPorId(idRobot) {
        for(let i = 0; i < this.#robot.length; i++) {
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
        this.registrarRobot("Atlas V1", "SN-1001", "Boston Dynamics", "HD-2024", "Automotriz", "https://res.cloudinary.com/tgh2fcit/image/upload/v1789766051/ChatGPT_Image_Sep_18_2026_06_13_26_PM.png", "TURING-1");
        this.registrarRobot("Optimus Gen2", "SN-1002", "Tesla", "TS-02", "Logística", "https://res.cloudinary.com/tgh2fcit/image/upload/v1789766177/ChatGPT_Image_Sep_18_2026_06_15_24_PM.png", "TURING-2");
        this.registrarRobot("KUKA KR-6", "SN-1003", "KUKA Systems", "KR-600", "Metalúrgica", "https://res.cloudinary.com/tgh2fcit/image/upload/v1789767546/ChatGPT_Image_Sep_18_2026_06_36_01_PM.png", "TURING-3");
        this.registrarRobot("UR10e Cobot", "SN-1004", "Universal Robots", "UR10e", "Electrónica", "https://res.cloudinary.com/tgh2fcit/image/upload/v1789768114/ChatGPT_Image_Sep_18_2026_06_48_13_PM.png", "TURING-4");
        this.registrarRobot("Spot Explorer", "SN-1005", "Boston Dynamics", "Spot-V2", "Seguridad", "img/spot.jpg", "TURING-5");

        //Robots aceptados y asignados (prueba de funcionario)
        this.#robot[0].estado = "ACEPTADO";
        this.#robot[0].asignadoA = "TURING-1";
        this.#robot[1].estado = "ACEPTADO";
        this.#robot[1].asignadoA = "TURING-1";
        this.#robot[2].estado = "ACEPTADO";
        this.#robot[2].asignadoA = "TURING-1";
        this.#robot[3].estado = "ACEPTADO";
        this.#robot[3].asignadoA = "TURING-2";
    }

}