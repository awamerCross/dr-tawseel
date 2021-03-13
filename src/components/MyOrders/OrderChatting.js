import React, { useState, useEffect, useRef } from 'react'
import { ScrollView, View, Image, TouchableOpacity, Text, StyleSheet, Dimensions, FlatList, Linking, TextInput, I18nManager, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'
import Colors from '../../consts/Colors';
import { InputIcon } from '../../common/InputText';

import { getInbox, sendNewMessage, delegateUpdateOrder, getCancelReasons, cancelOrder, sendRate, sendBill } from '../../actions';

import BTN from '../../common/BTN';
import Header from '../../common/Header';
import i18n from "../locale/i18n";
import StarRating from "react-native-star-rating";
import { useDispatch, useSelector } from "react-redux";

import RNModal from "react-native-modal";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

import Modal from "react-native-modal";
import { Textarea } from "native-base";
import { useIsFocused } from '@react-navigation/native';

window.navigator.userAgent = 'react-native';
import SocketIOClient from 'socket.io-client';
import { _renderRows } from '../../common/LoaderImage';
import { ToasterNative } from '../../common/ToasterNatrive';

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
    const order = useSelector(state => state.chat.messages.order ? state.chat.messages.order : null);
    const dispatch = useDispatch();
    const [msg, setMsg] = useState('');
    const [rateMsg, setRateMsg] = useState('');
    const [spinner, setSpinner] = useState(false);
    const isFocused = useIsFocused();

    console.log(order);
    const [showBillModal, setShowBillModal] = useState(false);
    const [cost, setCost] = useState(0);
    const ScrollViewRef = useRef();
    let total = Number(orderDetails.shipping) + Number(cost);

    const [selected, setisSelected] = useState(false);
    const [photo, setPhoto] = useState('');
    const [base64, setBase64] = useState('');
    const [starCount, setStarCount] = useState(0);
    const [IsDeliverMoadl, setIsDeliverMoadl] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [showRateModal, setShowRateModal] = useState(false);
    const [selectedRadion, setSelectedRadio] = useState(0)
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [data, setData] = useState([
        { id: 1, title: 'هذا النص هو مثال لنص يمكن ان يستبدل', },
        { id: 2, title: 'هذا النص هو مثال لنص يمكن ان يستبدل', },
        { id: 5, title: 'هذا النص هو مثال لنص يمكن ان يستبدل', }])

    function fetchData() {
        console.log('hhhhhh');
        setMsg('')
        dispatch(getInbox(lang, token, orderDetails.room)).then(() => ScrollViewRef.current.scrollToEnd({ animated: true }))
        dispatch(getCancelReasons(lang))
    }


    const askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
    };

    const _pickImage = async (i) => {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();

        if (status === 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,

                base64: true,
                aspect: [4, 3],
                quality: .5,
            });

            if (!result.cancelled) {
                setPhoto(result.uri);
                setBase64(result.base64);
            }

        }
        else {
            ToasterNative(i18n.t('CammeraErr'), "danger", 'top')

        }
    };

    const setBill = () => {
        dispatch(sendBill(lang, token, orderDetails.order_id, total, base64)).then(() => {
            setShowBillModal(!showBillModal)
            fetchData()
        })
    }

    function joinRoom() {
        socket.emit('subscribe-chat', { room: orderDetails.order_id });
    }




    useEffect(() => {

        if (isFocused) {
            fetchData()
            joinRoom()
            socket.on('get_message', () => fetchData());

        }


    }, [isFocused,]);

    function onSendMsg() {

        dispatch(sendNewMessage(lang, token, msg, orderDetails.order_id)).then(() => {
            fetchData()
            emitMsg();
            Keyboard.dismiss()

        })
    }

    function emitMsg() {
        socket.emit('send_message', { room: orderDetails.order_id, msg: 'msg' });
    }

    function updateOrder() {
        dispatch(delegateUpdateOrder(lang, token, orderDetails.order_id)).then(() => {
            fetchData()
            emitMsg();
        })
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
                <BTN title={i18n.t('send')} onPress={() => sendRateMsg()} ContainerStyle={{ marginTop: 30, borderRadius: 20, marginBottom: 30 }} TextStyle={{ fontSize: 13 }} />
            );

        } else {

            return (
                <BTN title={i18n.t('send')} ContainerStyle={[styles.Btn, { marginTop: 30, borderRadius: 20, marginBottom: 30, backgroundColor: '#ccc' }]} TextStyle={{ fontSize: 13 }} />
            );

        }

    }

    function sendRateMsg() {
        setIsSubmitted(true)
        dispatch(sendRate(lang, token, order.delegate_id, starCount, rateMsg)).then(() => { setIsSubmitted(false); navigation.navigate('SuccessEvaluation'); setShowRateModal(false) })
        setRateMsg('');
        setStarCount(0);
    }
    let loadingAnimated = []

    function renderMessage(message, i) {
        console.log(message);
        if (message.sender) {
            return (
                <View key={i} style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ flexBasis: '16%', alignItems: 'center', marginTop: 5 }}>
                        <Image source={{ uri: message.img }} style={{ width: 40, height: 40, borderRadius: 50, }} />
                    </View>
                    <View style={{ flexBasis: '82%', paddingHorizontal: 5 }}>
                        <View style={{ backgroundColor: message.type === 'bill' ? 'transparent' : Colors.sky, borderRadius: 15, overflow: 'hidden', flexDirection: "row", alignSelf: 'flex-start', alignItems: "center", justifyContent: 'center', flexWrap: 'wrap' }}>
                            {
                                message.type === 'image' ?
                                    <Image source={{ uri: message.message }} style={{ width: '100%', height: 220, borderRadius: 15, alignSelf: 'center', }} resizeMode={'contain'} />
                                    :
                                    message.type === 'bill' ?
                                        <View style={{ flexDirection: 'row', backgroundColor: Colors.sky, alignItems: 'center', padding: 10 }}>
                                            <View style={{ flex: 1, alignItems: 'flex-start' }}>
                                                <Text style={[styles.sText, { fontSize: 12, color: Colors.fontBold, padding: 5, alignSelf: 'flex-start' }]}>{JSON.parse(message.message).tax_number_text}:</Text>
                                                <Text style={[styles.sText, { color: Colors.fontBold, fontSize: 12, alignSelf: 'flex-start', padding: 5, }]}>{JSON.parse(message.message).sum_text}</Text>
                                                <Text style={[styles.sText, { fontSize: 12, color: Colors.fontBold, alignSelf: 'flex-start', padding: 5, }]}>{JSON.parse(message.message).vat_text} :</Text>
                                                <Text style={[styles.sText, { color: Colors.fontBold, fontSize: 10, alignSelf: 'flex-start', padding: 5, }]}>{JSON.parse(message.message).delivery_text}  </Text>
                                                <Text style={[styles.sText, { fontSize: 14, color: Colors.fontBold, margin: 5, alignSelf: 'flex-start', padding: 5, }]}>{JSON.parse(message.message).total_text} : </Text>

                                            </View>

                                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                <Text style={[styles.sText, { fontSize: 10, color: '#fff', padding: 5, fontFamily: 'flatMedium', }]}>{JSON.parse(message.message).tax_number}</Text>
                                                <Text style={[styles.sText, { padding: 5, color: '#fff', fontSize: 10, fontFamily: 'flatMedium', }]}>{JSON.parse(message.message).sum}</Text>
                                                <Text style={[styles.sText, { fontSize: 10, color: '#fff', padding: 5, fontFamily: 'flatMedium', }]}>{JSON.parse(message.message).vat}</Text>
                                                <Text style={[styles.sText, { color: '#fff', fontSize: 12, padding: 5, fontFamily: 'flatMedium', }]}>{JSON.parse(message.message).delivery}</Text>

                                                <Text style={[styles.sText, { fontSize: 16, color: '#fff', padding: 5, margin: 5, fontFamily: 'flatMedium', }]}>{JSON.parse(message.message).total}</Text>


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
                <View style={{ flexBasis: '16%', alignItems: 'center', marginTop: 5 }}>
                    <Image source={{ uri: message.img }} style={{ width: 40, height: 40, borderRadius: 50, }} />
                </View>
                <View style={{ flexBasis: '80%', paddingHorizontal: 5 }}>
                    <View style={{ backgroundColor: Colors.fontNormal, borderRadius: 15, flexDirection: "row", alignSelf: 'flex-end', alignItems: "center", justifyContent: 'center', flexWrap: 'wrap' }}>
                        {
                            message.type === 'image' ?
                                <Image source={{ uri: message.message }} style={{ width: '100%', height: 220, borderRadius: 15, alignSelf: 'center' }} resizeMode={'cover'} />
                                :
                                message.type === 'bill' ?
                                    <View style={{ flexDirection: 'row', backgroundColor: '#DBDBDB', alignItems: 'center', padding: 10 }}>
                                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                                            <Text style={[styles.sText, { fontSize: 12, color: Colors.fontBold, padding: 5, alignSelf: 'flex-start' }]}>{JSON.parse(message.message).tax_number_text}:</Text>
                                            <Text style={[styles.sText, { color: Colors.fontBold, fontSize: 12, alignSelf: 'flex-start', padding: 5, }]}>{JSON.parse(message.message).sum_text}</Text>
                                            <Text style={[styles.sText, { fontSize: 12, color: Colors.fontBold, alignSelf: 'flex-start', padding: 5, }]}>{JSON.parse(message.message).vat_text} :</Text>
                                            <Text style={[styles.sText, { color: Colors.fontBold, fontSize: 12, alignSelf: 'flex-start', padding: 5, }]}>{JSON.parse(message.message).delivery_text}  </Text>
                                            <Text style={[styles.sText, { fontSize: 12, color: Colors.fontBold, margin: 5, alignSelf: 'flex-start', padding: 5, }]}>{JSON.parse(message.message).total_text} : </Text>

                                        </View>

                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                            <Text style={[styles.sText, { fontSize: 10, color: Colors.sky, padding: 5, fontFamily: 'flatMedium', }]}>{JSON.parse(message.message).tax_number}</Text>
                                            <Text style={[styles.sText, { padding: 5, color: Colors.sky, fontSize: 10, fontFamily: 'flatMedium', }]}>{JSON.parse(message.message).sum}</Text>
                                            <Text style={[styles.sText, { fontSize: 10, color: Colors.sky, padding: 5, fontFamily: 'flatMedium', }]}>{JSON.parse(message.message).vat}</Text>
                                            <Text style={[styles.sText, { color: Colors.sky, fontSize: 12, padding: 5, fontFamily: 'flatMedium', }]}>{JSON.parse(message.message).delivery}</Text>

                                            <Text style={[styles.sText, { fontSize: 16, color: Colors.sky, padding: 5, margin: 5, fontFamily: 'flatMedium', }]}>{JSON.parse(message.message).total}</Text>


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
    // console.log(order);
    return (
        <View style={{ flex: 1, }}>
            <Header navigation={navigation} label={i18n.t('orderDetails')} />
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
                                    <TouchableOpacity onPress={() => setShowBillModal(!showBillModal)} >
                                        <Image source={require('../../../assets/images/chat_bill.png')} style={styles.ResImgNm} />
                                    </TouchableOpacity> : null
                            }

                            <TouchableOpacity onPress={() => Linking.openURL('tel:' + receiver.phone)} >
                                <Image source={require('../../../assets/images/callchat.png')} style={styles.ResImgNm} />
                            </TouchableOpacity>
                            {
                                user && user.user_type === 2 ?
                                    <TouchableOpacity onPress={() => navigation.navigate('Followrepresentative', { address: orderDetails.address, orderDetails })}>
                                        <Image source={require('../../../assets/images/mapchat.png')} style={[styles.ResImgNm]} />
                                    </TouchableOpacity>
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
                            <Text style={[styles.sText, { color: '#fff' }]}>{button.button_text}</Text>
                            <TouchableOpacity onPress={() => updateOrder()} style={{ backgroundColor: '#fff', height: 35, alignItems: 'center', padding: 3, borderRadius: 5, width: 70, justifyContent: 'center' }}>
                                <Text style={[styles.sText, { color: Colors.sky }]}>{i18n.t('confirm')}</Text>
                            </TouchableOpacity>
                        </View> : null
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
                                    <BTN title={i18n.t('sendRate')} onPress={() => { setIsDeliverMoadl(false); navigation.navigate('SuccessEvaluation') }} ContainerStyle={{ marginTop: 10, borderRadius: 20, }} TextStyle={{ fontSize: 13 }} />
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
                                keyExtractor={(item) => item.id}
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
                                        <Image source={require('../../../assets/images/more_gray.png')} style={{ width: 6 }} resizeMode='contain' />
                                    </TouchableOpacity>
                                    : null
                            }


                            <View style={[styles.containerTableTextOverInput, { height: 40, marginTop: width * .03, width: '80%', marginHorizontal: 9 }]}>
                                <TextInput
                                    style={[styles.textInput, { borderColor: Colors.fontNormal }, { borderRadius: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }]}
                                    value={msg}
                                    onChangeText={setMsg}
                                    onFocus={() => ScrollViewRef.current.scrollToEnd({ animated: true })}
                                    placeholder={i18n.t('writeUrMsg')}
                                />
                            </View>

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
                style={{ width: "95%", flex: 1, alignSelf: 'center', }}
                avoidKeyboard={true}
            >


                <View style={[{ borderRadius: 5, backgroundColor: '#fff', width: '100%', overflow: 'hidden', }]}>

                    <View style={{ alignItems: 'center', }}>
                        <View style={{ width: '100%', height: 50, backgroundColor: Colors.sky, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.sText, { color: '#fff', textAlign: 'center', marginTop: 10, fontSize: 16, lineHeight: 20 }]}>{i18n.t('exportBill')}</Text>
                        </View>
                        <View style={{ width: '100%' }}>
                            <View style={{ marginTop: 40, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                    <InputIcon
                                        label={i18n.t('productsCost')}
                                        inputStyle={{ borderRadius: 30, height: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                                        styleCont={{ height: 45, width: '90%' }}
                                        LabelStyle={{ bottom: 50, backgroundColor: 0, color: Colors.IconBlack, left: 5, marginVertical: 5 }}
                                        onChangeText={setCost}
                                        editable={true}
                                        keyboardType='numeric'
                                    // value={cityName ? cityName : ''}
                                    />
                                </View>
                            </View>

                            <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                    <InputIcon
                                        label={i18n.t('productsCostWithShaping')}
                                        inputStyle={{ borderRadius: 30, height: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                                        styleCont={{ height: 45, width: '90%' }}
                                        LabelStyle={{ bottom: 50, backgroundColor: 0, color: Colors.IconBlack, left: 5, marginVertical: 5 }}
                                        editable={false}
                                        keyboardType='numeric'
                                        value={total.toString()}
                                    />
                                </View>
                            </View>

                            <Text style={[styles.sText, { color: Colors.IconBlack, textAlign: 'center', marginTop: 10, fontSize: 16 }]}>{i18n.t('total')} :  <Text style={[styles.sText, { color: Colors.sky, textAlign: 'center', marginTop: 10, fontSize: 16 }]}>{total}  {i18n.t('RS')}</Text></Text>

                            <View>
                                <TouchableOpacity onPress={_pickImage}>
                                    <Image source={photo === '' ? require('../../../assets/images/fileupload.png') : { uri: photo }} style={{ width: '100%', height: photo === '' ? 80 : 200, marginTop: 20, borderRadius: 15 }} resizeMode='contain' />
                                </TouchableOpacity>
                            </View>


                            <Text style={[styles.sText, { textAlign: 'center', marginTop: 5 }]}>{i18n.t('uploadImg')}</Text>

                        </View>
                        <TouchableOpacity onPress={setBill} style={{ backgroundColor: Colors.sky, width: '92%', borderRadius: 20, padding: 15, marginTop: 20, marginHorizontal: '2%', marginBottom: 5 }}>
                            <Text style={[styles.sText, { color: Colors.bg, fontSize: 14 }]}>{i18n.t('send')}</Text>
                        </TouchableOpacity>
                        {/* <BTN onPress={() => setBill()} title={i18n.t('send')} ContainerStyle={{ borderRadius: 35, marginBottom: 30, flex: .1, padding: 20, }} TextStyle={{ fontSize: 14, padding: 0, bottom: 10 }} /> */}

                    </View>

                </View>

            </RNModal>

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
        marginHorizontal: 10,
        alignSelf: 'center'
    },
    starImg: {
        width: width * .04,
        height: width * .04,
        marginVertical: 5
    },
    ResImgNm: {
        width: width * .1,
        height: width * .1,
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
        width: width * .1,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#737373',
        opacity: .9,
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
