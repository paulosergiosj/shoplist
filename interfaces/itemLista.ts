export class ItemLista {
  id: number | null;
  localId: number | null;
  descricao: string;
  informarPeso: boolean;
  valor: string | null;
  valorTotal: string;
  quantidade: string | null;
  valorKg: string | null;
  peso: string | null;

  constructor(
    descricao: string,
    informarPeso: boolean,
    valor: string | null,
    valorTotal: string,
    quantidade: string | null,
    valorKg: string | null,
    peso: string | null) {
    this.descricao = descricao;
    this.informarPeso = informarPeso;
    this.valor = valor;
    this.valorTotal = valorTotal;
    this.quantidade = quantidade;
    this.valorKg = valorKg;
    this.peso = peso;
  }

  static New() {
    return new ItemLista('', false, 'R$0,00', 'R$0,00', '0', 'R$0,00', '0');
  }
}