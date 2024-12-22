import { BaseVisitor } from "../tools/visitor.js";
import {ContenidoRango, Identificador} from "../tools/nodos.js";
import {StrComilla} from "../tools/nodos.js";
import {Clase} from "../tools/nodos.js";
import {Agrup} from "../tools/nodos.js";


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

         // Si es un nodo Clase y tiene cuantificador
    if (node.exp instanceof Clase && node.count) {
        const baseCode = `
        block
            integer :: match_count
            logical :: in_range, found_error
            character :: invalid_char
            
            
            match_count = 0
            found_error = .false.
            if (allocated(lexeme)) deallocate(lexeme)
            allocate(character(len=0) :: lexeme)
            
            do i = cursor, len_trim(input)
                in_range = .false.
                
                ${node.exp.expr
                    .filter((node) => typeof node === 'string')
                    .map(char => `
                    if (input(i:i) == "${char}") then
                        in_range = .true.
                    end if`)
                    .join('\n')}
                
                ${node.exp.expr
                    .filter((node) => node instanceof ContenidoRango)
                    .map((range) => `
                    if (.not. in_range) then
                        if (input(i:i) >= "${range.inicio}" .and. input(i:i) <= "${range.fin}") then
                            in_range = .true.
                        end if
                    end if`)
                    .join('\n')}
                

                    ! Acumular carácter válido en lexeme
                    lexeme = lexeme // input(i:i)
                    match_count = match_count + 1
                
            end do
            
            ! Si encontramos un error, reportarlo
            if (found_error) then
                print *, "Error léxico: carácter '", invalid_char, "' no está en el rango permitido, columna: ", i
                if (allocated(lexeme)) deallocate(lexeme)
                allocate(character(len=5) :: lexeme)
                lexeme = "ERROR"
                cursor = i
                return
            end if


            ! Manejar cuantificadores
            ${this.generateQuantifierCode(node.count, 'match_count')}
        end block`;
        
        return baseCode;
    }else if(node.exp instanceof Agrup){
        return node.exp.accept(this);
    
    }else if(node.exp instanceof Identificador){
        return node.exp.accept(this);
    }else if(node.count){

        if (node.count == '*'){
            return ` 

            !expresión normal*          
                if (input(cursor:cursor + ${node.exp.expr.length - 1}) == "${node.exp.expr}") then
                    do while (cursor <= len_trim(input) - ${node.exp.expr.length - 1} .and. input(cursor:cursor + ${node.exp.expr.length - 1}) == "${node.exp.expr}")
                        lexeme = lexeme // input(cursor:cursor + ${node.exp.expr.length - 1})
                        cursor = cursor + ${node.exp.expr.length}
                    end do
                return
                end if
                `;
        }else if (node.count == '+'){
            return `
            !expresión normal+          
                if (input(cursor:cursor + ${node.exp.expr.length - 1}) == "${node.exp.expr}") then
                    allocate(character(len=${node.exp.expr.length}) :: lexeme)
                    lexeme = input(cursor:cursor + ${node.exp.expr.length - 1})
                    cursor = cursor + ${node.exp.expr.length}
                    return
                end if
            `;
        }else if (node.count == '?'){
            return `
            !expresión normal?          
                if (input(cursor:cursor + ${node.exp.expr.length - 1}) == "${node.exp.expr}") then
                    allocate(character(len=${node.exp.expr.length}) :: lexeme)
                    lexeme = input(cursor:cursor + ${node.exp.expr.length - 1})
                    cursor = cursor + ${node.exp.expr.length}
                    return
                end if
            `;
        }
        
    }
    
    // Para otros casos, delegar al nodo hijo
    return node.exp.accept(this);

    }



    /**
     * @type {BaseVisitor['visitStrComilla']}
     */
    visitStrComilla(node) {
        if (node.opI === 'i') {
            return `
        block
            !string i 
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
            !string 
        if  (((input(cursor:cursor + ${node.expr.length - 1}) == "${node.expr}"))) then
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
     * @type {BaseVisitor['visitContenidoRango']}
     */
     visitContenidoRango(node) {
        return `
    if (input(i:i) >= "${node.inicio}" .and. input(i:i) <= "${node.fin}") then
        lexeme = input(cursor:i)
        cursor = i + 1
        return
    end if
        `;

    
}

generateQuantifierCode(quantifier, countVar) {
    switch (quantifier) {
        case '*':
            return `
            ! Cuantificador * (cero o más)
            cursor = i
            return`;
            
        case '+':
            return `
            ! Cuantificador + (uno o más)
            if (${countVar} > 0) then
                cursor = i
                return
            else
                print *, "Error léxico: se requiere al menos una coincidencia para el cuantificador '+', columna: ", cursor
                if (allocated(lexeme)) deallocate(lexeme)
                allocate(character(len=5) :: lexeme)
                lexeme = "ERROR"
                return
            end if`;
            
        case '?':
            return `
            ! Cuantificador ? (cero o uno)
            if (${countVar} <= 1) then
                cursor = i
                return
            else
                print *, "Error léxico: se encontraron múltiples coincidencias para el cuantificador '?', columna: ", cursor
                if (allocated(lexeme)) deallocate(lexeme)
                allocate(character(len=5) :: lexeme)
                lexeme = "ERROR"
                return
            end if`;
            
        default:
            return `
            ! Sin cuantificador (exactamente uno)
            if (${countVar} == 1) then
                cursor = i
                return
            else
                print *, "Error léxico: se requiere exactamente una coincidencia, columna: ", cursor
                if (allocated(lexeme)) deallocate(lexeme)
                allocate(character(len=5) :: lexeme)
                lexeme = "ERROR"
                return
            end if`;
    }
}




    generateCaracteres(chars) {

        if (chars.length === 0) return '';
    return `
    if (findloc([${chars
        .map((char) => `"${char}"`)
        .join(', ')}], input(i:i), 1) > 0) then
        lexeme = input(cursor:i)
        cursor = i + 1
        return
    end if
    `;
    }


    
    /**
     * @type {BaseVisitor['visitClase']}
     */
    visitClase(node) {

        if (node.opI === 'i') {
            const caracteres = node.expr
                .filter((node) => typeof node === 'string')
                .map(char => `"${char.toUpperCase()}"`);
                
            return `
            block
                !clase i en rango
                character(len=1) :: temp_str
                logical :: is_match
                    integer :: i, char_code
                
                    is_match = .false.
                    temp_str = input(cursor:cursor)
                
                    ! Convertir a mayúsculas el carácter de entrada
                    char_code = iachar(temp_str)
                    if (char_code >= iachar('a') .and. char_code <= iachar('z')) then
                        temp_str = achar(char_code - 32)
                    end if
                    
                    ! Verificar si está en el conjunto de caracteres
                    if (findloc([${caracteres.join(', ')}], temp_str, 1) > 0) then
                        is_match = .true.
                    end if
        
                    ! Verificar rangos si existen
                    ${node.expr
                        .filter((node) => node instanceof ContenidoRango)
                        .map(range => `
                            ! Verificar rango ${range.inicio}-${range.fin}
                            if (.not. is_match) then
                                if (temp_str >= "${range.inicio.toUpperCase()}" .and. temp_str <= "${range.fin.toUpperCase()}") then
                                    is_match = .true.
                                end if
                            end if
                        `).join('\n')
                    }
                
                    if (is_match) then
                        lexeme = input(cursor:cursor)
                        cursor = cursor + 1
                        return
                    end if
                end block`;
            } else {
                return `
                i = cursor
                ${this.generateCaracteres(
                    node.expr.filter((node) => typeof node === 'string')
                )}
                ${node.expr
                    .filter((node) => node instanceof ContenidoRango)
                    .map((range) => range.accept(this))
                    .join('\n')}
                `;

        }
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
                integer :: i
            
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


    /**
     * @type {BaseVisitor['visitIdentificador']}
     */
    visitIdentificador(node) {
        
    }


    /**
     * @type {BaseVisitor['visitAgrup']}
     */

    visitAgrup(node) {

        return node.expr.accept(this);
    }


    /**
     * @type {BaseVisitor['visitPunto']}
     */
    visitPunto(node){

    }

    /**
     * @type {BaseVisitor['visitFinCadena']}
     */

    visitFinCadena(node){

    }



    
    







}