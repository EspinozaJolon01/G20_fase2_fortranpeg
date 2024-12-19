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
        
        if (node.count =="+"){
            return `
            if (input(cursor:cursor + ${node.exp.expr.length - 1}) == "${node.exp.expr}") then
                do while (cursor <= len_trim(input) - ${node.exp.expr.length - 1} .and. input(cursor:cursor + ${node.exp.expr.length - 1}) == "${node.exp.expr}")
                lexeme = lexeme // input(cursor:cursor + ${node.exp.expr.length - 1})
                cursor = cursor + ${node.exp.expr.length}
                end do
                return
            end if
            `
        }else if (node.count === "*"){
            return `
            lexeme = ""
                do while (cursor <= len_trim(input) - ${node.exp.expr.length - 1} .and. input(cursor:cursor + ${node.exp.expr.length - 1}) == "${node.exp.expr}")
                    lexeme = lexeme // input(cursor:cursor + ${node.exp.expr.length - 1})
                    cursor = cursor + ${node.exp.expr.length}
                end do
                return
                `
        }
        return node.exp.accept(this);
    }



    /**
     * @type {BaseVisitor['visitStrComilla']}
     */
    visitStrComilla(node) {
        if (node.opI === 'i') {
            return `
        block
            character(len=${node.expr.length}) :: temp_str
            logical :: is_match
            integer :: i, char_code
            
            is_match = .false.
            temp_str = input(cursor:cursor + ${node.expr.length - 1})
            
            do i = 1, ${node.expr.length}
                char_code = iachar(temp_str(i:i))
                if (char_code >= iachar('a') .and. char_code <= iachar('z')) then
                    temp_str(i:i) = achar(char_code - 32)
                end if
            end do
            
            if ("${node.expr.toUpperCase()}" == temp_str) then
                is_match = .true.
            end if
            
            if (is_match) then
                allocate(character(len=${node.expr.length}) :: lexeme)
                lexeme = input(cursor:cursor + ${node.expr.length - 1})
                cursor = cursor + ${node.expr.length}
                return
            end if
        end block`;
        } else {
            return `
        if ("${node.expr}" == input(cursor:cursor + ${node.expr.length - 1})) then
            allocate(character(len=${node.expr.length}) :: lexeme)
            lexeme = input(cursor:cursor + ${node.expr.length - 1})
            cursor = cursor + ${node.expr.length}
            return
        end if`;
        }
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