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
            function nextSym(input, cursor) result(lexeme)
                character(len=*), intent(in) :: input
                integer, intent(inout) :: cursor
                character(len=:), allocatable :: lexeme
            
                if (cursor > len(input)) then
                    allocate( character(len=3) :: lexeme )
                    lexeme = "EOF"
                    return
                end if
            
                ${producciones.map((produccion) => produccion.accept(this)).join('\n')}
            
                print *, "error lexico en col ", cursor, ', "'//input(cursor:cursor)//'"'
                lexeme = "ERROR"
            end function nextSym
            end module tokenizer 
                `;
    }
    







}