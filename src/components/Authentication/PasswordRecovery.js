import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, Dimensions, ScrollView, Image } from 'react-native'
import Constants from "expo-constants";


import LogoLogin from '../../common/LogoLogin'
import { InputIcon } from '../../common/InputText';
import BTN from '../../common/BTN';
import Colors from '../../consts/Colors';
import { Toaster } from '../../common/Toaster';
import { validatePhone, } from "../../common/Validation";
import i18n from "../locale/i18n";
import Container from '../../common/Container';
import { useDispatch, useSelector } from 'react-redux';
import { CheckPhone } from '../../actions/AuthAction';
import LoadingBtn from '../../common/Loadbtn';
import { ToasterNative } from '../../common/ToasterNatrive';

const { width } = Dimensions.get('window')

function PasswordRecovery({ navigation }) {
    const [phone, setPhone] = useState("");
    const [spinner, setSpinner] = useState(false);
    const lang = useSelector(state => state.lang.lang);

    const dispatch = useDispatch()

    const _validate = () => {
        let phoneErr = validatePhone(phone);
        return phoneErr
    };

    const SubmitLoginHandler = () => {
        const isVal = _validate();
        if (!isVal) {
            setSpinner(true)
            dispatch(CheckPhone(lang, phone, navigation)).then(() => setSpinner(false))
        }
        else {
            setSpinner(false)
            ToasterNative(_validate(), 'danger', 'bottom');
        }
    }



    return (

        <ScrollView style={styles.container}>
            <LogoLogin navigation={navigation} />
            <Text style={styles.sText}>{i18n.t("passRecovery")}</Text>
            <InputIcon
                label={i18n.t("phone")}
                onChangeText={(e) => setPhone(e)}
                value={phone}
                styleCont={{ marginTop: 30 }}
                keyboardType='numeric'
            />

            <BTN title={i18n.t("confirm")} onPress={SubmitLoginHandler} spinner={spinner} />

        </ScrollView>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg,
        width
    },
    sText: {
        textAlign: 'center',
        fontFamily: 'flatMedium',
        color: Colors.sky,
        fontSize: 14,
        marginTop: 20
    },
    building: {
        width,
        height: 100,
    },
})
export default PasswordRecovery
