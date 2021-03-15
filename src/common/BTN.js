import React from 'react'
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native'
import Colors from '../consts/Colors'

function BTN({
    title,
    onPress,
    TextStyle,
    ContainerStyle, disable
}) {
    return (
        <TouchableOpacity disable={disable} style={[styles.container, ContainerStyle]} onPress={onPress}>
            <Text style={[styles.sText, TextStyle]}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.sky,
        width: '85%',
        alignSelf: 'center',
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        padding: 15
    },
    sText: {
        fontFamily: 'flatMedium',
        color: Colors.bg,
        fontSize: 16,
        textAlign: 'center',
    }
})
export default BTN