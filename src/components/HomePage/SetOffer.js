import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    Dimensions,
    StyleSheet,
    TextInput,
    I18nManager,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import i18n from "../locale/i18n";
import * as Location from 'expo-location';
import MapView, { Polyline } from 'react-native-maps';
import Header from '../../common/Header';
import BTN from "../../common/BTN";
import Colors from '../../consts/Colors';
import { useDispatch, useSelector } from "react-redux";
import { sendOffer, removeOffer, getAllOffers } from '../../actions';
import Modal from "react-native-modal";
import { Toast } from "native-base";
import * as Notifications from "expo-notifications";


const latitudeDelta = 0.00922;
const longitudeDelta = 0.00421;
const isIOS = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window')

function SetOffer({ navigation, route }) {
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null)
    const MinPriceCoast = useSelector(state => state.BasketDetailes.DeliverCoast)
    const user = useSelector(state => state.Auth ? state.Auth.user ? state.Auth.user.data : null : null)

    const lang = useSelector(state => state.lang.lang);
    let pathName = route.params ? route.params.pathName : null;
    let type = route.params ? route.params.type : null;
    const { orderDetails } = route.params;
    const dispatch = useDispatch();
    let mapRef = useRef(null);
    const [city, setCity] = useState('');
    const [cost, setCost] = useState('');
    const [spinner, setSpinner] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [mapRegion, setMapRegion] = useState({
        latitude: 24.774265,
        longitude: 46.738586,
        latitudeDelta,
        longitudeDelta
    });

    const [initMap, setInitMap] = useState(true);
    const [showAddress, setShowAddress] = useState(false);

    const fetchData = async () => {
        setCost('')

        let { status } = await Location.requestPermissionsAsync();
        let userLocation = {};
        if (status !== 'granted') {
            alert('صلاحيات تحديد موقعك الحالي ملغاه');
        } else {
            const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });

            userLocation = { latitude, longitude, latitudeDelta, longitudeDelta };

            setInitMap(false);
            setMapRegion(userLocation);

            mapRef.current.animateToRegion(userLocation, 150)
        }
    };

    useEffect(() => {
        Notifications.addNotificationReceivedListener(handleNotification);
    }, []);

    function handleNotification(notification) {
        if (notification && notification.origin !== 'received') {
            let { type, room } = notification.request.content.data;

            if (type === 'chat' && room) {
                setShowModal(false)
                navigation.navigate('OrderChatting', { receiver: user.user_type == 2 ? room.order.delegate : room.order.user, sender: user.user_type == 2 ? room.order.user : room.order.delegate, orderDetails: room.order })
            }
        }

    }

    useEffect(() => {
        setCost('')
        fetchData();
    }, [city, route.params]);


    console.log(orderDetails);
    console.log(cost);
    function setNewOffer() {
        // { orderDetails.shipping_range.from } - { orderDetails.shipping_range.to }
        if (cost >= orderDetails.shipping_range.from && cost <= orderDetails.shipping_range.to) {
            setSpinner(true)
            dispatch(sendOffer(lang, token, orderDetails.order_id, cost)).then(() => {
                setShowModal(!showModal)
                setSpinner(false)
            })
        } else {
            // { i18n.t('priceRange') } <Text style={[ styles.sText , { color: Colors.sky }]}> { orderDetails.shipping_range.from } - { orderDetails.shipping_range.to } </Text> { i18n.t('RS') }</Text>
            Toast.show({
                text: i18n.t('priceRange') + ' ' + orderDetails.shipping_range.from + ' - ' + orderDetails.shipping_range.to + ' ' + i18n.t('RS'),
                type: 'danger',
                duration: 3000,
                textStyle: {
                    color: "white",
                    fontFamily: 'flatMedium',
                    textAlign: 'center'
                }
            })
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView style={{ flex: 1, }}>
                <Header navigation={navigation} label={i18n.t('sendOffer')} />


                <View style={{ flex: 1, height: height * .93, width: width }}>
                    <View style={{ height: '50%', width }}>
                        <MapView
                            ref={mapRef}
                            style={{ width: '100%', height: '100%', flex: 1 }}
                            initialRegion={mapRegion}>
                            <Polyline
                                coordinates={[
                                    { latitude: orderDetails.address.latitude_provider, longitude: orderDetails.address.longitude_provider },
                                    { latitude: orderDetails.address.latitude_to, longitude: orderDetails.address.longitude_to },
                                ]}
                                strokeColor={Colors.sky}
                                strokeWidth={3}
                            />

                            <MapView.Marker coordinate={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }} title={i18n.t('you')}>
                                <Image source={require('../../../assets/images/map_pin.png')} resizeMode={'contain'} style={{ width: 40, height: 40 }} />
                            </MapView.Marker>

                            <MapView.Marker coordinate={{ latitude: orderDetails.address.latitude_provider, longitude: orderDetails.address.longitude_provider }} title={i18n.t('deliveryPoint')}>
                                <Image source={require('../../../assets/images/home_location.png')} resizeMode={'contain'} style={{ width: 40, height: 40 }} />
                            </MapView.Marker>

                            <MapView.Marker coordinate={{ latitude: orderDetails.address.latitude_to, longitude: orderDetails.address.longitude_to }} title={i18n.t('receiptPoint')}>
                                <Image source={require('../../../assets/images/driver_location.png')} resizeMode={'contain'} style={{ width: 40, height: 40 }} />
                            </MapView.Marker>
                        </MapView>
                    </View>

                    <View style={{ width: '100%', marginBottom: 40, height: '50%' }}>


                        <View style={{ flexDirection: 'row', width: '100%', borderBottomColor: '#ddd', borderBottomWidth: 1, paddingVertical: 5, height: '30%' }}>
                            <TouchableOpacity onPress={() => mapRef.current.animateToRegion({ latitude: orderDetails.address.latitude_to, longitude: orderDetails.address.longitude_to, latitudeDelta: 0.0005, longitudeDelta: 0.0001 }, 150)} style={{ flexDirection: 'row', width: '50%', borderLeftColor: '#ddd', borderLeftWidth: 1, padding: 5 }}>
                                <Image source={require('../../../assets/images/driver_location.png')} style={{ width: 30, height: 30, marginRight: 1 }} resizeMode={'contain'} />
                                <View style={{ flexDirection: 'column', alignItems: 'center', width: '85%' }}>
                                    <Text style={[styles.sText, { color: Colors.IconBlack, alignSelf: 'flex-start' }]}>{i18n.t('receiptPoint')}</Text>
                                    <Text style={[styles.sText, { color: Colors.fontBold, alignSelf: 'flex-start', writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr', marginVertical: 5, lineHeight: 20 }]}>{(orderDetails.address.address_to).substr(0, 50) + '...'}</Text>
                                    <Text style={[styles.sText, { color: Colors.fontBold, alignSelf: 'flex-start', writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' }]}> يبعد عنك : {orderDetails.address.distance_to} </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => mapRef.current.animateToRegion({ latitude: orderDetails.address.latitude_provider, longitude: orderDetails.address.longitude_provider, latitudeDelta: 0.0005, longitudeDelta: 0.0001 }, 150)} style={{ flexDirection: 'row', width: '50%', justifyContent: 'flex-start', padding: 5 }}>
                                <Image source={require('../../../assets/images/home_location.png')} style={{ width: 30, height: 30, marginRight: 1 }} resizeMode={'contain'} />
                                <View style={{ flexDirection: 'column', alignItems: 'center', width: '85%' }}>
                                    <Text style={[styles.sText, { color: Colors.IconBlack, alignSelf: 'flex-start' }]}>{i18n.t('deliveryPoint')}</Text>
                                    <Text style={[styles.sText, { color: Colors.fontBold, alignSelf: 'flex-start', writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr', marginVertical: 5, lineHeight: 20 }]}> {(orderDetails.address.address_provider).substr(0, 50) + '...'} </Text>
                                    <Text style={[styles.sText, { color: Colors.fontBold, alignSelf: 'flex-start', writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' }]}> يبعد عنك : {orderDetails.address.distance_from} </Text>
                                </View>
                            </TouchableOpacity>


                        </View>

                        <Text style={[styles.sText, { color: Colors.IconBlack, fontSize: 16, textAlign: 'center', marginTop: 30 }]}>{i18n.t('deliveryCost')}</Text>

                        <View style={[styles.containerTableTextOverInput, { height: 40, marginTop: 15, width: '60%', marginHorizontal: 9, flexDirection: 'row', alignSelf: 'center', left: -15 }]}>
                            <Image source={require('../../../assets/images/money.png')} style={{ width: 25, height: 25, right: -35, top: 10, zIndex: 999 }} resizeMode={'contain'} />
                            <TextInput
                                style={[styles.textInput, { borderColor: Colors.fontNormal }, { borderRadius: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea', paddingLeft: 40 }]}
                                value={cost}
                                onChangeText={setCost}
                                keyboardType='phone-pad'
                                placeholder={i18n.t('writeUrMsg')}
                            />
                        </View>

                        <Text style={[styles.sText, { color: Colors.IconBlack, textAlign: 'center', marginTop: 10 }]}>{i18n.t('priceRange')} <Text style={[styles.sText, { color: Colors.sky }]}> {orderDetails.shipping_range.from} - {orderDetails.shipping_range.to} </Text> {i18n.t('RS')}</Text>

                        {
                            spinner ?
                                <View style={[{ justifyContent: 'center', alignItems: 'center', marginTop: 30, marginBottom: 30 }]}>
                                    <ActivityIndicator size="large" color={Colors.sky} style={{ alignSelf: 'center' }} />
                                </View>
                                :
                                <TouchableOpacity onPress={() => setNewOffer()} style={{ width: '90%', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.sky, alignSelf: 'center', height: 40, marginVertical: 20 }}>
                                    <Text style={[styles.sText, { color: '#fff' }]}>{i18n.t('confirm')}</Text>
                                </TouchableOpacity>
                        }


                    </View>
                </View>


                <Modal
                    onBackdropPress={() => setShowModal(!showModal)}
                    onBackButtonPress={() => setShowModal(!showModal)}
                    isVisible={showModal}
                    style={styles.bgModel}
                    avoidKeyboard={true}
                >
                    <View style={[{ borderRadius: 5, backgroundColor: '#fff', width: '100%', overflow: 'hidden', padding: 10 }]}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={[styles.sText, { color: Colors.IconBlack, textAlign: 'center', marginTop: 10, fontSize: 16, width: '80%', lineHeight: 20 }]}>{i18n.t('sendOfferToUser')}</Text>
                            <View style={{ width: '100%' }}>
                                <View style={{ marginTop: 10, alignItems: 'flex-start', flexDirection: 'row', paddingHorizontal: 20, justifyContent: 'space-between' }}>
                                    <BTN onPress={() => { navigation.navigate('RebHome'); setShowModal(false) }} title={i18n.t('home')} ContainerStyle={{ width: '43%', borderRadius: 10, marginEnd: 5 }} TextStyle={{ fontSize: 13 }} />
                                    <BTN onPress={() => { dispatch(removeOffer(lang, token, orderDetails.order_id)).then(() => navigation.navigate('RebHome')); setShowModal(false) }} title={i18n.t('cancelOffer')} ContainerStyle={{ width: '43%', borderRadius: 20, backgroundColor: '#999' }} TextStyle={{ fontSize: 13, }} />
                                </View>
                            </View>
                        </View>
                    </View>

                </Modal>
            </ScrollView>
        </KeyboardAvoidingView>

    );
}


const styles = StyleSheet.create({
    BigImg: {
        height: height * .15,
        width: width * .2,
    },
    MenueImg: {
        width: 18,
        height: 20,
        marginHorizontal: 4,

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
        color: Colors.fontBold,
        fontSize: 13,
    },
    containerTableTextOverInput: {
        height: width * .15,
        position: "relative",
        marginHorizontal: "5%",
        marginVertical: 10,
        justifyContent: 'center',

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
    bgModal: {
        width: "100%",
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'flex-end',
        bottom: -18,
    }
})

export default SetOffer;


