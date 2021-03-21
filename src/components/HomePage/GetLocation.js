import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, TouchableOpacity, Platform, ScrollView, Dimensions, StyleSheet } from "react-native";
import { Container, Content, Form, Input, Icon } from 'native-base'
import i18n from "../locale/i18n";
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import axios from "axios";
import MapView from 'react-native-maps';
import Header from '../../common/Header';
import BTN from "../../common/BTN";
import Colors from '../../consts/Colors';
import { useDispatch, useSelector } from "react-redux";
import { GetDliveryCost } from "../../actions/BsketDetailesAction";
import { InputIcon } from "../../common/InputText";
import { I18nManager } from "react-native-web";

const latitudeDelta = 0.0922;
const longitudeDelta = 0.0421;

const isIOS = Platform.OS === 'ios';
const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')
function GetLocation({ navigation, route }) {
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null)
    const lang = useSelector(state => state.lang.lang);
    const MinPriceCoast = useSelector(state => state.BasketDetailes.DeliverCoast)

    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [selectedLocation, setLocation] = useState(null);
    const [searchHeight, setSearchHeight] = useState(70);
    let pathName = route.params ? route.params.pathName : null;
    let type = route.params ? route.params.type : null;
    const { providerID } = route.params
    const dispatch = useDispatch()
    let mapRef = useRef(null);
    const [initMap, setInitMap] = useState(true);
    const [showAddress, setShowAddress] = useState(false);
    const [city, setCity] = useState('');
    const [mapRegion, setMapRegion] = useState({
        latitude: null,
        longitude: null,
        latitudeDelta,
        longitudeDelta
    });

    // const fetchData = async () => {
    //     setMapRegion({})
    //     let { status } = await Location.requestPermissionsAsync();
    //     let userLocation = {};
    //     if (status !== 'granted') {
    //         alert('صلاحيات تحديد موقعك الحالي ملغاه');
    //     } else {
    //         const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});

    //         if (route.params && route.params.latitude) {
    //             userLocation = { latitude: route.params.latitude, longitude: route.params.longitude, latitudeDelta, longitudeDelta };
    //         } else {
    //             userLocation = { latitude, longitude, latitudeDelta, longitudeDelta };
    //         }

    //         setInitMap(false);
    //         setMapRegion(userLocation);
    //         isIOS ? mapRef.current.animateToRegion(userLocation, 1000) : false;
    //     }

    //     let getCity = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
    //     getCity += userLocation.latitude + ',' + userLocation.longitude;
    //     getCity += '&key=AIzaSyCJTSwkdcdRpIXp2yG7DfSRKFWxKhQdYhQ&language=ar&sensor=true';
    //     try {
    //         const { data } = await axios.get(getCity);
    //         setCity(data.results[0].formatted_address)
    //         setSearch(data.results[0].formatted_address)
    //     } catch (e) {
    //         console.log(e);
    //     }
    // };

    console.log(mapRegion);
    useEffect(() => {

        (async () => {


            let { status } = await Location.requestPermissionsAsync();
            let userLocation = {};
            if (status !== 'granted') {
                alert('صلاحيات تحديد موقعك الحالي ملغاه');
            } else {
                const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});

                if (route.params && route.params.latitude) {
                    userLocation = { latitude: route.params.latitude, longitude: route.params.longitude, latitudeDelta, longitudeDelta };
                } else {
                    userLocation = { latitude, longitude, latitudeDelta, longitudeDelta };
                }

                setInitMap(false);
                setMapRegion(userLocation);
                // isIOS ? mapRef.current.animateToRegion(userLocation, 1000) : false;
            }

            let getCity = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
            getCity += userLocation.latitude + ',' + userLocation.longitude;
            getCity += '&key=AIzaSyCJTSwkdcdRpIXp2yG7DfSRKFWxKhQdYhQ&language=ar&sensor=true';
            try {
                const { data } = await axios.get(getCity);
                setCity(data.results[0].formatted_address)
                setSearch(data.results[0].formatted_address)
            } catch (e) {
                console.log(e);
            }


        })();


    }, [route.params])



    const _handleMapRegionChange = async (mapCoordinate) => {

        setShowAddress(true)
        setMapRegion({ latitude: mapCoordinate.latitude, longitude: mapCoordinate.longitude, latitudeDelta, longitudeDelta });

        // if (parseFloat(mapCoordinate.latitude).toFixed(6) == parseFloat(mapRegion.latitude).toFixed(6)
        //     && parseFloat(mapCoordinate.longitude).toFixed(6) == parseFloat(mapRegion.longitude).toFixed(6)) {
        //     return;
        // }
        // setMapRegion({ latitude: mapCoordinate.latitude, longitude: mapCoordinate.longitude, latitudeDelta, longitudeDelta });
        // pathName === 'SpecialOrder' || pathName === 'DeliveryReceiptLoaction' || pathName === 'AddAddress' || pathName === 'EditAddress' || pathName == 'OrderDetailes' ?
        //     null :
        //     dispatch(GetDliveryCost(providerID, mapCoordinate.latitude, mapCoordinate.longitude, token))


        let getCity = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
        getCity += mapCoordinate.latitude + ',' + mapCoordinate.longitude;
        getCity += '&key=AIzaSyCJTSwkdcdRpIXp2yG7DfSRKFWxKhQdYhQ&language=ar&sensor=true';


        try {

            const { data } = await axios.get(getCity)
            setCity(data.results[0].formatted_address)
            setSearch(data.results[0].formatted_address)
            // mapRef.current.animateToRegion(mapCoordinate, 0.1)


        } catch (e) {
            console.log(e);
        }



    };


    const getCurrentLocation = async () => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('صلاحيات تحديد موقعك الحالي ملغاه');
        } else {
            const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
            let userLocation = { latitude, longitude, latitudeDelta, longitudeDelta };
            setMapRegion({ latitude: userLocation.latitude, longitude: userLocation.longitude, latitudeDelta, longitudeDelta });
            // setMapRegion(userLocation);
            mapRef.current.animateToRegion(userLocation, 500)
            let getCity = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
            getCity += userLocation.latitude + ',' + userLocation.longitude;
            getCity += '&key=AIzaSyCJTSwkdcdRpIXp2yG7DfSRKFWxKhQdYhQ&language=ar&sensor=true';
            try {
                const { data } = await axios.get(getCity);
                setCity(data.results[0].formatted_address)
                setSearch(data.results[0].formatted_address)
            } catch (e) {
                console.log(e);
            }

        }
    }

    function getLoc() {
        if (pathName === 'SpecialOrder') {
            if (type === 'deliveryLocation') {
                navigation.navigate('SpecialOrder', { cityName: city, mapRegion })
            } else {
                navigation.navigate('SpecialOrder', { deliverCityName: city, deliverMapRegion: mapRegion })
            }
        } else if (pathName === 'DeliveryReceiptLoaction') {
            navigation.navigate('DeliveryReceiptLoaction', { deliverCityName: city, deliverMapRegion: mapRegion })
        } else if (pathName === 'YourOrder') {
            navigation.navigate('YourOrder', { deliverCityName: city, deliverMapRegion: mapRegion })
        } else if (pathName === 'AddAddress') {
            navigation.navigate('AddAddress', { cityName: city, mapRegion, pathName: 'getLoc' })
        } else if (pathName === 'EditAddress') {
            navigation.navigate('editAddress', { cityName: city, mapRegion, pathName: 'getLoc' })
        } else {
            navigation.navigate('PaymentDetailes', { cityName: city, mapRegion })
        }
    }

    async function onSearch() {
        let endPoint = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=';
        endPoint += search;
        endPoint += '&key=AIzaSyCJTSwkdcdRpIXp2yG7DfSRKFWxKhQdYhQ&language=' + lang;

        try {
            const { data } = await axios.get(endPoint);
            setSearchResult(data.results);
            setSearchHeight(270);

        } catch (e) {
            console.log(e);
        }
    }

    function setSelectedLocation(item) {
        const { geometry: { location } } = item;

        const formattedItem = {
            name: item.formatted_address,
            address: item.formatted_address,
            latitude: location.lat,
            longitude: location.lng
        };

        setSearchResult([]);
        setSearchHeight(60);
        setLocation(formattedItem);

        mapRef.current.animateToRegion(
            {
                latitude: formattedItem.latitude,
                longitude: formattedItem.longitude,
                latitudeDelta: 0.422,
                longitudeDelta: 0.121,
            },
            350
        );
    }


    return (
        <ScrollView style={{ flex: 1, }}>
            <Header navigation={navigation} label={pathName !== 'OrderDetailes' ? i18n.t('selectLoca') : i18n.t('seeLocation')} />

            <View style={{ flex: 1, height: height * .9, width: width, marginTop: 20 }}>




                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute' }}>
                    <View style={{ width: '80%', marginHorizontal: 10 }}>
                        <InputIcon
                            placeholder={i18n.t('selectLocation')}
                            inputStyle={{ borderRadius: 5, height: 40, backgroundColor: '#eaeaea', borderColor: '#eaeaea', width: '100%', paddingHorizontal: 5, }}
                            styleCont={{ height: 60, width: '100%' }}
                            LabelStyle={{ backgroundColor: 0, color: Colors.IconBlack }}
                            image={require('../../../assets/images/pingray.png')}
                            editable={false}
                            multiline={true}
                            numberOfLines={10}

                            value={search}
                            onChangeText={(search) => setSearch(search)}
                            onSubmitEditing={() => onSearch()}
                        />

                        {
                            searchResult && searchResult.length > 0 ?
                                <View style={{ alignSelf: 'center', width: '100%', maxHeight: 200, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, overflow: 'hidden', top: 52, left: 5, minHeight: 60, position: 'absolute' }}>
                                    <TouchableOpacity style={{ position: 'absolute', zIndex: 3, right: -2, top: -2 }} onPress={() => setSearchResult([])}>
                                        <Icon type={'AntDesign'} name={'closecircle'} style={{ color: Colors.sky }} />
                                    </TouchableOpacity>

                                    <View style={{ alignSelf: 'center', width: '100%', height: 220, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, paddingBottom: 20, backgroundColor: '#fff', borderRadius: 10 }}>
                                        <ScrollView>
                                            {
                                                searchResult.map((item, i) => (
                                                    <TouchableOpacity onPress={() => setSelectedLocation(item)} style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd', marginHorizontal: 10, width: '95%', height: 50, alignItems: 'center', alignSelf: 'center', overflow: 'hidden', zIndex: 9999 }}>
                                                        <Icon type={'Entypo'} name={'location'} style={{ marginHorizontal: 10, color: '#000', fontSize: 16 }} />
                                                        <Text style={[styles.sText, { alignSelf: 'center', textAlign: I18nManager.isRTL ? 'right' : 'left', }]}>{(item.formatted_address).substr(0, 40) + '...'}</Text>
                                                    </TouchableOpacity>
                                                ))
                                            }
                                        </ScrollView>
                                    </View>
                                </View>
                                : null
                        }
                    </View>

                    <TouchableOpacity onPress={getCurrentLocation} style={{ backgroundColor: Colors.sky, padding: 10, marginHorizontal: 5, borderRadius: 5, height: 40 }}>
                        <Icon type='Ionicons' name='locate' style={{ color: '#fff', fontSize: 22 }} />
                    </TouchableOpacity>
                </View>


                <View style={{ width: '100%', height: '100%', flex: 1, zIndex: -1 }}>
                    {
                        mapRegion.latitude != null ? (
                            <>
                                <MapView
                                    ref={mapRef}
                                    initialRegion={mapRegion}
                                    onRegionChangeComplete={(e) => { _handleMapRegionChange(e) }}
                                    style={{ width: '100%', height: '100%', flex: 1, }}

                                />

                                <View style={{ left: '50%', marginLeft: -24, marginTop: -48, position: 'absolute', top: '50%', zIndex: 9999999, width: 25, height: 25 }}>
                                    <Image source={require('../../../assets/images/circleblue.png')} resizeMode={'contain'} style={{ width: 35, height: 35 }} />
                                </View>
                            </>
                        ) : (<View />)
                    }
                </View>


                <View style={[{ position: 'absolute', bottom: 70, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', width: '100%' }]}>

                    {
                        showAddress && pathName === 'PaymentDetailes' ?
                            <View style={{ backgroundColor: '#fff', padding: 10, width: '85%', borderRadius: 5, alignItems: 'center' }}>
                                <Text style={[{
                                    fontFamily: 'flatMedium',
                                    color: Colors.IconBlack,
                                    textAlign: 'center',
                                    fontSize: 13,
                                    lineHeight: 20
                                }]}>{i18n.t('delevierAddress')} : {city}</Text>
                                {/* <Text style={[{ fontFamily: 'flatMedium', color: Colors.sky, fontSize: 14, marginTop: 10 }]}>{i18n.t('delevierPrice')}</Text>
                                <Text style={[{ fontFamily: 'flatMedium', color: Colors.sky, fontSize: 14, marginTop: 5 }]}>{MinPriceCoast.delivery.min}{i18n.t('RS')}</Text> */}
                            </View>
                            :
                            null
                    }

                    {
                        pathName !== 'OrderDetailes' ?

                            <BTN title={i18n.t('confirm')} disable={mapRegion.latitude == null} onPress={() => getLoc()} ContainerStyle={{ marginTop: 10, borderRadius: 20, padding: 15 }} TextStyle={{ fontSize: 13 }} />
                            :
                            null
                    }

                </View>
            </View>
        </ScrollView>
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
        fontSize: width * .036,
    },
})

export default GetLocation;


