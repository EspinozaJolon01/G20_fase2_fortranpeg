
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
 * @typedef {import('./Visitor').BaseVisitor} BaseVisitor
 */

export class expression   {

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
        return visitor.visitexpression (this);
    }
}
    
export class producciones extends expression {

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
        return visitor.visitproducciones(this);
    }
}
    
export class opciones extends expression {

    /**
    * @param {Object} options
    * @param {expression} options.listOpciones Lista de opciones de la produccion
    */
    constructor({ listOpciones }) {
        super();
        
        /**
         * Lista de opciones de la produccion
         * @type {expression}
        */
        this.listOpciones = listOpciones;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitopciones(this);
    }
}
    
export class union extends expression {

    /**
    * @param {Object} options
    * @param {expression} options.listUnion Lista de expresiones de la union
    */
    constructor({ listUnion }) {
        super();
        
        /**
         * Lista de expresiones de la union
         * @type {expression}
        */
        this.listUnion = listUnion;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitunion(this);
    }
}
    
export class expresion extends expression {

    /**
    * @param {Object} options
    * @param {expression|null} options.tag Etiqueta de la expresion
 * @param {expression} options.exp Expresiones de la union
 * @param {expression} options.count Conteo de la expresion
    */
    constructor({ tag, exp, count }) {
        super();
        
        /**
         * Etiqueta de la expresion
         * @type {expression|null}
        */
        this.tag = tag;


        /**
         * Expresiones de la union
         * @type {expression}
        */
        this.exp = exp;


        /**
         * Conteo de la expresion
         * @type {expression}
        */
        this.count = count;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitexpresion(this);
    }
}
    
export class etiqueta extends expression {

    /**
    * @param {Object} options
    * @param {string|null} options.tag Etiqueta de la expresion
 * @param {string} options.id Identificador de la etiqueta
 * @param {expression|null} options.vars Varios de la etiqueta
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
         * @type {string}
        */
        this.id = id;


        /**
         * Varios de la etiqueta
         * @type {expression|null}
        */
        this.vars = vars;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitetiqueta(this);
    }
}
    
export class expresiones extends expression {

    /**
    * @param {Object} options
    * @param {expression} options.expr Expresion de la union
 * @param {string|null} options.opI Identificador de la expresion
    */
    constructor({ expr, opI }) {
        super();
        
        /**
         * Expresion de la union
         * @type {expression}
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
        return visitor.visitexpresiones(this);
    }
}
    
export class conteo extends expression {

    /**
    * @param {Object} options
    * @param {expression} options.val Valor de la expresion
    */
    constructor({ val }) {
        super();
        
        /**
         * Valor de la expresion
         * @type {expression}
        */
        this.val = val;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitconteo(this);
    }
}
    
export class corchetes extends expression {

    /**
    * @param {Object} options
    * @param {expression} options.contenido Contenido de la expresion
    */
    constructor({ contenido }) {
        super();
        
        /**
         * Contenido de la expresion
         * @type {expression}
        */
        this.contenido = contenido;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitcorchetes(this);
    }
}
    
export class rango extends expression {

    /**
    * @param {Object} options
    * @param {expression} options.inicio Inicio del rango
 * @param {expression} options.fin Fin del rango
    */
    constructor({ inicio, fin }) {
        super();
        
        /**
         * Inicio del rango
         * @type {expression}
        */
        this.inicio = inicio;


        /**
         * Fin del rango
         * @type {expression}
        */
        this.fin = fin;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitrango(this);
    }
}
    
export class caracter extends expression {

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
        return visitor.visitcaracter(this);
    }
}
    
export class contenido extends expression {

    /**
    * @param {Object} options
    * @param {expression} options.cont Contenido de la expresion
    */
    constructor({ cont }) {
        super();
        
        /**
         * Contenido de la expresion
         * @type {expression}
        */
        this.cont = cont;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitcontenido(this);
    }
}
    
export class corchete extends expression {

    /**
    * @param {Object} options
    * @param {expression} options.cont Contenido de la expresion
    */
    constructor({ cont }) {
        super();
        
        /**
         * Contenido de la expresion
         * @type {expression}
        */
        this.cont = cont;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitcorchete(this);
    }
}
    
export class texto extends expression {

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
        return visitor.visittexto(this);
    }
}
    
export class numero extends expression {

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
        return visitor.visitnumero(this);
    }
}
    
export class identificador extends expression {

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
        return visitor.visitidentificador(this);
    }
}
    
export default { expression , producciones, opciones, union, expresion, etiqueta, expresiones, conteo, corchetes, rango, caracter, contenido, corchete, texto, numero, identificador }
