import React, { useState, useEffect } from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, ImageBackground } from 'react-native'
import { DrawerActions } from '@react-navigation/native';


import Colors from '../../consts/Colors';

import { validateUserName, valdiateMoney, validateAccountNum } from '../../common/Validation';
import { GetAccountBanks, } from '../../actions/Wallet';
import Container from '../../common/Container';
import { useSelector, useDispatch } from 'react-redux';

import i18n from "../locale/i18n";
import Header from '../../common/Header';

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

function VisaBank({ navigation }) {


    const [Bankname, setName] = useState('');
    const [accountNAme, setAcoountname] = useState("");
    const [accountnum, setAccountnum] = useState('');
    const [money, setMoney] = useState('')
    const token = useSelector(state => state.Auth.user ?state.Auth.user.data.token : null)
    const lang = useSelector(state => state.lang.lang);
    const BankAccount = useSelector(state => state.wallet.Banks);
    const [base64, setBase64] = useState('');
    const [userImage, setUserImage] = useState(null);



    console.log(BankAccount);

    const _validate = () => {
        let BanknameErr = validateUserName(Bankname)
        let AccountnameErr = validateUserName(Bankname)
        let accountnumErr = validateAccountNum(accountnum)
        let moneyErr = valdiateMoney(money)

        return BanknameErr || AccountnameErr || accountnumErr || moneyErr
    };

    const [spinner, setSpinner] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setSpinner(true)
            dispatch(GetAccountBanks(token, lang)).then(() => setSpinner(false))
        });

        return unsubscribe;
    }, [navigation])


    return (
        <Container loading={spinner}>
            <View style={{ flex: 1, backgroundColor: Colors.bg }}>
                <Header navigation={navigation} label={i18n.t('Banktransfer')} />

                <ScrollView style={{ flex: 1, }}>

                    <View style={{ marginTop: 20, marginHorizontal: 20, }}>
                        {
                            !BankAccount ? null :
                                BankAccount.map((acc, i) => {
                                    return (
                                        <TouchableOpacity style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' , marginBottom:20 , borderWidth:1 , borderColor:'#ccc' }} onPress={() => navigation.navigate('BankDataTransfer', { BankId: acc.id })} >
                                            <ImageBackground source={{ uri: acc.image }} style={styles.BAImage}>
                                                <View  style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 0, backgroundColor: '#00000082' }} />
                                                <View style={{ marginTop: 10, marginLeft: 25 }}>
                                                    <View style={{ flexDirection: 'row', }}>
                                                        <Text style={styles.textB}>{i18n.t('AccName')} :</Text>
                                                        <Text style={styles.textB}>{acc.account_name}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', }}>
                                                        <Text style={styles.textB}>{i18n.t('bankname')}:   </Text>
                                                        <Text style={styles.textB}>{acc.bank_name}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', }}>
                                                        <Text style={styles.textB}>{i18n.t('Accnum')}:  </Text>
                                                        <Text style={styles.textB}>{acc.account_number}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', }}>
                                                        <Text style={styles.textB}>{ i18n.t('iban') } : </Text>
                                                        <Text style={styles.textB}>{acc.iban_number}</Text>
                                                    </View>

                                                </View>
                                            </ImageBackground>
                                        </TouchableOpacity>

                                    )
                                })
                        }


                    </View>
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
export default VisaBank
