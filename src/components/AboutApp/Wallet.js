import React, { useState, useEffect } from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, I18nManager } from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import Colors from '../../consts/Colors';
import BTN from '../../common/BTN';
import { GetWallet } from '../../actions/Wallet';
import Container from '../../common/Container';
import i18n from "../locale/i18n";
import { useSelector, useDispatch } from 'react-redux';
import Header from "../../common/Header";



const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')
function Wallet({ navigation }) {

    const [spinner, setSpinner] = useState(true);
    const WalletTotal           = useSelector(state => state.wallet.wallet);
    const token                 = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null)
    const lang                  = useSelector(state => state.lang.lang);
    const user                  = useSelector(state => state.Auth ? state.Auth.user ? state.Auth.user.data : null : null)


    const dispatch = useDispatch()

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setSpinner(true)
            dispatch(GetWallet(token, lang)).then(() => setSpinner(false))
        });

        return unsubscribe;
    }, [navigation])


    return (
        <Container loading={spinner}>
            <ScrollView style={{ flex: 1 }}>
                <Header navigation={navigation} label={i18n.t('wallet')} />
                <View style={styles.ImgsContainer}>
                    <Image source={require('../../../assets/images/Wallt.png')} style={styles.images} resizeMode='contain' />
                    <Text style={styles.stext}>{i18n.t('currentbalance')}</Text>
                    <View style={styles.card}>
                        {
                            !WalletTotal ? null :
                                <Text style={[styles.TPrice, { color: WalletTotal.amount == 0 ? Colors.sky : WalletTotal.amount < 0 ? 'red' : 'green' }]}>{WalletTotal.amount} {i18n.t('RS')}</Text>

                        }





                    </View>

                    <View  style={{marginTop : 20}}>
                        {
                            !WalletTotal ? null :
                                WalletTotal.amount < 0 ?
                                <Text style={[styles.TPrice, { color:   'red'     , fontSize : 18} ]}> {i18n.t('haveDebit')}</Text>
                                    :null

                        }



                    </View>
                </View>

                <BTN title={i18n.t('Recharge')} onPress={() => navigation.navigate('Rescharge')} ContainerStyle={[styles.Btn, { marginTop: width * .15, borderRadius: 5 }]} TextStyle={{ fontSize: 14, }} />

                {
                    user && user.user_type !== 2 ?
                        <BTN title={i18n.t('withdraw')} onPress={() => navigation.navigate('ReCallBalance')} ContainerStyle={[styles.Btn, { marginTop: 5, backgroundColor: Colors.fontNormal, borderRadius: 5 }]} TextStyle={{ fontSize: 14, }} />
                        : null
                }

            </ScrollView>
        </Container>


    )
}
const styles = StyleSheet.create({
    BigImg: {
        height: height * .14,
        width: width * .23,
    },
    MenueImg: {
        width: 18,
        height: 18,
        marginHorizontal: 4,

    },
    Text: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: width * .045,
        textAlign: 'center',
        top: width * .14,

    },
    ImgsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: height * .03
    },
    images: {
        width: 100,
        height: 80,
        borderRadius: 200,


    },
    stext: {
        fontFamily: 'flatMedium',
        color: Colors.sky,
        fontSize: 18,
        marginTop: height * .09
    },
    lText: {
        marginTop: 10,
        paddingHorizontal: 15,
        fontFamily: 'flatRegular',
        lineHeight: 20,
        color: Colors.fontNormal,
        fontSize: 13,
        textAlign: 'center'
    },
    card: {
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#e5e0e0',
        width: width * .4,
        height: width * .29,
        marginHorizontal: 20,
        marginTop: width * .15,
        borderRadius: 15
    },
    TPrice: {
        textAlign: 'center',
        fontFamily: 'flatMedium',
        color: Colors.sky,
        fontSize: width * .07

    }

})
export default Wallet
