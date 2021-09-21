import React, { useState } from "react";
import { View, StyleSheet, TextInput, I18nManager, Image, Dimensions, Text, TouchableOpacity, Platform } from "react-native";
import Colors from "../consts/Colors";


const { width } = Dimensions.get('window')

const InputTouchable = ({
    KeyboardStyle,
    label,
    labelTexts,
    value,
    onChangeText,
    LabelStyle,
    inputStyle,
    placeholder,
    image,
    styleCont,
    imageFocused,
    onPress,
    imgStyle,
    editable,
    WrapStyle,
    ...props
}) => {


    return (

        <View style={[styles.containerTableTextOverInput, styleCont]} onPress={onPress}>
            <Text style={[styles.labelText, LabelStyle]}    >
                {label}
            </Text>
            <TouchableOpacity style={[styles.Wrap, WrapStyle]} onPress={onPress}>

                <Text style={{ fontFamily: 'flatMedium' }}    >
                    {value}
                </Text>
                <View style={{ alignSelf: 'flex-end', alignItems: 'center', }}>
                    <Image source={image} style={[styles.image, imgStyle, { width: 20, height: 20 }]} resizeMode='contain' />
                </View>
            </TouchableOpacity>


        </View>


    );
};
export { InputTouchable };

const styles = StyleSheet.create({

    containerTableTextOverInput: {
        height: 45,
        position: "relative",
        marginHorizontal: "5%",
        marginVertical: 10,
        justifyContent: 'center',

    },
    labelText: {
        left: 10,
        backgroundColor: Colors.bg,
        alignSelf: "flex-start",
        fontSize: width * .03,
        zIndex: 10,
        position: "absolute",
        fontFamily: 'flatMedium',


    },
    Wrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 25,
        alignItems: 'center',
        paddingStart: 15,
        backgroundColor: '#eaeaea'

    },

    textInput: {
        justifyContent: "flex-end",
        paddingHorizontal: 5,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 15,
        color: Colors.fontNormal,
        textAlign: I18nManager.isRTL ? "right" : "left",
        fontFamily: "flatMedium",
        fontSize: 13,
    },
    image: {
        width: width * 0.04,
        maxWidth: width * 0.12,
        height: width * 0.06,
        maxHeight: width * 0.12,
        resizeMode: "contain",
        marginRight: 10,
        alignSelf: 'center'

    },
});