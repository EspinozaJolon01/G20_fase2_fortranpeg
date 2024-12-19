import { BaseVisitor } from "../tools/visitor.js";



export class GeneratorFortran extends BaseVisitor {


    /**
     * @type {BaseVisitor['visitProducciones']}
     */
    visitProducciones(node) {
        return node.opc.accept(this);
    }


    /**
     * @type {BaseVisitor['visitOpciones']}
     */
    visitOpciones(node){
        return node.listOpciones.map(opcion => opcion.accept(this)).join('\n');
    }

    /**
     * @type {BaseVisitor['visitUnion']}
     */
    visitUnion(node){
        return node.listUnion.map(union => union.accept(this)).join('\n');
    }

    /**
     * @type {BaseVisitor['visitExpresion']}
     */
    visitExpresion(node) {
        return node.exp.accept(this);
    }



    /**
     * @type {BaseVisitor['visitStrComilla']}
     */
    visitStrComilla(node) {
            return `
        if ("${node.expr}" == input(cursor:cursor + ${
                node.expr.length - 1
            })) then !Foo
            allocate( character(len=${node.expr.length}) :: lexeme)
            lexeme = input(cursor:cursor + ${node.expr.length - 1})
            cursor = cursor + ${node.expr.length}
            return
        end if
        `;
        }
    

    /**
     * @type {BaseVisitor['visitConteo']}
     */
    visitConteo(node) {
        throw new Error("Method not implemented.");
    }

    /**
     * @type {BaseVisitor['visitRango']}
     */
    visitRango(node) {
        throw new Error("Method not implemented.");
    }





    /**
     * @type {BaseVisitor['visitNumero']}
     */
    visitNumero(node) {
        throw new Error("Method not implemented.");
    }





    //Generar el tokennizador

    generateTokenizer(producciones) {
        return `
            module tokenizer
            implicit none
            
            contains
            FUNCTION nextSym(input, cursor) RESULT(lexeme)
            CHARACTER(LEN=*), INTENT(IN) :: input
            INTEGER, INTENT(INOUT) :: cursor
            CHARACTER(LEN=:), ALLOCATABLE :: lexeme

            ! Verificar que el cursor no exceda el tamaño de la cadena
            IF (cursor < 1 .OR. cursor > LEN_TRIM(input)) THEN
                PRINT *, "error: cursor fuera de límites en col ", cursor
                lexeme = ""
                RETURN
            END IF

            ! Comprobar si hay suficientes caracteres para leer
            IF (cursor + 2 > LEN_TRIM(input)) THEN
                PRINT *, "error: no hay suficientes caracteres para leer en col ", cursor
                lexeme = ""
                RETURN
            END IF
            
                ${producciones.map((produccion) => produccion.accept(this)).join('\n')}
            
                PRINT *, "error lexico en col ", cursor, ', "'//input(cursor:cursor)//'"'
                lexeme = ""
            END FUNCTION nextSym
            end module tokenizer 
                `;
    }
    







}