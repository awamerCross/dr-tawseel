import React, { useState, useEffect } from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, ActivityIndicator, FlatList, I18nManager } from 'react-native'
import { Content, Icon } from 'native-base';
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useSelector, useDispatch } from 'react-redux';
import { getPlaces, setPlace, specialOrder } from '../../actions'

import Colors from '../../consts/Colors';
import BTN from '../../common/BTN';
import { InputIcon } from '../../common/InputText';
import Header from '../../common/Header';
import i18n from "../locale/i18n";
import { Button } from "native-base";
import { ValdiateCoupon } from '../../actions/BsketDetailesAction';
import Modal from "react-native-modal";
import { InputTouchable } from '../../common/InputTouchable';
import PayModal from "react-native-modal";


const { width, height } = Dimensions.get('window')
const latitudeDelta = 0.0922;
const longitudeDelta = 0.0421;

function DeliveryReceiptLoaction({ navigation, route }) {

    const { place, desc, base64 } = route.params;
    const [isSpin, setIsSpin] = useState(false);
    const [deliverCityName, setDeliverCityName] = useState('');
    const [activeDeliverAddress, setActiveDeliverAddress] = useState(false);
    const [deliverAddressName, setDeliverAddressName] = useState('');
    const [initMap, setInitMap] = useState(true);
    const [deliverMapRegion, setDeliverMapRegion] = useState({
        latitude: null,
        longitude: null,
        latitudeDelta,
        longitudeDelta
    });

    const [paymentType, setPaymentType] = useState('');
    const [SelctLocation, setSelctLocation] = useState('');
    const places = useSelector(state => state.places?.places);
    const [PaymentName, setPaymentName] = useState('');

    const AllPayment = [
        {
            name: 'byMada',
            key: 'mada',
            Image: require('../../../assets/images/mda.png'),
        },
        {
            name: 'cashPay',
            key: 'cash',
            Image: require('../../../assets/images/money.png'),
        },
        {
            name: 'byWallet',
            key: 'wallet',
            Image: require('../../../assets/images/Wallt.png'),
        },
        {
            name: 'byStc',
            key: 'STC_PAY',
            Image: require('../../../assets/images/StcPay.png'),
        },
        {
            name: 'byVisaMaster',
            key: 'master',
            Image: require('../../../assets/images/masterVisa.jpeg'),
        },
        {
            name: 'byapplePay',
            key: 'ApplePay',
            Image: require('../../../assets/images/applePayement.png'),
        },

    ]
    const [saveLocmMdalVisible, setSaveLocmMdalVisible] = useState(false);
    const [PaymentModal, setPaymentModal] = useState(false);

    const [region, setRegion] = useState({
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
    });
    const [locationModal, setLocationModal] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [orderTime, setOrderTime] = useState(i18n.t('_1h'));
    const [isMapReady, SetIsmapReady] = useState(false)
    const dispatch = useDispatch();
    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null);
    const [Cuboun, setCuboun] = useState('')
    const [SavelocationModal, setSavelocationModal] = useState(false);



    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setInitMap(false);
            if (route.params?.deliverCityName) {
                setDeliverCityName(route.params.deliverCityName.substr(0, 25))
                setDeliverMapRegion(route.params.deliverMapRegion)
            }
        });
        dispatch(getPlaces(lang, token))

        return unsubscribe;
    }, [navigation, route.params?.deliverCityName]);

    function onSetPlace() {
        setSaveLocmMdalVisible(false)
        dispatch(setPlace(lang, token, deliverMapRegion.latitude, deliverMapRegion.longitude, deliverAddressName, deliverCityName)).then(() => setActiveDeliverAddress(true))
    }


    function setSpecialOrder() {
        setIsSpin(true)
        dispatch(specialOrder(lang, token, place.latitude, place.longitude, place.formatted_address, deliverMapRegion.latitude, deliverMapRegion.longitude, deliverCityName, orderTime, desc, base64, paymentType, place.icon, place.phone, place.rating, place.name, Cuboun, navigation)).then(() => {
            setIsSpin(false)
        })
    }

    function renderBtn() {
        if (deliverCityName == '') {
            return (
                <Button style={{ marginVertical: 20, borderRadius: 20, backgroundColor: '#999', width: '85%', alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} disabled={true}>
                    <Text style={[styles.sText, { color: '#fff', textAlign: 'center', alignSelf: 'center' }]}>{i18n.t('sentOrder')}</Text>
                </Button>
            )
        }


        return (
            <BTN title={i18n.t('sentOrder')} onPress={() => setSpecialOrder()} ContainerStyle={{ marginVertical: 10, borderRadius: 20, }} spinner={isSpin} />
        )
    }

    const HandleChangeCuboen = (e) => {
        setCuboun(e)
        dispatch(ValdiateCoupon(token, e))
    }

    const confirmSelctArriveLocation = () => {
        setLocationModal(false);

        if (SelctLocation == 'ChooseSavedPlaces') {
            setSavelocationModal(true)
        }
        else if (SelctLocation == 'manuallyLoc') {
            navigation.navigate('getLocation', { latitude: deliverMapRegion.latitude, longitude: deliverMapRegion.longitude, pathName: 'DeliveryReceiptLoaction' })
        }
    }


    const ConfirmSelectPlace = (item) => {
        setSavelocationModal(false)
        setDeliverCityName(item?.address)
        setDeliverMapRegion({ latitude: item?.latitude, longitude: item?.longitude })
    }




    return (
        <View style={{ flex: 1, backgroundColor: Colors.bg }}>
            <Header navigation={navigation} />

            <Content style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

                <View style={styles.container}>
                    <View style={styles.ImgText}>
                        <View style={{ backgroundColor: '#fff', borderRadius: 30, padding: 3, }}>
                            <Image source={{ uri: place.icon }} style={styles.ResImgNm} />
                        </View>
                        <Text style={[styles.sText, { alignSelf: 'flex-start', writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' }]}>{place.name}</Text>
                    </View>
                </View>

                {
                    !initMap && region.latitude != null ?
                        <View style={{ height: 200, width, marginTop: 20 }}>

                            <MapView
                                // provider={PROVIDER_GOOGLE}
                                style={{ width: '100%', height: '100%', flex: 1, }}
                                region={region}
                                onRegionChangeComplete={region => setRegion(region)}
                            //   customMapStyle={mapStyle}
                            >
                                <MapView.Marker coordinate={{ latitude: place.latitude, longitude: place.longitude }}  >
                                    <View style={{ alignItems: 'center' }}>
                                        <View style={{ backgroundColor: '#fff', borderRadius: 30, padding: 3, }}>
                                            <Image source={{ uri: place.icon }} style={[styles.ResImgNm, { backgroundColor: '#fff' }]} />
                                        </View>
                                        <View
                                            style={{
                                                backgroundColor: Colors.bg,
                                                borderColor: Colors.sky,
                                                borderRadius: 10,
                                                elevation: 10,
                                                borderWidth: 1,
                                            }}>
                                            <Text style={styles.sText}>{place.name}</Text>
                                            <Text style={[styles.sText, { color: Colors.sky, textAlign: 'center', marginBottom: 5 }]}>{place.distance}</Text>
                                        </View>
                                    </View>
                                </MapView.Marker>
                            </MapView>
                        </View> : null
                }

                <View style={{ backgroundColor: '#E8E8E8', height: 40, justifyContent: 'center' }}>
                    <Text style={[styles.sText, { color: Colors.IconBlack, marginLeft: 25, fontSize: 14, alignSelf: 'flex-start' }]}>{i18n.t('dlivery')}</Text>
                </View>

                <View style={{ marginLeft: 20, marginTop: 20 }}>
                    <Text style={[styles.sText, { marginHorizontal: 5, fontSize: 13, alignSelf: 'flex-start' }]}>{i18n.t('delPoint')}</Text>
                    <View style={{ flexDirection: 'row', marginVertical: 10, paddingHorizontal: 10 }}>
                        <Image source={require('../../../assets/images/pingray.png')} style={styles.iconImg} resizeMode='contain' />
                        <Text style={[styles.yText, { fontSize: 13, alignSelf: 'flex-start', writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' }]}>{place.formatted_address}</Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30 }}>
                    <InputTouchable
                        label={i18n.t('deliveryLocation')}
                        LabelStyle={{ bottom: 60, backgroundColor: 0, color: Colors.IconBlack, }}
                        styleCont={{ width: '75%' }}
                        image={require('../../../assets/images/locationgray.png')}
                        onPress={() => setLocationModal(true)}
                        value={deliverCityName ? deliverCityName?.length > 30 ? (deliverCityName).substr(0, 33) + '...' : deliverCityName : ''}
                    />


                    <TouchableOpacity onPress={() => { setSaveLocmMdalVisible(true) }}>
                        <View style={{ backgroundColor: '#eaeaea', width: 45, paddingVertical: 10, height: 45, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={activeDeliverAddress == '' ? require('../../../assets/images/star.png') : require('../../../assets/images/yellowstar.png')} style={{ width: 20, height: 20, padding: 10, borderRadius: 100, alignSelf: 'center' }} resizeMode='contain' />
                        </View>
                    </TouchableOpacity>
                </View>

                <InputTouchable
                    label={i18n.t('orderTime')}
                    LabelStyle={{ bottom: 60, backgroundColor: 0, color: Colors.IconBlack, left: 5, marginVertical: 5 }}
                    styleCont={{ width: '90%', marginTop: 50 }}
                    image={require('../../../assets/images/clock_gray.png')}
                    onPress={() => setModalVisible(true)}
                    value={orderTime}
                />

                <InputIcon
                    label={i18n.t('discountCode')}
                    value={Cuboun}
                    onChangeText={(e) => HandleChangeCuboen(e)}
                    styleCont={{ paddingHorizontal: 8, marginTop: 20 }}
                />


                <TouchableOpacity style={styles.BtnBay} onPress={() => setPaymentModal(true)}>
                    <Icon type='MaterialCommunityIcons' name='credit-card-settings-outline' style={{ fontSize: 22, color: Colors.IconBlack }} />
                    <Text style={styles.pay}>{i18n.t('selectPayment')}</Text>
                </TouchableOpacity>
                <Text style={[styles.pay, { alignSelf: 'center', marginTop: 30 }]}>{PaymentName ? i18n.t(PaymentName) : null}</Text>

                {renderBtn()}

            </Content >

            <Modal
                onBackdropPress={() => setSaveLocmMdalVisible(false)}
                onBackButtonPress={() => setSaveLocmMdalVisible(false)}
                isVisible={saveLocmMdalVisible}
                style={{ flex: 1, alignSelf: 'center', }}
            >

                <View style={styles.modalView}>
                    <View style={{ backgroundColor: '#FFA903', width: '100%', height: height * .08, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={[styles.sText, { color: Colors.bg }]}>{i18n.t('saveLocation')}</Text>
                    </View>
                    <View >
                        <Text style={styles.ssText}>
                            {
                                deliverCityName ? deliverCityName : ''
                            }
                        </Text>
                        <InputIcon
                            label={i18n.t('placeName')}
                            placeholder={i18n.t('enterPlaceName')}
                            inputStyle={{ borderRadius: 30, height: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                            styleCont={{ height: 45, marginTop: 10 }}
                            onChangeText={(e) => setDeliverAddressName(e)}
                            value={deliverAddressName}
                            LabelStyle={{ bottom: 60, backgroundColor: 0, color: Colors.IconBlack, left: 5 }}
                        />
                    </View>

                    <BTN title={i18n.t('save')} onPress={() => onSetPlace()} ContainerStyle={[styles.Btn, { marginTop: 0, height: 40 }]} TextStyle={{ fontSize: 13 }} />
                    <BTN title={i18n.t('cancel')} onPress={() => { setSaveLocmMdalVisible(false) }} ContainerStyle={{ marginTop: 10, marginBottom: 10, borderRadius: 20, backgroundColor: '#B4B4B4' }} TextStyle={{ fontSize: 13, color: '#000' }} />

                </View>
            </Modal>

            <Modal
                onBackdropPress={() => setModalVisible(false)}
                onBackButtonPress={() => setModalVisible(false)}
                isVisible={modalVisible}
                style={{ flex: 1, alignSelf: 'center', }}
            >
                <View style={styles.centeredView}>

                    <View style={styles.modalView}>
                        <View style={{ backgroundColor: '#FFA903', width: '100%', height: height * .08, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={[styles.sText, { color: Colors.bg }]}>{i18n.t('orderTime')}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', padding: 17 }}>
                            <TouchableOpacity onPress={() => setOrderTime(i18n.t('_1h'))} style={{ backgroundColor: orderTime === i18n.t('_1h') ? Colors.sky : '#dcdada94', width: width * .25, height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
                                <Text style={[styles.sText, { color: orderTime === i18n.t('_1h') ? '#fff' : Colors.fontNormal, textAlign: 'center' }]}>{i18n.t('_1h')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setOrderTime(i18n.t('_2h'))} style={{ backgroundColor: orderTime === i18n.t('_2h') ? Colors.sky : '#dcdada94', width: width * .25, height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
                                <Text style={[styles.sText, { color: orderTime === i18n.t('_2h') ? '#ffffff' : Colors.fontNormal, textAlign: 'center' }]}>{i18n.t('_2h')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setOrderTime(i18n.t('_3h'))} style={{ backgroundColor: orderTime === i18n.t('_3h') ? Colors.sky : '#dcdada94', width: width * .25, height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
                                <Text style={[styles.sText, { color: orderTime === i18n.t('_3h') ? '#fff' : Colors.fontNormal, textAlign: 'center' }]}>{i18n.t('_3h')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setOrderTime(i18n.t('_4h'))} style={{ backgroundColor: orderTime === i18n.t('_4h') ? Colors.sky : '#dcdada94', width: width * .25, height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
                                <Text style={[styles.sText, { color: orderTime === i18n.t('_4h') ? '#fff' : Colors.fontNormal, textAlign: 'center' }]}>{i18n.t('_4h')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setOrderTime(i18n.t('_5h'))} style={{ backgroundColor: orderTime === i18n.t('_5h') ? Colors.sky : '#dcdada94', width: width * .25, height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
                                <Text style={[styles.sText, { color: orderTime === i18n.t('_5h') ? '#fff' : Colors.fontNormal, textAlign: 'center' }]}>{i18n.t('_5h')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setOrderTime(i18n.t('_6h'))} style={{ backgroundColor: orderTime === i18n.t('_6h') ? Colors.sky : '#dcdada94', width: width * .25, height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
                                <Text style={[styles.sText, { color: orderTime === i18n.t('_6h') ? '#fff' : Colors.fontNormal, textAlign: 'center' }]}>{i18n.t('_6h')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setOrderTime(i18n.t('_7h'))} style={{ backgroundColor: orderTime === i18n.t('_7h') ? Colors.sky : '#dcdada94', width: width * .25, height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
                                <Text style={[styles.sText, { color: orderTime === i18n.t('_7h') ? '#fff' : Colors.fontNormal, textAlign: 'center' }]}>{i18n.t('_7h')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setOrderTime(i18n.t('_8h'))} style={{ backgroundColor: orderTime === i18n.t('_8h') ? Colors.sky : '#dcdada94', width: width * .25, height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
                                <Text style={[styles.sText, { color: orderTime === i18n.t('_8h') ? '#fff' : Colors.fontNormal, textAlign: 'center' }]}>{i18n.t('_8h')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setOrderTime(i18n.t('_9h'))} style={{ backgroundColor: orderTime === i18n.t('_9h') ? Colors.sky : '#dcdada94', width: width * .25, height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
                                <Text style={[styles.sText, { color: orderTime === i18n.t('_9h') ? '#fff' : Colors.fontNormal, textAlign: 'center' }]}>{i18n.t('_9h')}</Text>
                            </TouchableOpacity>
                        </View>
                        <BTN title={i18n.t('done')} onPress={() => { setModalVisible(false); }} ContainerStyle={{ marginBottom: 20, borderRadius: 20, }} TextStyle={{ height: 30 }} />
                    </View>
                </View>
            </Modal>

            <PayModal
                animationType="slide"
                style={{ flex: 1, width: '100%', marginStart: 0, marginTop: 60, marginBottom: 0, }}
                onBackButtonPress={() => setPaymentModal(false)}
                onBackdropPress={() => setPaymentModal(false)}
                onSwipeComplete={() => setPaymentModal(false)}
                swipeDirection={["down"]}
                isVisible={PaymentModal} >
                <View style={[styles.centeredViews, { borderTopRightRadius: 20, borderTopLeftRadius: 20, }]}>
                    {
                        AllPayment.map((Pay, index) => {
                            return (
                                <TouchableOpacity key={index.toString()} onPress={() => { setPaymentType(Pay.key); setPaymentName(Pay.name) }} style={[styles.modalView, { marginTop: 20, marginHorizontal: '2%', width: '95%', backgroundColor: paymentType == Pay.key ? '#9A9A9A' : 'white' }]}>
                                    <View style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', marginHorizontal: 20, paddingVertical: 10 }}>
                                        <Image source={Pay.Image} style={{ width: 40, height: 40 }} resizeMode='contain' />
                                        <Text style={styles.payText}>{i18n.t(Pay.name)}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                    <BTN title={i18n.t('confirm')} onPress={() => setPaymentModal(false)} ContainerStyle={{ marginBottom: 5, borderRadius: 20, backgroundColor: Colors.sky, marginTop: 20 }} />
                </View>
            </PayModal>


            <PayModal
                animationType="slide"
                style={{ flex: 1, width: '100%', marginStart: 0, marginTop: '100%', marginBottom: 0, }}
                onBackButtonPress={() => setLocationModal(false)}
                onBackdropPress={() => setLocationModal(false)}
                onSwipeComplete={() => setLocationModal(false)}
                swipeDirection={["down"]}
                isVisible={locationModal} >
                <View style={[styles.centeredViews, { borderTopRightRadius: 20, borderTopLeftRadius: 20, }]}>
                    <View style={{ alignItems: 'center', alignSelf: 'flex-start', margin: 20 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30 }} onPress={() => setSelctLocation('ChooseSavedPlaces')}>
                            <Icon
                                type="Feather"
                                name={SelctLocation == 'ChooseSavedPlaces' ? 'check-circle' : 'circle'}
                                color={Colors.secondary}
                            />
                            <Text style={{ marginHorizontal: 20, fontFamily: 'flatMedium' }}>{i18n.t('ChooseSavedPlaces')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, alignSelf: 'flex-start' }} onPress={() => setSelctLocation('manuallyLoc')}>
                            <Icon
                                type="Feather"
                                name={SelctLocation == 'manuallyLoc' ? 'check-circle' : 'circle'}
                                color={Colors.secondary}
                            />
                            <Text style={{ marginHorizontal: 20, fontFamily: 'flatMedium' }}>{i18n.t('manuallyLoc')}</Text>
                        </TouchableOpacity>
                    </View>

                    <BTN title={i18n.t('confirm')} onPress={confirmSelctArriveLocation} ContainerStyle={{ marginBottom: 5, borderRadius: 20, backgroundColor: Colors.sky, marginTop: 20 }} />
                </View>
            </PayModal>

            <PayModal
                animationType="slide"
                style={{ flex: 1, width: '100%', marginStart: 0, marginBottom: 0, }}
                onBackButtonPress={() => setSavelocationModal(false)}
                onBackdropPress={() => setSavelocationModal(false)}
                onSwipeComplete={() => setSavelocationModal(false)}
                swipeDirection={["down"]}
                isVisible={SavelocationModal} >
                <View style={[styles.centeredViews, { borderTopRightRadius: 20, borderTopLeftRadius: 20, marginTop: 40, overflow: 'hidden', }]}>
                    {
                        places?.map((place, i) => (
                            <TouchableOpacity style={styles.card} key={i.toString()} onPress={() => ConfirmSelectPlace(place)}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={require('../../../assets/images/pinblue.png')} style={styles.iconImg} resizeMode='contain' />
                                        <Text style={styles.yText}>{(place.name).substr(0, 35)}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                </View>
            </PayModal>
        </View>

    )
}

const mapStyle = [
    {
        elementType: "geometry",
        stylers: [
            {
                color: '#CDCDCD'
            }
        ]
    },
    {
        elementType: "flatMedium",
        stylers: [
            {
                color: Colors.IconBlack
            }
        ]
    },
    {
        featureType: "water",
        elementType: "flatMedium",
        stylers: [
            {
                color: Colors.bg
            }
        ]
    },
    {
        featureType: "water",
        elementType: "flatMedium",
        stylers: [
            {
                color: "#E8E8E8"
            }
        ]
    }
];

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
    Text: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: width * .04,
        textAlign: 'center',
        top: width * .19
    },
    sText: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: 14,
        marginHorizontal: 10
    },


    container: {
        paddingStart: width * .07,
        marginTop: width * .07
    },
    ImgText: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    ResImgNm: {
        width: 35,
        height: 35,
        borderRadius: 50
    },
    iconImg: {
        width: 14,
        height: 14,
        marginHorizontal: 1,
        marginVertical: 5

    },
    yText: {
        fontFamily: 'flatLight',
        color: Colors.IconBlack,
        fontSize: 14,
        marginTop: width * .01
    },

    orderImg: {
        width: 35,
        height: 35,
        borderRadius: 5
    },
    imgWrap: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        marginHorizontal: width * .1,

    },
    fileupload: {
        width: 70,
        height: 70,
        alignSelf: 'center',
        marginTop: 10
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",

    },

    modalView: {
        backgroundColor: "white",
        borderRadius: 5,
        width: width * .9,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5
    },
    pay: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: 16,
        marginHorizontal: 10

    },
    centeredViews: {
        flex: 1,
        alignItems: "center",
        backgroundColor: '#F5F6FA',

    },

    Btn: {
        borderRadius: 30
    },
    payText: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: 14,
        marginHorizontal: 10

    },
    ssText: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: 13,
        marginBottom: 35,
        marginHorizontal: 25,
        lineHeight: 20,
        marginTop: 15
    },
    BtnBay: { flexDirection: 'row', alignItems: 'center', marginTop: 50, backgroundColor: Colors.sky, width: '50%', borderRadius: 20, paddingVertical: 15, justifyContent: 'center', alignSelf: 'center' }
    , card: {
        shadowColor: Colors.bg,
        backgroundColor: Colors.bg,
        flexDirection: 'row',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 1,
        marginVertical: 5,
        width: '100%',
        padding: 20
    },
})


export default DeliveryReceiptLoaction