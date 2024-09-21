import { BaseEntity } from "./baseEntity";

export class ItemListaEntity extends BaseEntity {
    descricao: string;
    informarPeso: boolean;
    valor: number | null;
    valorTotal: number;
    quantidade: number | null;
    valorKg: number | null;
    peso: number | null;
    listaId: number;
}