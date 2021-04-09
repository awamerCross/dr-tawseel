import React, { useState, useEffect } from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, ActivityIndicator, FlatList, I18nManager } from 'react-native'
import { Content } from 'native-base';
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useSelector, useDispatch } from 'react-redux';
import { setPlace, specialOrder } from '../../actions'

import Colors from '../../consts/Colors';
import BTN from '../../common/BTN';
import { InputIcon } from '../../common/InputText';
import Header from '../../common/Header';
import i18n from "../locale/i18n";
import { Button } from "native-base";
import { ValdiateCoupon } from '../../actions/BsketDetailesAction';
import Modal from "react-native-modal";


const { width, height } = Dimensions.get('window')
const latitudeDelta = 0.0922;
const longitudeDelta = 0.0421;

function DeliveryReceiptLoaction({ navigation, route }) {

    const { place, desc, base64 }                           = route.params;
    const [isSpin, setIsSpin]                               = useState(false);
    const [deliverCityName, setDeliverCityName]             = useState('');
    const [activeDeliverAddress, setActiveDeliverAddress]   = useState(false);
    const [deliverAddressName, setDeliverAddressName]       = useState('');
    const [initMap, setInitMap]                             = useState(true);
    const [deliverMapRegion, setDeliverMapRegion]           = useState({
        latitude: null,
        longitude: null,
        latitudeDelta,
        longitudeDelta
    });

    const [selectedRadion, setSelectedRadio] = useState(0);
    const [paymentType, setPaymentType]      = useState('cash');
    const [data, setData] = useState([
        { id: 1, title: i18n.t('recievePay'), key: 'cash' },
        { id: 2, title: i18n.t('byWallet'), key: 'wallet' },
        { id: 3, title: i18n.t('online'), key: 'online' },
    ]);

    const [saveLocmMdalVisible, setSaveLocmMdalVisible] = useState(false);

    const [region, setRegion] = useState({
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
    });

    const [modalVisible, setModalVisible]   = useState(false);
    const [orderTime, setOrderTime]         = useState(i18n.t('_1h'));
    const [isMapReady, SetIsmapReady]       = useState(false)
    const dispatch                          = useDispatch();
    const lang                              = useSelector(state => state.lang.lang);
    const token                             = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null);
    const [Cuboun, setCuboun]               = useState('')


    const onMapLayout = () => {
        SetIsmapReady(true)
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setInitMap(false);
            if (route.params?.deliverCityName) {
                setDeliverCityName(route.params.deliverCityName.substr(0, 25))
                setDeliverMapRegion(route.params.deliverMapRegion)
            }
        });

        return unsubscribe;
    }, [navigation, route.params?.deliverCityName]);

    function onSetPlace() {
        setSaveLocmMdalVisible(false)
        dispatch(setPlace(lang, token, deliverMapRegion.latitude, deliverMapRegion.longitude, deliverAddressName, deliverCityName)).then(() => setActiveDeliverAddress(true))
    }

    function handleChange(key, index) {
        setSelectedRadio(index);
        setPaymentType(key);
    }

    function setSpecialOrder() {
        setIsSpin(true)
        dispatch(specialOrder(lang, token, place.latitude, place.longitude, place.formatted_address, deliverMapRegion.latitude, deliverMapRegion.longitude, deliverCityName, orderTime, desc, base64, paymentType, place.icon, place.phone, place.rating, place.name, Cuboun, navigation)).then(() =>{
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

        if (isSpin) {
            return (
                <View style={{ alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={'large'} color={Colors.sky} />
                </View>
            )
        }

        return (
            <BTN title={i18n.t('sentOrder')} onPress={() => setSpecialOrder()} ContainerStyle={{ marginVertical: 10, borderRadius: 20, height: 50 }} />
        )
    }

    const HandleChangeCuboen = (e) => {
        setCuboun(e)
        dispatch(ValdiateCoupon(token, e))
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
                        <Text style={[styles.sText, { alignSelf: 'flex-start', writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr', lineHeight: 22 }]}>{place.name}</Text>
                    </View>
                </View>

                {
                    !initMap && region.latitude != null ?
                        <View style={{ height: 200, width, marginTop: 20 }}>

                            <MapView
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
                        <Text style={[styles.yText, { fontSize: 13, alignSelf: 'flex-start', writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr', lineHeight: 22 }]}>{place.formatted_address}</Text>
                    </View>
                </View>

                <View style={{ marginVertical: 40, flexDirection: 'row' }}>
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <InputIcon
                            label={i18n.t('delPoint')}
                            inputStyle={{ borderRadius: 30, height: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                            styleCont={{ height: 45, width: '75%' }}
                            LabelStyle={{ bottom: 60, backgroundColor: 0, color: Colors.IconBlack, left: 5, marginVertical: 5 }}
                            image={require('../../../assets/images/locationgray.png')}
                            onPress={() => navigation.navigate('getLocation', { latitude: deliverMapRegion.latitude, longitude: deliverMapRegion.longitude, pathName: 'DeliveryReceiptLoaction' })}
                            editable={false}
                            value={deliverCityName ? deliverCityName : ''}
                        />
                        <TouchableOpacity onPress={() => { setSaveLocmMdalVisible(true) }}>
                            <View style={{ marginTop: 15, backgroundColor: '#eaeaea', width: width * .1, paddingVertical: width * .05, height: 0, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                                <Image source={activeDeliverAddress == '' ? require('../../../assets/images/star.png') : require('../../../assets/images/yellowstar.png')} style={{ width: 20, height: 20, padding: 10, borderRadius: 100, alignSelf: 'center' }} resizeMode='contain' />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity onPress={() => { setModalVisible(true); }} style={{ flexDirection: 'row' }}>
                    <InputIcon
                        label={i18n.t('orderTime')}
                        placeholder={i18n.t('selectOrderTime')}
                        inputStyle={{ borderRadius: 30, height: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                        styleCont={{ height: 45, width: width * .88, marginTop: 10 }}
                        LabelStyle={{ bottom: 60, backgroundColor: 0, color: Colors.IconBlack, left: 5 }}
                        editable={false}
                        value={orderTime}
                    />

                    <TouchableOpacity onPress={() => { setModalVisible(true); }} style={{ marginTop: width * .055, position: 'absolute', marginLeft: width * .85 }} >
                        <Image source={require('../../../assets/images/clock_gray.png')} style={[styles.iconImg,]} resizeMode='contain' />
                    </TouchableOpacity>
                </TouchableOpacity>

                <InputIcon
                    label={i18n.t('discountCode')}
                    value={Cuboun}
                    onChangeText={(e) => HandleChangeCuboen(e)}
                    styleCont={{ paddingHorizontal: 8, marginTop: 20 }}
                />

                <View style={[{ marginBottom: 10 }, styles.container]}>
                    <Text style={[styles.sText, { marginVertical: 20, color: '#000', alignSelf: 'flex-start' }]}>{i18n.t('selectPayment')}</Text>

                    <FlatList data={data}
                        keyExtractor={(item) => (item.id).toString()}
                        renderItem={({ item, index }) => {
                            return (
                                <View>
                                    <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: width * .04, }}>
                                        <TouchableOpacity onPress={() => handleChange(item.key, index)} style={{ flexDirection: 'row', alignItems: 'center', height: 20 }}>
                                            <View style={{
                                                height: 16,
                                                width: 16,
                                                borderRadius: 12,
                                                borderWidth: 2,
                                                borderColor: selectedRadion === index ? Colors.sky : Colors.fontNormal,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                                {
                                                    selectedRadion === index ?
                                                        <View style={{
                                                            height: 8,
                                                            width: 8,
                                                            borderRadius: 6,
                                                            backgroundColor: Colors.sky,
                                                        }} />
                                                        : null
                                                }
                                            </View>
                                            <Text style={[styles.sText, { color: selectedRadion === index ? Colors.sky : Colors.fontNormal, left: 8 }]}>{item.title}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        }} />
                </View>

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

                    <BTN title={i18n.t('save')} onPress={() => onSetPlace()} ContainerStyle={[styles.Btn, { marginTop: 0, }]} TextStyle={{ fontSize: 13 }} />
                    <BTN title={i18n.t('cancel')} onPress={() => { setSaveLocmMdalVisible(false) }} ContainerStyle={{ marginTop: 10, marginBottom: 10, borderRadius: 20, backgroundColor: '#B4B4B4' }} TextStyle={{ fontSize: 13, color: '#000' }} />

                </View>
            </Modal>

            <Modal
                onBackdropPress={() => setModalVisible(false)}
                onBackButtonPress={() => setModalVisible(false)}
                isVisible={modalVisible}
                style={{ flex: 1, alignSelf: 'center', }}
            >

                <View style={styles.modalView}>
                    <View style={{ backgroundColor: '#FFA903', width: '100%', height: height * .08, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={[styles.sText, { color: Colors.bg }]}>{i18n.t('orderTime')}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' , justifyContent:'space-between' , flexWrap:'wrap' , padding:17}}>
                        <TouchableOpacity onPress={() => setOrderTime(i18n.t('_1h'))} style={{ backgroundColor: orderTime === i18n.t('_1h') ? Colors.sky : '#dcdada94', width: width * .25, height: 40, justifyContent: 'center' , alignItems:'center' , marginBottom:15 }}>
                            <Text style={[styles.sText, { color: orderTime ===i18n.t('_1h') ? '#fff' : Colors.fontNormal, textAlign: 'center' }]}>{ i18n.t('_1h') }</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setOrderTime(i18n.t('_2h'))} style={{ backgroundColor: orderTime === i18n.t('_2h') ?  Colors.sky : '#dcdada94', width: width * .25, height: 40, justifyContent: 'center' , alignItems:'center' , marginBottom:15 }}>
                            <Text style={[styles.sText, { color: orderTime ===i18n.t('_2h') ? '#ffffff' : Colors.fontNormal, textAlign: 'center' }]}>{ i18n.t('_2h') }</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setOrderTime(i18n.t('_3h'))} style={{ backgroundColor: orderTime === i18n.t('_3h') ? Colors.sky : '#dcdada94', width: width * .25, height: 40, justifyContent: 'center' , alignItems:'center' , marginBottom:15 }}>
                            <Text style={[styles.sText, { color: orderTime ===i18n.t('_3h') ? '#fff' : Colors.fontNormal, textAlign: 'center' }]}>{ i18n.t('_3h') }</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setOrderTime(i18n.t('_4h'))} style={{ backgroundColor: orderTime === i18n.t('_4h') ? Colors.sky : '#dcdada94', width: width * .25, height: 40, justifyContent: 'center' , alignItems:'center' , marginBottom:15 }}>
                            <Text style={[styles.sText, { color: orderTime === i18n.t('_4h') ? '#fff' : Colors.fontNormal, textAlign: 'center' }]}>{ i18n.t('_4h') }</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setOrderTime(i18n.t('_5h'))} style={{ backgroundColor: orderTime === i18n.t('_5h') ? Colors.sky : '#dcdada94',width: width * .25, height: 40, justifyContent: 'center'  , alignItems:'center' , marginBottom:15}}>
                            <Text style={[styles.sText, { color: orderTime === i18n.t('_5h') ? '#fff' : Colors.fontNormal, textAlign: 'center' }]}>{ i18n.t('_5h') }</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setOrderTime(i18n.t('_6h'))} style={{ backgroundColor: orderTime === i18n.t('_6h') ? Colors.sky : '#dcdada94', width: width * .25, height: 40, justifyContent: 'center'  , alignItems:'center' , marginBottom:15}}>
                            <Text style={[styles.sText, { color: orderTime === i18n.t('_6h') ? '#fff' : Colors.fontNormal, textAlign: 'center' }]}>{ i18n.t('_6h') }</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setOrderTime(i18n.t('_7h'))} style={{ backgroundColor: orderTime === i18n.t('_7h') ? Colors.sky : '#dcdada94', width: width * .25, height: 40, justifyContent: 'center'  , alignItems:'center' , marginBottom:15}}>
                            <Text style={[styles.sText, { color: orderTime === i18n.t('_7h') ? '#fff' : Colors.fontNormal, textAlign: 'center' }]}>{ i18n.t('_7h') }</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setOrderTime(i18n.t('_8h'))} style={{ backgroundColor: orderTime === i18n.t('_8h') ? Colors.sky : '#dcdada94', width: width * .25, height: 40, justifyContent: 'center'  , alignItems:'center' , marginBottom:15}}>
                            <Text style={[styles.sText, { color: orderTime === i18n.t('_8h') ? '#fff' : Colors.fontNormal, textAlign: 'center' }]}>{ i18n.t('_8h') }</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setOrderTime(i18n.t('_9h'))} style={{ backgroundColor: orderTime === i18n.t('_9h') ? Colors.sky : '#dcdada94', width: width * .25, height: 40, justifyContent: 'center'  , alignItems:'center' , marginBottom:15}}>
                            <Text style={[styles.sText, { color: orderTime === i18n.t('_9h') ? '#fff' : Colors.fontNormal, textAlign: 'center' }]}>{ i18n.t('_9h') }</Text>
                        </TouchableOpacity>
                    </View>
                    <BTN title={i18n.t('done')} onPress={() => { setModalVisible(false); }} ContainerStyle={{ marginBottom: 20, borderRadius: 20, }} TextStyle={{ height: 30 }} />

                </View>
            </Modal>
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
        fontSize: 12,
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
        width: width * .14,
        height: width * .14,
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
        fontSize: width * .034,
        marginTop: width * .01
    },

    orderImg: {
        width: width * .22,
        height: width * .22,
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
        backgroundColor: '#737373',
        opacity: .9,

    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 5,
        width: width * .9,
        height: 330,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5
    },
    Btn: {
        borderRadius: 30
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
})


export default DeliveryReceiptLoaction