
/**

 * @typedef {import('./nodos').Expression } Expression 


 * @typedef {import('./nodos').Producciones} Producciones


 * @typedef {import('./nodos').Opciones} Opciones


 * @typedef {import('./nodos').Union} Union


 * @typedef {import('./nodos').Expresion} Expresion


 * @typedef {import('./nodos').StrComilla} StrComilla


 * @typedef {import('./nodos').Conteo} Conteo


 * @typedef {import('./nodos').Rango} Rango


 * @typedef {import('./nodos').Numero} Numero

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
