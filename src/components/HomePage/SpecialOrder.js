
import React, { useEffect, useState } from 'react'
import {
    ScrollView,
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Text,
    Modal,
    FlatList,
    I18nManager
} from 'react-native'
import { Button, Icon, Textarea, Toast, } from 'native-base'
import * as ImagePicker from 'expo-image-picker';
import Colors from '../../consts/Colors';
import BTN from '../../common/BTN';
import { InputIcon } from '../../common/InputText';
import Header from '../../common/Header';
import i18n from "../locale/i18n";
import { useSelector, useDispatch } from 'react-redux';
import { getPlaces, setPlace, specialOrder } from '../../actions'
import { ValdiateCoupon } from '../../actions/BsketDetailesAction';
import { InputTouchable } from '../../common/InputTouchable';
import PayModal from "react-native-modal";

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')
const latitudeDelta = 0.0922;
const longitudeDelta = 0.0421;
let base64 = [];

function SpecialOrder({ navigation, route }) {

    const [isSpin, setIsSpin] = useState(false);
    const [desc, setDesc] = useState('');
    const [activeAddress, setActiveAddress] = useState(false);
    const [cityName, setCityName] = useState('');
    const [addressName, setAddressName] = useState('');
    const [mapRegion, setMapRegion] = useState({
        latitude: 31.2587,
        longitude: 32.2988,
        latitudeDelta,
        longitudeDelta
    });
    const places = useSelector(state => state.places?.places);

    const [deliverCityName, setDeliverCityName] = useState('');
    const [activeDeliverAddress, setActiveDeliverAddress] = useState(false);
    const [deliverAddressName, setDeliverAddressName] = useState('');
    const [deliverMapRegion, setDeliverMapRegion] = useState({
        latitude: 31.2587,
        longitude: 32.2988,
        latitudeDelta,
        longitudeDelta
    });

    const [paymentType, setPaymentType] = useState('');
    const [PaymentName, setPaymentName] = useState('');

    const [SelctLocation, setSelctLocation] = useState('');

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



    const [modalVisible, setModalVisible] = useState(false);
    const [saveLocmMdalVisible, setSaveLocmMdalVisible] = useState(false);
    const [orderTime, setOrderTime] = useState(i18n.t('_1h'));
    const [pointType, setPointType] = useState('');
    const [photos, setPhotos] = useState([]);
    const dispatch = useDispatch();
    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null);
    const [Cuboun, setCuboun] = useState('');
    const [PaymentModal, setPaymentModal] = useState(false);
    const [locationModal, setLocationModal] = useState(false);
    const [SavelocationModal, setSavelocationModal] = useState(false);


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            base64 = []
            setIsSpin(false);

            setPhotos([]);
            setCityName('');
            setPaymentType('')
            setDeliverCityName('');
            setPaymentName('')
            setDesc('');
            setOrderTime(i18n.t('_1h'))
            if (route.params?.cityName) {
                setCityName(route.params.cityName.substr(0, 25))
                setMapRegion(route.params.mapRegion)
            }
            if (route.params?.deliverCityName) {
                setDeliverCityName(route.params.deliverCityName.substr(0, 25))
                setDeliverMapRegion(route.params.deliverMapRegion)
            }
        });
        dispatch(getPlaces(lang, token))
        return unsubscribe;
    }, [navigation, route.params?.cityName, route.params?.deliverCityName]);


    function confirmDelete(i) {
        photos.splice(i, 1);
        setPhotos([...photos]);
        base64.splice(i, 1);

    };

    function onSetPlace() {
        setSaveLocmMdalVisible(false)

        if (pointType === 'deliveryLocation' && addressName !== '') {
            dispatch(setPlace(lang, token, mapRegion.latitude, mapRegion.longitude, addressName, cityName)).then(() => setActiveAddress(true))
        } else if (pointType === 'delPoint' && deliverAddressName !== '') {
            dispatch(setPlace(lang, token, deliverMapRegion.latitude, deliverMapRegion.longitude, deliverAddressName, deliverCityName)).then(() => setActiveDeliverAddress(true))
        } else {
            Toast.show({
                text: i18n.t('locationName'),
                type: "danger",
                duration: 3000,
                textStyle: {
                    color: "white",
                    fontFamily: "flatMedium",
                    textAlign: 'center'
                }
            });
        }
    }

    const HandleChangeCuboun = (e) => {
        setCuboun(e)
        setTimeout(() => {
            dispatch(ValdiateCoupon(token, e))

        }, 5000);
    }


    function renderUploadImgs() {
        let imgBlock = [];
        for (let i = 0; i < photos.length; i++) {
            imgBlock.push(
                <TouchableOpacity key={i} onPress={() => _pickImage(i)} style={[{ width: 100, height: 100, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', marginHorizontal: 10 }]}>
                    <Image source={{ uri: photos[i].image }} style={{ width: '90%', height: '88%', borderRadius: 10 }} resizeMode={'cover'} />
                    {
                        photos[i] ?
                            <TouchableOpacity onPress={() => confirmDelete(i)} style={[{ position: 'absolute', top: 0, right: 0, zIndex: 2, backgroundColor: '#000', borderRadius: 50, width: 25, height: 25, justifyContent: 'center', alignItems: 'center' }]}>
                                <Image source={require('../../../assets/images/close.png')} resizeMode='contain' style={{ width: 11, height: 11 }} />
                            </TouchableOpacity>
                            :
                            null
                    }
                </TouchableOpacity>
            )
        }
        return imgBlock
    }




    const _pickImage = async (i) => {

        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            base64: true
        });

        if (!result.cancelled) {
            let tempPhotos = photos;
            if (photos[i]) {
                tempPhotos[i] = { id: i, image: result.uri };
                base64[i] = result.base64;
            } else {
                tempPhotos.push({ id: i, image: result.uri });
                base64.push(result.base64);
            }

            setPhotos([...tempPhotos]);

        }
    };

    function setSpecialOrder() {
        setIsSpin(true)
        const icon = 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png'

        dispatch(specialOrder(lang, token, mapRegion.latitude, mapRegion.longitude, cityName, deliverMapRegion.latitude, deliverMapRegion.longitude, deliverCityName, orderTime, desc, photos, paymentType, icon, null, null, null, Cuboun, navigation)).then(
            () => {
                setCuboun('')
                setIsSpin(false)

            }
        ).catch(() => setIsSpin(false))
    }

    function renderBtn() {
        if (cityName == '' || deliverCityName == '' || desc == '' || paymentType == '') {
            return (
                <Button style={{ marginVertical: 10, borderRadius: 20, backgroundColor: '#999', width: '85%', alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} disabled={true}>
                    <Text style={[styles.sText, { color: '#fff', textAlign: 'center', alignSelf: 'center' }]}>{i18n.t('sentOrder')}</Text>
                </Button>
            )
        }

        return (
            <BTN title={i18n.t('sentOrder')} onPress={() => setSpecialOrder()} spinner={isSpin} ContainerStyle={{ marginBottom: 5, borderRadius: 10 }} />
        )
    }

    const confirmSelctArriveLocation = () => {
        setLocationModal(false);

        if (SelctLocation == 'ChooseSavedPlaces') {
            setSavelocationModal(true)
        }
        else if (SelctLocation == 'manuallyLoc') {
            pointType == 'deliveryLocation' ?

                navigation.navigate('getLocation', { pathName: 'SpecialOrder', type: 'deliveryLocation' })
                :
                navigation.navigate('getLocation', { pathName: 'SpecialOrder', type: 'delPoint' })
        }
    }

    const ConfirmSelectPlace = (item) => {
        setSavelocationModal(false)
        if (pointType == 'deliveryLocation') {

            setCityName(item?.address)
            setMapRegion({ latitude: item?.latitude, longitude: item?.longitude })
        }
        else if (pointType == 'delPoint') {
            setDeliverCityName(item?.address)
            setDeliverMapRegion({ latitude: item?.latitude, longitude: item?.longitude })
        }

    }




    return (
        <View style={{ flex: 1, backgroundColor: Colors.bg }}>
            <Header navigation={navigation} label={i18n.t('specialOrder')} />

            <ScrollView style={{ flex: 1 }}>
                <View style={{ marginTop: 60, flexDirection: 'row', alignItems: 'center', width: '100%' }} >
                    <InputTouchable
                        label={i18n.t('delPoint')}
                        styleCont={{ width: '75%' }}
                        LabelStyle={{ bottom: 60, backgroundColor: 0, color: Colors.IconBlack, left: 5, marginVertical: 5 }}
                        image={require('../../../assets/images/locationgray.png')}
                        onPress={() => { setLocationModal(true); setPointType('deliveryLocation') }}
                        editable={false}
                        value={cityName ? cityName?.length > 30 ? (cityName).substr(0, 30) + '...' : cityName : ''}
                    />
                    <TouchableOpacity onPress={() => { setSaveLocmMdalVisible(true); setPointType('deliveryLocation') }}>
                        <View style={{ backgroundColor: '#eaeaea', width: 45, height: 45, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={activeAddress == '' ? require('../../../assets/images/star.png') : require('../../../assets/images/yellowstar.png')} style={{ width: 20, height: 20, padding: 10, borderRadius: 100, alignSelf: 'center' }} resizeMode='contain' />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: 60, flexDirection: 'row', alignItems: 'center', width: '100%' }} onPress={() => navigation.navigate('getLocation', { pathName: 'SpecialOrder', type: 'delPoint' })}>

                    <InputTouchable
                        label={i18n.t('deliveryLocation')}
                        LabelStyle={{ bottom: 60, backgroundColor: 0, color: Colors.IconBlack, left: 5, marginVertical: 5 }}
                        styleCont={{ width: '75%', marginTop: 0 }}
                        image={require('../../../assets/images/locationgray.png')}
                        onPress={() => { setLocationModal(true); setPointType('delPoint') }} editable={false}
                        value={deliverCityName ? deliverCityName?.length > 30 ? (deliverCityName).substr(0, 33) + '...' : deliverCityName : ''}
                    />
                    <TouchableOpacity onPress={() => { setSaveLocmMdalVisible(true); setPointType('delPoint') }} style={{ backgroundColor: '#eaeaea', width: 45, height: 45, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={activeDeliverAddress == '' ? require('../../../assets/images/star.png') : require('../../../assets/images/yellowstar.png')} style={{ width: 20, height: 20, padding: 10, borderRadius: 100, alignSelf: 'center' }} resizeMode='contain' />
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

                <View style={{ marginTop: 15 }}>
                    <Text style={[styles.labelText, { color: Colors.IconBlack, paddingHorizontal: 10, fontSize: 13, top: 10 },]}  >
                        {i18n.t('orderDetails')}
                    </Text>
                    <Textarea
                        style={{
                            backgroundColor: '#eaeaea', borderColor: '#eaeaea', textAlignVertical: 'top', paddingTop: 10, height: 120, marginTop: 40, padding: 10,
                            width: '90%', alignSelf: 'center', fontFamily: 'flatMedium', fontSize: 13, textAlign: I18nManager.isRTL ? 'right' : 'left', borderRadius: 5
                        }}
                        onChangeText={(e) => setDesc(e)}
                        value={desc}
                        placeholder={i18n.t('writeOrderDet')}
                        placeholderTextColor={Colors.fontNormal}
                    />
                </View>
                <InputIcon
                    label={i18n.t('discountCode')}
                    value={Cuboun}
                    onChangeText={(e) => HandleChangeCuboun(e)}
                    styleCont={{ paddingHorizontal: 8, marginTop: 30 }}

                />

                <TouchableOpacity style={styles.BtnBay} onPress={() => setPaymentModal(true)}>
                    <Icon type='MaterialCommunityIcons' name='credit-card-settings-outline' style={{ fontSize: 22, color: Colors.IconBlack }} />
                    <Text style={styles.pay}>{i18n.t('selectPayment')}</Text>
                </TouchableOpacity>


                <Text style={[styles.pay, { alignSelf: 'center', marginTop: 30 }]}>{PaymentName ? i18n.t(PaymentName) : null}</Text>


                <TouchableOpacity onPress={_pickImage}>
                    <Image source={require('../../../assets/images/fileupload.png')} style={styles.fileupload} resizeMode='contain' />
                </TouchableOpacity>
                <Text style={[styles.sText, { textAlign: 'center', marginTop: 5 }]}>{i18n.t('uploadImg')}</Text>

                <View>
                    <ScrollView style={{ alignSelf: 'flex-start', marginTop: 20 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                        {renderUploadImgs()}
                    </ScrollView>
                </View>

                {renderBtn()}
            </ScrollView>



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

            <Modal
                animationType="slide"
                style={{ flex: 1 }}
                visible={saveLocmMdalVisible}
                onRequestClose={() => setSaveLocmMdalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{ backgroundColor: '#FFA903', width: '100%', height: height * .08, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={[styles.sText, { color: Colors.bg }]}>{i18n.t('saveLocation')}</Text>
                        </View>
                        <View>
                            <Text style={styles.ssText}>
                                {
                                    pointType === 'deliveryLocation' ?
                                        cityName ? cityName : ''
                                        :
                                        deliverCityName ? deliverCityName : ''
                                }
                            </Text>

                            <InputIcon
                                value={pointType === 'deliveryLocation' ? addressName : deliverAddressName}
                                onChangeText={(location) => pointType === 'deliveryLocation' ? setAddressName(location) : setDeliverAddressName(location)}
                                label={i18n.t('placeName')}
                                placeholder={i18n.t('enterPlaceName')}
                                inputStyle={{ borderRadius: 30, height: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                                styleCont={{ height: 45, marginTop: 10 }}
                                LabelStyle={{ bottom: 60, backgroundColor: 0, color: Colors.IconBlack, left: 5 }}
                            />
                        </View>
                        <BTN title={i18n.t('save')} onPress={() => onSetPlace()} ContainerStyle={{ borderRadius: 15 }} />
                        <BTN title={i18n.t('cancel')} onPress={() => { setSaveLocmMdalVisible(false) }} ContainerStyle={{ marginBottom: 15, borderRadius: 15 }} />
                    </View>
                </View>
            </Modal>


            <Modal
                animationType="slide"
                transparent={true}
                style={{ flex: 1 }}
                visible={modalVisible} >

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
                        <BTN title={i18n.t('done')} onPress={() => { setModalVisible(false); }} ContainerStyle={{ marginBottom: 10, borderRadius: 10, }} />
                    </View>
                </View>
            </Modal>



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
        color: Colors.fontNormal,
        fontSize: 14,
        marginHorizontal: 10
    },
    iconImg: {
        width: 14,
        height: 14,

    },
    container: {
        paddingStart: width * .07,

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

    },

    centeredViews: {
        flex: 1,
        alignItems: "center",
        backgroundColor: '#F5F6FA',

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
    card: {
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
    yText: {
        fontFamily: 'flatLight',
        color: Colors.fontNormal,
        fontSize: 14
    },
    labelText: {
        left: 25,
        alignSelf: "flex-start",
        fontSize: 14,
        zIndex: 10,
        position: "absolute",
        fontFamily: 'flatMedium',


    },
    BtnBay: { flexDirection: 'row', alignItems: 'center', marginTop: 50, backgroundColor: Colors.sky, width: '50%', borderRadius: 20, paddingVertical: 15, justifyContent: 'center', alignSelf: 'center' }
})

export default SpecialOrder
