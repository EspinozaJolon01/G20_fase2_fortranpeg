
/**

 * @typedef {import('./nodos').expression } expression 


 * @typedef {import('./nodos').producciones} producciones


 * @typedef {import('./nodos').opciones} opciones


 * @typedef {import('./nodos').union} union


 * @typedef {import('./nodos').expresion} expresion


 * @typedef {import('./nodos').etiqueta} etiqueta


 * @typedef {import('./nodos').expresiones} expresiones


 * @typedef {import('./nodos').conteo} conteo


 * @typedef {import('./nodos').corchetes} corchetes


 * @typedef {import('./nodos').rango} rango


 * @typedef {import('./nodos').caracter} caracter


 * @typedef {import('./nodos').contenido} contenido


 * @typedef {import('./nodos').corchete} corchete


 * @typedef {import('./nodos').texto} texto


 * @typedef {import('./nodos').numero} numero


 * @typedef {import('./nodos').identificador} identificador

 */


/**
 * Clase base para los visitantes
 * @abstract
 */
export class BaseVisitor {

    
    /**
     * @param {expression } node
     * @returns {any}
     */
    visitexpression (node) {
        throw new Error('Metodo visitexpression  no implementado');
    }
    

    /**
     * @param {producciones} node
     * @returns {any}
     */
    visitproducciones(node) {
        throw new Error('Metodo visitproducciones no implementado');
    }
    

    /**
     * @param {opciones} node
     * @returns {any}
     */
    visitopciones(node) {
        throw new Error('Metodo visitopciones no implementado');
    }
    

    /**
     * @param {union} node
     * @returns {any}
     */
    visitunion(node) {
        throw new Error('Metodo visitunion no implementado');
    }
    

    /**
     * @param {expresion} node
     * @returns {any}
     */
    visitexpresion(node) {
        throw new Error('Metodo visitexpresion no implementado');
    }
    

    /**
     * @param {etiqueta} node
     * @returns {any}
     */
    visitetiqueta(node) {
        throw new Error('Metodo visitetiqueta no implementado');
    }
    

    /**
     * @param {expresiones} node
     * @returns {any}
     */
    visitexpresiones(node) {
        throw new Error('Metodo visitexpresiones no implementado');
    }
    

    /**
     * @param {conteo} node
     * @returns {any}
     */
    visitconteo(node) {
        throw new Error('Metodo visitconteo no implementado');
    }
    

    /**
     * @param {corchetes} node
     * @returns {any}
     */
    visitcorchetes(node) {
        throw new Error('Metodo visitcorchetes no implementado');
    }
    

    /**
     * @param {rango} node
     * @returns {any}
     */
    visitrango(node) {
        throw new Error('Metodo visitrango no implementado');
    }
    

    /**
     * @param {caracter} node
     * @returns {any}
     */
    visitcaracter(node) {
        throw new Error('Metodo visitcaracter no implementado');
    }
    

    /**
     * @param {contenido} node
     * @returns {any}
     */
    visitcontenido(node) {
        throw new Error('Metodo visitcontenido no implementado');
    }
    

    /**
     * @param {corchete} node
     * @returns {any}
     */
    visitcorchete(node) {
        throw new Error('Metodo visitcorchete no implementado');
    }
    

    /**
     * @param {texto} node
     * @returns {any}
     */
    visittexto(node) {
        throw new Error('Metodo visittexto no implementado');
    }
    

    /**
     * @param {numero} node
     * @returns {any}
     */
    visitnumero(node) {
        throw new Error('Metodo visitnumero no implementado');
    }
    

    /**
     * @param {identificador} node
     * @returns {any}
     */
    visitidentificador(node) {
        throw new Error('Metodo visitidentificador no implementado');
    }
    
}
