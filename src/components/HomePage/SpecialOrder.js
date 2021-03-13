import React, { useEffect, useState } from 'react'
import {
    ScrollView,
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Text,
    FlatList,
    ActivityIndicator,
    I18nManager,
    Platform
} from 'react-native';
import Modal from "react-native-modal";

import { Button, Textarea, } from 'native-base'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Colors from '../../consts/Colors';
import BTN from '../../common/BTN';
import { InputIcon } from '../../common/InputText';
import Header from '../../common/Header';
import i18n from "../locale/i18n";
import { useSelector, useDispatch } from 'react-redux';
import { setPlace, specialOrder } from '../../actions'
import { ValdiateCoupon } from '../../actions/BsketDetailesAction';
import { ToasterNative } from '../../common/ToasterNatrive';

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
        latitude: "",
        longitude: "",
        latitudeDelta,
        longitudeDelta
    });

    const [deliverCityName, setDeliverCityName] = useState('');
    const [activeDeliverAddress, setActiveDeliverAddress] = useState(false);
    const [deliverAddressName, setDeliverAddressName] = useState('');
    const [deliverMapRegion, setDeliverMapRegion] = useState({
        latitude: "",
        longitude: "",
        latitudeDelta,
        longitudeDelta
    });

    const [selectedRadion, setSelectedRadio] = useState(0);
    const [paymentType, setPaymentType] = useState('cash');
    const [data, setData] = useState([
        { id: 1, title: i18n.t('recievePay'), key: 'cash' },
        { id: 2, title: i18n.t('byWallet'), key: 'wallet' },
        { id: 3, title: i18n.t('online'), key: 'online' },
        // { id: 4, title: i18n.t('byMada') },
        // { id: 5, title: i18n.t('byApple') }
    ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [saveLocmMdalVisible, setSaveLocmMdalVisible] = useState(false);
    const [orderTime, setOrderTime] = useState(i18n.t('_2h'));
    const [pointType, setPointType] = useState('');
    const [photos, setPhotos] = useState([]);
    const dispatch = useDispatch();
    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null);
    const [Cuboun, setCuboun] = useState('')


    useEffect(() => {

        const unsubscribe = navigation.addListener('focus', () => {

            base64 = []
            if (route.params?.cityName) {
                setCityName(route.params.cityName.substr(0, 25))
                setMapRegion(route.params.mapRegion)
            }
            if (route.params?.deliverCityName) {
                setDeliverCityName(route.params.deliverCityName.substr(0, 25))
                setDeliverMapRegion(route.params.deliverMapRegion)
            }
        });

        return () => {
            setCityName('');
            setDeliverCityName('');


            unsubscribe;

        };
    }, [navigation, route.params?.cityName, route.params?.deliverCityName]);


    function confirmDelete(i) {
        photos.splice(i, 1);
        setPhotos([...photos]);
        base64.splice(i, 1);
        // console.log('base64',base64)
        // console.log('photos',photos)
    };

    function onSetPlace() {
        setSaveLocmMdalVisible(false)

        if (pointType === 'deliveryLocation' && addressName !== '') {
            dispatch(setPlace(lang, token, mapRegion.latitude, mapRegion.longitude, addressName, cityName)).then(() => setActiveAddress(true))
        } else if (pointType === 'delPoint' && deliverAddressName !== '') {
            dispatch(setPlace(lang, token, deliverMapRegion.latitude, deliverMapRegion.longitude, deliverAddressName, deliverCityName)).then(() => setActiveDeliverAddress(true))
        } else {

            ToasterNative(i18n.t('locationName'), 'danger', 'bottom')

        }
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

    function handleChange(key, index) {
        setSelectedRadio(index);
        setPaymentType(key);
    }




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

        }
        else {
            ToasterNative(i18n.t('CammeraErr'), "danger", 'top')

        }
    };


    function setSpecialOrder() {
        setIsSpin(true)
        const icon = 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png'

        dispatch(specialOrder(lang, token, mapRegion.latitude, mapRegion.longitude, cityName, deliverMapRegion.latitude, deliverMapRegion.longitude, deliverCityName, orderTime, desc, base64, paymentType, icon, null, null, null, Cuboun, navigation)).then(
            () =>
                setIsSpin(false),
            setPhotos([]),
            setCityName(''),
            setDeliverCityName(''),
            setDesc(''),
            setOrderTime('_2h')


        )
    }

    function renderBtn() {
        if (cityName == '' || deliverCityName == '' || desc == '') {
            return (
                <Button style={{ marginVertical: 10, borderRadius: 20, backgroundColor: '#999', width: '85%', alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} disabled={true}>
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
            <BTN title={i18n.t('sentOrder')} onPress={() => setSpecialOrder()} ContainerStyle={{ marginVertical: 10, borderRadius: 20, padding: 15 }} />
        )
    }
    const HandleChangeCuboun = (e) => {
        setCuboun(e)

        dispatch(ValdiateCoupon(token, e))
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bg }}>
            <Header navigation={navigation} />

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

                <TouchableOpacity style={{ marginTop: 60, flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('getLocation', { pathName: 'SpecialOrder', type: 'deliveryLocation' })}>
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <InputIcon
                            label={i18n.t('deliveryLocation')}
                            inputStyle={{ borderRadius: 30, height: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                            styleCont={{ height: 45, width: '75%' }}
                            LabelStyle={{ bottom: 60, backgroundColor: 0, color: Colors.IconBlack, left: 5, marginVertical: 5 }}
                            image={require('../../../assets/images/locationgray.png')}
                            onPress={() => navigation.navigate('getLocation', { pathName: 'SpecialOrder', type: 'deliveryLocation' })}
                            editable={false}
                            value={cityName ? cityName : ''}
                        />
                        <TouchableOpacity onPress={() => { setSaveLocmMdalVisible(true); setPointType('deliveryLocation') }}>
                            <View style={{ marginTop: 15, backgroundColor: '#eaeaea', width: width * .1, paddingVertical: width * .05, height: 0, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                                <Image source={activeAddress == '' ? require('../../../assets/images/star.png') : require('../../../assets/images/yellowstar.png')} style={{ width: 20, height: 20, padding: 10, borderRadius: 100, alignSelf: 'center' }} resizeMode='contain' />
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={{ marginTop: 60, flexDirection: 'row' }} onPress={() => navigation.navigate('getLocation', { pathName: 'SpecialOrder', type: 'delPoint' })}>
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <InputIcon
                            label={i18n.t('delPoint')}
                            inputStyle={{ borderRadius: 30, height: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                            styleCont={{ height: 45, width: '75%' }}
                            LabelStyle={{ bottom: 60, backgroundColor: 0, color: Colors.IconBlack, left: 5, marginVertical: 5 }}
                            image={require('../../../assets/images/locationgray.png')}
                            onPress={() => navigation.navigate('getLocation', { pathName: 'SpecialOrder', type: 'delPoint' })}
                            editable={false}
                            value={deliverCityName ? deliverCityName : ''}
                        />
                        <TouchableOpacity onPress={() => { setSaveLocmMdalVisible(true); setPointType('delPoint') }}>
                            <View style={{ marginTop: 15, backgroundColor: '#eaeaea', width: width * .1, paddingVertical: width * .05, height: 0, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                                <Image source={activeDeliverAddress == '' ? require('../../../assets/images/star.png') : require('../../../assets/images/yellowstar.png')} style={{ width: 20, height: 20, padding: 10, borderRadius: 100, alignSelf: 'center' }} resizeMode='contain' />
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { setModalVisible(true); }} style={{ marginTop: 40, flexDirection: 'row' }}>
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

                <View style={{ marginTop: 15 }}>
                    <Text style={[styles.labelText,
                    {
                        color: Colors.IconBlack, paddingHorizontal: 10, fontSize: 13,
                        top: 10
                    },
                    ]}  >
                        {i18n.t('orderDetails')}
                    </Text>
                    <Textarea
                        style={{
                            backgroundColor: '#eaeaea', borderColor: '#eaeaea', textAlignVertical: 'top', paddingTop: 10, height: 150, marginTop: 40,
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

                <TouchableOpacity onPress={photos.length == 3 ? () => ToasterNative(i18n.t('exNum'), "danger", "bottom") : _pickImage}>
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
                    <View style={{ flex: 1 }}>
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
                    <BTN title={i18n.t('save')} onPress={() => onSetPlace()} ContainerStyle={[styles.Btn, { marginTop: 110, }]} TextStyle={{ fontSize: 14, }} />
                    <BTN title={i18n.t('cancel')} onPress={() => { setSaveLocmMdalVisible(false) }} ContainerStyle={{ marginTop: 10, marginBottom: 10, borderRadius: 20, backgroundColor: '#B4B4B4' }} TextStyle={{ fontSize: 14, color: '#000' }} />
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', padding: 17 }}>
                        <TouchableOpacity onPress={() => setOrderTime(i18n.t('_2h'))} style={{ backgroundColor: orderTime === i18n.t('_2h') ? Colors.sky : '#dcdada94', width: width * .25, height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
                            <Text style={[styles.sText, { color: orderTime === i18n.t('_2h') ? '#fff' : Colors.fontNormal, textAlign: 'center' }]}>{i18n.t('_2h')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setOrderTime(i18n.t('_4h'))} style={{ backgroundColor: orderTime === i18n.t('_4h') ? Colors.sky : '#dcdada94', width: width * .25, height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
                            <Text style={[styles.sText, { color: orderTime === i18n.t('_4h') ? '#ffffff' : Colors.fontNormal, textAlign: 'center' }]}>{i18n.t('_4h')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setOrderTime(i18n.t('_8h'))} style={{ backgroundColor: orderTime === i18n.t('_8h') ? Colors.sky : '#dcdada94', width: width * .25, height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
                            <Text style={[styles.sText, { color: orderTime === i18n.t('_8h') ? '#fff' : Colors.fontNormal, textAlign: 'center' }]}>{i18n.t('_8h')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setOrderTime(i18n.t('_10h'))} style={{ backgroundColor: orderTime === i18n.t('_10h') ? Colors.sky : '#dcdada94', width: width * .25, height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
                            <Text style={[styles.sText, { color: orderTime === i18n.t('_10h') ? '#fff' : Colors.fontNormal, textAlign: 'center' }]}>{i18n.t('_10h')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setOrderTime(i18n.t('_20h'))} style={{ backgroundColor: orderTime === i18n.t('_20h') ? Colors.sky : '#dcdada94', width: width * .25, height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
                            <Text style={[styles.sText, { color: orderTime === i18n.t('_20h') ? '#fff' : Colors.fontNormal, textAlign: 'center' }]}>{i18n.t('_20h')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setOrderTime(i18n.t('_40h'))} style={{ backgroundColor: orderTime === i18n.t('_40h') ? Colors.sky : '#dcdada94', width: width * .25, height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
                            <Text style={[styles.sText, { color: orderTime === i18n.t('_40h') ? '#fff' : Colors.fontNormal, textAlign: 'center' }]}>{i18n.t('_40h')}</Text>
                        </TouchableOpacity>
                    </View>
                    <BTN title={i18n.t('done')} onPress={() => { setModalVisible(false); }} ContainerStyle={{ marginVertical: 25, borderRadius: 20, padding: 0 }} TextStyle={{ fontSize: 16 }} />
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
    iconImg: {
        width: 14,
        height: 14,
        marginHorizontal: 1,
        marginVertical: 5

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
        opacity: Platform.OS = 'ios' ? .97 : .9,

    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 5,
        width: width * .9,
        height: 310,
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
    labelText: {
        left: 25,
        alignSelf: "flex-start",
        fontSize: width * .03,
        zIndex: 10,
        position: "absolute",
        fontFamily: 'flatMedium',


    },
})

export default SpecialOrder
