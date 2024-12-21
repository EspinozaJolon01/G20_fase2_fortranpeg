import { BaseVisitor } from "../tools/visitor.js";
import {ContenidoRango} from "../tools/nodos.js";
import {StrComilla} from "../tools/nodos.js";
import {Clase} from "../tools/nodos.js";


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
            !expresión +
            if (input(cursor:cursor + ${node.exp.expr.length - 1}) == "${node.exp.expr}") then
                do while (cursor <= len_trim(input) - ${node.exp.expr.length - 1} .and. input(cursor:cursor + ${node.exp.expr.length - 1}) == "${node.exp.expr}")
                lexeme = lexeme // input(cursor:cursor + ${node.exp.expr.length - 1})
                cursor = cursor + ${node.exp.expr.length}
                end do
                return
            end if
            `
        }else if (node.count === "*"){
            if (node.exp.expr.filter((node) => node instanceof Clase)){
                return `

                !expresión rango *
                ${this.generateCaracteres(
                    node.exp.expr.filter((node) => typeof node === 'string')
                )}
                ${node.exp.expr
                    .filter((node) => node instanceof ContenidoRango)
                    .map((range) => range.accept(this))
                    .join('\n')}
                        ! Verificar si no se encontraron caracteres válidos
            if (len(lexeme) == 0) then
                if (allocated(lexeme)) deallocate(lexeme)  ! Desasignar si ya estaba asignado
                allocate(character(len=5) :: lexeme)
                lexeme = "ERROR"
                print *, "Error léxico: sin caracteres válidos en col ", cursor
                return
            end if
            cursor = cursor + len(lexeme)
            return


                    `;
            }else{
                return `  
            !expresión normal*          
                if (input(cursor:cursor + ${node.exp.expr.length - 1}) == "${node.exp.expr}") then
                    do while (cursor <= len_trim(input) - ${node.exp.expr.length - 1} .and. input(cursor:cursor + ${node.exp.expr.length - 1}) == "${node.exp.expr}")
                        lexeme = lexeme // input(cursor:cursor + ${node.exp.expr.length - 1})
                        cursor = cursor + ${node.exp.expr.length}
                    end do
                return
                end if
                `
            }
        }else if (node.count === "?"){
            return `  
            !expresión ?
            if ((cursor+2 > len_trim(input)).or.(("${node.exp.expr}" == input(cursor:cursor+${node.exp.expr.length - 1})))) then
            if ("${node.exp.expr}" == input(cursor:cursor + ${node.exp.expr.length - 1})) then
                allocate(character(len=${node.exp.expr.length}) :: lexeme)
                lexeme = input(cursor:cursor + ${node.exp.expr.length - 1})
                cursor = cursor + ${node.exp.expr.length }
                        
            return
            end if
        end if
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
        //     return `
        // if (input(i:i) >= "${node.inicio}" .and. input(i:i) <= "${node.fin}") then
        //     lexeme = input(cursor:i)
        //     cursor = i + 1
        //     return
        // end if
        //     `;
        return `
    
        if (allocated(lexeme)) deallocate(lexeme)  ! Desasignar si ya estaba asignado
        allocate(character(len=0) :: lexeme)

        do i = cursor, len_trim(input)
            if (input(i:i) >= "${node.inicio}" .and. input(i:i) <= "${node.fin}") then
                lexeme = lexeme // input(i:i)
            else
                ! Encontrar un carácter fuera del rango y lanzar error léxico
                print *, "Error léxico: carácter no válido en col ", i, ', "' // input(i:i) // '"'
                if (allocated(lexeme)) deallocate(lexeme)  ! Desasignar antes de asignar ERROR
                allocate(character(len=5) :: lexeme)
                lexeme = "ERROR"
                return
            end if
        end do
        cursor = cursor + len(lexeme)

       
        
    `;
        
    }



    generateCaracteres(chars) {
        console.log(chars);
        if (chars.length === 0) return '';
        return `
        if (allocated(lexeme)) deallocate(lexeme)  ! Asegurarse de liberar el lexeme si ya está asignado
        allocate(character(len=0) :: lexeme)

        do i = cursor, len_trim(input)
            if (findloc([${chars.map((char) => `"${char}"`).join(', ')}], input(i:i), 1) > 0) then
                lexeme = lexeme // input(i:i)
            else
                exit  ! Salir si se encuentra un carácter no permitido
            end if
        end do

        cursor = cursor + len(lexeme)

      
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

    visitAgrup(node){
        return node.expr.accept(this);
    }



    
    







}