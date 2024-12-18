import { BaseVisitor } from "./visitor.js";
import { Producciones } from "./nodos.js";


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
     * @type {BaseVisitor['visitEtiqueta']}
     */
    visitEtiqueta(node) {
        return node.id.accept(this);
    }

    /**
     * @type {BaseVisitor['visitExpresiones']}
     */
    visitExpresiones(node) {
        return node.expr.accept(this);
    }



    /**
     * @type {BaseVisitor['visitLiterales']}
     */
    visitLiterales(node) {
        const template = `
            if ( "${node.lit}" == input(cursor:cursor + ${node.lit.length - 1}) ) then
                allocate( character(len=${node.lit.length}) :: lexeme)
                lexeme = input(cursor:cursor + ${node.lit.length - 1})
                cursor = cursor + ${node.lit.length}
                return
            end if
        `;
    
        return template;
    }
    

    /**
     * @type {BaseVisitor['visitConteo']}
     */
    visitConteo(node) {
        throw new Error("Method not implemented.");
    }


    /**
     * @type {BaseVisitor['visitCorchete']}
     */
    visitCorchete(node) {
        throw new Error("Method not implemented.");
    }


    /**
     * @type {BaseVisitor['visitRango']}
     */
    visitRango(node) {
        throw new Error("Method not implemented.");
    }

    /**
     * @type {BaseVisitor['visitCaracter']}
     */
    visitCaracter(node) {
        throw new Error("Method not implemented.");
    }

    /**
     * @type {BaseVisitor['visitContenido']}
     */
    visitContenido(node) {
        throw new Error("Method not implemented.");
    }

    /**
     * @type {BaseVisitor['visitCorchetes']}
     */
    visitCorchetes(node) {
        throw new Error("Method not implemented.");
    }

    /**
     * @type {BaseVisitor['visitTexto']}
     */
    visitTexto(node) {
        throw new Error("Method not implemented.");
    }


    /**
     * @type {BaseVisitor['visitIdentificador']}
     */
    visitIdentificador(node) {
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
        const rules = producciones.map(token => this.visitLiterales(token)).join("\n");
    
        const template = `
            module tokenizer
            implicit none
    
            contains
            function nextSym(input, cursor) result(lexeme)
                character(len=*), intent(in) :: input
                integer, intent(inout) :: cursor
                character(len=:), allocatable :: lexeme
                ${rules}
                print *, "error lexico en col ", cursor, ', "'//input(cursor:cursor)//'"'
            end function nextSym
            end module tokenizer
        `;
    
        return template;
    }
    







}