import { BaseVisitor } from "../tools/visitor.js";
import { ContenidoRango, Identificador } from "../tools/nodos.js";
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
            const baseCode = `
            block
                integer :: match_count, i, start_pos, max_iterations
                logical :: any_range_match, found_match
                character :: current_char
                character(len=:), allocatable :: temp_lexeme
                
                match_count = 0
                max_iterations = len_trim(input) - cursor + 1
                found_match = .false.
                
                if (allocated(lexeme)) deallocate(lexeme)
                allocate(character(len=0) :: lexeme)
                allocate(character(len=0) :: temp_lexeme)
                
                start_pos = cursor
                
                do i = 1, max_iterations
                    if (cursor > len_trim(input)) exit
                    
                    current_char = input(cursor:cursor)
                    any_range_match = .false.
                    
                    ! Verificar caracteres y rangos
                    ${node.exp.expr
                        .filter((node) => typeof node === 'string')
                        .map(char => `
                        if (.not. any_range_match) then
                            if (current_char == "${char}") then
                                any_range_match = .true.
                            end if
                        end if`)
                        .join('\n')}
                    
                    ${node.exp.expr
                        .filter((node) => node instanceof ContenidoRango)
                        .map((range) => `
                        if (.not. any_range_match) then
                            if (current_char >= "${range.inicio}" .and. current_char <= "${range.fin}") then
                                any_range_match = .true.
                            end if
                        end if`)
                        .join('\n')}
                    
                    if (any_range_match) then
                        temp_lexeme = temp_lexeme // current_char
                        match_count = match_count + 1
                        cursor = cursor + 1
                        found_match = .true.
                    else
                        exit
                    end if
                end do
                
                ! Manejar los cuantificadores
                select case ("${node.count}")
                    case ("*")
                        lexeme = temp_lexeme
                        return
                    case ("+")
                        if (match_count > 0) then
                            lexeme = temp_lexeme
                            return
                        end if
                    case ("?")
                        if (match_count <= 1) then
                            lexeme = temp_lexeme
                            return
                        end if
                    case default
                        if (match_count == 1) then
                            lexeme = temp_lexeme
                            return
                        end if
                end select
                
                ! Si llegamos aquí, no se cumplieron las condiciones
                cursor = start_pos
                if (allocated(temp_lexeme)) deallocate(temp_lexeme)
            end block`;
            
            return baseCode;
        } else if (node.exp instanceof Agrup) {
            return node.exp.accept(this);
        } else if (node.exp instanceof Identificador) {
            return node.exp.accept(this);
        } else if (node.count) {
            if (node.count == '*') {
                return `
                block
                    integer :: start_pos, matches, max_iterations
                    start_pos = cursor
                    matches = 0
                    max_iterations = len_trim(input) - cursor + 1
                    
                    if (allocated(lexeme)) deallocate(lexeme)
                    allocate(character(len=0) :: lexeme)
                    
                    do while (cursor <= len_trim(input) - ${node.exp.expr.length - 1} .and. matches < max_iterations)
                        if (input(cursor:cursor + ${node.exp.expr.length - 1}) == "${node.exp.expr}") then
                            lexeme = lexeme // input(cursor:cursor + ${node.exp.expr.length - 1})
                            cursor = cursor + ${node.exp.expr.length}
                            matches = matches + 1
                        else
                            exit
                        end if
                    end do
                    return
                end block`;
            } else if (node.count == '+') {
                return `
                block
                    integer :: start_pos, matches, max_iterations
                    start_pos = cursor
                    matches = 0
                    max_iterations = len_trim(input) - cursor + 1
                    
                    if (allocated(lexeme)) deallocate(lexeme)
                    allocate(character(len=0) :: lexeme)
                    
                    do while (cursor <= len_trim(input) - ${node.exp.expr.length - 1} .and. matches < max_iterations)
                        if (input(cursor:cursor + ${node.exp.expr.length - 1}) == "${node.exp.expr}") then
                            lexeme = lexeme // input(cursor:cursor + ${node.exp.expr.length - 1})
                            cursor = cursor + ${node.exp.expr.length}
                            matches = matches + 1
                        else
                            exit
                        end if
                    end do
                    
                    if (matches == 0) then
                        cursor = start_pos
                    end if
                end block`;
            } else if (node.count == '?') {
                return `
                block
                    integer :: start_pos
                    start_pos = cursor
                    
                    if (cursor <= len_trim(input) - ${node.exp.expr.length - 1}) then
                        if (input(cursor:cursor + ${node.exp.expr.length - 1}) == "${node.exp.expr}") then
                            allocate(character(len=${node.exp.expr.length}) :: lexeme)
                            lexeme = input(cursor:cursor + ${node.exp.expr.length - 1})
                            cursor = cursor + ${node.exp.expr.length}
                        end if
                    end if
                    return
                end block`;
            }
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
            allocate(character(len=${node.expr.length}) :: lexeme)
            lexeme = input(cursor:cursor + ${node.expr.length - 1})
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
                    allocate(character(len=1) :: lexeme)
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

    generateCaracteres(chars) {
        if (chars.length === 0) return '';
        return `
        ! Caracteres ${chars.join(', ')}
        if (findloc([${chars.map((char) => `"${char}"`).join(', ')}], input(cursor:cursor), 1) > 0) then
            allocate(character(len=1) :: lexeme)
            lexeme = input(cursor:cursor)
            cursor = cursor + 1
            return
        end if`;
    }

    generateTokenizer(producciones) {
        return `
        module tokenizer
        implicit none
        
        contains
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
        end module tokenizer`;
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
        // Implementar si es necesario
    }
}