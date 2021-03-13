import React, { useState } from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, ImageBackground, ActivityIndicator } from 'react-native'
import { DrawerActions } from '@react-navigation/native';


import Colors from '../../consts/Colors';
import { InputIcon } from '../../common/InputText';
import BTN from '../../common/BTN';
import { useSelector, useDispatch } from 'react-redux';
import { validateAccountNum, valdiateMoney, validateBankName, validateUserName } from '../../common/Validation';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Toaster } from '../../common/Toaster';
import i18n from "../locale/i18n";
import Header from '../../common/Header';
import { SendTransferFromACc } from '../../actions/Wallet';
import Container from '../../common/Container';
import { ToasterNative } from '../../common/ToasterNatrive';

const { width, height } = Dimensions.get('window')

function BankDataTransfer({ navigation, route }) {

    const { BankId } = route.params
    const [Bankname, setName] = useState('');
    const [accountNAme, setAcoountname] = useState("");
    const [accountnum, setAccountnum] = useState('');
    const [money, setMoney] = useState('')
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

        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();

        if (status === 'granted') {
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

        }
        else {
            ToasterNative(i18n.t('CammeraErr'), "danger", 'top')

        }
    };


    const SubmitHandler = () => {
        const isVal = _validate();
        if (!isVal) {
            setSpinner(true)
            dispatch(SendTransferFromACc(token, lang, BankId, base64, Bankname, accountNAme, accountnum, money, navigation)).then(() => setSpinner(false))
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
                <ScrollView style={{ flex: 1 }}>
                    <TouchableOpacity onPress={_pickImage}>
                        {
                            userImage == null ?
                                <Image source={require('../../../assets/images/plus.png')} style={{ width: 100, height: 100, marginTop: 30, alignSelf: 'center', borderRadius: 50 }} resizeMode='contain' />
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
