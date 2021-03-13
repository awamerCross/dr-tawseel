import React, { useState } from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, TouchableWithoutFeedback } from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import Colors from '../../consts/Colors';




const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')
function ShareApp({ navigation }) {
    return (
       <View/>
    )
}
const styles = StyleSheet.create({
    BigImg: {
        height: height * .14,
        width: width * .23,
    },
    MenueImg: {
        width: 18,
        height: 18,
        marginHorizontal: 4,

    },
    Text: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: width * .045,
        textAlign: 'center',
        top: width * .14,

    },
    ImgsContainer: {
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: height * .03
    },
    images: {
        width: width * .4,
        height: width * .4,


    },
    stext: {
        fontFamily: 'flatMedium',
        color: Colors.sky,
        fontSize: width * .05,
        marginTop: height * .05
    },
    lText: { marginTop: 20, paddingHorizontal: 15, fontFamily: 'flatRegular', lineHeight: 20, color: Colors.fontNormal },

})

export default ShareApp
