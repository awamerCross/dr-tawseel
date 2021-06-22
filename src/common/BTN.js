import React from 'react'
import { TouchableOpacity, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import Colors from '../consts/Colors'

function BTN({
    title,
    onPress,
    TextStyle,
    ContainerStyle,
    disable,
    spinner
}) {
    return (
        <TouchableOpacity disabled={disable} style={[styles.container, ContainerStyle]} onPress={onPress}>
            {
                spinner ?
                    <ActivityIndicator color={Colors.bg} size={'large'} />
                    :
                    <Text style={[styles.sText, TextStyle]}>
                        {title}
                    </Text>
            }
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.sky,
        width: '90%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 13,
        marginTop: 15
    },
    sText: {
        fontFamily: 'flatMedium',
        color: Colors.bg,
        fontSize: 17,
        textAlign: 'center',
    }
})
export default BTN
