import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, FlatList, Button, Alert, BackHandler } from 'react-native';
import CheckBox from 'expo-checkbox';
import { Colors } from '../constants/Colors';
import { ItemListaModal } from '../components/itemListaModal';
import { ItemLista } from '../interfaces/itemLista';
import { ListItem } from 'react-native-elements';
import { floatParaStringValor, stringValorParaFloat } from '../utils/number.utils';
import { maskCurrency } from '../utils/mask.utils';
import { Appbar, Menu, Searchbar, TextInput } from 'react-native-paper';
import { ListaRepository } from '../database/listaRepository';
import { ListaEntity } from '../entities/listaEntity';
import { ItemListaEntity } from '../entities/itemListaEntity';
import { ItemListaRepository } from '../database/itemListaRepository';
import { useFocusEffect } from '@react-navigation/native';

export const NewEditListView = ({ navigation, route }) => {
    const [tituloLista, setTituloLista] = useState("");
    const [itemModal, setItemModal] = useState(ItemLista.New());
    const [items, setItems] = useState<ItemLista[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [totalizador, setTotalizador] = useState('R$0,00');
    const [nextLocalId, setNextLocalId] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState(items);
    const [idLista, setIdLista] = useState(0);
    const saindoAposSalvar = useRef(false);

    const listaRepository = ListaRepository();
    const itemListaRepository = ItemListaRepository();
    const tituloListaRef = useRef(tituloLista);
    const totalizadorRef = useRef(totalizador);
    const itemsRef = useRef(items);
    const itemModalRef = useRef(itemModal);

    useEffect(() => {
        tituloListaRef.current = tituloLista;
        totalizadorRef.current = totalizador;
        itemsRef.current = items;
        itemModalRef.current = itemModal;
        setFilteredData(items);
    }, [tituloLista, totalizador, items, itemModal]);

    useFocusEffect(
        useCallback(() => {
            const loadItens = async () => {
                try {
                    var lista = await listaRepository.getById(route.params.id);
                    setTituloLista(lista.titulo);
                    setTotalizador(maskCurrency(lista.total));
                    setIdLista(lista.id);

                    var itens: ItemLista[] = [];
                    var itensEntity = await itemListaRepository.getAllByListaId(route.params.id);
                    for (let index = 0; index < itensEntity.length; index++) {
                        var item = itensEntity[index];

                        var itemLista = new ItemLista(item.descricao, item.informarPeso, !item.informarPeso ? maskCurrency(item.valor) : '0,00', maskCurrency(item.valorTotal), !item.informarPeso ? item.quantidade.toString() : '0', item.informarPeso ? maskCurrency(item.valorKg) : '0,00', item.informarPeso ? floatParaStringValor(item.peso) : '0');

                        itemLista.localId = index;
                        itens.push(itemLista);
                    }

                    setNextLocalId(itensEntity.length + 1);
                    setItems(itens);
                } catch (error) {
                    console.error('erro ao carregar itens');
                    throw error;
                }
            };

            if (route.params.edit) {
                loadItens();
            }
            return () => {
                //console.log('Tela perdeu o foco');
            };
        }, [])
    );

    const [menuVisible, setMenuVisible] = useState(false);
    const showMenu = () => setMenuVisible(true);
    const hideMenu = () => setMenuVisible(false);

    const handleOptionSelect = (option) => {
        if (option == 1) {
            salvarLista();
        }

        if (option == 2) {
            recalcularTotalizador(itemsRef.current);
            Alert.alert("Sucesso", "Totalizador recalculado");
        }
        hideMenu();
    };

    const openModal = () => {
        setModalVisible(true);
    };

    const adicionarItem = () => {
        setItemModal(ItemLista.New());
        openModal();
    }

    const editarItem = (itemLista: ItemLista) => {
        itemLista.informarPeso = itemLista.peso != '0';
        setItemModal(itemLista);
        openModal();
    }

    const closeModal = () => {
        setModalVisible(false);
    };

    const onCancelModal = () => {
        closeModal();
    }

    const novoIdLocal = () => {
        setNextLocalId(nextLocalId + 1);
        return nextLocalId;
    }

    const onChangeSearch = (query) => {
        setSearchQuery(query);
        const newData = items.filter(item =>
            item.descricao.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredData(newData);
    };

    // React.useLayoutEffect(() => {
    //     navigation.setOptions({
    //         headerRight: () => (
    //             <Button
    //                 onPress={salvarLista}
    //                 title="Salvar"
    //                 color='#70e8c4'
    //             />
    //         ),
    //     });
    // }, [navigation]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <Appbar.Header>
                    <Appbar.Content title="Lista" />
                    <Menu
                        visible={menuVisible}
                        onDismiss={hideMenu}
                        anchor={<Appbar.Action icon="dots-vertical" onPress={showMenu} />}
                        style={{ marginTop: 80 }}
                    >
                        <Menu.Item onPress={() => handleOptionSelect(1)} title="Salvar" />
                        <Menu.Item onPress={() => handleOptionSelect(2)} title="Recalcular totalizador" />
                        {/* <Menu.Item onPress={() => handleOptionSelect('Opção 3')} title="Opção 3" /> */}
                    </Menu>
                </Appbar.Header>
            ),
        });
    }, [navigation, menuVisible]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (saindoAposSalvar.current) {
                return;
            }

            e.preventDefault();
            Alert.alert(
                'Sair da tela',
                'Deseja realmente sair? Todo o progresso será perdido',
                [
                    { text: 'Não', style: 'cancel', onPress: () => { } },
                    {
                        text: 'Sim',
                        style: 'destructive',
                        onPress: async () => navigation.dispatch(e.data.action),
                    },
                ]
            );
        });

        return unsubscribe;
    }, [navigation]);

    const salvarLista = async () => {
        if (tituloListaRef.current == undefined || tituloListaRef.current.length == 0) {
            alert("Necessário informar titulo.");
            return;
        }

        var lista = new ListaEntity();
        lista.titulo = tituloListaRef.current;
        lista.total = stringValorParaFloat(totalizadorRef.current);

        if (route.params.edit) {
            lista.id = idLista;
            await atualizarLista(lista);
            saindoAposSalvar.current = true;
            navigation.navigate('Listas');
            return;
        }

        var id = await listaRepository.insertLista(lista);
        if (id != undefined || id > -1) {
            var itens = MapearListaItensParaEntity();
            await itemListaRepository.insertItensLista(itens, id);
        }

        saindoAposSalvar.current = true;
        navigation.navigate('Listas');
    };


    async function atualizarLista(lista: ListaEntity) {
        await listaRepository.update(lista);
        var itens = MapearListaItensParaEntity();
        await itemListaRepository.insertItensLista(itens, idLista);
    };

    function MapearListaItensParaEntity() {
        var itens: ItemListaEntity[] = [];

        itemsRef.current.forEach(x => {
            itens.push({
                descricao: x.descricao,
                informarPeso: x.informarPeso,
                valor: !x.informarPeso ? stringValorParaFloat(x.valor) : null,
                valorTotal: stringValorParaFloat(x.valorTotal),
                quantidade: !x.informarPeso ? parseInt(x.quantidade) : null,
                valorKg: x.informarPeso ? stringValorParaFloat(x.valorKg) : null,
                peso: x.informarPeso ? stringValorParaFloat(x.peso) : null,
                id: null,
                criadoEm: null,
                removed: false,
                listaId: null
            });
        });

        return itens;
    }

    const onSubmitedModal = (item: ItemLista, editando: boolean) => {
        var totalizadorAtualizado = stringValorParaFloat(totalizadorRef.current);

        if (!editando) {
            item.localId = novoIdLocal();
            setItems([...items, item]);
        } else {
            var valorAnterior = stringValorParaFloat(items.filter(x => x.localId == item.localId)[0].valorTotal);
            totalizadorAtualizado = totalizadorAtualizado - valorAnterior;
            var novaLista = items.filter(x => x.localId != item.localId);
            novaLista.push(item);
            novaLista.sort((a, b) => a.localId - b.localId);
            setItems(novaLista);
        }
        setTotalizador(maskCurrency(totalizadorAtualizado + stringValorParaFloat(item.valorTotal)));
        closeModal();
    }

    async function removerItemLista(localId: any) {
        var novaLista = items.filter(x => x.localId != localId);
        setItems(novaLista);
        recalcularTotalizador(novaLista);
    }

    function recalcularTotalizador(lista: ItemLista[]) {
        var total = 0;
        lista.forEach(x => {
            total += stringValorParaFloat(x.valorTotal)
        });

        setTotalizador(maskCurrency(total));
    }

    function obterItensLista({ item }: { item: ItemLista }) {
        return (

            <ListItem
                key={item.localId}
                bottomDivider
                onPress={() => editarItem(item)}
                onLongPress={() => {
                    Alert.alert(
                        'Remover',
                        'Deseja remover o item?',
                        [
                            { text: 'Não', style: 'cancel', onPress: () => { } },
                            {
                                text: 'Sim',
                                style: 'destructive',
                                onPress: async () => await removerItemLista(item.localId),
                            },
                        ],
                        { cancelable: true }
                    );
                }}>
                <ListItem.Content>
                    <ListItem.Title><Text>{String(item.descricao)}</Text></ListItem.Title>
                    <ListItem.Subtitle><Text>{item.informarPeso
                        ? `${String(item.valorKg)} x ${String(item.peso)} = ${String(item.valorTotal)}`
                        : `${String(item.valor)} x ${String(item.quantidade)} = ${String(item.valorTotal)}`
                    }</Text></ListItem.Subtitle>

                </ListItem.Content>

            </ListItem>)
    }

    return (
        <View style={styles.view}>
            <View style={styles.totalizador}>
                <Text style={styles.text_totalizador}>
                    Total:{totalizador}
                </Text>
            </View>
            <Searchbar
                placeholder="Buscar"
                onChangeText={onChangeSearch}
                value={searchQuery}
                style={{ marginBottom: 20, marginTop: 10 }}
            />
            <TextInput
                keyboardType="default"
                selectionColor={'black'}
                mode={'outlined'}
                label={'Titulo'}
                onChangeText={(value) => setTituloLista(value)}
                value={tituloLista}
            />
            <View style={styles.flatListView}>
                <FlatList
                    keyExtractor={list => String(list.localId)}
                    //data={items}
                    data={filteredData}
                    renderItem={obterItensLista}
                />
            </View>
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={adicionarItem}>
                    <Text style={styles.label}>Adicionar</Text>
                </TouchableOpacity>
                <ItemListaModal visible={modalVisible} item={itemModal} onSend={onSubmitedModal} onCancel={onCancelModal} />
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    flatListView: {
        height: '65%'
    },
    text_totalizador: {
        fontSize: 20,
        textAlign: 'right'
    },
    totalizador: {
        width: '100%',
        height: 30,
        marginTop: 10,
        paddingEnd: 10
    },
    view: {
        width: '100%',
        height: '100%'
    },
    container: {
        marginTop: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    label: {
        textAlign: 'center',
        fontSize: 20
    },
    button: {
        width: '80%',
        backgroundColor: Colors.dark.tint,
        marginTop: 70,
        padding: 15,
        borderWidth: 2,
        borderColor: Colors.light.tint,
        borderRadius: 30
    }
});