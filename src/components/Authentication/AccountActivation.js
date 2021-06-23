import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, Dimensions, ScrollView, Image, TouchableOpacity, Linking } from 'react-native'
import Constants from "expo-constants";

import LogoLogin from '../../common/LogoLogin'
import { InputIcon } from '../../common/InputText';
import BTN from '../../common/BTN';
import Colors from '../../consts/Colors';
import { validateCode } from "../../common/Validation";
import i18n from "../locale/i18n";
import CountDown from 'react-native-countdown-component';
import { useDispatch, useSelector } from 'react-redux';
import { ActivationCode, resendCode } from '../../actions/AuthAction';
import LoadingBtn from '../../common/Loadbtn';
import { ToasterNative } from '../../common/ToasterNatrive';
import { useIsFocused } from '@react-navigation/native';
import { getAppInfo } from '../../actions';
import { SText } from '../../common/SText';

const { width } = Dimensions.get('window')

function AccountActivation({ navigation, route }) {
    const { token } = route.params;
    const lang = useSelector(state => state.lang.lang);
    const [spinner, setSpinner] = useState(false);
    const [showCounter, setShowCounter] = useState(true);
    const [counterID, setCounterID] = useState(1);

    const [code, setcode] = useState("");
    const MyactivateCode = 1122;

    const _validate = () => {


        let codeErr = validateCode(code);
        return codeErr
    };

    const isFocused = useIsFocused();
    const dispatch = useDispatch()
    const appInfo = useSelector(state => state.appInfo.appInfo);

    useEffect(() => {
        if (isFocused) {
            setcode('')
            dispatch(getAppInfo(lang));

        }
    }, [isFocused])


    const SubmitLoginHandler = () => {
        const isVal = _validate();

        if (!isVal) {
            setSpinner(true)
            dispatch(ActivationCode(code, token, lang, navigation, route.params)).then(() => setSpinner(false))
        }
        else {
            setSpinner(false)
            ToasterNative(_validate(), 'danger', 'bottom')
        }
    }

    function sendNewCode() {
        setCounterID(counterID + 1);
        setShowCounter(true);
        dispatch(resendCode(lang, token))
    }

    return (
        <ScrollView style={styles.container}>
            <LogoLogin navigation={navigation} />
            <View style={{ marginTop: 30 }} >
                <Text style={styles.sText}>{i18n.t("activateAcc")}</Text>

                {
                    showCounter ?
                        <>
                            <Text style={styles.Text}>{i18n.t("sentCode")}</Text>
                            <CountDown
                                id={counterID}
                                until={60 * 2}
                                size={20}
                                onFinish={() => { setShowCounter(false); }}
                                digitStyle={{ backgroundColor: '#FFF' }}
                                digitTxtStyle={{ color: Colors.sky }}
                                timeLabelStyle={{ color: 'red', fontWeight: 'bold' }}
                                separatorStyle={{ color: Colors.sky }}
                                timeToShow={['M', 'S']}
                                timeLabels={{ m: null, s: null }}

                                showSeparator={true}
                            />
                        </> :
                        <TouchableOpacity onPress={() => sendNewCode()}>
                            <Text style={styles.Text}>{i18n.t("resendCode")}</Text>
                        </TouchableOpacity>
                }

                <View style={{ marginTop: 20 }}>
                    <InputIcon
                        label={i18n.t("activationCode")}
                        onChangeText={(e) => setcode(e)}
                        value={code}
                        LabelStyle={{ paddingHorizontal: 10 }}
                        keyboardType='numeric'
                    />

                    <BTN title={i18n.t("confirm")} onPress={SubmitLoginHandler} ContainerStyle={{ marginTop: 20 }} spinner={spinner} />
                </View>
                {/* <View style={[styles.WrapText, { marginTop: 30 }]}>
                    <Image source={require('../../../assets/images/whatsapp.png')} style={{ width: 20, height: 20 }} resizeMode='contain' />
                    <SText title={i18n.t("broblem")} style={{ paddingTop: 0, color: Colors.IconBlack, fontFamily: 'flatLight', marginLeft: 5 }} onPress={() => Linking.openURL(`https://api.whatsapp.com/send?phone=${appInfo.whatapp}`)} />
                </View> */}
            </View>
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
        fontSize: 20,
        marginTop: 20
    },
    Text: {
        textAlign: 'center',
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: 13,
        marginTop: 10
    },
    building: {
        width,
        height: 100,
    },
    WrapText: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 }

})
export default AccountActivation
