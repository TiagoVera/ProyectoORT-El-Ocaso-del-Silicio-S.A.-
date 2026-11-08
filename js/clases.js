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
    constructor(documento, contraseña) {
        this.codigoFuncionario = "TURING-" + funcionario.#ultimoId++;
        this.documento = documento;
        this.contraseña = contraseña;
    }
}

class robot {
    constructor(nombre, numDeSerie, fabricante, modelo, industria, imagen) {
        this.nombre = nombre;
        this.numDeSerie = numDeSerie;
        this.fabricante = fabricante;
        this.modelo = modelo;
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

class sistema {
    #administrador = [];
    #funcionario = [];
    #robot = [];
    #actividades = [];


    iniciarSesion(usuario, contraseña) {
        if (esFuncionario(usuario)) {

        } else {
            let administrador = this.#administrador[i];
            if (sonIgualesTexto(administrador.usuario, usuario) && administrador.contraseña == contraseña) {
                return administrador;
            }
        }
    }
}