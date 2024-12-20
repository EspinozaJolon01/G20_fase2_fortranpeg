{{
    import { ids, usos} from '../index.js'
    import { ErrorReglas } from './error.js';
    import { errores } from '../index.js'
    
    
}}

{
    const crearNodo = (tipoNodo, propiedades) => {
        const tipos = {
            'contenidoRango': nodos.ContenidoRango,
            'producciones': nodos.Producciones,
            'opciones': nodos.Opciones,
            'union': nodos.Union,
            'expresion': nodos.Expresion,
            'strComilla': nodos.StrComilla,
            'conteo': nodos.Conteo,
            'clase': nodos.Clase
        }
        const nodo = new tipos[tipoNodo](propiedades);
        nodo.location = location();
        return nodo;
    }
}



gramatica = _ produ:producciones+ _ {

    let duplicados = ids.filter((item, index) => ids.indexOf(item) !== index);
    if (duplicados.length > 0) {
        errores.push(new ErrorReglas("Regla duplicada: " + duplicados[0]));
    }


    // Validar que todos los usos están en ids
    let noEncontrados = usos.filter(item => !ids.includes(item));
    if (noEncontrados.length > 0) {
        errores.push(new ErrorReglas("Regla no encontrada: " + noEncontrados[0]));
    }
    return produ
}

producciones = _ id:identificador _ lit:(literales)? _ "=" _ opc:opciones (_";")? { return crearNodo('producciones', { id,opc,lit }) };

opciones = opc: union opcs:(_ "/" _ @union)* { return crearNodo('opciones', { listOpciones: [opc,...opcs ]}) }

union = exp: expresion exprs:(_ @expresion !(_ literales? _ "=") )* {return crearNodo('union', {listUnion: [exp, ...exprs]})}

expresion  = tag:$(etiqueta/varios)? _ exp:expresiones _ count:$([?+*]/conteo)? {return crearNodo('expresion', {exp,tag,count}) }

etiqueta = tag:("@")? _ id:identificador _ ":" vars:(varios)? 

varios = ("!"/"$"/"@"/"&")     

expresiones  =  expr:identificador { usos.push(id); }
                / expr:$literales opI:"i"?    { return crearNodo('strComilla', {expr: expr.replace(/['"]/g, ''),opI}) }
                / "(" _ expr:opciones _ ")"   
                / expr:clase opI:"i"?  { return crearNodo('clase', {expr,opI}) }
                / expr:"." 
                / expr:"!."  

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
clase
    = "[" @contenidoRango+ "]" 

contenidoRango = inicio:$[^\[\]] "-" fin:$[^\[\]] {return crearNodo('contenidoRango', {inicio,fin})}
                / $[^\[\]]


literales = '"' @stringDobleComilla* '"'  
            / "'" @stringSimpleComilla* "'"  

stringDobleComilla = !('"' / "\\" / finLinea) .   
                    / "\\" escape 
                    / continuacionLinea 

stringSimpleComilla = !("'" / "\\" / finLinea) .  
                    / "\\" escape 
                    / continuacionLinea 

continuacionLinea = "\\" secuenciaFinLinea 

finLinea = [\n\r\u2028\u2029] 

escape = "'" 
        / '"' 
        / "\\" 
        / "b" 
        / "f" 
        / "n" 
        / "r" 
        / "t" 
        / "v" 
        / "u" 

secuenciaFinLinea = ("\r\n" / "\n" / "\r" / "\u2028" / "\u2029") 

numero = num:[0-9]+ 

identificador = id:[_a-z]i[_a-z0-9]i* {return text()}

_ = (Comentarios /[ \t\n\r])*


Comentarios = 
    "//" [^\n]* 
    / "/*" (!"*/" .)* "*/"
