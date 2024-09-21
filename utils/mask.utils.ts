export const applyMask = (value, maskType = ''): string => {

    if (maskType == 'peso') {//resolver problema do input peso
        //const digitsFloat = value.slice(0, -2) + "." + value.slice(-2);

        var valueFormatted = value.replace(/(?!^[-0-9]*,?)[^0-9,]/g, '').replace(/,(?=.*,)/g, '');
        return valueFormatted;  //maskWeight(digitsFloat);
    }

    const onlyDigits = value
        .split('')
        .filter(s => /\d|\./.test(s))
        .join('')
        .padStart(3, '0');
    const digitsFloat = onlyDigits.slice(0, -2) + '.' + onlyDigits.slice(-2);
    return maskCurrency(digitsFloat);
}

const maskWeight = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 3
    }).format(parseFloat(valor));
};

export const maskCurrency = (valor, locale = 'pt-BR', currency = 'BRL') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(parseFloat(valor));
};