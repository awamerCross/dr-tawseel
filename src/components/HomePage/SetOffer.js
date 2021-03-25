import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, ScrollView, Dimensions, StyleSheet, TextInput, I18nManager, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import i18n from "../locale/i18n";
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import axios from "axios";
import MapView, { Polyline } from 'react-native-maps';
import Header from '../../common/Header';
import BTN from "../../common/BTN";
import Colors from '../../consts/Colors';
import { useDispatch, useSelector } from "react-redux";
import { sendOffer, removeOffer } from '../../actions';
import Modal from "react-native-modal";
import { Toast } from "native-base";


const latitudeDelta = 0.0922;
const longitudeDelta = 0.0421;
const isIOS = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window')

function SetOffer({ navigation, route }) {
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null)
    const MinPriceCoast = useSelector(state => state.BasketDetailes.DeliverCoast)

    const lang                      = useSelector(state => state.lang.lang);
    let pathName                    = route.params ? route.params.pathName : null;
    let type                        = route.params ? route.params.type : null;
    const { orderDetails }          = route.params;
    const dispatch                  = useDispatch();
    let mapRef                      = useRef(null);
    const [city, setCity]           = useState('');
    const [cost, setCost]           = useState('');
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
            const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});

            userLocation = { latitude, longitude, latitudeDelta, longitudeDelta };

            setInitMap(false);
            // setMapRegion(userLocation);

            console.log('opppsppsps', userLocation, mapRegion)

            mapRef.current.getMapRef().animateToRegion(userLocation, 500)
        }
    };

    useEffect(() => {
        setCost('')
        fetchData();
    }, [city, mapRegion]);

    //
    // useEffect(() => {
    //     dispatch(GetDliveryCost(providerID, mapRegion.latitude, mapRegion.longitude, token))
    //
    // }, [city, mapRegion]);

    console.log(orderDetails);
    console.log(cost);
    function setNewOffer() {
        // { orderDetails.shipping_range.from } - { orderDetails.shipping_range.to }
        if (cost >= orderDetails.shipping_range.from && cost <= orderDetails.shipping_range.to) {
            dispatch(sendOffer(lang, token, orderDetails.order_id, cost)).then(() => setShowModal(!showModal))
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

    const _handleMapRegionChange = async (mapCoordinate) => {
        setShowAddress(true)
        setMapRegion({ latitude: mapCoordinate.latitude, longitude: mapCoordinate.longitude, latitudeDelta, longitudeDelta });

        let getCity = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
        getCity += mapCoordinate.latitude + ',' + mapCoordinate.longitude;
        getCity += '&key=AIzaSyCJTSwkdcdRpIXp2yG7DfSRKFWxKhQdYhQ&language=ar&sensor=true';

        try {
            const { data } = await axios.get(getCity);
            setCity(data.results[0].formatted_address)

        } catch (e) {
            console.log(e);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView style={{ flex: 1, }}>
                <Header navigation={navigation} label={i18n.t('sendOffer')} />

                <TouchableOpacity onPress={() => fetchData()} style={{ height: 200 , backgroundColor: 'red' }}>
                    <Text>damn</Text>
                </TouchableOpacity>

                <View style={{ flex: 1, height: height * .93, width: width }}>
                    <MapView
                        ref={mapRef}
                        style={{ width: '100%', height: '100%', flex: 1 }}
                        initialRegion={mapRegion}>
                        <Polyline
                            coordinates={[
                                { latitude: orderDetails.address.latitude_provider, longitude: orderDetails.address.longitude_provider },
                                { latitude: orderDetails.address.latitude_to, longitude: orderDetails.address.longitude_to },
                            ]}
                            strokeColor={Colors.sky} // fallback for when `strokeColors` is not supported by the map-provider
                            strokeWidth={3}
                        />

                        <MapView.Marker coordinate={{ latitude: orderDetails.address.latitude_provider, longitude: orderDetails.address.longitude_provider }} >
                            <Image source={require('../../../assets/images/home_location.png')} resizeMode={'contain'} style={{ width: 35, height: 35 }} />
                        </MapView.Marker>

                        <MapView.Marker coordinate={{ latitude: orderDetails.address.latitude_to, longitude: orderDetails.address.longitude_to }} >
                            <Image source={require('../../../assets/images/driver_location.png')} resizeMode={'contain'} style={{ width: 35, height: 35 }} />
                        </MapView.Marker>

                    </MapView>
                    <View style={{ width: '100%', marginBottom: 40 }}>

                        <View style={{ flexDirection: 'row', width: '100%', borderBottomColor: '#ddd', borderBottomWidth: 1, paddingVertical: 5 }}>
                            <View style={{ flexDirection: 'row', width: '50%', justifyContent: 'flex-start', padding: 5 }}>
                                <Image source={require('../../../assets/images/home_location.png')} style={{ width: 25, height: 25, marginRight: 1 }} resizeMode={'contain'} />
                                <View style={{ flexDirection: 'column', alignItems: 'center', width: '85%' }}>
                                    <Text style={[styles.sText, { color: Colors.IconBlack, alignSelf: 'flex-start' }]}>{i18n.t('receiptPoint')}</Text>
                                    <Text style={[styles.sText, { color: Colors.fontBold, alignSelf: 'flex-start', writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' }]}> {orderDetails.address.address_provider} </Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', width: '50%', borderLeftColor: '#ddd', borderLeftWidth: 1, padding: 5 }}>
                                <Image source={require('../../../assets/images/driver_location.png')} style={{ width: 25, height: 25, marginRight: 1 }} resizeMode={'contain'} />
                                <View style={{ flexDirection: 'column', alignItems: 'center', width: '85%' }}>
                                    <Text style={[styles.sText, { color: Colors.IconBlack, alignSelf: 'flex-start' }]}>{i18n.t('deliveryPoint')}</Text>
                                    <Text style={[styles.sText, { color: Colors.fontBold, alignSelf: 'flex-start', writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' }]}>{orderDetails.address.address_to}</Text>
                                </View>
                            </View>
                        </View>

                        <Text style={[styles.sText, { color: Colors.IconBlack, fontSize: 16, textAlign: 'center', marginTop: 10 }]}>{i18n.t('deliveryCost')}</Text>

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

                        <BTN title={i18n.t('confirm')} onPress={() => setNewOffer()} ContainerStyle={{ width: '90%', paddingVertical: 30 }} TextStyle={{ fontSize: 15, padding: 35, marginBottom: 5 }} />

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
                                    <BTN onPress={() => { navigation.navigate('RebHome'); setShowModal(false) }} title={i18n.t('home')} ContainerStyle={{ width: '45%', borderRadius: 20, marginEnd: 5 }} TextStyle={{ fontSize: 13 }} />

                                    <BTN onPress={() => { dispatch(removeOffer(lang, token, orderDetails.order_id)).then(() => navigation.navigate('RebHome')); setShowModal(false) }} title={i18n.t('cancelOffer')} ContainerStyle={{ width: '45%', borderRadius: 20, backgroundColor: '#999' }} TextStyle={{ fontSize: 13, }} />
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


