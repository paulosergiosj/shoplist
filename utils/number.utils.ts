export function stringValorParaFloat(numero) {
    if (numero === undefined || numero === null || numero === '') {
        return 0;
    }

    return parseFloat(numero
        .replace(/R\$\s*/g, '')
        .replace(/\./g, '')
        .replace(',', '.')
        .trim());
}

export function floatParaStringValor(numero) {
    if (numero === undefined || numero === null || numero === '') {
        return 0;
    }

    return numero.toString().replace('.', ',');
}