import React, { useState, useEffect } from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Platform, } from 'react-native'
import { Text, Icon } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { delegateUpdateOrder, getOrderDetails } from '../../actions';
import * as Location from 'expo-location'
import Container from '../../common/Container';
import Colors from '../../consts/Colors';
import BTN from '../../common/BTN';
import Header from '../../common/Header';
import i18n from "../locale/i18n";
window.navigator.userAgent = 'react-native';
import SocketIOClient from 'socket.io-client';
import CountDown from 'react-native-countdown-component';
import Modal from "react-native-modal";
import * as Linking from 'expo-linking';

const { width, height } = Dimensions.get('window')
const isIOS = Platform.OS === 'ios';

function OrderDetailes({ navigation, route }) {

    const socket = SocketIOClient('https://drtawsel.4hoste.com:4544/', {jsonp: false});
    const {orderId, latitude, longitude} = route.params;
    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null);
    const user = useSelector(state => state.Auth ? state.Auth.user ? state.Auth.user.data : null : null)
    const orderDetails = useSelector(state => state.orders.orderDetails);
    const dispatch = useDispatch();
    const [spinner, setSpinner] = useState(false);
    const [toggle, setToggle] = useState(true)
    const [Isopen, setIsOpen] = useState(false)
    const [click, setClick] = useState(false)
    const [clickImg, setClickImg] = useState(false)
    const [openedImg, setOpenedImg] = useState('')
    const [ModelProduct, setModelProduct] = useState([])

    const [counterID, setCounterID] = useState(1);

    function fetchData() {
        setSpinner(true)
        dispatch(getOrderDetails(lang, token, orderId, latitude, longitude)).then(() => setSpinner(false))
    }

    function getLocation() {
        Location.watchPositionAsync({
            enableHighAccuracy: true,
            distanceInterval: 50,
            timeInterval: 5000
        }, (position) => {
            joinRoom({
                lat: position.coords.latitude,
                long: position.coords.longitude,
                room: orderDetails.order_id
            })
        });
    }

    function joinRoom(data) {
        socket.emit('subscribe', {room: data.room});
        socket.emit('delegate_Updated', data);
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchData()

            if (user && user.user_type === 3) {
                getLocation();
            }
        })
        return unsubscribe
    }, [navigation, orderId, socket]);

    function onDeliverOrder() {
        dispatch(delegateUpdateOrder(lang, token, orderDetails.order_id)).then(() => {
            fetchData()
        })
    }

    const OpenURL = (url) => {
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }

    function checkOrderStatus(orderStatus, currentStatus) {
        if (currentStatus === 'PROGRESS') {
            if (orderStatus === 'PROGRESS'
                || orderStatus === 'READY'
                || orderStatus === 'DELEGATEACCEPT'
                || orderStatus === 'DELEGATEARRIVED'
                || orderStatus === 'DELIVEREDTODELEGATE'
                || orderStatus === 'ONWAY'
                || orderStatus === 'ARRIVED'
                || orderStatus === 'DELIVER'
                || orderStatus === 'DELIVERED') {
                return true
            }
        } else if (currentStatus === 'READY') {
            if (orderStatus === 'READY'
                || orderStatus === 'DELEGATEACCEPT'
                || orderStatus === 'DELEGATEARRIVED'
                || orderStatus === 'DELIVEREDTODELEGATE'
                || orderStatus === 'ONWAY'
                || orderStatus === 'ARRIVED'
                || orderStatus === 'DELIVER'
                || orderStatus === 'DELIVERED') {
                return true
            }
        } else if (currentStatus === 'DELEGATEACCEPT') {
            if (orderStatus === 'DELEGATEACCEPT'
                || orderStatus === 'DELEGATEARRIVED'
                || orderStatus === 'DELIVEREDTODELEGATE'
                || orderStatus === 'ONWAY'
                || orderStatus === 'ARRIVED'
                || orderStatus === 'DELIVER'
                || orderStatus === 'DELIVERED') {
                return true
            }
        } else if (currentStatus === 'DELEGATEARRIVED') {
            if (orderStatus === 'DELEGATEARRIVED'
                || orderStatus === 'DELIVEREDTODELEGATE'
                || orderStatus === 'ONWAY'
                || orderStatus === 'ARRIVED'
                || orderStatus === 'DELIVER'
                || orderStatus === 'DELIVERED') {
                return true
            }
        }
    }

    function navigateToMap(lat, lng) {
        const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
        const latLng = `${lat},${lng}`;
        const label = 'Custom Label';
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });


        Linking.openURL(url);
    }

    return (
        <Container loading={spinner}>
            {
                orderDetails ?
                    <View style={{flex: 1, backgroundColor: Colors.bg}}>
                        <Header navigation={navigation} label={i18n.t('orderDetails')}/>
                        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>

                            <View style={styles.card}>
                                {
                                    orderDetails && orderDetails.provider ?
                                        <View style={{flexDirection: 'row', flex: .75}}>
                                            <View style={{
                                                backgroundColor: '#f8f8f8',
                                                width: 70,
                                                height: 70,
                                                borderRadius: 5,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <Image source={{uri: orderDetails.provider.avatar}}
                                                       style={styles.ImgCard} resizeMode={'cover'}/>
                                            </View>
                                            <View style={{flexDirection: 'column', justifyContent: 'center',}}>
                                                <Text style={[styles.sText, {
                                                    alignSelf: 'flex-start',
                                                    fontSize: 14,
                                                    color: Colors.fontBold
                                                }]}>{(orderDetails.provider.name).substr(0, 20)}</Text>
                                                <Text style={[styles.yText, {
                                                    alignSelf: 'flex-start',
                                                    fontSize: 12,
                                                }]}>{orderDetails.date}</Text>
                                                <Text style={[styles.yText, {
                                                    alignSelf: 'flex-start',
                                                    fontSize: 12,
                                                }]}>{orderDetails.provider.phone}</Text>
                                                <Text style={[styles.yText, {
                                                    alignSelf: 'flex-start',
                                                    fontSize: 12,
                                                }]}>{(orderDetails.provider.address).substr(0, 30)}</Text>
                                            </View>
                                        </View> : null
                                }

                                <View style={[styles.sLine]}/>
                                <View style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flex: .25
                                }}>
                                    <Text style={[styles.sText, {
                                        color: Colors.sky,
                                        marginHorizontal: 0
                                    }]}>{i18n.t('orderNum')}</Text>
                                    <Text style={[styles.sText, {marginVertical: 5}]}>{orderDetails.order_id}</Text>
                                </View>
                            </View>

                            {
                                orderDetails.type !== 'special' &&
                                orderDetails.status == 'PROGRESS' ?
                                    <View>
                                        <Text style={{
                                            marginHorizontal: 30,
                                            fontFamily: 'flatMedium',
                                        }}>{i18n.t('WaitOrders')}</Text>
                                        <CountDown
                                            id={counterID}
                                            until={orderDetails.end_seconds}
                                            size={20}
                                            // onFinish={() => { setShowCounter(false); }}
                                            digitStyle={{backgroundColor: '#FFF'}}
                                            digitTxtStyle={{color: Colors.sky}}
                                            timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
                                            separatorStyle={{color: Colors.sky}}
                                            timeToShow={['H', 'M', 'S']}
                                            timeLabels={{m: null, s: null}}
                                            showSeparator={true}
                                            style={{flexDirection: 'row-reverse', justifyContent: 'center'}}
                                        />
                                    </View>
                                    :
                                    orderDetails.status == 'WAITING' ?
                                        <Text style={{
                                            marginHorizontal: 30,
                                            fontFamily: 'flatMedium',
                                            alignSelf: 'flex-start',
                                            marginVertical: 20,
                                        }}>{i18n.t('WaiOrders')}</Text>
                                        : null
                            }
                            {

                                orderDetails.type !== 'special' ?
                                    <View>
                                        <View style={[styles.warb, {alignItems: 'flex-start'}]}>
                                            <Text style={styles.aloneText}>{i18n.t('followOrder')}</Text>
                                        </View>

                                        <View style={{
                                            paddingHorizontal: width * .03,
                                            paddingTop: 20,
                                            backgroundColor: '#fff'
                                        }}>
                                            <View style={styles.followStep}>
                                                <View style={[styles.skyCircle,
                                                    {
                                                        backgroundColor: checkOrderStatus(orderDetails.status, 'PROGRESS') ? Colors.sky : '#fff',
                                                        borderColor: checkOrderStatus(orderDetails.status, 'PROGRESS') ? Colors.sky : Colors.fontNormal
                                                    }]}>
                                                    <Icon type={'Feather'} name={'check'} style={[styles.checkCircle]}/>
                                                </View>
                                                <Text
                                                    style={[styles.nText, {marginHorizontal: 0}]}>{i18n.t('progressOrder')}</Text>
                                                <View style={[styles.stepLine,
                                                    {backgroundColor: checkOrderStatus(orderDetails.status, 'PROGRESS') ? Colors.sky : Colors.fontNormal,}]}/>
                                            </View>

                                            <View style={[styles.followStep]}>
                                                <View style={[styles.skyCircle,
                                                    {
                                                        backgroundColor: checkOrderStatus(orderDetails.status, 'READY') ? Colors.sky : '#fff',
                                                        borderColor: checkOrderStatus(orderDetails.status, 'READY') ? Colors.sky : Colors.fontNormal
                                                    }]}>
                                                    <Icon type={'Feather'} name={'check'} style={[styles.checkCircle]}/>
                                                </View>
                                                <Text
                                                    style={[styles.nText, {marginHorizontal: 0}]}>{i18n.t('readyOrder')}</Text>
                                                <View style={[styles.stepLine,
                                                    {backgroundColor: checkOrderStatus(orderDetails.status, 'READY') ? Colors.sky : Colors.fontNormal,}]}/>
                                            </View>

                                            <View style={[styles.followStep]}>
                                                <View style={[styles.skyCircle,
                                                    {
                                                        backgroundColor: checkOrderStatus(orderDetails.status, 'DELEGATEACCEPT') ? Colors.sky : '#fff',
                                                        borderColor: checkOrderStatus(orderDetails.status, 'DELEGATEACCEPT') ? Colors.sky : Colors.fontNormal
                                                    }]}>
                                                    <Icon type={'Feather'} name={'check'} style={[styles.checkCircle]}/>
                                                </View>
                                                <Text
                                                    style={[styles.nText, {marginHorizontal: 0}]}>{i18n.t('delegateAccept')}</Text>
                                                <View style={[styles.stepLine,
                                                    {backgroundColor: checkOrderStatus(orderDetails.status, 'DELEGATEACCEPT') ? Colors.sky : Colors.fontNormal,}]}/>
                                            </View>

                                            <View style={[styles.followStep]}>
                                                <View style={[styles.skyCircle,
                                                    {
                                                        backgroundColor: checkOrderStatus(orderDetails.status, 'DELEGATEARRIVED') ? Colors.sky : '#fff',
                                                        borderColor: checkOrderStatus(orderDetails.status, 'DELEGATEARRIVED') ? Colors.sky : Colors.fontNormal
                                                    }]}>
                                                    <Icon type={'Feather'} name={'check'} style={[styles.checkCircle]}/>
                                                </View>
                                                <Text
                                                    style={[styles.nText, {marginHorizontal: 0}]}>{i18n.t('delegateArrived')}</Text>
                                            </View>
                                        </View>
                                    </View>


                                    : null

                            }

                            <View style={{flexDirection: 'column', borderWidth: 1, borderColor: '#ddd', marginTop: 5}}>
                                <View style={styles.accordion}>
                                    <Text style={[styles.DText, {
                                        color: Colors.sky,
                                        fontSize: 16
                                    }]}>{i18n.t('deliverLocation')}</Text>
                                </View>


                                {
                                    orderDetails.address && orderDetails.address.address_provider ?
                                        <View style={[{
                                            width: '100%',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            paddingHorizontal: 15,
                                            backgroundColor: '#fff',
                                            borderWidth: 1,
                                            borderColor: '#ddd',
                                            height: 50,
                                        }]}>
                                            <Image source={require('../../../assets/images/pinblue.png')}
                                                   style={{width: 20, height: 20}} resizeMode={'contain'}/>
                                            <Text
                                                style={[styles.nText, {fontSize: 13}]}>{(orderDetails.address.address_provider).substr(0, 25)}...</Text>

                                            <TouchableOpacity
                                                onPress={() => navigateToMap(orderDetails.address.latitude_provider, orderDetails.address.longitude_provider)}>
                                                <Text
                                                    style={[styles.nText, {color: Colors.sky}]}>( {i18n.t('seeLocation')} )</Text>
                                            </TouchableOpacity>
                                        </View> : null
                                }


                                <View style={styles.accordion}>
                                    <Text style={[styles.DText, {
                                        color: Colors.sky,
                                        fontSize: 16
                                    }]}>{i18n.t('receiveLocation')}</Text>

                                </View>
                                {
                                    orderDetails.address ?
                                        <View style={[{
                                            width: '100%',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            paddingHorizontal: 15,
                                            backgroundColor: '#fff',
                                            borderWidth: 1,
                                            borderColor: '#ddd',
                                            height: 50,
                                        }]}>
                                            <Image source={require('../../../assets/images/pinblue.png')}
                                                   style={{width: 20, height: 20}} resizeMode={'contain'}/>
                                            <Text
                                                style={[styles.nText, {fontSize: 13}]}>{(orderDetails.address.address_to).substr(0, 25)}...</Text>

                                            <TouchableOpacity
                                                onPress={() => navigateToMap(orderDetails.address.latitude_to, orderDetails.address.longitude_to)}>
                                                <Text
                                                    style={[styles.nText, {color: Colors.sky}]}>( {i18n.t('seeLocation')} )</Text>
                                            </TouchableOpacity>
                                        </View> : null
                                }
                            </View>


                            <View style={{flexDirection: 'column', borderWidth: 1, borderColor: '#ddd', marginTop: 5}}>
                                <View style={styles.accordion}>
                                    <Text style={[styles.DText, {
                                        color: Colors.sky,
                                        fontSize: 16
                                    }]}>{i18n.t('payMethod')}</Text>
                                </View>

                                <View style={[{
                                    width: '100%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingHorizontal: 15,
                                    backgroundColor: '#fff',
                                    borderWidth: 1,
                                    borderColor: '#ddd',
                                    height: 50,
                                }]}>
                                    <Icon type={'FontAwesome'} name={'money'}
                                          style={{color: Colors.sky, fontSize: 15}}/>
                                    <Text style={[styles.nText, {fontSize: 13}]}>{orderDetails.payment_text}</Text>
                                </View>
                            </View>

                            <TouchableOpacity onPress={() => {
                                setToggle(!toggle), setIsOpen(false)
                            }}>
                                <View style={styles.accordion}>
                                    <Text style={[styles.DText, {
                                        color: Colors.sky,
                                        fontSize: 16
                                    }]}>{i18n.t('orderDetails')}</Text>
                                    <Image
                                        source={toggle ? require('../../../assets/images/arro.png') : require('../../../assets/images/arrblue.png')}
                                        style={{width: 10, height: 10, alignSelf: 'center', marginHorizontal: 20}}
                                        resizeMode={'contain'}/>
                                </View>
                            </TouchableOpacity>

                            <View>
                                {
                                    toggle ?
                                        <>
                                            {
                                                orderDetails.type != 'special' ?
                                                    orderDetails.products && orderDetails.products.map((product, i) => (
                                                        <View key={i} style={{
                                                            width: '100%',
                                                            backgroundColor: '#f8f8f8',
                                                            marginBottom: 5,
                                                            flex: 1
                                                        }}>
                                                            <View style={{
                                                                flexDirection: 'row',
                                                                width: '100%',
                                                                backgroundColor: '#fff',
                                                                borderWidth: 1,
                                                                borderColor: '#ddd',
                                                                height: 50,
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                alignSelf: 'flex-start'
                                                            }}>

                                                                <Text style={[styles.nText, {
                                                                    color: Colors.sky,
                                                                    fontSize: 11,
                                                                }]}>{product.name.length > 15 ? (product.name).substr(0, 15) + '...' : product.name}</Text>
                                                                <TouchableOpacity onPress={() => {
                                                                    setClick(true);
                                                                    setModelProduct(product)
                                                                }}>

                                                                    <Text style={[styles.oText, {
                                                                        color: Colors.fontBold,
                                                                        fontSize: 12,
                                                                        marginHorizontal: 8,
                                                                        fontFamily: 'flatMedium',
                                                                    }]}>({i18n.t('details')})</Text>
                                                                </TouchableOpacity>
                                                                <Text style={[styles.nText, {
                                                                    fontSize: 10,
                                                                    color: Colors.sky
                                                                }]}>( {product.price} {i18n.t('RS')})</Text>

                                                                {/* <View style={{ borderRightWidth: 1, borderRightColor: Colors.sky, paddingHorizontal: 10, }}>
                                                                </View> */}
                                                                <Text style={{
                                                                    color: Colors.fontNormal,
                                                                    fontFamily: 'flatMedium',
                                                                }}>{i18n.t('total')} :</Text>
                                                                <Text
                                                                    style={[styles.nText, {color: Colors.sky}]}> {orderDetails.total} {i18n.t('RS')}</Text>

                                                            </View>
                                                        </View>
                                                    ))
                                                    :
                                                    <View style={{width: '100%'}}>
                                                        <View style={{flexDirection: 'row'}}>
                                                            {
                                                                orderDetails.images.map((img, i) => (
                                                                    <TouchableOpacity onPress={() => {
                                                                        setClickImg(true);
                                                                        setOpenedImg(img)
                                                                    }} style={{flexDirection: 'row', padding: 5}}>
                                                                        <Image source={{uri: img}} key={i} style={{
                                                                            width: 100,
                                                                            height: 100,
                                                                            borderRadius: 5,
                                                                            marginHorizontal: 5
                                                                        }} resizeMode={'contain'}/>
                                                                    </TouchableOpacity>
                                                                ))
                                                            }
                                                        </View>
                                                        <Text
                                                            style={[styles.sText, {alignSelf: 'flex-start'}]}> {orderDetails.details} </Text>
                                                    </View>
                                            }
                                        </>
                                        : null

                                }

                                <Modal
                                    onBackdropPress={() => setClick(false)}
                                    onBackButtonPress={() => setClick(false)}
                                    isVisible={click}
                                    style={{flex: 1, alignSelf: 'center',}}
                                >

                                    <View style={styles.modalView}>


                                        <View style={{
                                            backgroundColor: Colors.sky,
                                            width: '100%',
                                            height: height * .08,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'row'
                                        }}>
                                            <Text
                                                style={[styles.modetext, {color: Colors.bg,}]}>{i18n.t('details')}</Text>
                                        </View>
                                        <View style={{flexDirection: 'column', marginTop: 10, marginLeft: 10,}}>

                                            {
                                                !ModelProduct.extras ?
                                                    <Text
                                                        style={{
                                                            fontFamily: 'flatMedium',
                                                            color: Colors.IconBlack,
                                                            fontSize: width * .04,
                                                        }}>
                                                        {i18n.t('noDetailss')}
                                                    </Text> :
                                                    ModelProduct.extras.map((ex, i) => {
                                                        return (
                                                            <View style={{flexDirection: 'row', alignItems: 'center'}}
                                                                  key={'_' + i}>
                                                                <Text style={[styles.modetext, {
                                                                    color: Colors.IconBlack,
                                                                    marginVertical: 5
                                                                }]}>{ex.name}</Text>
                                                                <Text style={[styles.modetext, {
                                                                    color: Colors.sky,
                                                                    marginVertical: 5
                                                                }]}>{ex.price} {i18n.t('RS')}</Text>
                                                            </View>
                                                        )
                                                    })}

                                            <View style={{flexDirection: 'row'}}>
                                                <Text
                                                    style={[styles.nText, {color: Colors.fontNormal}]}> {i18n.t('quantity')} : </Text>
                                                <Text style={[styles.nText]}> ({ModelProduct.quantity})</Text>
                                            </View>

                                            <View style={{flexDirection: 'row'}}>
                                                <Text
                                                    style={[styles.nText, {color: Colors.fontNormal}]}> {i18n.t('taxes')} : </Text>
                                                <Text
                                                    style={[styles.nText]}> ({orderDetails.added_value} {i18n.t('RS')})</Text>
                                            </View>

                                            <View style={{flexDirection: 'row'}}>
                                                <Text
                                                    style={[styles.nText, {color: Colors.fontNormal}]}> {i18n.t('delevierPrice')} : </Text>
                                                <Text
                                                    style={[styles.nText]}> ({orderDetails.shipping} {i18n.t('RS')})</Text>
                                            </View>

                                        </View>

                                    </View>

                                </Modal>
                                {
                                    orderDetails && orderDetails.images ?

                                        <Modal
                                            onBackdropPress={() => setClickImg(false)}
                                            onBackButtonPress={() => setClickImg(false)}
                                            isVisible={clickImg}
                                            style={{flex: 1, alignSelf: 'center',}}
                                        >

                                            <View style={[styles.modalView, {paddingBottom: 5,}]}>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    padding: 5,
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>
                                                    <Image source={{uri: openedImg}} style={{
                                                        width: '100%',
                                                        height: 400,
                                                        borderRadius: 5,
                                                    }} resizeMode={'contain'}/>
                                                </View>
                                            </View>

                                        </Modal>
                                        : null
                                }
                                {
                                    user && user.user_type === 2 && orderDetails.delegate && orderDetails.status !== 'DELIVERED' ?
                                        <View style={{flexDirection: 'column'}}>
                                            <Text style={[styles.nText, {
                                                marginHorizontal: width * .08,
                                                marginVertical: 10
                                            }]}>{i18n.t('RebName')}</Text>
                                            <View style={[styles.warb, {
                                                width: '90%',
                                                alignSelf: 'center',
                                                borderRadius: 3,
                                                paddingHorizontal: 20
                                            }]}>
                                                <Text
                                                    style={[styles.nText, {alignSelf: 'flex-start'}]}>{orderDetails.delegate.name}</Text>
                                            </View>

                                            <Text style={[styles.nText, {
                                                marginHorizontal: width * .08,
                                                marginVertical: 10
                                            }]}>{i18n.t('phone')}</Text>
                                            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                                                <View style={[styles.warb, {
                                                    width: '70%',
                                                    borderRadius: 3,
                                                    paddingHorizontal: 20
                                                }]}>
                                                    <Text
                                                        style={[styles.nText, {textAlign: 'left'}]}>{orderDetails.delegate.phone}</Text>
                                                </View>
                                                <TouchableOpacity
                                                    onPress={() => Linking.openURL(`tel://${orderDetails.delegate.phone}`)}
                                                    style={{
                                                        backgroundColor: Colors.sky,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        borderRadius: 5
                                                    }}>
                                                    <Text
                                                        style={[styles.aloneText, {color: '#fff'}]}>{i18n.t('call')}</Text>
                                                </TouchableOpacity>
                                            </View>

                                            <TouchableOpacity style={{marginTop: 20}}
                                                              onPress={() => navigation.navigate('Followrepresentative', {
                                                                  address: orderDetails.address,
                                                                  orderDetails
                                                              })}>
                                                <Text
                                                    style={[styles.aloneText, {textAlign: 'center',}]}>({i18n.t('delegateTracking')})</Text>
                                            </TouchableOpacity>
                                        </View>

                                        : null
                                }

                                {
                                    user && orderDetails.user && user.user_type === 3 && orderDetails.status !== 'DELIVERED' ?
                                        <View style={{
                                            flexDirection: 'column',
                                            borderWidth: 1,
                                            borderColor: '#ddd',
                                            marginTop: 5
                                        }}>
                                            <View style={styles.accordion}>
                                                <Text style={[styles.DText, {
                                                    color: Colors.sky,
                                                    fontSize: 16
                                                }]}>{i18n.t('clientName')}</Text>
                                            </View>

                                            <View style={[{
                                                width: '100%',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                paddingHorizontal: 15,
                                                backgroundColor: '#fff',
                                                borderWidth: 1,
                                                borderColor: '#ddd',
                                                height: 50,
                                            }]}>
                                                <Image source={{uri: orderDetails.user.avatar}}
                                                       style={{width: 45, height: 45, borderRadius: 5}}
                                                       resizeMode={'contain'}/>
                                                <Text style={[styles.nText]}>{orderDetails.user.name}</Text>
                                                {
                                                    orderDetails.status !== 'READY' ?
                                                        <TouchableOpacity onPress={() => {
                                                            Linking.openURL(`tel://${orderDetails.user.phone}`)
                                                        }}
                                                                          style={{position: 'absolute', right: 10}}>
                                                            <Image
                                                                source={require('../../../assets/images/callchat.png')}
                                                                style={{width: 40, height: 40}} resizeMode={'contain'}/>
                                                        </TouchableOpacity> : null
                                                }
                                            </View>
                                        </View> : null
                                }

                                {
                                    user && user.user_type === 3 && orderDetails.delegate == null && orderDetails.type !== 'special' ?
                                        <BTN title={i18n.t('IWillDeliver')}
                                             onPress={() => onDeliverOrder()}
                                             ContainerStyle={{marginBottom: 40, borderRadius: 20,}}
                                             TextStyle={{fontSize: 13}}/>
                                        : null
                                }

                                {

                                    user && user.user_type === 3 && orderDetails.type === 'special' && orderDetails.status === 'READY' ?
                                        <View style={{marginTop: 20}}>
                                            <BTN title={i18n.t('sendOfferPrice')}
                                                 onPress={() => navigation.navigate('SetOffer', {orderDetails})}
                                                 ContainerStyle={{marginBottom: 40, borderRadius: 20,}}
                                                 TextStyle={{fontSize: 13}}/>
                                        </View>
                                        : null
                                }

                                {
                                    Isopen ?
                                        <View style={{flexDirection: 'column'}}>
                                            <Text style={[styles.nText, {
                                                marginHorizontal: width * .08,
                                                marginVertical: 10
                                            }]}>{i18n.t('clientName')}</Text>
                                            <View style={[styles.warb, {
                                                width: '90%',
                                                alignSelf: 'center',
                                                borderRadius: 3,
                                                paddingHorizontal: 20
                                            }]}>
                                                <Text style={[styles.nText, {justifyContent: 'center'}]}>اوامر
                                                    الشبكه</Text>
                                            </View>
                                            {/*<TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.navigate('Followrepresentative')}>*/}
                                            {/*    <Text style={[styles.aloneText, { textAlign: 'center', }]}>({i18n.t('delegateTracking')})</Text>*/}
                                            {/*</TouchableOpacity>*/}
                                        </View>
                                        : null
                                }

                                {
                                    checkOrderStatus(orderDetails.status, 'DELEGATEACCEPT') ?
                                        <View style={{marginTop: 20}}>
                                            <BTN title={i18n.t('startChat')}
                                                 onPress={() => navigation.navigate('OrderChatting', {
                                                     receiver: user && user.user_type == 2 ? orderDetails.delegate : orderDetails.user,
                                                     sender: user.user_type == 2 ? orderDetails.user : orderDetails.delegate,
                                                     orderDetails
                                                 })}
                                                 ContainerStyle={{marginHorizontal: 20, borderRadius: 20,}}
                                                 TextStyle={{fontSize: 13}}/>
                                        </View>
                                        : null
                                }
                            </View>

                        </ScrollView>
                    </View> : null
            }
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
    sText: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: width * .036,
        marginHorizontal: 10
    },
    card: {
        shadowColor: Colors.bg,
        backgroundColor: Colors.bg,
        flexDirection: 'row',
        marginHorizontal: 20,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 1,
        width: width * .89,
        height: 100,
        paddingStart: 10,
        overflow: 'hidden',
        borderRadius: 5,
        alignItems: 'center',

    },
    ImgCard: {
        width: 70,
        height: 70,
    },
    nText: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: 13,
        marginHorizontal: 1
    },
    iconImg: {
        width: 12,
        height: 12,
        marginHorizontal: 1,
        marginVertical: 5
    },
    yText: {
        fontFamily: 'flatLight',
        color: Colors.IconBlack,
        fontSize: width * .03,
        marginHorizontal: 10
    },
    warb: {
        width,
        backgroundColor: '#f8f8f8',
        height: height * .06,
        justifyContent: 'center'
    },
    aloneText: {
        fontFamily: 'flatMedium',
        color: Colors.sky,
        fontSize: 18,
        marginHorizontal: 15,
    },
    DText: {
        marginHorizontal: 15,
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: width * .036,
    },
    accordion: {
        backgroundColor: '#f8f8f8',
        height: height * .06,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'

    }, followStep: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25
    },
    stepLine: {
        height: 30,
        backgroundColor: Colors.sky,
        width: 1.5,
        position: 'absolute',
        left: 9,
        top: 20
    }, skyCircle: {
        backgroundColor: Colors.sky,
        borderColor: Colors.sky,
        borderWidth: 1,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        marginRight: 10
    },
    checkCircle: {
        fontSize: 15,
        color: '#fff',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#737373',
        opacity: Platform.OS === 'ios' ? .98 : .95,


    },
    modalView: {

        backgroundColor: "white",
        borderRadius: 15,
        width: width * .9,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
        paddingBottom: 50
    },
    modetext: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: 12,
        marginHorizontal: 10,
    },
    sLine: { height: height * .08, width: 1, backgroundColor: '#e5e0e0', },
})

export default OrderDetailes
