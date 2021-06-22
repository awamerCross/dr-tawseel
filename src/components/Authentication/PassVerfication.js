import React, { useState, useEffect } from 'react'
import { View, Text, Dimensions, StyleSheet, ScrollView, Image, Linking, KeyboardAvoidingView, Platform } from 'react-native'
import Constants from "expo-constants";


import LogoLogin from '../../common/LogoLogin'
import { InputIcon } from '../../common/InputText';
import Colors from '../../consts/Colors'
import BTN from '../../common/BTN';
import {
    validatePassword,
    validateCode,
    validateTwoPasswords,
} from "../../common/Validation";
import i18n from "../locale/i18n";
import { useDispatch, useSelector } from 'react-redux';
import { ResetPassword } from '../../actions/AuthAction';
import LoadingBtn from '../../common/Loadbtn';
import { ToasterNative } from '../../common/ToasterNatrive';
import { getAppInfo } from '../../actions';
import { SText } from '../../common/SText';
import { useIsFocused } from '@react-navigation/native';

const { width } = Dimensions.get('window')
function PassVerfication({ navigation, route }) {


    const [code, setcode] = useState('');
    const [password, setPassword] = useState('');
    const [nPassword, setnPassword] = useState('')
    const [showPass, setShowPass] = useState(false);
    const [showConPass, setShowConPass] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const { token } = route.params
    const MyactivateCode = 1122;


    const isFocused = useIsFocused();
    const dispatch = useDispatch()
    const lang = useSelector(state => state.lang.lang);
    const appInfo = useSelector(state => state.appInfo.appInfo);

    useEffect(() => {
        if (isFocused) {
            dispatch(getAppInfo(lang));

        }
    }, [isFocused])

    const _validate = () => {

        let isValid = MyactivateCode == code;
        let codeErr = validateCode(code);
        let passwordErr = validatePassword(password);
        let passConfirmErr = validateTwoPasswords(password, nPassword)

        return codeErr || passwordErr || passConfirmErr;
    };

    const SubmitLoginHandler = () => {
        const isVal = _validate();
        if (!isVal) {
            setSpinner(true)
            dispatch(ResetPassword(password, code, token, navigation)).then(() => setSpinner(false))
        }
        else {
            setSpinner(false)
            ToasterNative(_validate(), 'danger', 'botoom');
        }
    }



    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <LogoLogin navigation={navigation} />
                <Text style={styles.sText}>{i18n.t("passRecovery")}</Text>
                <InputIcon
                    label={i18n.t("code")}
                    onChangeText={(e) => setcode(e)}
                    value={code}
                    LabelStyle={{ paddingHorizontal: 10 }}
                    keyboardType='numeric'
                    styleCont={{ marginTop: 25 }}
                />

                <InputIcon
                    label={i18n.t("newpass")}
                    onChangeText={(e) => setPassword(e)}
                    value={password}
                    secureTextEntry={!showPass}
                    LabelStyle={{ paddingHorizontal: 10 }}
                    styleCont={{ marginTop: 15 }}
                    image={require('../../../assets/images/view.png')}
                    onPress={() => setShowPass(!showPass)}
                />

                <InputIcon
                    label={i18n.t("confirmPass")}
                    onChangeText={(e) => setnPassword(e)}
                    value={nPassword}
                    secureTextEntry={!showConPass}
                    LabelStyle={{ paddingHorizontal: 10 }}
                    styleCont={{ marginTop: 15 }}
                    image={require('../../../assets/images/view.png')}
                    onPress={() => setShowConPass(!showConPass)}
                />
                <BTN title={i18n.t("send")} onPress={SubmitLoginHandler} spinner={spinner} />

                <View style={[styles.WrapText, { marginTop: 30 }]}>
                    <Image source={require('../../../assets/images/whatsapp.png')} style={{ width: 20, height: 20 }} resizeMode='contain' />
                    <SText title={i18n.t("broblem")} style={{ paddingTop: 0, color: Colors.IconBlack, fontFamily: 'flatLight', marginLeft: 5 }} onPress={() => Linking.openURL(`https://api.whatsapp.com/send?phone=${appInfo.whatapp}`)} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg,
        width
    },
    WrapText: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 }
    ,
    Text: {
        fontFamily: 'flatMedium',
        color: '#A8A8A8',
        fontSize: 12
    },
    sText: {
        textAlign: 'center',
        fontFamily: 'flatMedium',
        color: Colors.sky,
        fontSize: 14,
        marginTop: 30
    },
    building: {
        width,
        height: 100,
    },
})
export default PassVerfication
