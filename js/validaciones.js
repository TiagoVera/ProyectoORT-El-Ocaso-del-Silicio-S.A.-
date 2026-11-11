function estaVacio(texto){
    return texto.trim().length == 0;
}

function sonIgualesTexto(textoA,textoB){
    return textoA.trim().toLowerCase() == textoB.trim().toLowerCase();
}

function esFuncionario(usuario){
    return usuario.includes("TURING-")
}

// Valida que el nombre del robot no pase de 20 caracteres.
function superaLargo(texto, maximo) {
    return texto.trim().length > maximo;
}


// Valida que el numero de serie NO contenga espacios.
function tieneEspacios(texto) {
   
    for (let i = 0; i < texto.length; i++) {
        if (texto.charAt(i) == " ") {
            return true; 
        }
    }
    return false; 
}

// Valida que el numero de serie contenga al menos un dígito.
function tieneNumero(texto) {
    for (let i = 0; i < texto.length; i++) {
        let caracter = texto.charAt(i);
    
        if (caracter >= "0" && caracter <= "9") {
            return true; 
    }
    return false; 
    }
}