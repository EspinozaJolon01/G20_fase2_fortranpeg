
/**

 * @typedef {import('../tools/nodos').Expression } Expression 


 * @typedef {import('../tools/nodos').Producciones} Producciones


 * @typedef {import('../tools/nodos').Opciones} Opciones


 * @typedef {import('../tools/nodos').Union} Union


 * @typedef {import('../tools/nodos').Expresion} Expresion


 * @typedef {import('../tools/nodos').StrComilla} StrComilla


 * @typedef {import('../tools/nodos').Clase} Clase


 * @typedef {import('../tools/nodos').ContenidoRango} ContenidoRango


 * @typedef {import('../tools/nodos').Identificador} Identificador


 * @typedef {import('../tools/nodos').Agrup} Agrup

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
     * @param {StrComilla} node
     * @returns {any}
     */
    visitStrComilla(node) {
        throw new Error('Metodo visitStrComilla no implementado');
    }
    

    /**
     * @param {Clase} node
     * @returns {any}
     */
    visitClase(node) {
        throw new Error('Metodo visitClase no implementado');
    }
    

    /**
     * @param {ContenidoRango} node
     * @returns {any}
     */
    visitContenidoRango(node) {
        throw new Error('Metodo visitContenidoRango no implementado');
    }
    

    /**
     * @param {Identificador} node
     * @returns {any}
     */
    visitIdentificador(node) {
        throw new Error('Metodo visitIdentificador no implementado');
    }
    

    /**
     * @param {Agrup} node
     * @returns {any}
     */
    visitAgrup(node) {
        throw new Error('Metodo visitAgrup no implementado');
    }
    
}
