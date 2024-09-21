import React, { useCallback, useEffect, useState } from 'react'
import { Text, FlatList, SafeAreaView, View, Alert } from 'react-native'
import { ListItem } from 'react-native-elements';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import FloatingButton from '../components/floatingButton';
import { ListaRepository } from '../database/listaRepository';
import { ListaEntity } from '../entities/listaEntity';
import { maskCurrency } from '../utils/mask.utils';
import { formatarData } from '../utils/date.utils';
import { ItemListaRepository } from '../database/itemListaRepository';

export const SavedLists = ({ navigation }) => {

    const itemListaRepository = ItemListaRepository();
    const listaRepository = ListaRepository();
    const [listas, setListas] = useState<ListaEntity[]>([]);


    useFocusEffect(
        useCallback(() => {
            // Código a ser executado quando a tela for acessada
            const loadListas = async () => {
                try {
                    const result = await listaRepository.getAll();
                    setListas(result);


                    // var lista = result[result.length - 1];

                    // const itens = await itemListaRepository.getAllByListaId(lista.id);
                } catch (error) {
                    console.error('Erro ao buscar listas', error);
                }
            };

            loadListas();
            return () => {
                //console.log('Tela perdeu o foco');
            };
        }, [])
    );

    // useEffect(() => {

    // }, []);

    function getListData({ item }: { item: ListaEntity }) {
        return (
            <ListItem
                key={item.id}
                bottomDivider
                onPress={() => editList(item)}
                onLongPress={() => {
                    Alert.alert(
                        'Remover',
                        'Deseja realmente excluir a lista? Isso não pode ser desfeito',
                        [
                            { text: 'Não', style: 'cancel', onPress: () => { } },
                            {
                                text: 'Sim',
                                style: 'destructive',
                                onPress: async () => await removerLista(item.id),
                            },
                        ],
                        { cancelable: true }
                    );
                }}
            >
                <ListItem.Content>
                    <ListItem.Title>{item.titulo}</ListItem.Title>
                    <ListItem.Subtitle><Text>{formatarData(item.alteradoEm)}</Text></ListItem.Subtitle>
                    <ListItem.Subtitle>Total: {maskCurrency(item.total)}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        )
    }

    async function removerLista(id: number) {
        await itemListaRepository.removeAllFromLista(id);
        await listaRepository.remove(id);
        const result = await listaRepository.getAll();
        setListas(result);
    }

    function editList(item: ListaEntity) {
        navigation.navigate('Lista', { id: item.id, edit: true });
    }

    function newList() {
        navigation.navigate('Lista', { edit: false });
    }

    return (
        <View style={{ height: '100%' }}>
            <FlatList
                keyExtractor={list => list.id.toString()}
                data={listas}
                renderItem={getListData}
            />
            <FloatingButton onButtonPress={newList} />
        </View>
    )
}