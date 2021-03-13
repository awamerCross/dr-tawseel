import React, { useState } from 'react'
import { ScrollView, View, Image, StyleSheet, Dimensions, Text, I18nManager, Platform } from 'react-native'
import Colors from '../../consts/Colors';
import { InputIcon } from '../../common/InputText';
import BTN from '../../common/BTN';
import { validateUserName, validatePhone, validateEmail } from '../../common/Validation';
import { Toaster } from '../../common/Toaster';
import i18n from "../../components/locale/i18n";
import { useSelector, useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import RNPickerSelect from 'react-native-picker-select';
import { Label } from 'native-base';
import { WebView } from "react-native-webview";

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

const isIOS = Platform.OS === 'ios';

function PersonalProfile({ navigation }) {

    const cities = useSelector(state => state.Cities.cities)
    let cityName = cities.map(city => ({ label: city.name, value: city.id }));
    const lang = useSelector(state => state.lang.lang);
    const user = useSelector(state => state.Auth ? state.Auth.user ? state.Auth.user.data : null : null)

    const dispatch = useDispatch();

    const askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);

    };

    return (
        user ?
            <WebView
                source={{ uri: 'https://drtawsel.aait-sa.com/update-delegate/' + user.id + '/' + lang }}
                style={{ flex: 1, width: '100%', height: '100%' }}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={false}
                scrollEnabled={true}
                javaScriptEnabled={true}
            // onNavigationStateChange={(state) => _onLoad(state, navigation)}
            />
            : null
    )
}


const styles = StyleSheet.create({

    ImgsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: 20
    },
    images: {
        width: 50,
        height: 50,
        borderRadius: 200,

    },
    stext: {
        fontFamily: 'flatMedium',
        color: Colors.sky,
        fontSize: width * .035
    },
    inputPicker: {
        paddingRight: 17,
        paddingLeft: isIOS ? 10 : 15,
        height: width * .15,
        flex: 1,
        justifyContent: "flex-end",
        borderWidth: 1,
        borderRadius: 5,
        color: Colors.fontNormal,
        textAlign: I18nManager.isRTL ? "right" : "left",
        fontFamily: "flatMedium",
        fontSize: 13,
        marginTop: 15,
        marginBottom: 10
    }
    , flexCenter: {
        alignSelf: 'center',
    },
    label: {
        left: 9,
        paddingRight: 10,
        paddingLeft: 10,
        alignSelf: 'flex-start',
        fontFamily: 'flatMedium',
        fontSize: 14,
        zIndex: 10,
        position: 'absolute',
        backgroundColor: '#fff'
    },

})
export default PersonalProfile
