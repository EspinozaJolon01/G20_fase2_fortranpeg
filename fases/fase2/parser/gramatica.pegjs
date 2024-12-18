{{
    import { ids, usos} from '../index.js'
    import { ErrorReglas } from './error.js';
    import { errores } from '../index.js'
}}

{
    const crearNodo = (tipoNodo, propiedades) => {
        const tipos = {
            'numero': nodos.Numero,
            'identificador': nodos.Identificador,
            'rango': nodos.Rango,
            'producciones': nodos.Producciones,
            'opciones': nodos.Opciones,
            'union': nodos.Union,
            'expresion': nodos.Expresion,
            'etiqueta': nodos.Etiqueta,
            'expresiones': nodos.Expresiones,
            'conteo': nodos.Conteo,
            'corchetes': nodos.Corchetes,
            'contenido': nodos.Contenido,
            'corchete': nodos.Corchete,
            'caracter': nodos.Caracter,
            'texto': nodos.Texto,
            'literales': nodos.Literales,   
            'finLinea': nodos.FinLinea,
            'continuacionLinea': nodos.ContinuacionLinea,
            'stringSimpleComilla': nodos.StringSimpleComilla,
            'stringDobleComilla': nodos.StringDobleComilla,

        }
        const nodo = new tipos[tipoNodo](propiedades);
        nodo.location = location();
        return nodo;
    }
}


gramatica = _ producciones+ _ {

    let duplicados = ids.filter((item, index) => ids.indexOf(item) !== index);
    if (duplicados.length > 0) {
        errores.push(new ErrorReglas("Regla duplicada: " + duplicados[0]));
    }

    // Validar que todos los usos están en ids
    let noEncontrados = usos.filter(item => !ids.includes(item));
    if (noEncontrados.length > 0) {
        errores.push(new ErrorReglas("Regla no encontrada: " + noEncontrados[0]));
    }
}

producciones = _ id:identificador _ lit:(literales)? _ "=" _ opc:opciones (_";")? { return crearNodo('producciones', { id,lit,opc }) };

opciones = opc: union opcs:(_ "/" _ union)* { return crearNodo('opciones', {opc,...opcs }) }

union = exp: expresion exprs:(_ expresion !(_ literales? _ "=") )* {return crearNodo('union', {exp, ...exprs})}

expresion  = tag:(etiqueta/varios)? _ exp:expresiones _ count:([?+*]/conteo)? { return crearNodo('expresion', {tag,exp,count}) }

etiqueta = tag:("@")? _ id:identificador _ ":" vars:(varios)? {return crearNodo('etiqueta', {tag, id, vars})}

varios = id:("!"/"$"/"@"/"&") { return id }

expresiones  =  id:identificador { usos.push(id); return crearNodo('expresiones', {id}) }
                / lit:literales opI:"i"?    { return crearNodo('expresiones', {lit,opI}) }
                / "(" _ opcs:opciones _ ")"   { return crearNodo('expresiones', {opcs}) }
                / cor:corchetes opI:"i"? { return crearNodo('expresiones', {cor,opI}) }
                / pt:"." {return crearNodo('expresiones', {pt})}
                / eof:"!."  {return crearNodo('expresiones', {eof})}

// conteo = "|" parteconteo _ (_ delimitador )? _ "|"

conteo = val:$("|" _ (numero / id:identificador) _ "|") {return crearNodo('conteo', {val})}
        / val:$("|" _ (numero / id:identificador)? _ ".." _ (numero / id2:identificador)? _ "|") {return crearNodo('conteo', {val})}
        / val:$("|" _ (numero / id:identificador)? _ "," _ opciones _ "|") {return crearNodo('conteo', {val})}
        / val:$("|" _ (numero / id:identificador)? _ ".." _ (numero / id2:identificador)? _ "," _ opciones _ "|") {return crearNodo('conteo', {val})}

// parteconteo = identificador
//             / [0-9]? _ ".." _ [0-9]?
// 			/ [0-9]

// delimitador =  "," _ expresion

// Regla principal que analiza corchetes con contenido
corchetes
    = "[" contenido:(rango / contenido)+ "]" {
        return `Entrada válida: [${input}]`; return crearNodo('corchetes', {contenido})
    }

// Regla para validar un rango como [A-Z]
rango
    = inicio:caracter "-" fin:caracter {
        if (inicio.charCodeAt(0) > fin.charCodeAt(0)) {
            throw new Error(`Rango inválido: [${inicio}-${fin}]`);

        }
        return `${inicio}-${fin}`;

        return crearNodo('rango', {inicio, fin})
    }

// Regla para caracteres individuales
caracter
    = char:[a-zA-Z0-9_ ] {return crearNodo('caracter', {char})}

// Coincide con cualquier contenido que no incluya "]"
contenido
    = cont:(corchete / texto)+  {return crearNodo('contenido', {cont})}

corchete
    = "[" cont:contenido "]"    {return crearNodo('corchete', {cont})}

texto
    = txt:[^\[\]]+  {return crearNodo('texto', {txt})}

literales = '"' lit:stringDobleComilla* '"'   {return crearNodo('literales', {lit})}
            / "'" lit:stringSimpleComilla* "'"  {return crearNodo('literales', {lit})}

stringDobleComilla = str:!('"' / "\\" / finLinea) .   { return crearNodo('stringDobleComilla', {str}) }
                    / "\\" escape {return text()}
                    / continuacionLinea {return text()}

stringSimpleComilla = str:!("'" / "\\" / finLinea) .  { return crearNodo('stringSimpleComilla', {str}) }
                    / "\\" escape {return text()}
                    / continuacionLinea {return text()}

continuacionLinea = "\\" secuenciaFinLinea { return text() }

finLinea = [\n\r\u2028\u2029] { return text() }

escape = "'" { return "'"; }
        / '"' { return '"'; }
        / "\\" { return "\\"; }
        / "b" { return text() }
        / "f" { return text() }
        / "n" { return text() }
        / "r" { return text() }
        / "t" { return text() }
        / "v" { return text() }
        / "u" { return text() }

secuenciaFinLinea =  secuencia: ("\r\n" / "\n" / "\r" / "\u2028" / "\u2029") { return secuencia }

// literales = 
//     "\"" [^"]* "\""
//     / "'" [^']* "'"
    

numero = num:[0-9]+ {return crearNodo('numero', {num})}

identificador = id:[_a-z]i[_a-z0-9]i* {return crearNodo('identificador', {id})}

_ = (Comentarios /[ \t\n\r])*


Comentarios = 
    "//" [^\n]* 
    / "/*" (!"*/" .)* "*/"
