
/**
 * @typedef {Object} Location
 * @property {Object} start
 * @property {number} start.offset
 * @property {number} start.line
 * @property {number} start.column
 * @property {Object} end
 * @property {number} end.offset
 * @property {number} end.line
 * @property {number} end.column
*/
    

/**
 * @typedef {import('./visitor').BaseVisitor} BaseVisitor
 */

export class Expression   {

    /**
    * @param {Object} options
    * @param {Location|null} options.location Ubicacion del nodo en el codigo fuente
    */
    constructor() {
        
        
        /**
         * Ubicacion del nodo en el codigo fuente
         * @type {Location|null}
        */
        this.location = null;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitExpression (this);
    }
}
    
export class Producciones extends Expression {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la produccion
 * @param {string|null} options.lit Lista de literales de la produccion
 * @param {any} options.opc Opciones de la produccion
    */
    constructor({ id, lit, opc }) {
        super();
        
        /**
         * Identificador de la produccion
         * @type {string}
        */
        this.id = id;


        /**
         * Lista de literales de la produccion
         * @type {string|null}
        */
        this.lit = lit;


        /**
         * Opciones de la produccion
         * @type {any}
        */
        this.opc = opc;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitProducciones(this);
    }
}
    
export class Opciones extends Expression {

    /**
    * @param {Object} options
    * @param {Expression} options.listOpciones Lista de opciones de la produccion
    */
    constructor({ listOpciones }) {
        super();
        
        /**
         * Lista de opciones de la produccion
         * @type {Expression}
        */
        this.listOpciones = listOpciones;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitOpciones(this);
    }
}
    
export class Union extends Expression {

    /**
    * @param {Object} options
    * @param {Expression} options.listUnion Lista de expresiones de la union
    */
    constructor({ listUnion }) {
        super();
        
        /**
         * Lista de expresiones de la union
         * @type {Expression}
        */
        this.listUnion = listUnion;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitUnion(this);
    }
}
    
export class Expresion extends Expression {

    /**
    * @param {Object} options
    * @param {Expression|null} options.tag Etiqueta de la expresion
 * @param {Expression} options.exp Expresiones de la union
 * @param {Expression} options.count Conteo de la expresion
    */
    constructor({ tag, exp, count }) {
        super();
        
        /**
         * Etiqueta de la expresion
         * @type {Expression|null}
        */
        this.tag = tag;


        /**
         * Expresiones de la union
         * @type {Expression}
        */
        this.exp = exp;


        /**
         * Conteo de la expresion
         * @type {Expression}
        */
        this.count = count;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitExpresion(this);
    }
}
    
export class Etiqueta extends Expression {

    /**
    * @param {Object} options
    * @param {string|null} options.tag Etiqueta de la expresion
 * @param {Expression} options.id Identificador de la etiqueta
 * @param {Expression|null} options.vars Varios de la etiqueta
    */
    constructor({ tag, id, vars }) {
        super();
        
        /**
         * Etiqueta de la expresion
         * @type {string|null}
        */
        this.tag = tag;


        /**
         * Identificador de la etiqueta
         * @type {Expression}
        */
        this.id = id;


        /**
         * Varios de la etiqueta
         * @type {Expression|null}
        */
        this.vars = vars;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitEtiqueta(this);
    }
}
    
export class Expresiones extends Expression {

    /**
    * @param {Object} options
    * @param {Expression} options.expr Expresion de la union
 * @param {string|null} options.opI Identificador de la expresion
    */
    constructor({ expr, opI }) {
        super();
        
        /**
         * Expresion de la union
         * @type {Expression}
        */
        this.expr = expr;


        /**
         * Identificador de la expresion
         * @type {string|null}
        */
        this.opI = opI;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitExpresiones(this);
    }
}
    
export class Conteo extends Expression {

    /**
    * @param {Object} options
    * @param {Expression} options.val Valor de la expresion
    */
    constructor({ val }) {
        super();
        
        /**
         * Valor de la expresion
         * @type {Expression}
        */
        this.val = val;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitConteo(this);
    }
}
    
export class Corchetes extends Expression {

    /**
    * @param {Object} options
    * @param {Expression} options.contenido Contenido de la expresion
    */
    constructor({ contenido }) {
        super();
        
        /**
         * Contenido de la expresion
         * @type {Expression}
        */
        this.contenido = contenido;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitCorchetes(this);
    }
}
    
export class Rango extends Expression {

    /**
    * @param {Object} options
    * @param {Expression} options.inicio Inicio del rango
 * @param {Expression} options.fin Fin del rango
    */
    constructor({ inicio, fin }) {
        super();
        
        /**
         * Inicio del rango
         * @type {Expression}
        */
        this.inicio = inicio;


        /**
         * Fin del rango
         * @type {Expression}
        */
        this.fin = fin;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitRango(this);
    }
}
    
export class Caracter extends Expression {

    /**
    * @param {Object} options
    * @param {string} options.char Caracter de la expresion
    */
    constructor({ char }) {
        super();
        
        /**
         * Caracter de la expresion
         * @type {string}
        */
        this.char = char;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitCaracter(this);
    }
}
    
export class Contenido extends Expression {

    /**
    * @param {Object} options
    * @param {Expression} options.cont Contenido de la expresion
    */
    constructor({ cont }) {
        super();
        
        /**
         * Contenido de la expresion
         * @type {Expression}
        */
        this.cont = cont;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitContenido(this);
    }
}
    
export class Corchete extends Expression {

    /**
    * @param {Object} options
    * @param {Expression} options.cont Contenido de la expresion
    */
    constructor({ cont }) {
        super();
        
        /**
         * Contenido de la expresion
         * @type {Expression}
        */
        this.cont = cont;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitCorchete(this);
    }
}
    
export class Texto extends Expression {

    /**
    * @param {Object} options
    * @param {string} options.txt Texto de la expresion
    */
    constructor({ txt }) {
        super();
        
        /**
         * Texto de la expresion
         * @type {string}
        */
        this.txt = txt;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitTexto(this);
    }
}
    
export class Numero extends Expression {

    /**
    * @param {Object} options
    * @param {number} options.num Numero de la expresion
    */
    constructor({ num }) {
        super();
        
        /**
         * Numero de la expresion
         * @type {number}
        */
        this.num = num;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitNumero(this);
    }
}
    
export class Identificador extends Expression {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la expresion
    */
    constructor({ id }) {
        super();
        
        /**
         * Identificador de la expresion
         * @type {string}
        */
        this.id = id;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitIdentificador(this);
    }
}
    
export class Literales extends Expression {

    /**
    * @param {Object} options
    * @param {string} options.lit Literales de la expresion
    */
    constructor({ lit }) {
        super();
        
        /**
         * Literales de la expresion
         * @type {string}
        */
        this.lit = lit;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitLiterales(this);
    }
}
    
export default { Expression , Producciones, Opciones, Union, Expresion, Etiqueta, Expresiones, Conteo, Corchetes, Rango, Caracter, Contenido, Corchete, Texto, Numero, Identificador, Literales }
