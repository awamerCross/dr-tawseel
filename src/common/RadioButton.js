import React from 'react'
import { View, TouchableOpacity } from 'react-native';
import Colors from '../consts/Colors';

function RadioButton({ selected, contentstyle, onPress }) {
    return (
        <TouchableOpacity onPress={onPress} >
            <View style={[{
                height: 24,
                width: 24,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: selected ? Colors.sky : Colors.fontNormal,
                alignItems: 'center',
                justifyContent: 'center',
            }, contentstyle]}>
                {
                    selected ?
                        <View style={{
                            height: 12,
                            width: 12,
                            borderRadius: 6,
                            backgroundColor: Colors.sky,
                        }} />
                        : null
                }
            </View>
        </TouchableOpacity>
    );
}
export default RadioButton