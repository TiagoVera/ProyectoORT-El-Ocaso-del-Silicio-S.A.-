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
    static #ultimoId = 0;
    constructor(documento, nombre, telefono) {
        this.codigoFuncionario = "TURING-" + funcionario.#ultimoId++;
        this.documento = documento;
        this.nombre = nombre;
        this.telefono = telefono;
        this.contraseña = "pass-" + funcionario.documento;
        this.robotsAceptados = 0;
    }
}

class robot {
    static #ultimoId = 0;
    constructor(nombre, numDeSerie, fabricante, modelo, industria, imagen) {
        this.id = "HAL-" + robot.#ultimoId++;
        this.nombre = nombre;
        this.numDeSerie = numDeSerie;
        this.fabricante = fabricante;
        this.modelo = modelo;
        this.estado = "PENDIENTE";
        this.motivo = "Registro Ingresado";
        this.industria = industria;
        this.imagen = imagen;
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


    iniciarSesion(usuario, contraseña) {
        if (esFuncionario(usuario)) {

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
    registrarRobot(nombre, numDeSerie, fabricante, modelo, industria, imagen) {
        let nuevoRobot = new robot(nombre, numDeSerie, fabricante, modelo, industria, imagen);
        this.#robot.push(nuevoRobot);
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
            listaRobots.push(this.#robot[i])

        }
        return listaRobots;
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
        this.registrarRobot("Atlas V1", "SN-1001", "Boston Dynamics", "HD-2024", "Automotriz", "img/atlas.jpg");
        this.registrarRobot("Optimus Gen2", "SN-1002", "Tesla", "TS-02", "Logística", "img/optimus.jpg");
        this.registrarRobot("KUKA KR-6", "SN-1003", "KUKA Systems", "KR-600", "Metalúrgica", "img/kuka.jpg");
        this.registrarRobot("UR10e Cobot", "SN-1004", "Universal Robots", "UR10e", "Electrónica", "img/ur10e.jpg");
        this.registrarRobot("Spot Explorer", "SN-1005", "Boston Dynamics", "Spot-V2", "Seguridad", "img/spot.jpg");
    }

}