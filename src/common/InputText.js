import React, { useState } from "react";
import { View, StyleSheet, TextInput, I18nManager, Image, Dimensions, Text, TouchableOpacity, Platform } from "react-native";
import Colors from "../consts/Colors";
import { Right } from "native-base";


const { width } = Dimensions.get('window')

const InputIcon = ({
    KeyboardStyle,
    label,
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
    ...props
}) => {

    const [focused, setFocused] = useState(false);

    return (

        <View style={[styles.containerTableTextOverInput, styleCont]}>
            <Text style={[styles.labelText,
            {
                color: focused || value ? Colors.sky : Colors.fontNormal, paddingHorizontal: 10, fontSize: 13,
                bottom: focused || value ? width * .13 : null
            }, LabelStyle
            ]}  >
                {label}
            </Text>

            <TextInput
                style={[styles.textInput, { borderColor: focused || value ? Colors.sky : Colors.fontNormal }, inputStyle]}
                value={value}
                onChangeText={onChangeText}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                {...props}
                placeholder={placeholder}
                editable={editable}


            />
            <TouchableOpacity onPress={onPress} style={{ position: 'absolute', alignSelf: 'flex-end', marginTop: 15, alignItems: 'center', right: 5 }}>
                <Image source={image} style={[styles.image, imgStyle]} resizeMode='contain' />
            </TouchableOpacity>
        </View>


    );
};
export { InputIcon };

const styles = StyleSheet.create({

    containerTableTextOverInput: {
        height: width * .15,
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
    textInput: {
        flex: 1,
        justifyContent: "flex-end",
        paddingHorizontal: 25,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 5,
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