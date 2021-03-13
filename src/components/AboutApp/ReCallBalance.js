import React, { useState } from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, ImageBackground, ActivityIndicator, Platform } from 'react-native'
import { DrawerActions } from '@react-navigation/native';


import Colors from '../../consts/Colors';
import { InputIcon } from '../../common/InputText';
import BTN from '../../common/BTN';
import { Toaster } from '../../common/Toaster';
import { validateAccountNum } from '../../common/Validation';
import Header from '../../common/Header';
import i18n from "../locale/i18n";
import { Withdrawwallet } from '../../actions/Wallet';
import { useSelector, useDispatch } from 'react-redux';
import Container from '../../common/Container';
import { ToasterNative } from '../../common/ToasterNatrive';
import LoadingBtn from '../../common/Loadbtn';

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

function ReCallBalance({ navigation }) {


    const [accountnum, setAccountnum] = useState('');
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null)
    const [spinner, setSpinner] = useState(false);
    const lang = useSelector(state => state.lang.lang);

    const dispatch = useDispatch();

    const _validate = () => {

        let accountnumErr = validateAccountNum(accountnum);

        return accountnumErr
    };

    const WithdrawwalletConfirm = () => {
        let val = _validate();
        if (!val) {
            setSpinner(true)
            dispatch(Withdrawwallet(token, accountnum, lang, navigation)).then(() => setSpinner(false))
            setAccountnum('')
        }
        else {
            setSpinner(false)
            ToasterNative(_validate(), 'danger', 'bottom')
        }
    }





    return (
        <View style={{ flex: 1, backgroundColor: Colors.bg }}>
            <Header navigation={navigation} label={i18n.t('wallet')} />

            <View style={{ margin: 20, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: 'flatMedium', fontSize: 12, marginVertical: 5, color: Colors.fontNormal }}>{i18n.t('RecoverWallet')} </Text>
                <InputIcon
                    label={i18n.t("Accnum")}
                    value={accountnum}
                    onChangeText={(e) => setAccountnum(e)}
                    styleCont={{ marginTop: 30, width: '98%', }}
                    inputStyle={{ borderRadius: 25, }}
                    keyboardType='numeric'
                    inputStyle={{ paddingHorizontal: 10, }}


                />

            </View>
            <LoadingBtn loading={spinner}>
                <BTN title={i18n.t('agree')} ContainerStyle={styles.LoginBtn} onPress={WithdrawwalletConfirm} ContainerStyle={{ borderRadius: 25, flex: .07 }} TextStyle={{ fontSize: 18, }} />
            </LoadingBtn>
        </View>

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
        borderRadius: 20

    },
    textB: {
        fontSize: width * .03,
        color: Colors.bg,
        fontFamily: 'flatMedium',
        marginTop: 10,

    }
})

export default ReCallBalance
