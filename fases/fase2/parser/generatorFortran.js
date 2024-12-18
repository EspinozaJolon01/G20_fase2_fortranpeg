import { BaseVisitor } from "./visitor.js";
import mustache from 'mustache';

export class GeneratorFortran extends BaseVisitor {


    visitexpression(node) {}

    /**
     * @type {BaseVisitor['visitProducciones']}
     */
    visitProducciones(node) {
        return node.opc.accept(this);
    }

}