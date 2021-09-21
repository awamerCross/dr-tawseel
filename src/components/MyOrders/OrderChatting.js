import React, { useState, useEffect, useRef } from 'react'
import { ScrollView, View, Image, TouchableOpacity, Text, StyleSheet, Dimensions, FlatList, Linking, TextInput, I18nManager, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard, AppState } from 'react-native'
import Colors from '../../consts/Colors';
import { InputIcon } from '../../common/InputText';

import {
    getInbox,
    sendNewMessage,
    delegateUpdateOrder,
    getCancelReasons,
    cancelOrder,
    sendRate,
    sendBill,
} from '../../actions';

import BTN from '../../common/BTN';
import Header from '../../common/Header';
import i18n from "../locale/i18n";
import StarRating from "react-native-star-rating";
import { useDispatch, useSelector } from "react-redux";

import RNModal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import { Camera } from 'expo-camera';

import Modal from "react-native-modal";
import { Icon, Textarea, Toast } from "native-base";
import { useIsFocused } from '@react-navigation/native';
import SocketIOClient from 'socket.io-client';
import { _renderRows } from '../../common/LoaderImage';
import { ToasterNative } from '../../common/ToasterNatrive';
import ImageZoom from 'react-native-image-pan-zoom';
import * as Location from "expo-location";
import axios from "axios";
import CONST from "../../consts";
import * as Notifications from "expo-notifications";
import { PayWithWallet } from '../../actions/Wallet';
import { WebView } from "react-native-webview";


window.navigator.userAgent = 'react-native';

const { width, height } = Dimensions.get('window')


function OrderChatting({ navigation, route }) {

    const { receiver, sender, orderDetails } = route.params;

    const socket = SocketIOClient('https://drtawsel.4hoste.com:4544/', { jsonp: false });
    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null);
    const user = useSelector(state => state.Auth ? state.Auth.user ? state.Auth.user.data : null : null)
    const messages = useSelector(state => state.chat.messages.messages);

    const cancelReasons = useSelector(state => state.cancelReasons.cancelReasons);
    const button = useSelector(state => state.chat.messages.order ? state.chat.messages.order.button : null);
    let order = useSelector(state => state.chat.messages.order ? state.chat.messages.order : null);
    const dispatch = useDispatch();
    const [msg, setMsg] = useState('');
    const [rateMsg, setRateMsg] = useState('');
    const [spinner, setSpinner] = useState(false);
    const isFocused = useIsFocused();
    const [PaymentFinished, setPaymentFinished] = useState(false)
    const [showBillModal, setShowBillModal] = useState(false);
    const [zoomBillModal, setZoomBillModal] = useState(false);
    const [cost, setCost] = useState(0);
    const ScrollViewRef = useRef();
    let total = Number(orderDetails.shipping) + Number(cost);
    const [top, setTop] = useState(0);
    console.log(top);
    const [EditMaodVisible, setEditMaodVisible] = useState(false)
    const [photo, setPhoto] = useState('');
    const [base64, setBase64] = useState('');
    const [starCount, setStarCount] = useState(0);
    const [IsDeliverMoadl, setIsDeliverMoadl] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [showRateModal, setShowRateModal] = useState(false);
    const [selectedRadion, setSelectedRadio] = useState(0)
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [billImage, setBillImage] = useState('');
    const [billSpinner, setBillSpinner] = useState(false);
    const [ShowPay, setShowPay] = useState(false);
    const [GetPayment, setGetPayment] = useState('');
    const [WebViews, setWebViews] = useState(false);
    const [spinnerPayment, setSpinnerPayment] = useState(false);



    let PayWay = [
        {
            id: 1,
            name: 'mada',
            image: require('../../../assets/images/mda.png')
        },
        {
            id: 2,
            name: 'master',
            image: require('../../../assets/images/mster.png')
        }
    ]


    function fetchData() {


        axios({
            url: CONST.url + 'update-availability',
            method: 'POST',
            params: { lang },
            data: { available: 0 },
            headers: { Authorization: 'Bearer ' + token, },
        }).then(response => {

        });

        setMsg('')
        setTimeout(() => {
            dispatch(getInbox(lang, token, orderDetails.room)).then(() => {
                ScrollViewRef.current.scrollToEnd()
            })
        })

        // setTimeout(()=>{
        //
        // },500)

        // Keyboard.addListener('keyboardDidShow', ()=>{
        //     ScrollViewRef.current.scrollToEnd({ animated: true })
        //  });



        dispatch(getCancelReasons(lang))
        // ScrollViewRef.current.scrollToEnd({ animated: true })
    }

    const _pickImage = async (i) => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,

            base64: true,
            aspect: [4, 3],
            quality: .5,
        });

        if (!result.cancelled) {
            setPhoto(result.uri);
            setBase64(result.base64);
            setTop(0)

        }
        setTimeout(() => {
            setShowBillModal(true)

        }, 1000);
    };

    const _pickImageFrpmCamera = async () => {
        const { status } = await Camera.requestPermissionsAsync();

        if (status === 'granted') {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,

                base64: true,
                aspect: [4, 3],
                quality: .5,
            });

            if (!result.cancelled) {
                setPhoto(result.uri);
                setBase64(result.base64);
                setTop(0)
            }
            setTimeout(() => {
                setShowBillModal(true)

            }, 1000);
        }
        else {
            ToasterNative(i18n.t('CammeraErr'), "danger", 'top')

        }
    }

    const setBill = () => {
        setBillSpinner(true)

        dispatch(sendBill(lang, token, orderDetails.order_id, total, base64)).then(() => {
            setBase64('')
            setCost(0)
            setBillSpinner(false)
            setShowBillModal(false)
            emitMsg()
            fetchData()
        }).catch(() => {
            setBillSpinner(false)
            setShowBillModal(false)
        })
    }

    function joinRoom() {
        socket.emit('subscribe-chat', { room: orderDetails.order_id });
    }


    useEffect(() => {

        const unsubscribe = navigation.addListener('focus', () => {
            fetchData()
            // if (order.status === 'DELIVER' || order.status === 'DELIVERED'){
            //     setShowRateModal(true)
            // }
            if (user && user.user_type === 3) {
                getLocation();
            }
        })

        return unsubscribe;
    }, [navigation, socket]);




    useEffect(() => {


        setEditMaodVisible(false)
        setShowBillModal(false)
        fetchData()
        joinRoom()
        socket.on('get_message', () => fetchData());
        setPhoto('');
        setBase64('');
        setCost(0)


        const subscription = Notifications.addNotificationReceivedListener(res => {


            if (res.request.content.data.type === 'chat') {
                // setTimeout(()=> {
                //     ScrollViewRef.current.scrollToEnd({ animated: true })
                // }, 1000)

                if (res.request.content.data.room.order.status == 'DELIVERED') {
                    setShowRateModal(true)

                }
            }

        });

        return () => {
            subscription.remove();
        };


    }, [route.params]);



    useEffect(() => {



        return () => {

            axios({
                url: CONST.url + 'update-availability',
                method: 'POST',
                params: { lang },
                data: { available: 1 },
                headers: { Authorization: 'Bearer ' + token, },
            }).then(response => {

            });
        };
    }, [navigation, route, route?.params])




    function onSendMsg() {
        setMsg('')
        dispatch(sendNewMessage(lang, token, msg, orderDetails.order_id)).then(() => {
            //   fetchData()
            emitMsg();
            Keyboard.dismiss()
            // ScrollViewRef.current.scrollToEnd({ animated: true })
            // ScrollViewRef.current.scrollToEnd({ animated: true })
        })
    }

    function emitMsg() {
        socket.emit('send_message', { room: orderDetails.order_id, msg: 'msg' });
        // ScrollViewRef.current.scrollToEnd({ animated: true })
        // ScrollViewRef.current.scrollToEnd({ animated: true })

    }
    function navigateToMap(lat, lng) {
        // const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        // const label = 'Custom Label';
        // const url = Platform.select({
        //     ios: `${scheme}${label}@${latLng}`,
        //     android: `${scheme}${latLng}(${label})`
        // });
        const url = `http://maps.google.com/maps?&daddr=${latLng}`;
        Linking.openURL(url);
    }


    async function updateOrder() {
        let id = orderDetails.order_id;
        let customer_paid = null;
        await axios({
            url: CONST.url + 'delegates/update-orders',
            method: 'POST',
            params: { lang },
            data: { id, customer_paid },
            headers: { Authorization: 'Bearer ' + token, },
        }).then(response => {


            if (response.data.data.status === 'DELIVERED') {
                setShowRateModal(true)
            }
            socket.emit('send_message', { room: orderDetails.order_id, msg: 'msg' });
            socket.emit('send_message', { room: orderDetails.order_id, msg: 'msg' });
            fetchData()
            emitMsg();

            if (!response.data.success) {
                Toast.show({
                    text: response.data.message,
                    type: response.data.success ? "success" : "danger",
                    duration: 3000,
                    textStyle: {
                        color: "white",
                        fontFamily: 'flatMedium',
                        textAlign: 'center'
                    }
                });
            }
        });

    }
    function renderConfirm() {

        if (isSubmitted) {
            return (
                <View style={[{ justifyContent: 'center', alignItems: 'center', marginTop: 30, marginBottom: 30 }]}>
                    <ActivityIndicator size="large" color={Colors.sky} style={{ alignSelf: 'center' }} />
                </View>
            )
        }

        if (rateMsg && starCount) {
            return (

                <TouchableOpacity onPress={() => sendRateMsg()} style={[styles.container, { backgroundColor: Colors.sky, margin: 20 }]} >
                    <Text style={[styles.sText, { padding: 20, color: '#fff', fontSize: 16 }]}>
                        {i18n.t('send')}
                    </Text>
                </TouchableOpacity>

            );
        } else {

            return (
                <TouchableOpacity disabled={true} style={[styles.container, { backgroundColor: Colors.sky, margin: 20 }]} >
                    <Text style={[styles.sText, { padding: 20, color: '#fff', fontSize: 16 }]}>
                        {i18n.t('send')}
                    </Text>
                </TouchableOpacity>
            );

        }

    }

    function getLocation() {
        Location.watchPositionAsync({
            enableHighAccuracy: true,
            distanceInterval: 50,
            timeInterval: 5000
        }, (position) => {
            subscribeRoom({
                lat: position.coords.latitude,
                long: position.coords.longitude,
                room: orderDetails.order_id
            })
        });
    }

    function subscribeRoom(data) {
        socket.emit('subscribe', { room: data.room });
        socket.emit('delegate_Updated', data);
    }

    function sendRateMsg() {
        setIsSubmitted(true)
        dispatch(sendRate(lang, token, order.delegate_id, starCount, rateMsg)).then(() => { setIsSubmitted(false); navigation.navigate('SuccessEvaluation'); setShowRateModal(false) })
        setRateMsg('');
        setStarCount(0);
    }
    let loadingAnimated = []



    function onSendsMsg() {
        setMsg('')
        dispatch(sendNewMessage(lang, token, 'لقد قمت بتحويل المبلغ', orderDetails.order_id)).then(() => {
            //   fetchData()
            emitMsg();
            Keyboard.dismiss()
            // ScrollViewRef.current.scrollToEnd({ animated: true })
            // ScrollViewRef.current.scrollToEnd({ animated: true })
        })
    }

    const PayForWallet = () => dispatch(PayWithWallet(token, order?.order_id, lang, onSendsMsg));

    function _onLoad(state, navigation) {
        if (!PaymentFinished) {
            if (state.url.indexOf('?status=') != -1) {
                let status = state.url.split("status=")[1].split('&')[0];
                if (status == '1') {

                    Toast.show({
                        text: i18n.t('successPayment'),
                        type: "success",
                        duration: 3000
                    });
                    onSendsMsg()

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
            console.log(state);
        }

    }




    function renderMessage(message, i) {
        if (message.sender) {
            return (
                <View key={i} style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ flexBasis: '13%', alignItems: 'center', marginTop: 5 }}>
                        <Image source={{ uri: message.img }} style={{ width: 40, height: 40, borderRadius: 50, }} />
                    </View>
                    <View style={{ flexBasis: '82%', }}>
                        <View style={{ backgroundColor: message.type === 'image' ? 'transparent' : Colors.sky, borderRadius: 15, overflow: 'hidden', flexDirection: "row", alignSelf: 'flex-start', alignItems: "center", justifyContent: 'center', flexWrap: 'wrap' }}>
                            {
                                message.type === 'image' ?
                                    <TouchableOpacity onPress={() => { setBillImage(message.message); setZoomBillModal(!zoomBillModal) }} style={{ width: '100%', height: 220 }}>
                                        <Image source={{ uri: message.message }} style={{ width: '100%', height: 220, borderRadius: 15, alignSelf: 'center', }} resizeMode={'cover'} />
                                    </TouchableOpacity>

                                    :
                                    message.type === 'bill' ?
                                        <View style={{ flexDirection: 'row', backgroundColor: Colors.bg, alignItems: 'center', padding: 10 }}>
                                            <View style={{ flex: 1 }}>


                                                <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd', padding: 4 }}>
                                                    <Text style={[styles.sText, { color: Colors.fontBold, width: 130, textAlign: I18nManager.isRTL ? 'left' : 'right' }]}>{JSON.parse(message.message).sum_text} </Text>
                                                    <Text style={[styles.sText, { color: Colors.sky, fontFamily: 'flatMedium', }]}>{JSON.parse(message.message).sum}</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd', padding: 4, backgroundColor: '#eee' }}>
                                                    <Text style={[styles.sText, { color: Colors.fontBold, width: 130, textAlign: I18nManager.isRTL ? 'left' : 'right' }]}>{JSON.parse(message.message).delivery_text}  </Text>
                                                    <Text style={[styles.sText, { color: Colors.sky, fontFamily: 'flatMedium', }]}>{JSON.parse(message.message).delivery}</Text>
                                                </View>


                                                <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd', padding: 4 }}>
                                                    <Text style={[styles.sText, { color: Colors.fontBold, width: 130, textAlign: I18nManager.isRTL ? 'left' : 'right' }]}>{JSON.parse(message.message).discount_txt}  </Text>
                                                    <Text style={[styles.sText, { color: Colors.sky, fontFamily: 'flatMedium', }]}>{JSON.parse(message.message).discount}</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row', padding: 4, backgroundColor: '#eee' }}>
                                                    <Text style={[styles.sText, { color: Colors.fontBold, width: 130, textAlign: I18nManager.isRTL ? 'left' : 'right' }]}>{JSON.parse(message.message).total_text}  </Text>
                                                    <Text style={[styles.sText, { color: Colors.sky, fontFamily: 'flatMedium', }]}>{JSON.parse(message.message).total}</Text>
                                                </View>
                                            </View>

                                        </View>

                                        :
                                        <Text style={[styles.sText, { padding: 10, color: '#fff', fontFamily: 'flatMedium', }]}>{message.message}</Text>
                            }
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.sText, { fontSize: 12 }]}>{message.time}</Text>
                            <Image source={require('../../../assets/images/tickblue.png')} style={{ width: 12, height: 12, marginTop: 6 }} resizeMode='contain' />
                            {
                                message.seen ?
                                    <Image source={require('../../../assets/images/tickblue.png')} style={{ width: 12, height: 12, marginTop: 6 }} resizeMode='contain' /> : null
                            }
                        </View>
                    </View>
                </View>
            )
        }

        return (
            <View key={i} style={{ flexDirection: 'row-reverse', marginTop: 10 }}>
                <View style={{ flexBasis: '12%', alignItems: 'center', marginTop: 5 }}>
                    <Image source={{ uri: message.img }} style={{ width: 40, height: 40, borderRadius: 50, }} />
                </View>
                <View style={{ flexBasis: '80%', paddingHorizontal: 5 }}>
                    <View style={{ backgroundColor: Colors.fontNormal, borderRadius: 15, flexDirection: "row", alignSelf: 'flex-end', alignItems: "center", justifyContent: 'center', flexWrap: 'wrap' }}>
                        {
                            message.type === 'image' ?
                                <TouchableOpacity onPress={() => { setBillImage(message.message); setZoomBillModal(!zoomBillModal) }} style={{ width: '100%', height: 220 }}>
                                    <Image source={{ uri: message.message }} style={{ width: '100%', height: 220, borderRadius: 15, alignSelf: 'center' }} resizeMode={'cover'} />
                                </TouchableOpacity>
                                :
                                message.type === 'bill' ?
                                    <View style={{ flexDirection: 'row', backgroundColor: Colors.bg, alignItems: 'center', padding: 10, borderRadius: 15 }}>
                                        <View style={{ flex: 1 }}>

                                            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd', padding: 3 }}>
                                                <Text style={[styles.sText, { color: Colors.fontBold, width: 130, textAlign: I18nManager.isRTL ? 'left' : 'right' }]}>{JSON.parse(message.message).sum_text} </Text>
                                                <Text style={[styles.sText, { color: Colors.sky, fontFamily: 'flatMedium', }]}>{JSON.parse(message.message).sum}</Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd', padding: 3, backgroundColor: '#eee' }}>
                                                <Text style={[styles.sText, { color: Colors.fontBold, width: 130, textAlign: I18nManager.isRTL ? 'left' : 'right' }]}>{JSON.parse(message.message).delivery_text}  </Text>
                                                <Text style={[styles.sText, { color: Colors.sky, fontFamily: 'flatMedium', }]}>{JSON.parse(message.message).delivery}</Text>
                                            </View>


                                            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd', padding: 4 }}>
                                                <Text style={[styles.sText, { color: Colors.fontBold, width: 130, textAlign: I18nManager.isRTL ? 'left' : 'right' }]}>{JSON.parse(message.message).discount_txt}  </Text>
                                                <Text style={[styles.sText, { color: Colors.sky, fontFamily: 'flatMedium', }]}>{JSON.parse(message.message).discount}</Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', padding: 3, backgroundColor: '#eee' }}>
                                                <Text style={[styles.sText, { color: Colors.fontBold, width: 130, textAlign: I18nManager.isRTL ? 'left' : 'right' }]}>{JSON.parse(message.message).total_text} : </Text>
                                                <Text style={[styles.sText, { color: Colors.sky, fontFamily: 'flatMedium', }]}>{JSON.parse(message.message).total}</Text>
                                            </View>
                                        </View>
                                    </View>

                                    :
                                    <Text style={[styles.sText, { padding: 10, color: '#fff', fontFamily: 'flatMedium', }]}>{message.message}</Text>
                        }

                    </View>
                    <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                        <Text style={[styles.sText, { fontSize: 12 }]}>{message.time}</Text>
                        <Image source={require('../../../assets/images/tickblue.png')} style={{ width: 12, height: 12, marginTop: 6 }} resizeMode='contain' />
                        {
                            message.seen ? <Image source={require('../../../assets/images/tickblue.png')} style={{ width: 12, height: 12, marginTop: 6 }} resizeMode='contain' /> : null
                        }
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, }}>
            <Header navigation={navigation} label={i18n.t('inbox')} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <View style={{ width, paddingBottom: 15, backgroundColor: '#dbdbdb' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={{ uri: receiver.avatar }} style={styles.ResImgNm} />
                            <Text style={[styles.sText, { color: Colors.IconBlack }]}>{receiver.name}</Text>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <StarRating
                                    disabled={false}
                                    maxStars={5}
                                    rating={order && order.rate}
                                    fullStarColor={'#fec104'}
                                    starSize={13}
                                    starStyle={{ marginHorizontal: 0 }}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            {
                                order && order.show_create_bill ?
                                    <TouchableOpacity onPress={() => {
                                        setShowBillModal(!showBillModal)
                                        setEditMaodVisible(false)
                                    }} >
                                        <Image source={require('../../../assets/images/chat_bill.png')} style={styles.ResImgNm} />
                                    </TouchableOpacity> : null
                            }

                            {
                                order && order.status !== 'DELIVERED' ?
                                    <>
                                        <TouchableOpacity onPress={() => Linking.openURL('tel:' + receiver.phone)} >
                                            <Image source={require('../../../assets/images/callchat.png')} style={styles.ResImgNm} />
                                        </TouchableOpacity>

                                        {
                                            user && user.user_type === 2 ?

                                                <TouchableOpacity onPress={() => navigation.navigate('Followrepresentative', { address: orderDetails.address, orderDetails })}>
                                                    <Image source={require('../../../assets/images/mapchat.png')} style={[styles.ResImgNm]} />
                                                </TouchableOpacity>
                                                :
                                                user && user.user_type === 3 ?
                                                    < TouchableOpacity
                                                        onPress={() => navigateToMap(orderDetails.address.latitude_to, orderDetails.address.longitude_to)}>
                                                        <Image source={require('../../../assets/images/mapchat.png')} style={[styles.ResImgNm]} />
                                                    </TouchableOpacity>
                                                    :
                                                    null
                                        }
                                    </>
                                    : null
                            }
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: -8 }}>
                        <Image source={require('../../../assets/images/money.png')} style={styles.ResImg} resizeMode='contain' />
                        <Text style={[{ fontFamily: 'flatMedium', color: Colors.fontNormal, fontSize: 11 }]}>{i18n.t('delivryPrice')} {orderDetails.shipping} {i18n.t('RS')} </Text>
                    </View>
                    <TouchableOpacity style={{ marginLeft: 70, marginTop: 5 }} onPress={() => setShowRateModal(!showRateModal)}>
                        {
                            order && order.status && order.status == 'DELIVERED' ?
                                <Text style={[{ fontFamily: 'flatMedium', color: Colors.sky, fontSize: 13, alignSelf: 'flex-start' }]}>{i18n.t('rateOrder')} </Text>
                                :
                                null
                        }
                    </TouchableOpacity>
                </View>

                {
                    order && user && user.user_type == 3 && button && order.status !== 'DELIVERED' ?
                        <View style={{ backgroundColor: Colors.sky, width: '100%', height: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, justifyContent: 'space-between' }}>
                            <Text style={[styles.sText, { color: '#fff', fontFamily: 'flatMedium' }]}>{button.button_text}</Text>
                            {
                                order?.payment_type != 'cash' && order.status == 'ARRIVED' ?

                                    null
                                    :
                                    <TouchableOpacity onPress={() => updateOrder()} style={{ backgroundColor: '#fff', height: 35, alignItems: 'center', padding: 3, borderRadius: 5, width: 70, justifyContent: 'center' }}>
                                        <Text style={[styles.sText, { color: Colors.sky }]}>{i18n.t('confirm')}</Text>
                                    </TouchableOpacity>
                            }

                        </View>
                        :
                        user && user?.user_type == 2 && order?.payment_type != 'cash' && order?.payment_status == 0 && order?.bill_created == 1 ?
                            <View style={{ backgroundColor: Colors.sky, width: '100%', height: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, justifyContent: 'space-between' }}>
                                <Text style={[styles.sText, { color: '#fff' }]}>{'تآكيد الدفع'}</Text>
                                <TouchableOpacity onPress={order.payment_type == 'wallet' ? PayForWallet : () => setShowPay(true)} style={{ backgroundColor: '#fff', height: 35, alignItems: 'center', padding: 3, borderRadius: 5, width: 70, justifyContent: 'center' }}>
                                    {
                                        order.payment_type == 'wallet' ?
                                            <Image source={require('../../../assets/images/Wallt.png')} style={[styles.ResImgNm, { marginTop: 0 }]} resizeMode={'contain'} />
                                            :
                                            <Image source={require('../../../assets/images/visa.png')} style={[styles.ResImgNm, { marginTop: 0, borderRadius: 5 }]} resizeMode={'contain'} />

                                    }
                                </TouchableOpacity>
                            </View>
                            :
                            null
                }





                <ScrollView style={{ flex: 1, }} ref={ScrollViewRef} keyboardShouldPersistTaps='handled'>
                    {/* Chat */}


                    {
                        spinner ?
                            _renderRows(loadingAnimated, 10, '2rows', width * .89, 90, { flexDirection: 'column', }, { borderRadius: 5, })
                            :
                            messages ? messages.map((message, i) => renderMessage(message, i)) : null}

                    {/* Delivered  order*/}
                    <View style={styles.centeredView}>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={IsDeliverMoadl}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10 }} onPress={() => setIsDeliverMoadl(false)}>
                                        <Image source={require('../../../assets/images/close.png')} style={[styles.ResImgNm, {
                                            alignSelf: 'center', marginLeft: 0, marginTop: 0,
                                            width: 20, height: 20
                                        }]} />
                                    </TouchableOpacity>
                                    <Image source={require('../../../assets/images/yass.jpg')} style={styles.ResIm} />
                                    <Text style={[styles.sText, { color: Colors.IconBlack, marginTop: 10 }]}>ياسر البطل</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 15, alignSelf: 'center' }}>
                                        <StarRating
                                            maxStars={5}
                                            rating={starCount}
                                            selectedStar={(rating) => setStarCount(rating)}
                                            fullStarColor={'#fec104'}
                                            starSize={24}
                                            starStyle={{ marginHorizontal: 5 }}
                                        />
                                    </View>
                                    <InputIcon
                                        placeholder={i18n.t('writeComment')}
                                        inputStyle={{ backgroundColor: '#eaeaea', borderColor: '#eaeaea', textAlignVertical: 'top', paddingTop: 10, borderRadius: 5 }}
                                        styleCont={{ height: width * .3, marginHorizontal: 10, width: '90%', alignSelf: 'center' }}
                                        LabelStyle={{ bottom: width * .42, backgroundColor: 0, left: 10, color: Colors.IconBlack }}
                                    />
                                    <BTN title={i18n.t('sendRate')} onPress={() => { setIsDeliverMoadl(false); navigation.navigate('SuccessEvaluation') }} ContainerStyle={{ marginTop: 10, borderRadius: 20 }} TextStyle={{ fontSize: 13 }} />
                                </View>
                            </View>
                        </Modal>
                    </View>

                    {/* cancelOrder */}

                    <Modal
                        onBackdropPress={() => setShowModal(!showModal)}
                        onBackButtonPress={() => setShowModal(!showModal)}
                        isVisible={showModal}
                        style={styles.bgModel}
                        avoidKeyboard={true}

                    >
                        <View style={[{ backgroundColor: '#eee', width: '100%', overflow: 'hidden', bottom: -20 }]}>
                            <View style={{ backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 15, marginBottom: 15 }}>
                                <Text style={[{ fontFamily: 'flatMedium', color: Colors.IconBlack, fontSize: 14 }]}>{i18n.t('chooseReason')}</Text>
                            </View>
                            <FlatList data={cancelReasons}
                                keyExtractor={(item, index) => index.id}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View>
                                            <TouchableOpacity key={index} onPress={() => setSelectedRadio(item.id)} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginTop: 15 }}>
                                                <View >
                                                    <View style={{
                                                        height: 15,
                                                        width: 15,
                                                        borderRadius: 12,
                                                        borderWidth: 2,
                                                        borderColor: selectedRadion === item.id ? Colors.sky : Colors.fontNormal,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}>
                                                        {
                                                            selectedRadion === item.id ?
                                                                <View style={{
                                                                    height: 7,
                                                                    width: 7,
                                                                    borderRadius: 6,
                                                                    backgroundColor: Colors.sky,
                                                                }} />
                                                                : null
                                                        }
                                                    </View>
                                                </View>
                                                <Text style={[styles.sText, { color: selectedRadion === item.id ? Colors.sky : Colors.fontNormal, fontSize: 13 }]}>{item.reason}</Text>
                                            </TouchableOpacity>
                                            <View style={{ height: 1, width: '100%', backgroundColor: '#ddd', marginTop: 15, }} />
                                        </View>
                                    )
                                }} />

                            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                <BTN title={i18n.t('send')} onPress={() => { dispatch(cancelOrder(lang, token, selectedRadion, order.order_id)).then(() => setShowModal(false)) }} ContainerStyle={{ borderRadius: 50, width: 120, marginTop: 15, marginBottom: 15 }} TextStyle={{ fontSize: 13 }} />
                                <View style={{ backgroundColor: '#ddd', width: 2, height: '100%', marginHorizontal: 30 }} />
                                <BTN title={i18n.t('cancelOrder')} onPress={() => { setShowModal(false) }} ContainerStyle={{ borderRadius: 50, width: 120, marginTop: 15, marginBottom: 15, backgroundColor: '#ddd' }} TextStyle={{ fontSize: 13, color: Colors.IconBlack }} />

                            </View>
                        </View>
                    </Modal>

                    <Modal
                        onBackdropPress={() => setShowRateModal(!showRateModal)}
                        onBackButtonPress={() => setShowRateModal(!showRateModal)}
                        isVisible={showRateModal}
                        style={[styles.bgModel, { justifyContent: 'center' }]}
                        avoidKeyboard={true}
                    >
                        <View style={[{ backgroundColor: '#fff', width: '90%', overflow: 'hidden', alignSelf: 'center' }]}>
                            <View style={{ backgroundColor: Colors.sky, paddingHorizontal: 20, paddingVertical: 15, marginBottom: 15, justifyContent: 'center' }}>
                                <Text style={[{ fontFamily: 'flatMedium', color: '#fff', fontSize: 14, textAlign: 'center' }]}>{i18n.t('rateOrder')}</Text>
                            </View>

                            <Image source={{ uri: receiver.avatar }} style={[styles.ResIm, { borderRadius: 5 }]} />
                            <Text style={[styles.sText, { color: Colors.IconBlack, marginTop: 10 }]}>{receiver.name}</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 15, alignSelf: 'center' }}>
                                <StarRating
                                    maxStars={5}
                                    rating={starCount}
                                    selectedStar={(rating) => setStarCount(rating)}
                                    fullStarColor={'#fec104'}
                                    starSize={20}
                                    starStyle={{ marginHorizontal: 5 }}
                                />
                            </View>

                            <Textarea
                                style={{
                                    backgroundColor: '#eaeaea', borderColor: '#eaeaea', textAlignVertical: 'top', paddingTop: 10, height: 150, marginTop: 10,
                                    width: '85%', alignSelf: 'center', fontFamily: 'flatMedium', fontSize: 13, textAlign: I18nManager.isRTL ? 'right' : 'left', borderRadius: 5
                                }}
                                onChangeText={(e) => setRateMsg(e)}
                                value={rateMsg}
                                placeholder={i18n.t('writeComment')}
                                placeholderTextColor={Colors.fontNormal}
                            />

                            {renderConfirm()}

                        </View>
                    </Modal>
                </ScrollView>

                {/* Points Bottom */}


                {
                    order && order.status && order.status !== 'DELIVERED' ?
                        <View style={{ bottom: 0, flexDirection: 'row', width, height: 70, backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 15 }}>
                            {
                                user && user.user_type === 2 ?
                                    <TouchableOpacity onPress={() => setShowModal(!showModal)}>
                                        <Image source={require('../../../assets/images/more_gray.png')} style={{ width: 10 }} resizeMode='contain' />
                                    </TouchableOpacity>
                                    : null
                            }


                            <TextInput
                                style={[styles.textInput, { borderColor: Colors.fontNormal }, { borderRadius: 10, backgroundColor: '#eaeaea', borderColor: '#eaeaea', padding: 10, marginHorizontal: 5 }]}
                                value={msg}
                                onChangeText={setMsg}
                                onFocus={() => ScrollViewRef.current.scrollToEnd({ animated: true })}
                                placeholder={i18n.t('writeUrMsg')}
                            />

                            <TouchableOpacity onPress={() => onSendMsg()}>
                                <Image source={require('../../../assets/images/sendmassege.png')} style={[styles.SendIcon, { transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }] }]} resizeMode='contain' />
                            </TouchableOpacity>

                        </View> : null
                }
            </KeyboardAvoidingView>

            <RNModal
                onBackdropPress={() => setShowBillModal(!showBillModal)}
                onBackButtonPress={() => setShowBillModal(!showBillModal)}
                isVisible={showBillModal}
                style={{ width: "95%", alignSelf: 'flex-end', }}
                avoidKeyboard={true}
            >
                <View style={[{ borderRadius: 5, backgroundColor: '#fff', width: '100%', overflow: 'hidden', }]}>
                    <View style={{ alignItems: 'center', }}>
                        <View style={{
                            width: '100%',
                            height: 50,
                            backgroundColor: Colors.sky,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={[styles.sText, {
                                color: '#fff',
                                textAlign: 'center',
                                marginTop: 10,
                                fontSize: 16,
                                lineHeight: 20
                            }]}>{i18n.t('exportBill')}</Text>
                        </View>

                        <View style={{ width: '100%' }}>
                            <View>
                                <TouchableOpacity onPress={() => {
                                    setTop(0);
                                    setShowBillModal(!showBillModal);
                                    setTimeout(() => setEditMaodVisible(true), 2000)
                                }}>
                                    <Image source={photo === '' ? require('../../../assets/images/fileupload.png') : { uri: photo }}
                                        style={{ width: '100%', height: photo === '' ? 80 : 200, marginTop: 20, borderRadius: 15 }}
                                        resizeMode='contain' />
                                </TouchableOpacity>
                            </View>


                            <Text style={[styles.sText, { textAlign: 'center', marginTop: 5 }]}>{i18n.t('uploadImg')}</Text>

                            <View style={{ marginTop: 40, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                    <InputIcon
                                        label={i18n.t('productsCost')}
                                        inputStyle={{ borderRadius: 30, height: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                                        styleCont={{ height: 45, width: '90%' }}
                                        LabelStyle={{
                                            bottom: 50,
                                            backgroundColor: 0,
                                            color: Colors.IconBlack,
                                            left: 5,
                                            marginVertical: 5
                                        }}
                                        onChangeText={setCost}
                                        editable={true}
                                        keyboardType='numeric'
                                        value={cost}
                                    />
                                </View>
                            </View>

                            <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                    <InputIcon
                                        label={i18n.t('productsCostWithShaping')}
                                        inputStyle={{ borderRadius: 30, height: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                                        styleCont={{ height: 45, width: '90%' }}
                                        LabelStyle={{
                                            bottom: 50,
                                            backgroundColor: 0,
                                            color: Colors.IconBlack,
                                            left: 5,
                                            marginVertical: 5
                                        }}
                                        editable={false}
                                        keyboardType='numeric'
                                        value={total.toString()}
                                    />
                                </View>
                            </View>

                            <Text style={[styles.sText, {
                                color: Colors.IconBlack,
                                textAlign: 'center',
                                marginTop: 10,
                                fontSize: 16
                            }]}>{i18n.t('total')} : <Text style={[styles.sText, {
                                color: Colors.sky,
                                textAlign: 'center',
                                marginTop: 10,
                                fontSize: 16
                            }]}>{total} {i18n.t('RS')}</Text></Text>


                            {
                                billSpinner ?
                                    <View style={[{ justifyContent: 'center', alignItems: 'center', marginTop: 30, marginBottom: 30 }]}>
                                        <ActivityIndicator size="large" color={Colors.sky} style={{ alignSelf: 'center' }} />
                                    </View> :
                                    <TouchableOpacity disabled={cost == 0 || base64 == '' ? true : false} onPress={setBill} style={{
                                        backgroundColor: Colors.sky,
                                        width: '92%',
                                        borderRadius: 20,
                                        padding: 15,
                                        marginTop: 20,
                                        marginHorizontal: '2%',
                                        marginBottom: 25
                                    }}>
                                        <Text style={[styles.sText, { color: Colors.bg, fontSize: 14 }]}>{i18n.t('send')}</Text>
                                    </TouchableOpacity>

                            }

                        </View>


                        {/* <BTN onPress={() => setBill()} title={i18n.t('send')} ContainerStyle={{ borderRadius: 35, marginBottom: 30, flex: .1, padding: 20, }} TextStyle={{ fontSize: 14, padding: 0, bottom: 10 }} /> */}

                    </View>
                </View>

            </RNModal>
            <Modal
                animationType="slide"
                transparent={true}
                style={{ bottom: -18, }}
                visible={EditMaodVisible} >

                <TouchableOpacity style={styles.centeredView2} onPress={() => setEditMaodVisible(false)}>

                    <View style={[styles.modalView2, { top: top }]}>
                        <View style={{ margin: 20, backgroundColor: Colors.bg }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                                <TouchableOpacity onPress={() => { setTop(10000); _pickImageFrpmCamera().then(() => setEditMaodVisible(false)) }} style={{ flexDirection: 'column', alignItems: 'center', backgroundColor: '#fff', padding: 10 }}>
                                    <Image source={require('../../../assets/images/camer.png')} resizeMode={'contain'} style={{ width: 35, height: 35 }} />
                                    <Text style={[styles.sText, { fontFamily: 'flatMedium', color: Colors.IconBlack }]}>{i18n.t('pickImg')} </Text>

                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setTop(10000); _pickImage().then(() => setEditMaodVisible(false)) }} style={{ flexDirection: 'column', alignItems: 'center', backgroundColor: '#fff', padding: 10 }}>
                                    <Image source={require('../../../assets/images/gallery.png')} resizeMode={'contain'} style={{ width: 35, height: 35 }} />
                                    <Text style={[styles.sText, { fontFamily: 'flatMedium', color: Colors.IconBlack }]}> {i18n.t('pickCamera')}</Text>

                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>

                </TouchableOpacity>
            </Modal>

            <RNModal
                onBackdropPress={() => setZoomBillModal(!zoomBillModal)}
                onBackButtonPress={() => setZoomBillModal(!zoomBillModal)}
                isVisible={zoomBillModal}
                style={{ width: "95%", alignSelf: 'center', }}
                avoidKeyboard={true}
            >
                <View style={[{ borderRadius: 5, backgroundColor: '#fff', width: '100%', overflow: 'hidden', height: height * 80 / 100 }]}>

                    <View style={{ alignItems: 'center', }}>
                        <View style={{ width: '100%', height: 50, backgroundColor: Colors.sky, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.sText, { color: '#fff', textAlign: 'center', marginTop: 10, fontSize: 16, lineHeight: 20 }]}>{i18n.t('showBill')}</Text>
                        </View>

                        <ImageZoom cropWidth={width * 95 / 100} cropHeight={height * 80 / 100} imageWidth={width * 95 / 100} imageHeight={height * 75 / 100}>
                            <Image source={{ uri: billImage }} style={{ width: '100%', height: '100%', borderRadius: 15, alignSelf: 'center', }} resizeMode={'cover'} />
                        </ImageZoom>

                    </View>
                </View>
            </RNModal>

            <Modal
                animationType="slide"
                transparent={true}
                style={{ bottom: -18, }}
                isVisible={ShowPay} >

                <View style={styles.centeredView2} >

                    <View style={[styles.modalView2, { height: height * .35 }]}>
                        <View style={{ margin: 20, backgroundColor: Colors.bg, }}>

                            <FlatList
                                data={PayWay}
                                horizontal
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View >
                                            <TouchableOpacity key={index} onPress={() => setGetPayment(item.name)} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginTop: 15 }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={{
                                                        height: 15,
                                                        width: 15,
                                                        borderRadius: 12,
                                                        borderWidth: 2,
                                                        borderColor: GetPayment === item.name ? Colors.sky : Colors.fontNormal,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}>
                                                        {
                                                            GetPayment === item.name ?
                                                                <View style={{
                                                                    height: 7,
                                                                    width: 7,
                                                                    borderRadius: 6,
                                                                    backgroundColor: Colors.sky,
                                                                }} />
                                                                : null
                                                        }
                                                    </View>
                                                </View>
                                                <Image source={item.image} resizeMode='contain' style={{ width: 100, height: 100 }} />
                                            </TouchableOpacity>
                                            <View style={{ height: 1, width: '100%', backgroundColor: '#ddd', marginTop: 15, }} />
                                        </View>
                                    )
                                }} />
                            <BTN title={i18n.t('confirm')} onPress={() => { setShowPay(false); setSpinnerPayment(true); setTimeout(() => setWebViews(true), 1000) }} disable={GetPayment == ''} />

                        </View>

                    </View>

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
                        source={{ uri: `https://drtawsel.aait-sa.com/payment/${order?.order_id}/${GetPayment}?fbclid=IwAR10qp1PR5Zc-FauPUzm0IGv8gHFvZAdUtZ6mgpdG57zPtJ5M2_zmEuIRz4` }}
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

        </View>
    )
}
const styles = StyleSheet.create({
    BigImg: {
        height: height * .15,
        width: width * .22,
    },
    MenueImg: {
        width: 18,
        height: 20,
        marginHorizontal: 4,

    },
    MenueIm: {
        width: width * .07,
        height: width * .07,
        marginHorizontal: 5

    },
    MenueImgs: {
        width: width * .03,
        height: width * .03,

    },
    Text: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: width * .04,
        textAlign: 'center',
        top: width * .19
    },
    sText: {
        fontFamily: 'flatLight',
        color: Colors.fontNormal,
        fontSize: 14,
        alignSelf: 'center'
    },
    starImg: {
        width: width * .04,
        height: width * .04,
        marginVertical: 5
    },
    ResImgNm: {
        width: 40,
        height: 40,
        borderRadius: 50,
        marginTop: height * .026,
        marginHorizontal: 5,
    },
    ResIm: {
        width: width * .16,
        height: width * .16,
        borderRadius: 50,
        marginTop: width * .05,
        alignSelf: 'center'

    },
    ResImg: {
        width: 27,
        height: 17,
        marginLeft: 65
    },
    SendIcon: {
        width: 45,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#737373',
        opacity: .9,
    },
    centeredView2: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        // backgroundColor: '#737373',
        // opacity: Platform.OS = 'ios' ? .7 : 1,

    },
    modalView2: {
        backgroundColor: "white",
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        width: width,
        height: height * .19,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 5,
        width: width * .9,
        height: height * .59,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5
    },
    containerTableTextOverInput: {
        height: width * .15,
        position: "relative",
        marginHorizontal: "5%",
        marginVertical: 10,
        justifyContent: 'center',
    },
    labelText: {
        left: 10,
        backgroundColor: Colors.bg,
        alignSelf: "flex-start",
        fontSize: width * .03,
        zIndex: 10,
        position: "absolute",
        fontFamily: 'flatMedium',
    },
    textInput: {
        flex: 1,
        justifyContent: "flex-end",
        paddingHorizontal: 25,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 5,
        color: Colors.fontNormal,
        textAlign: I18nManager.isRTL ? "right" : "left",
        fontFamily: "flatMedium",
        fontSize: 13,
    },
    image: {
        width: width * 0.04,
        maxWidth: width * 0.12,
        height: width * 0.06,
        maxHeight: width * 0.12,
        resizeMode: "contain",
        marginRight: 10,
        alignSelf: 'center'
    },
    bgModel: {
        width: "100%",
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'flex-end'
    },
})
export default OrderChatting
