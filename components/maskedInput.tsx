
import React, { useRef, useState } from 'react';
import { TextInput } from 'react-native-paper';
import { applyMask } from '../utils/mask.utils';

export const MaskedInput = ({ label, value, onChangeText, mode, tamanho = 10, mascara = '', editable = true }) => {

    const handleChange = (text) => {
        if (editable == false) {
            onChangeText(text);
            return applyMask(text, mascara);
        }

        var formattedValue = applyMask(text, mascara);
        onChangeText(formattedValue);
    };

    return (
        <TextInput
            editable={editable}
            selectionColor={'black'}
            keyboardType={'numeric'}
            label={label}
            value={value}
            onChangeText={handleChange}
            mode={mode}
            maxLength={tamanho}
        />
    );
};