
/**

 * @typedef {import('../tools/nodos').Expression } Expression 


 * @typedef {import('../tools/nodos').Producciones} Producciones


 * @typedef {import('../tools/nodos').Opciones} Opciones


 * @typedef {import('../tools/nodos').Union} Union


 * @typedef {import('../tools/nodos').Expresion} Expresion


 * @typedef {import('../tools/nodos').StrComilla} StrComilla


 * @typedef {import('../tools/nodos').Conteo} Conteo


 * @typedef {import('../tools/nodos').Rango} Rango


 * @typedef {import('../tools/nodos').Numero} Numero

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
     * @param {Conteo} node
     * @returns {any}
     */
    visitConteo(node) {
        throw new Error('Metodo visitConteo no implementado');
    }
    

    /**
     * @param {Rango} node
     * @returns {any}
     */
    visitRango(node) {
        throw new Error('Metodo visitRango no implementado');
    }
    

    /**
     * @param {Numero} node
     * @returns {any}
     */
    visitNumero(node) {
        throw new Error('Metodo visitNumero no implementado');
    }
    
}
