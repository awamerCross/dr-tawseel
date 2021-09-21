import React, { useState, Fragment } from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, KeyboardAvoidingView, Platform } from 'react-native'


import Colors from '../../consts/Colors';
import { InputIcon } from '../../common/InputText';
import BTN from '../../common/BTN';
import { useSelector, useDispatch } from 'react-redux';
import { validateAccountNum, valdiateMoney, validateBankName, validateUserName } from '../../common/Validation';
import * as ImagePicker from 'expo-image-picker';

import i18n from "../locale/i18n";
import Header from '../../common/Header';
import { SendTransferFromACc } from '../../actions/Wallet';
import Container from '../../common/Container';
import { ToasterNative } from '../../common/ToasterNatrive';

const { width, height } = Dimensions.get('window')

function BankDataTransfer({ navigation, route }) {

    const { BankId } = route.params
    const [Bankname, setName] = useState('');
    const [STcAcc, setSTcAcc] = useState('');
    const [iban, setiban] = useState('');


    const [accountNAme, setAcoountname] = useState("");
    const [accountnum, setAccountnum] = useState('');
    const [money, setMoney] = useState('');
    const user = useSelector(state => state.Auth?.user?.data)
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null)
    const lang = useSelector(state => state.lang.lang);
    const [base64, setBase64] = useState('');
    const [userImage, setUserImage] = useState(null);

    const _validate = () => {
        let BanknameErr = validateBankName(Bankname)
        let AccountnameErr = validateUserName(accountNAme)
        let accountnumErr = validateAccountNum(accountnum)
        let moneyErr = valdiateMoney(money)
        let ImageErr = base64 == '' ? i18n.t('choosePic') : null

        return BanknameErr || AccountnameErr || accountnumErr || moneyErr || ImageErr
    };

    const [spinner, setSpinner] = useState(false);
    const dispatch = useDispatch();

    const _pickImage = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,

            base64: true,
            aspect: [4, 3],
            quality: .5,
        });

        if (!result.cancelled) {
            setUserImage(result.uri);
            setBase64(result.base64);
        }
    };


    const SubmitHandler = () => {
        const isVal = _validate();
        if (!isVal) {
            setSpinner(true)
            dispatch(SendTransferFromACc(token, lang, BankId, base64, Bankname, accountNAme, accountnum, money, iban, STcAcc, navigation)).then(() => setSpinner(false))
            setAccountnum('')
            setAcoountname('')
            setName('')
            setMoney('')
            setUserImage(null)
            setBase64('')

        }
        else {
            setSpinner(false)

            ToasterNative(_validate(), 'danger', 'bottom');
        }
    }





    return (
        <Container loading={spinner}>

            <View style={{ flex: 1, backgroundColor: Colors.bg }}>
                <Header navigation={navigation} label={i18n.t('Banktransfer')} />
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{ flex: 1 }}>
                    <ScrollView style={{ flex: 1 }}>
                        <TouchableOpacity onPress={_pickImage}>
                            {
                                userImage == null ?
                                    <Image source={require('../../../assets/images/plus.png')} style={{ width: 50, height: 50, marginTop: 30, alignSelf: 'center', borderRadius: 50 }} resizeMode='contain' />
                                    :
                                    <Image source={{ uri: userImage }} style={{ width: 100, height: 100, marginTop: 30, alignSelf: 'center', borderRadius: 50 }} resizeMode='contain' />

                            }
                        </TouchableOpacity>
                        <Text style={{ fontSize: 14, color: Colors.IconBlack, fontFamily: 'flatMedium', textAlign: 'center', marginTop: 20 }}> {i18n.t('Bankpicture')}</Text>
                        <InputIcon
                            label={i18n.t("bankname")}
                            placeholder={i18n.t("bankname")}
                            value={Bankname}
                            onChangeText={(e) => setName(e)}
                            styleCont={{ marginTop: 20, }}
                            inputStyle={{ borderRadius: 25 }}

                        />

                        {
                            user.user_type == 3 ?
                                <Fragment>
                                    <InputIcon
                                        label={i18n.t("StcAcc")}
                                        placeholder={i18n.t("StcAcc")}
                                        value={STcAcc}
                                        onChangeText={(e) => setSTcAcc(e)}
                                        styleCont={{ marginTop: 20, }}
                                        inputStyle={{ borderRadius: 25 }}
                                    />

                                    <InputIcon
                                        label={i18n.t("iban")}
                                        placeholder={i18n.t("iban")}
                                        value={iban}
                                        onChangeText={(e) => setiban(e)}
                                        styleCont={{ marginTop: 10 }}
                                        inputStyle={{ borderRadius: 25 }}
                                        keyboardType='numeric'


                                    />
                                </Fragment>
                                : null
                        }

                        <InputIcon
                            label={i18n.t("AccountUser")}
                            placeholder={i18n.t("AccountUser")}
                            value={accountNAme}
                            onChangeText={(e) => setAcoountname(e)}
                            styleCont={{ marginTop: 10 }}
                            inputStyle={{ borderRadius: 25 }}

                        />

                        <InputIcon
                            label={i18n.t("Accnum")}
                            placeholder={i18n.t("Accnum")}
                            value={accountnum}
                            onChangeText={(e) => setAccountnum(e)}
                            styleCont={{ marginTop: 10 }}
                            inputStyle={{ borderRadius: 25 }}
                            keyboardType='numeric'

                        />
                        <InputIcon
                            label={i18n.t("moneyPaied")}
                            placeholder={i18n.t("moneyPaied")}
                            value={money}
                            onChangeText={(e) => setMoney(e)}
                            styleCont={{ marginTop: 10 }}
                            inputStyle={{ borderRadius: 25 }}
                            keyboardType='numeric'

                        />
                        <BTN title={i18n.t("confirm")} onPress={SubmitHandler} ContainerStyle={{ marginVertical: width * .1, borderRadius: 5 }} TextStyle={{ fontSize: 16, }} />
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Container>



    )


}
const styles = StyleSheet.create({
    BigImg: {
        height: height * .15,
        width: width * .22,
    },
    MenueImg: {
        width: 20,
        height: 20,


    },
    Text: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: width * .04,
        textAlign: 'center',
        top: width * .19
    },
    BAImage: {
        width: '100%',
        height: height * .26,
        borderRadius: 20,

    },
    textB: {
        fontSize: width * .03,
        color: Colors.bg,
        fontFamily: 'flatMedium',
        marginTop: 10
    }
})

export default BankDataTransfer
