import { BaseEntity } from "./baseEntity";
import { ItemListaEntity } from "./itemListaEntity";

export class ListaEntity extends BaseEntity {
    titulo: string;
    alteradoEm: Date;
    total: number;
    itens: ItemListaEntity[];
}