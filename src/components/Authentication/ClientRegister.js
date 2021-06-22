import React, { useState, useEffect } from 'react'
import { View, Text, Dimensions, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, } from 'react-native'
import Constants from "expo-constants";

import {
    validatePhone,
    validatePassword,
    validateEmail,
    validateUserName,
    validateTwoPasswords,
    agreePolicy
} from "../../common/Validation";

import LogoLogin from '../../common/LogoLogin'
import { InputIcon } from '../../common/InputText';
import Colors from '../../consts/Colors'
import BTN from '../../common/BTN';
import { Toaster } from '../../common/Toaster';
import { SText } from '../../common/SText';
import { CheckBox } from 'native-base';
import i18n from "../locale/i18n";
import { useDispatch, useSelector } from 'react-redux';
import { UserRegister } from '../../actions/AuthAction';
import { ToasterNative } from '../../common/ToasterNatrive';

const { width } = Dimensions.get('window')
function ClientRegister({ navigation, route }) {

    const { userType } = route.params;
    const lang = useSelector(state => state.lang.lang);


    const [name, setName] = useState('');
    const [phone, setPhone] = useState("");
    const [email, setemail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [spinner, setSpinner] = useState(false);
    const [isSelected, setSelection] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const dispatch = useDispatch();

    const _validate = () => {
        let nameErr = validateUserName(name)
        let phoneErr = validatePhone(phone);
        let passwordErr = validatePassword(password);
        let emailErr = validateEmail(email)
        let twoPass = validateTwoPasswords(password, confirmPassword)
        let policyValid = agreePolicy(isSelected)

        return nameErr || phoneErr || passwordErr || emailErr || twoPass || policyValid
    };

    const SubmitLoginHandler = () => {
        const isVal = _validate();
        if (!isVal) {
            setSpinner(true)
            dispatch(UserRegister(name, phone, password, email, userType, lang, navigation)).then(() => setSpinner(false))

        }
        else {
            setSpinner(false)
            ToasterNative(_validate(), 'danger', 'bottom')
        }
    }


    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{ flex: 1 }}>

            <ScrollView style={styles.container}>
                <LogoLogin navigation={navigation} />
                <Text style={[styles.sText,]}>{i18n.t("createAcc")}</Text>
                <View style={{ marginTop: 30 }}>
                    <InputIcon
                        label={i18n.t("username")}
                        onChangeText={(e) => setName(e)}
                        value={name}
                        LabelStyle={{ paddingHorizontal: 10 }}
                    />
                    <InputIcon
                        label={i18n.t('phone')}
                        onChangeText={(e) => setPhone(e)}
                        value={phone}
                        keyboardType='phone-pad'
                        LabelStyle={{ paddingHorizontal: 10 }}
                        styleCont={{ marginTop: 15 }}

                    />
                    <InputIcon
                        label={i18n.t('email')}
                        onChangeText={(e) => setemail(e)}
                        value={email}
                        keyboardType='email-address'
                        LabelStyle={{ paddingHorizontal: 10 }}
                        styleCont={{ marginTop: 15 }}
                    />

                    <InputIcon
                        label={i18n.t('password')}
                        onChangeText={(e) => setPassword(e)}
                        value={password}
                        secureTextEntry={!showPass}
                        styleCont={{ marginTop: 15 }}
                        LabelStyle={{ paddingHorizontal: 10 }}
                        image={require('../../../assets/images/view.png')}
                        onPress={() => setShowPass(!showPass)}
                    />

                    <InputIcon
                        label={i18n.t('confirmPass')}
                        onChangeText={(e) => setConfirmPassword(e)}
                        value={confirmPassword}
                        secureTextEntry={!showConfirmPass}
                        styleCont={{ marginTop: 15 }}
                        LabelStyle={{ paddingHorizontal: 10 }}
                        image={require('../../../assets/images/view.png')}
                        onPress={() => setShowConfirmPass(!showConfirmPass)}
                    />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                    <CheckBox checked={isSelected} color={isSelected ? Colors.sky : '#DBDBDB'} style={{ backgroundColor: isSelected ? Colors.sky : '#DBDBDB', width: 17, height: 17, paddingBottom: 15, marginHorizontal: 10 }} onPress={() => setSelection(!isSelected)} />
                    <SText title={i18n.t("policy")} style={{ paddingVertical: 10, color: Colors.sky, marginLeft: 5, marginHorizontal: 10 }} onPress={() => navigation.navigate('politics', { typeName: 'Register' })} />
                </View>

                <BTN title={i18n.t('createAcc')} onPress={SubmitLoginHandler} spinner={spinner} />

                <View style={styles.WrapText}>
                    <Text style={styles.Text}>{i18n.t("haveAcc")}</Text>
                    <SText title={i18n.t("clickHere")} style={{ paddingTop: 0, color: Colors.sky, marginLeft: 5 }} onPress={() => navigation.navigate('Login')} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg,
        // paddingTop: Constants.statusBarHeight,
        width
    },
    Text: {
        fontFamily: 'flatMedium',
        color: '#A8A8A8',
        fontSize: 12
    },
    sText: {
        textAlign: 'center',
        fontFamily: 'flatMedium',
        color: Colors.sky,
        fontSize: 18,
        marginTop: 20
    },
    WrapText: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    checkboxContainer: {
        flexDirection: "row",
        justifyContent: 'center'

    },
    building: {
        width,
        height: 100,
        marginTop: 20,
    },
    checkbox: {
        alignSelf: "center",
    },

})
export default ClientRegister
