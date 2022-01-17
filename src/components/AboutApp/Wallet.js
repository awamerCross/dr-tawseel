import React, { useState, useEffect } from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, I18nManager, ActivityIndicator, } from 'react-native'
import Colors from '../../consts/Colors';
import BTN from '../../common/BTN';
import { GetWallet } from '../../actions/Wallet';
import Container from '../../common/Container';
import i18n from "../locale/i18n";
import { useSelector, useDispatch } from 'react-redux';
import Header from "../../common/Header";

import Modal from "react-native-modal";
import { Icon, Toast } from 'native-base';
import WebView from 'react-native-webview';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from "expo-linking";


const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')
function Wallet({ navigation }) {

    const [spinner, setSpinner] = useState(true);
    const WalletTotal = useSelector(state => state.wallet.wallet);
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null)
    const user = useSelector(state => state.Auth.user ? state.Auth.user.data : null)

    const lang = useSelector(state => state.lang.lang);
    const [paymentType, setPaymentType] = useState('');
    const [PaymentModal, setPaymentModal] = useState(false);
    const [WebViews, setWebViews] = useState(false);
    const [spinnerPayment, setSpinnerPayment] = useState(false);
    const [PaymentFinished, setPaymentFinished] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setSpinner(true)
            dispatch(GetWallet(token, lang)).then(() => setSpinner(false))
        });

        return unsubscribe;
    }, [navigation])


    const OpenWebView = () => {
        setPaymentModal(false)
        setTimeout(() => setWebViews(true), 1000)
    }

    function _onLoad(state, navigation) {
        console.log('url .....', state.url);

        if (state.url.indexOf('?status=') != -1) {
            let status = state.url.split("status=")[1].split('&')[0];
            if (status == '1') {

                Toast.show({
                    text: i18n.t('successCharge'),
                    type: "success",
                    fontFamily: 'flatMedium',
                    duration: 3000
                });

            } else {

                Toast.show({
                    text: i18n.t('error'),
                    type: "danger",
                    duration: 3000
                });
                setWebViews(false)

            }
            setPaymentFinished(true)
            return setWebViews(false)
        }
        // else {
        //     return setWebViews(false)
        // }

    }

    const _handleApplePayAsync = async () => {
        setPaymentModal(false)

        let paymentURL = `https://drtawsel.aait-sa.com/payment-wallet/${user?.id}/${paymentType}?linkingUri=${Linking.makeUrl(
            "/?"
        )}`;
        console.log("paymentURL ApplePay", paymentURL);
        let result = await WebBrowser.openBrowserAsync(paymentURL, {
            enableDefaultShareMenuItem: false,
            showTitle: false,
        });
        Linking.addEventListener("url", (event) => {
            console.log("url Actions", event);
            WebBrowser.dismissBrowser();

            if (event?.url?.indexOf('?status=') != -1) {

                let status = event?.url.split("status=")[1];

                console.log('====================================');
                console.log(status);
                console.log('====================================');
                if (status == 1) {

                    Toast.show({
                        text: i18n.t('successCharge'),
                        type: "success",
                        duration: 5000
                    });

                }
                else {

                    Toast.show({
                        text: i18n.t('error'),
                        type: "danger",
                        duration: 5000
                    });
                }
            }
        });

    }

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

                    <View style={{ marginTop: 20 }}>
                        {
                            !WalletTotal ? null :
                                WalletTotal.amount < 0 ?
                                    <Text style={[styles.TPrice, { color: 'red', fontSize: 18 }]}> {i18n.t('haveDebit')}</Text>
                                    : null

                        }

                    </View>
                </View>
                <BTN title={i18n.t('Recharge')} onPress={() => setPaymentModal(true)} ContainerStyle={[styles.Btn, { marginTop: width * .15, borderRadius: 5 }]} TextStyle={{ fontSize: 14, }} />

                {/* <BTN title={i18n.t('Recharge')} onPress={() => navigation.navigate('Rescharge')} ContainerStyle={[styles.Btn, { marginTop: width * .15, borderRadius: 5 }]} TextStyle={{ fontSize: 14, }} /> */}

                {/* {
                    user && user.user_type !== 2 ?
                        <BTN title={i18n.t('withdraw')} onPress={() => navigation.navigate('ReCallBalance')} ContainerStyle={[styles.Btn, { marginTop: 5, backgroundColor: Colors.fontNormal, borderRadius: 5 }]} TextStyle={{ fontSize: 14, }} />
                        : null
                } */}

            </ScrollView>

            <Modal
                animationType="slide"
                style={{ flex: 1, width: '100%', marginStart: 0, marginTop: 100, marginBottom: 0, }}
                onBackButtonPress={() => setPaymentModal(false)}
                onBackdropPress={() => setPaymentModal(false)}
                onSwipeComplete={() => setPaymentModal(false)}
                swipeDirection={["down"]}

                isVisible={PaymentModal} >
                <View style={[styles.centeredViews, { borderTopRightRadius: 20, borderTopLeftRadius: 20, }]}>
                    <TouchableOpacity onPress={() => setPaymentType('mada')} style={[styles.modalView, { marginTop: 20, marginHorizontal: '2%', width: '95%', backgroundColor: paymentType == 'mada' ? '#9A9A9A' : 'white' }]}>
                        <View style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', marginHorizontal: 20, paddingVertical: 10 }}>
                            <Image source={require('../../../assets/images/mda.png')} style={{ width: 40, height: 40 }} resizeMode='contain' />
                            <Text style={styles.payText}>{i18n.t('byMada')}</Text>
                        </View>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => setPaymentType('STC_PAY')} style={[styles.modalView, { marginTop: 20, marginHorizontal: '2%', width: '95%', backgroundColor: paymentType == 'STC_PAY' ? '#9A9A9A' : 'white' }]}>
                        <View style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', marginHorizontal: 20, paddingVertical: 20 }}>
                            <Image source={require('../../../assets/images/StcPay.png')} style={{ width: 40, height: 40 }} resizeMode='contain' />
                            <Text style={styles.payText}>{i18n.t('byStc')}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setPaymentType('master')} style={[styles.modalView, { marginTop: 20, marginHorizontal: '2%', width: '95%', backgroundColor: paymentType == 'master' ? '#9A9A9A' : 'white' }]}>
                        <View style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', marginHorizontal: 20, paddingVertical: 10 }}>
                            <Image source={require('../../../assets/images/masterVisa.jpeg')} style={{ width: 40, height: 40 }} resizeMode='contain' />
                            <Text style={styles.payText}>{i18n.t('byVisaMaster')}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setPaymentType('ApplePay')} style={[styles.modalView, { marginTop: 20, marginHorizontal: '2%', width: '95%', backgroundColor: paymentType == 'ApplePay' ? '#9A9A9A' : 'white' }]}>
                        <View style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', marginHorizontal: 20, paddingVertical: 10 }}>
                            <Image source={require('../../../assets/images/applePayement.png')} style={{ width: 40, height: 40 }} resizeMode='contain' />
                            <Text style={styles.payText}>{i18n.t('byapplePay')}</Text>
                        </View>
                    </TouchableOpacity>


                    <BTN title={i18n.t('confirm')} onPress={paymentType == 'ApplePay' ? _handleApplePayAsync : OpenWebView} ContainerStyle={{ marginBottom: 5, borderRadius: 20, backgroundColor: Colors.sky, marginTop: 100 }} />

                </View>
            </Modal>


            <Modal
                onBackdropPress={() => setWebViews(false)}
                onBackButtonPress={() => setWebViews(false)}
                isVisible={WebViews}
                style={{ marginBottom: 0, flex: 1, width, marginRight: 0, marginLeft: 0, marginTop: 0 }}

            >
                <View style={{ flex: 1 }}>
                    <WebView
                        source={{ uri: `https://drtawsel.aait-sa.com/payment-wallet/${user?.id}/${paymentType}?fbclid=IwAR10qp1PR5Zc-FauPUzm0IGv8gHFvZAdUtZ6mgpdG57zPtJ5M2_zmEuIRz4` }}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        scalesPageToFit={false}
                        style={{ height: 1000, marginTop: 20 }}
                        scrollEnabled={true}
                        javaScriptEnabled={true}
                        onLoad={() => setSpinnerPayment(false)}
                        onNavigationStateChange={(state) => _onLoad(state, navigation)}
                    />
                    {
                        spinnerPayment && (
                            <ActivityIndicator
                                style={{ position: "absolute", top: height / 2, left: width / 2 }}
                                size="large"
                            />
                        )}
                </View>

            </Modal>
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
        fontSize: 16,
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
        fontSize: 16,
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
        fontSize: 14

    },
    pay: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: 16,
        marginHorizontal: 10

    },
    payText: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: 14,
        marginHorizontal: 10

    },
    BtnBay: { flexDirection: 'row', alignItems: 'center', marginTop: 50, backgroundColor: Colors.sky, width: '50%', borderRadius: 20, paddingVertical: 15, justifyContent: 'center', alignSelf: 'center' },

    centeredViews: {
        flex: 1,
        alignItems: "center",
        backgroundColor: '#F5F6FA',
        // justifyContent: 'center'

    },

    modalView: {
        backgroundColor: "white",
        borderRadius: 5,
        width: '100%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,

    },

})
export default Wallet
