import React from 'react';
import { View, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Colors } from '../constants/Colors';

const FloatingButton = ({ onButtonPress }) => {
    return (
        // <View style={styles.container}>
        //     <TouchableOpacity style={styles.button} onPress={onButtonPress}>
        //         <Icon name="plus" size={24} color="#fff" />
        //     </TouchableOpacity>
        // </View>
        <TouchableOpacity style={styles.button} onPress={onButtonPress}>
            <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
         position: 'absolute',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        padding: 20
        //paddingTop: '100%',
        //paddingTop:660
    },
    button: {
        position: 'absolute',
        top:'85%',
        //bottom: ,
        left:'80%',
        marginBottom: 37,
        backgroundColor: Colors.light.tint,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    }
});

export default FloatingButton;