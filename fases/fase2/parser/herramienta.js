

// import fs from 'fs';
const fs = require('fs')

const types = [
    `
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
    `
]


const configuracionNodos = [
    // nuestros nodos de la gramatica 


    {
        name: 'expression ',
        base: true,
        props: [
            {
                name: 'location',
                type: 'Location|null',
                description: 'Ubicacion del nodo en el codigo fuente',
                default: 'null'
            }
        ]
    },

    //configuracion de los nodos de la gramatica
    // producciones = _ id:identificador _ lit:(literales)? _ "=" _ opc:opciones (_";")? { return crearNodo('producciones', { id,lit,opc }) };
    {
        name: 'producciones',
        extends: 'expression',
        props: [
            {
                name: 'id',
                type: 'string',
                description: 'Identificador de la produccion'
            },
            {
                name: 'lit',
                type: 'string|null',
                description: 'Lista de literales de la produccion'
            },
            {
                name: 'opc',
                type: 'any',
                description: 'Opciones de la produccion'
            }
        ]
    },

    //opciones = opc: union opcs:(_ "/" _ union)* { return crearNodo('opciones', { listOpciones: [opc,...opcs ]}) }

    {
        name: 'opciones',
        extends: 'expression',
        props: [
            {
                name: 'listOpciones',
                type: 'expression',
                description: 'Lista de opciones de la produccion'
            }
        ]
    },

    //union = exp: expresion exprs:(_ expresion !(_ literales? _ "=") )* {return crearNodo('union', {listUnion: [exp, ...exprs]})}

    {
        name: 'union',
        extends: 'expression',
        props: [
            {
                name: 'listUnion',
                type: 'expression',
                description: 'Lista de expresiones de la union'
            }
        ]
    },


    //expresion  = tag:(etiqueta/varios)? _ exp:expresiones _ count:([?+*]/conteo)? { return crearNodo('expresion', {tag,exp,count}) }

    {
        name: 'expresion',
        extends: 'expression',
        props: [
            {
                name: 'tag',
                type: 'expression|null',
                description: 'Etiqueta de la expresion'
            },
            {
                name: 'exp',
                type: 'expression',
                description: 'Expresiones de la union'
            },
            {
                name: 'count',
                type: 'expression',
                description: 'Conteo de la expresion'
            }
        ]
    },


    //etiqueta = tag:("@")? _ id:identificador _ ":" vars:(varios)? {return crearNodo('etiqueta', {tag, id, vars})}

    {
        name: 'etiqueta',
        extends: 'expression',
        props: [
            {
                name: 'tag',
                type: 'string|null',
                description: 'Etiqueta de la expresion'
            },
            {
                name: 'id',
                type: 'string',
                description: 'Identificador de la etiqueta'
            },
            {
                name: 'vars',
                type: 'expression|null',
                description: 'Varios de la etiqueta'
            }
        ]
    },

    // expresiones  =  expr:identificador { usos.push(id); return crearNodo('expresiones', {expr}) }
    // / expr:literales opI:"i"?    { return crearNodo('expresiones', {expr,opI}) }
    // / "(" _ expr:opciones _ ")"   { return crearNodo('expresiones', {expr}) }
    // / expr:corchetes opI:"i"? { return crearNodo('expresiones', {expr,opI}) }
    // / expr:"." {return crearNodo('expresiones', {expr})}
    // / expr:"!."  {return crearNodo('expresiones', {expr})}
    {
        name: 'expresiones',
        extends: 'expression',
        props: [
            {
                name: 'expr',
                type: 'expression',
                description: 'Expresion de la union'
            },
            {
                name: 'opI',
                type: 'string|null',
                description: 'Identificador de la expresion'
            }
        ]
    },


    //conteo = val:$("|" _ (numero / id:identificador) _ "|") {return crearNodo('conteo', {val})}

    {
        name: 'conteo',
        extends: 'expression',
        props: [
            {
                name: 'val',
                type: 'expression',
                description: 'Valor de la expresion'
            }
        ]
    },


    //return crearNodo('corchetes', {contenido})  

    {
        name: 'corchetes',
        extends: 'expression',
        props: [
            {
                name: 'contenido',
                type: 'expression',
                description: 'Contenido de la expresion'
            }
        ]
    },


    //crearNodo('rango', {inicio, fin})  

    {
        name: 'rango',
        extends: 'expression',
        props: [
            {
                name: 'inicio',
                type: 'expression',
                description: 'Inicio del rango'
            },
            {
                name: 'fin',
                type: 'expression',
                description: 'Fin del rango'
            }
        ]
    },

    //caracter = char:[a-zA-Z0-9_ ] {return crearNodo('caracter', {char})}
    {
        name: 'caracter',
        extends: 'expression',
        props: [
            {
                name: 'char',
                type: 'string',
                description: 'Caracter de la expresion'
            }
        ]
    },

    //contenido = cont:(corchete / texto)+  {return crearNodo('contenido', {cont})}

    {
        name: 'contenido',
        extends: 'expression',
        props: [
            {
                name: 'cont',
                type: 'expression',
                description: 'Contenido de la expresion'
            }
        ]
    },

    //corchete = "[" cont:contenido "]"    {return crearNodo('corchete', {cont})}

    {
        name: 'corchete',
        extends: 'expression',
        props: [
            {
                name: 'cont',
                type: 'expression',
                description: 'Contenido de la expresion'
            }
        ]
    },

    //texto = txt:[^\[\]]+  {return crearNodo('texto', {txt})}

    {

        name: 'texto',
        extends: 'expression',
        props: [
            {
                name: 'txt',
                type: 'string',
                description: 'Texto de la expresion'
            }
        ]
    },


    //numero = num:[0-9]+ {return crearNodo('numero', {num})}

    {
        name: 'numero',
        extends: 'expression',
        props: [
            {
                name: 'num',
                type: 'number',
                description: 'Numero de la expresion'
            }
        ]
    },

    //identificador = id:[_a-z]i[_a-z0-9]i* {return crearNodo('identificador', {id})}

    {
        name: 'identificador',
        extends: 'expression',
        props: [
            {
                name: 'id',
                type: 'string',
                description: 'Identificador de la expresion'
            }
        ]
    }

]


let code = ''

// Tipos base
types.forEach(type => {
    code += type + '\n'
})


// // Tipos de nodos
// configuracionNodos.forEach(nodo => {
//     code += `
// /**
//  * @typedef {Object} ${nodo.name}
//  * ${nodo.props.map(prop => `@property {${prop.type}} ${prop.name} ${prop.description}`).join('\n * ')}
// */
//     `
// })

// Tipos del visitor
code += `
/**
 * @typedef {import('./Visitor').BaseVisitor} BaseVisitor
 */
`

const baseClass = configuracionNodos.find(nodo => nodo.base)

configuracionNodos.forEach(nodo => {


    code += `
export class ${nodo.name} ${baseClass && nodo.extends ? `extends ${nodo.extends}` : ''} {

    /**
    * @param {Object} options
    * ${nodo.props.map(prop => `@param {${prop.type}} options.${prop.name} ${prop.description}`).join('\n * ')}
    */
    constructor(${!nodo.base && nodo.props.length > 0 && `{ ${nodo.props.map(prop => `${prop.name}`).join(', ')} }` || ''}) {
        ${baseClass && nodo.extends ? `super();` : ''}
        ${nodo.props.map(prop => `
        /**
         * ${prop.description}
         * @type {${prop.type}}
        */
        this.${prop.name} = ${prop.default || `${prop.name}`};
`).join('\n')}
    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visit${nodo.name}(this);
    }
}
    `
})

code += `
export default { ${configuracionNodos.map(nodo => nodo.name).join(', ')} }
`


fs.writeFileSync('./nodos.js', code)
console.log('Archivo de clases de nodo generado correctamente')


// Visitor
// @typedef {import('./nodos').expression } expression 
code = `
/**
${configuracionNodos.map(nodo => `
 * @typedef {import('./nodos').${nodo.name}} ${nodo.name}
`).join('\n')}
 */
`

code += `

/**
 * Clase base para los visitantes
 * @abstract
 */
export class BaseVisitor {

    ${configuracionNodos.map(nodo => `
    /**
     * @param {${nodo.name}} node
     * @returns {any}
     */
    visit${nodo.name}(node) {
        throw new Error('Metodo visit${nodo.name} no implementado');
    }
    `).join('\n')
    }
}
`

fs.writeFileSync('./Visitor.js', code)
console.log('Archivo de visitor generado correctamente')