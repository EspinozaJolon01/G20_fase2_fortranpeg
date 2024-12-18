

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
        name: 'Expression ',
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
        name: 'Producciones',
        extends: 'Expression',
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
        name: 'Opciones',
        extends: 'Expression',
        props: [
            {
                name: 'listOpciones',
                type: 'Expression',
                description: 'Lista de opciones de la produccion'
            }
        ]
    },

    //union = exp: expresion exprs:(_ expresion !(_ literales? _ "=") )* {return crearNodo('union', {listUnion: [exp, ...exprs]})}

    {
        name: 'Union',
        extends: 'Expression',
        props: [
            {
                name: 'listUnion',
                type: 'Expression',
                description: 'Lista de expresiones de la union'
            }
        ]
    },


    //expresion  = tag:(etiqueta/varios)? _ exp:expresiones _ count:([?+*]/conteo)? { return crearNodo('expresion', {tag,exp,count}) }

    {
        name: 'Expresion',
        extends: 'Expression',
        props: [
            {
                name: 'tag',
                type: 'Expression|null',
                description: 'Etiqueta de la expresion'
            },
            {
                name: 'exp',
                type: 'Expression',
                description: 'Expresiones de la union'
            },
            {
                name: 'count',
                type: 'Expression',
                description: 'Conteo de la expresion'
            }
        ]
    },


    //etiqueta = tag:("@")? _ id:identificador _ ":" vars:(varios)? {return crearNodo('etiqueta', {tag, id, vars})}

    {
        name: 'Etiqueta',
        extends: 'Expression',
        props: [
            {
                name: 'tag',
                type: 'string|null',
                description: 'Etiqueta de la expresion'
            },
            {
                name: 'id',
                type: 'Expression',
                description: 'Identificador de la etiqueta'
            },
            {
                name: 'vars',
                type: 'Expression|null',
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
        name: 'Expresiones',
        extends: 'Expression',
        props: [
            {
                name: 'expr',
                type: 'Expression',
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
        name: 'Conteo',
        extends: 'Expression',
        props: [
            {
                name: 'val',
                type: 'Expression',
                description: 'Valor de la expresion'
            }
        ]
    },


    //return crearNodo('corchetes', {contenido})  

    {
        name: 'Corchetes',
        extends: 'Expression',
        props: [
            {
                name: 'contenido',
                type: 'Expression',
                description: 'Contenido de la expresion'
            }
        ]
    },


    //crearNodo('rango', {inicio, fin})  

    {
        name: 'Rango',
        extends: 'Expression',
        props: [
            {
                name: 'inicio',
                type: 'Expression',
                description: 'Inicio del rango'
            },
            {
                name: 'fin',
                type: 'Expression',
                description: 'Fin del rango'
            }
        ]
    },

    //caracter = char:[a-zA-Z0-9_ ] {return crearNodo('caracter', {char})}
    {
        name: 'Caracter',
        extends: 'Expression',
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
        name: 'Contenido',
        extends: 'Expression',
        props: [
            {
                name: 'cont',
                type: 'Expression',
                description: 'Contenido de la expresion'
            }
        ]
    },

    //corchete = "[" cont:contenido "]"    {return crearNodo('corchete', {cont})}

    {
        name: 'Corchete',
        extends: 'Expression',
        props: [
            {
                name: 'cont',
                type: 'Expression',
                description: 'Contenido de la expresion'
            }
        ]
    },

    //texto = txt:[^\[\]]+  {return crearNodo('texto', {txt})}

    {

        name: 'Texto',
        extends: 'Expression',
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
        name: 'Numero',
        extends: 'Expression',
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
        name: 'Identificador',
        extends: 'Expression',
        props: [
            {
                name: 'id',
                type: 'string',
                description: 'Identificador de la expresion'
            }
        ]
    },


    // literales = '"' lit:stringDobleComilla* '"'   {return crearNodo('literales', {lit})}

    { 
        name: 'Literales',
        extends: 'Expression',
        props: [
            {
                name: 'lit',
                type: 'string',
                description: 'Literales de la expresion'
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
 * @typedef {import('./visitor').BaseVisitor} BaseVisitor
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


// visitor
// @typedef {import('./nodos').Expression } Expression 
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

fs.writeFileSync('./visitor.js', code)
console.log('Archivo de visitor generado correctamente')