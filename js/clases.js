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
    constructor(documento, telefono, nombre) {
        this.codigoFuncionario = "TURING-" + funcionario.#ultimoId++;
        this.documento = documento;
        this.nombre = nombre;
        this.telefono = telefono;
        this.codigoFuncionario = "pass-" + funcionario.documento;
        this.robotsAceptados = 0;
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
            for (let i = 0; i < this.#administrador.length; i++) {
                let administrador = this.#administrador[i];
                if (sonIgualesTexto(administrador.usuario, usuario) && administrador.contraseña == contraseña) {
                    return administrador;
                }
            }
        }
        return null
    }

    registrarFuncionario(documento,nombre,telefono){
        let nuevoFuncionario = new funcionario(documento,nombre,telefono);
        this.#funcionario.push(nuevoFuncionario); 
    }

        obtenerFuncionarios(){
        let listaFuncionarios = [];
        for (let i=0; i < this.#funcionario.length; i++){
                listaFuncionarios.push(this.#funcionario[i])
            
        }
        return listaFuncionarios;
    }
}