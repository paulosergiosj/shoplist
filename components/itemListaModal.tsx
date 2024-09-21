import { Alert, Modal, StyleSheet, Text, Pressable, View, Switch } from "react-native";
import { ItemLista } from "../interfaces/itemLista";
import React, { useEffect, useRef, useState } from 'react';
import CheckBox from 'expo-checkbox';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { Row } from "./row";
import { Col } from "./col";
import TextInputMask from "react-native-text-input-mask";
import { MaskedInput } from "./maskedInput";
import { applyMask, maskCurrency } from "../utils/mask.utils";
import { stringValorParaFloat } from "../utils/number.utils";

interface ItemListaModalProps {
    visible: boolean;
    item: ItemLista;
    onSend: (item: ItemLista, edit: boolean) => void;
    onCancel: () => void;
}

export const ItemListaModal: React.FC<ItemListaModalProps> = ({ visible, item, onSend, onCancel }) => {

    const [formData, setFormData] = useState<ItemLista>(item);

    useEffect(() => {
        setFormData(item);
    }, [visible]);

    const handleInputChange = (field: keyof ItemLista, value: string) => {
        setFormData((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleInputNumberChange = (field: keyof ItemLista, value: string) => {
        setFormData((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const atualizarCampoValor = (field: keyof ItemLista, value: string) => {
        setFormData((prevState) => ({
            ...prevState,
            [field]: value,
        }));

        var valor: number = 0;
        var quantidade: number = 0;

        switch (field) {
            case 'valor':
                valor = stringValorParaFloat(value);
                quantidade = parseInt(formData.quantidade);
                break;
            case 'quantidade':
                valor = stringValorParaFloat(formData.valor);
                quantidade = parseInt(value);
                break;

            case 'valorKg':
                valor = stringValorParaFloat(value);
                quantidade = stringValorParaFloat(formData.peso);
                break;

            case 'peso':
                valor = stringValorParaFloat(formData.valorKg);
                quantidade = stringValorParaFloat(value);
                break;
        }



        // var valorFloat = formatarNumeroParaFloat(field == 'valor' ? value : formData.valor);
        // var quantidadeInt = parseInt(field == 'quantidade' ? value : formData.quantidade);

        var valorCalculado = String(valor * quantidade);
        //alert("valorFloat: " + valorFloat + " quantidadeInt: " + quantidadeInt + " valorFormatado:" + valorCalculado);

        if (Number.isNaN(parseFloat(valorCalculado))) {
            valorCalculado = '0,00';
        }

        valorCalculado = maskCurrency(valorCalculado);

        //alert('valorCalculado dps do IF:' + valorCalculado);

        handleInputNumberChange('valorTotal', valorCalculado);
    };

    const handleCheckBoxChange = (field: keyof typeof formData, value: boolean) => {
        setFormData((prevState) => ({
            ...prevState,
            [field]: value,
        }));

        if (value) {
            atualizarCampoValor('valor', '0');
            atualizarCampoValor('quantidade', '0');
            return;
        }

        atualizarCampoValor('valorKg', '0');
        atualizarCampoValor('peso', '0');
    };

    function concluir() {
        var dadosInvalidos = exibirDadosInvalidos();

        if (dadosInvalidos != '') {
            alert(dadosInvalidos);
            return;
        }

        onSend(formData, item.localId !== undefined);
        setFormData(ItemLista.New());
    }

    function exibirDadosInvalidos() {

        if (formData.descricao.length == 0) {
            return 'Informe a descrição do item';
        }

        if (stringValorParaFloat(formData.valorTotal) == 0) {
            return formData.informarPeso ? 'Informe valor/peso para calculo' : 'informe valor unitário/quantidade para calculo';
        }

        return '';
    }
    return (
        <View>
            <View style={styles.centeredView}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={visible}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.app}>
                                <Row rowStyle={styles.row}>
                                    <Col numRows={4} colStyle={styles[`${4}col`]}>
                                        <View style={{ flexDirection: 'row', paddingTop: 9 }}>
                                            <Switch
                                                value={formData.informarPeso}
                                                onValueChange={(value) => handleCheckBoxChange('informarPeso', value)}
                                            />
                                            <Text style={{ paddingStart: 10, paddingTop: 12 }}>Informar peso?</Text>
                                        </View>
                                    </Col>
                                </Row>
                                <Row rowStyle={styles.row}>
                                    <Col numRows={4} colStyle={styles[`${4}col`]}>
                                        <TextInput
                                            keyboardType="default"
                                            selectionColor={'black'}
                                            mode={'outlined'}
                                            label={'Descrição'}
                                            onChangeText={(value) => handleInputChange('descricao', value)}
                                            value={formData.descricao}
                                        />
                                    </Col>

                                </Row>
                                {!formData.informarPeso && (
                                    <Row rowStyle={styles.row}>
                                        <Col numRows={1} colStyle={styles[`${1}col`]}>
                                            <MaskedInput
                                                mode={'outlined'}
                                                label={'Valor unitário'}
                                                onChangeText={(value) => atualizarCampoValor('valor', value)}
                                                value={formData.valor}
                                            />
                                        </Col>
                                        <Col numRows={1} colStyle={styles[`${1}col`]}>
                                            <TextInput
                                                keyboardType="numeric"
                                                selectionColor={'black'}
                                                mode={'outlined'}
                                                label={'Quantidade'}
                                                onChangeText={(value) => atualizarCampoValor('quantidade', value)}
                                                value={formData.quantidade}
                                            />
                                        </Col>

                                    </Row>)}
                                {/* aqui */}
                                {formData.informarPeso && (
                                    <Row rowStyle={styles.row}>
                                        <Col numRows={2} colStyle={styles[`${2}col`]}>
                                            <MaskedInput
                                                mode={'outlined'}
                                                label={'Valor do Kg'}
                                                onChangeText={(value) => atualizarCampoValor('valorKg', value)}
                                                value={formData.valorKg}
                                            />
                                        </Col>
                                        <Col numRows={2} colStyle={styles[`${2}col`]}>
                                            <MaskedInput
                                                mode={'outlined'}
                                                label={'Peso'}
                                                mascara={'peso'}
                                                onChangeText={(value) => atualizarCampoValor('peso', value)}
                                                value={formData.peso}
                                                tamanho={6}
                                            />
                                            {/* <TextInput
                                                mode={'outlined'}
                                                label={'Peso'}
                                                selectionColor={'black'}
                                                keyboardType={'numeric'}
                                                onChangeText={(value) => atualizarCampoValor('peso', value)}
                                                value={formData.peso}
                                                maxLength={6}
                                            /> */}
                                        </Col>
                                    </Row>
                                )}
                                <Row rowStyle={styles.row}>
                                    <Col numRows={4} colStyle={styles[`${4}col`]}>
                                        <MaskedInput
                                            mode={'outlined'}
                                            label={'Total'}
                                            editable={false}
                                            onChangeText={(value) => handleInputNumberChange('valorTotal', value)}
                                            value={formData.valorTotal}
                                        />
                                    </Col>
                                </Row>
                            </View>
                            <Row rowStyle={styles.row}>
                                <Col numRows={2} colStyle={styles[`${2}col`]}>
                                    <Button style={styles.buttonCancel} mode="contained" onPress={onCancel}>
                                        Cancelar
                                    </Button>
                                </Col>
                                <Col numRows={2} colStyle={styles[`${2}col`]}>
                                    <Button style={styles.button} mode="contained" onPress={concluir}>
                                        Concluir
                                    </Button>
                                </Col>
                            </Row>
                        </View>
                    </View>
                </Modal >
            </View >
        </View>);
}

const colPadding = 2;

const styles = StyleSheet.create({
    input: {
        marginEnd: 5
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    app: {
        flex: 4,
        marginHorizontal: "auto",
        width: '100%',
    },
    row: {
        flexDirection: "row",
        height: 50,
        marginBottom: 10,

    },
    "1col": {
        flex: 1,
        padding: colPadding
    },
    "2col": {
        flex: 2,
        padding: colPadding
    },
    "3col": {
        flex: 3,
        padding: colPadding
    },
    "4col": {
        flex: 4,
        padding: colPadding
    },
    modalView: {
        width: '90%',
        height: 400,
        margin: 20,
        backgroundColor: 'white',

        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        width: 150,
        backgroundColor: '#4fa88e'
    },
    buttonCancel: {
        width: 140,
        backgroundColor: '#782222'
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});
