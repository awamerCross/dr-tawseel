import React from "react";
import Toast from "react-native-tiny-toast";
import Colors from "../consts/Colors";
import { Dimensions } from "react-native";


const { width } = Dimensions.get('window')
const Toaster = (message) => {
    return Toast.show(message, {
        position: Toast.position.CENTER,
        containerStyle: {
            backgroundColor: "rgba(220,220,221,.85)",
            paddingHorizontal: width * 0.05,
            borderRadius: 20,
        },
        textColor: Colors.fontNormal,
        textStyle: {
            fontFamily: "flatMedium",
            fontSize: width * 0.04,
        },
        duration: 2000,
    });
};

export { Toaster };
