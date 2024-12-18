
/**

 * @typedef {import('./nodos').Expression } Expression 


 * @typedef {import('./nodos').Producciones} Producciones


 * @typedef {import('./nodos').Opciones} Opciones


 * @typedef {import('./nodos').Union} Union


 * @typedef {import('./nodos').Expresion} Expresion


 * @typedef {import('./nodos').Etiqueta} Etiqueta


 * @typedef {import('./nodos').Expresiones} Expresiones


 * @typedef {import('./nodos').Conteo} Conteo


 * @typedef {import('./nodos').Corchetes} Corchetes


 * @typedef {import('./nodos').Rango} Rango


 * @typedef {import('./nodos').Caracter} Caracter


 * @typedef {import('./nodos').Contenido} Contenido


 * @typedef {import('./nodos').Corchete} Corchete


 * @typedef {import('./nodos').Texto} Texto


 * @typedef {import('./nodos').Numero} Numero


 * @typedef {import('./nodos').Identificador} Identificador

 */


/**
 * Clase base para los visitantes
 * @abstract
 */
export class BaseVisitor {

    
    /**
     * @param {Expression } node
     * @returns {any}
     */
    visitExpression (node) {
        throw new Error('Metodo visitExpression  no implementado');
    }
    

    /**
     * @param {Producciones} node
     * @returns {any}
     */
    visitProducciones(node) {
        throw new Error('Metodo visitProducciones no implementado');
    }
    

    /**
     * @param {Opciones} node
     * @returns {any}
     */
    visitOpciones(node) {
        throw new Error('Metodo visitOpciones no implementado');
    }
    

    /**
     * @param {Union} node
     * @returns {any}
     */
    visitUnion(node) {
        throw new Error('Metodo visitUnion no implementado');
    }
    

    /**
     * @param {Expresion} node
     * @returns {any}
     */
    visitExpresion(node) {
        throw new Error('Metodo visitExpresion no implementado');
    }
    

    /**
     * @param {Etiqueta} node
     * @returns {any}
     */
    visitEtiqueta(node) {
        throw new Error('Metodo visitEtiqueta no implementado');
    }
    

    /**
     * @param {Expresiones} node
     * @returns {any}
     */
    visitExpresiones(node) {
        throw new Error('Metodo visitExpresiones no implementado');
    }
    

    /**
     * @param {Conteo} node
     * @returns {any}
     */
    visitConteo(node) {
        throw new Error('Metodo visitConteo no implementado');
    }
    

    /**
     * @param {Corchetes} node
     * @returns {any}
     */
    visitCorchetes(node) {
        throw new Error('Metodo visitCorchetes no implementado');
    }
    

    /**
     * @param {Rango} node
     * @returns {any}
     */
    visitRango(node) {
        throw new Error('Metodo visitRango no implementado');
    }
    

    /**
     * @param {Caracter} node
     * @returns {any}
     */
    visitCaracter(node) {
        throw new Error('Metodo visitCaracter no implementado');
    }
    

    /**
     * @param {Contenido} node
     * @returns {any}
     */
    visitContenido(node) {
        throw new Error('Metodo visitContenido no implementado');
    }
    

    /**
     * @param {Corchete} node
     * @returns {any}
     */
    visitCorchete(node) {
        throw new Error('Metodo visitCorchete no implementado');
    }
    

    /**
     * @param {Texto} node
     * @returns {any}
     */
    visitTexto(node) {
        throw new Error('Metodo visitTexto no implementado');
    }
    

    /**
     * @param {Numero} node
     * @returns {any}
     */
    visitNumero(node) {
        throw new Error('Metodo visitNumero no implementado');
    }
    

    /**
     * @param {Identificador} node
     * @returns {any}
     */
    visitIdentificador(node) {
        throw new Error('Metodo visitIdentificador no implementado');
    }
    
}
