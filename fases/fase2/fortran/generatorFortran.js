import { BaseVisitor } from "../tools/visitor.js";
import { ContenidoRango, FinCadena, Identificador } from "../tools/nodos.js";
import { StrComilla } from "../tools/nodos.js";
import { Clase } from "../tools/nodos.js";
import { Agrup } from "../tools/nodos.js";


export class GeneratorFortran extends BaseVisitor {
    
    visitProducciones(node) {
        return node.opc.accept(this);
    }

    visitOpciones(node) {
        return node.listOpciones.map(opcion => opcion.accept(this)).join('\n');
    }

    visitUnion(node) {
        return node.listUnion.map(union => union.accept(this)).join('\n');
    }

    visitExpresion(node) {
        if (node.exp instanceof Clase && node.count) {
            node.exp.expr = this.CaracteresEspeciales(node.exp.expr)
            const baseCode = `
            block
            integer :: match_count, start_pos, max_iterations
            logical :: found_match
            character :: current_char
            character(len=:), allocatable :: temp_lexeme
            
            match_count = 0
            max_iterations = len_trim(input) - cursor + 1
            found_match = .false.
            
            if (allocated(lexeme)) deallocate(lexeme)
            allocate(character(len=0) :: lexeme)
            allocate(character(len=0) :: temp_lexeme)
            
            start_pos = cursor
            
            if (cursor <= len_trim(input)) then
                current_char = input(cursor:cursor)
                
                ! Verificar si el primer carácter está en algún rango
                if (${node.exp.expr
                    .filter((node) => typeof node === 'string')
                    .map(char => `current_char == "${char}"`)
                    .concat(
                        node.exp.expr
                            .filter((node) => node instanceof ContenidoRango)
                            .map((range) => `(current_char >= "${range.inicio}" .and. current_char <= "${range.fin}")`)
                    )
                    .join(' .or. ')}) then
                    
                    do while (cursor <= len_trim(input))
                        current_char = input(cursor:cursor)
                        
                        if (${node.exp.expr
                            .filter((node) => typeof node === 'string')
                            .map(char => `current_char == "${char}"`)
                            .concat(
                                node.exp.expr
                                    .filter((node) => node instanceof ContenidoRango)
                                    .map((range) => `(current_char >= "${range.inicio}" .and. current_char <= "${range.fin}")`)
                            )
                            .join(' .or. ')}) then
                            temp_lexeme = temp_lexeme // current_char
                            match_count = match_count + 1
                            cursor = cursor + 1
                            found_match = .true.
                        else
                            exit
                        end if
                    end do
                end if
            end if

            ! Manejar el resultado
            if (found_match) then
                ! Manejar los cuantificadores
                select case ("${node.count}")
                    case ("*")
                        lexeme = temp_lexeme // " - " // "identificador *"
                        return
                    case ("+")
                        if (match_count > 0) then
                            lexeme = temp_lexeme // " - " // "identificador +"
                            return
                        end if
                    case ("?")
                        if (match_count <= 1) then
                        
                            lexeme = temp_lexeme // " - " // "identificador ?"
                            return
                        else
                            ! if (allocated(lexeme)) deallocate(lexeme)
                            ! allocate(character(len=5) :: lexeme)
                            cursor = start_pos
                            lexeme = "ERROR"
                            return
                            
                    end if
                    case default
                        if (match_count == 1) then
                            lexeme = temp_lexeme // " - " // "identificador"
                            return
                        end if
                end select
                
                if (allocated(temp_lexeme)) deallocate(temp_lexeme)
                cursor = start_pos
                allocate(character(len=5) :: lexeme)
                lexeme = "ERROR"
                return

            end if
        end block`;
        
        return baseCode;
        } else if (node.exp instanceof Agrup) {
            return node.exp.accept(this);
        } else if (node.exp instanceof Identificador) {
            return node.exp.accept(this);
        }else if(node.exp instanceof FinCadena){
            return `
            !string 
            if (((input(cursor:cursor + ${node.exp.expr.length - 1}) == "${node.exp.expr}"))) then
                if (allocated(lexeme)) deallocate(lexeme)
                allocate(character(len=${node.exp.expr.length}) :: lexeme)
                lexeme = input(cursor:cursor + ${node.exp.expr.length - 1}) // " - " // "EOF"
                cursor = cursor + ${node.exp.expr.length}
                return
    end if`;
        } else if (node.count) {
            if (node.exp instanceof StrComilla && node.count) {
                const baseCode = `
                block
                    integer :: match_count, start_pos, max_iterations
                    logical :: found_match
                    character(len=:), allocatable :: temp_lexeme
                    character(len=:), allocatable :: full_match
                    
                    match_count = 0
                    max_iterations = len_trim(input) - cursor + 1
                    found_match = .false.
                    
                    if (allocated(lexeme)) deallocate(lexeme)
                    allocate(character(len=0) :: lexeme)
                    allocate(character(len=0) :: temp_lexeme)
                    allocate(character(len=0) :: full_match)
                    
                    start_pos = cursor
                    
                    ! Verificar primera coincidencia usando visitStrComilla
                    ${node.exp.accept(this)}
                    

                   do while (cursor <= len_trim(input) - ${node.exp.expr.length - 1})
            if (input(cursor:cursor + ${node.exp.expr.length - 1}) == "${node.exp.expr}") then
                full_match = full_match // "${node.exp.expr}"
                cursor = cursor + ${node.exp.expr.length}
                match_count = match_count + 1
                found_match = .true.
            else
                exit
            end if
        end do
        
                    ! Manejar los cuantificadores
                    if (found_match) then
                    select case ("${node.count}")
                        case ("*")
                    ! Para * aceptamos todas las coincidencias encontradas
                    lexeme = full_match // " - string"
                    return
                    
                case ("+")
                    ! Para + necesitamos al menos una coincidencia
                    if (match_count > 0) then
                        lexeme = full_match // " - identificador +"
                        return
                    end if
            
                            
                        case ("?")
                            ! Para ? aceptamos tanto si hay coincidencia como si no
                            if (match_count<=1) then
                                lexeme = temp_lexeme
                                return
                            else
                                cursor = start_pos
                                return
                            end if
                            
                            
                        case default
                            ! Para ningún cuantificador, necesitamos exactamente una coincidencia
                            if (found_match) then
                                lexeme = temp_lexeme
                                return
                            end if
                    end select
                    end if
                    
                    ! Si llegamos aquí es que no se cumplió la condición del cuantificador
                    cursor = start_pos
                    if (allocated(temp_lexeme)) deallocate(temp_lexeme)
                end block`;
                
                return baseCode;
                }

        //     if (node.count == '*') {
        //         return `
        //         block
        //             integer :: start_pos, matches, max_iterations
        //             start_pos = cursor
        //             matches = 0
        //             max_iterations = len_trim(input) - cursor + 1
                    
        //             if (allocated(lexeme)) deallocate(lexeme)
        //             allocate(character(len=0) :: lexeme)
                    
        //             do while (cursor <= len_trim(input) - ${node.exp.expr.length - 1} .and. matches < max_iterations)
        //                 if (input(cursor:cursor + ${node.exp.expr.length - 1}) == "${node.exp.expr}") then
        //                     lexeme = lexeme // input(cursor:cursor + ${node.exp.expr.length - 1})
        //                     cursor = cursor + ${node.exp.expr.length}
        //                     matches = matches + 1
        //                 else
        //                     exit
        //                 end if
        //             end do
        //             return
        //         end block`;
        //     } else if (node.count == '+') {
        //         return `
        //         block
        //             integer :: start_pos, matches, max_iterations
        //             start_pos = cursor
        //             matches = 0
        //             max_iterations = len_trim(input) - cursor + 1
                    
        //             if (allocated(lexeme)) deallocate(lexeme)
        //             allocate(character(len=0) :: lexeme)
                    
        //             do while (cursor <= len_trim(input) - ${node.exp.expr.length - 1} .and. matches < max_iterations)
        //                 if (input(cursor:cursor + ${node.exp.expr.length - 1}) == "${node.exp.expr}") then
        //                     lexeme = lexeme // input(cursor:cursor + ${node.exp.expr.length - 1})
        //                     cursor = cursor + ${node.exp.expr.length}
        //                     matches = matches + 1
        //                 else
        //                     exit
        //                 end if
        //             end do
                    
        //             if (matches == 0) then
        //                 cursor = start_pos
        //             end if
        //         end block`;
        //     } else if (node.count == '?') {
        //         return `
        //         block
        //             integer :: start_pos
        //             start_pos = cursor
                    
        //             if (cursor <= len_trim(input) - ${node.exp.expr.length - 1}) then
        //                 if (input(cursor:cursor + ${node.exp.expr.length - 1}) == "${node.exp.expr}") then
        //                     allocate(character(len=${node.exp.expr.length}) :: lexeme)
        //                     lexeme = input(cursor:cursor + ${node.exp.expr.length - 1})
        //                     cursor = cursor + ${node.exp.expr.length}
        //                 end if
        //             end if
        //             return
        //         end block`;
        //     }
        }
        
        return node.exp.accept(this);
    }

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
            if (allocated(lexeme)) deallocate(lexeme)
            allocate(character(len=${node.expr.length}) :: lexeme)
            lexeme = input(cursor:cursor + ${node.expr.length - 1}) // " - " // "string"
            cursor = cursor + ${node.expr.length}
            return
        end if`;
        }
    }

    visitConteo(node) {
        throw new Error("Method not implemented.");
    }

    visitContenidoRango(node) {
        return `
        block
            integer :: start_pos
            start_pos = cursor
            
            if (cursor <= len_trim(input)) then
                if (input(cursor:cursor) >= "${node.inicio}" .and. input(cursor:cursor) <= "${node.fin}") then
                    !allocate(character(len=1) :: lexeme)
                    lexeme = input(cursor:cursor)
                    cursor = cursor + 1
                    return
                end if
            end if
            
            cursor = start_pos
        end block`;
    }

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
                    ${caracteres.length > 0 ? `
                        ! Verificar si está en el conjunto de caracteres
                        if (findloc([${caracteres.map(char => `${char}`).join(', ')}], temp_str, 1) > 0) then
                            is_match = .true.
                        end if
                    ` : ''}
                    
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
            block
                integer :: start_pos
                start_pos = cursor
                
                if (cursor <= len_trim(input)) then
                    ${this.generateCaracteres(node.expr.filter((node) => typeof node === 'string'))}
                    ${node.expr
                        .filter((node) => node instanceof ContenidoRango)
                        .map((range) => range.accept(this))
                        .join('\n')}
                end if
                
                cursor = start_pos
            end block`;
        }
    }

    //Verifica en un arreglo que si viene /t/n/r
    /*
    ["/", "/n"]
    */
    CaracteresEspeciales(chars){
        let resultado =[]
        for (let i = 0; i < chars.length; i++) {
            if (chars[i]=="\\" && i + 1 < chars.length){
                if (chars[i + 1] === 't' || chars[i + 1] === 'r' || chars[i + 1] === 'n'){
                    resultado.push("\\"+chars[i + 1]);
                    i++
                }
            }
            else{
                resultado.push(chars[i])
            }
        }          
        return  resultado ;
    }

    generateCaracteres(chars) {
        if (chars.length === 0) return '';
        chars = this.CaracteresEspeciales(chars)
        
        return `
        ! Caracteres ${chars.join(', ')}
        if (findloc([${chars.map((char) => `"${char}"`).join(', ')}], input(cursor:cursor), 1) > 0) then
            if (allocated(lexeme)) deallocate(lexeme)
            allocate(character(len=1) :: lexeme)
            lexeme = input(cursor:cursor)
            cursor = cursor + 1
            return
        end if`;
    }


    generateTokenizer(producciones) {
        return `
        module parser
        implicit none
        
        contains

        subroutine parse(input)
            character(len=:), intent(inout), allocatable :: input
            integer :: i = 1
            character(len=:), allocatable :: valor

            do while (valor/= "EOF" .AND. valor/= "ERROR")
                valor = nextsym(input, i)
                print *, valor
            end do
        end subroutine parse


        function nextSym(input, cursor) result(lexeme)
            character(len=*), intent(in) :: input
            integer, intent(inout) :: cursor
            character(len=:), allocatable :: lexeme
            integer :: i, start_pos, original_cursor
            
            if (cursor > len(input)) then
                allocate(character(len=3) :: lexeme)
                lexeme = "EOF"
                return
            end if
            
            start_pos = cursor
            original_cursor = cursor
            
            ! Intentar cada producción
            ${producciones.map((produccion, index) => `
            cursor = start_pos
            ! Producción ${index + 1}
            ${produccion.accept(this)}
            if (allocated(lexeme)) then
                if (len_trim(lexeme) > 0) then
                    return
                else
                    deallocate(lexeme)
                end if
            end if`).join('\n')}
            
            ! Si ninguna producción coincide
            cursor = start_pos + 1
            allocate(character(len=5) :: lexeme)
            lexeme = "ERROR"
        end function nextSym
        end module parser`;
    }

    visitIdentificador(node) {
        // Implementar si es necesario
    }

    visitAgrup(node) {
        return node.expr.accept(this);
    }

    visitPunto(node) {
        // Implementar si es necesario
    }

    visitFinCadena(node) {
        console.log("Fin de cadena")
        return `
            !string 
        if  (((input(cursor:cursor + ${node.expr.length - 1}) == "${node.expr}"))) then
            if (allocated(lexeme)) deallocate(lexeme)
            allocate(character(len=${node.expr.length}) :: lexeme)
            lexeme = input(cursor:cursor + ${node.expr.length - 1}) // " - " // "EOF"
            cursor = cursor + ${node.expr.length}
            return
        end if`;
    }
}