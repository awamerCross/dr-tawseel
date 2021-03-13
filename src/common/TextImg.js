import React from 'react'
import { TouchableOpacity, Text, Image, StyleSheet, Dimensions } from 'react-native'
import Colors from '../consts/Colors';



const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

function TextImg({ image, label, onPress }) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.Touchable}>
            <Image source={image} style={styles.Img} resizeMode='contain' />
            <Text style={styles.TextStyle}>{label}</Text>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    Touchable: {
        flexDirection: "row",
        alignItems: 'center',
        paddingStart: 10,
        paddingVertical: 15

    },
    Img: {
        width: 20,
        height: 20,

    },
    TextStyle: {
        color: Colors.fontBold,
        fontSize: 16,
        fontFamily: "flatMedium",
        paddingHorizontal: 15

    },
});
export default TextImg
