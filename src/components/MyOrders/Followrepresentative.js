import React, { useState, useEffect, useRef } from 'react'
import { ScrollView, View, AsyncStorage, Image, StyleSheet, Dimensions, Text, Animated } from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import MapView, {
    Marker,
    AnimatedRegion,
    Polyline,
    PROVIDER_GOOGLE
} from "react-native-maps";

import Colors from '../../consts/Colors';
import Header from '../../common/Header';
import i18n from "../locale/i18n";
import * as Location from 'expo-location';

window.navigator.userAgent = 'react-native';
import SocketIOClient from 'socket.io-client';
import { getAppInfo } from "../../actions";
import axios from "axios";

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

const latitudeDelta = 0.00922;
const longitudeDelta = 0.00421;

function Followrepresentative({ navigation, route }) {

    const socket = SocketIOClient('https://drtawsel.4hoste.com:4544/', { jsonp: false });
    const { orderDetails, address } = route.params;
    let mapRef = useRef(null);
    let markerRef = useRef(null);
    console.log(address);
    const [region, setRegion] = useState({
        latitude: address.latitude_provider,
        longitude: address.longitude_provider,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00421
    });

    const [markers, setMarkers] = useState([{
        title: '',
        coordinates: {
            latitude: address.latitude_to,
            longitude: address.longitude_to,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421
        },
    }]);

    const [currentLocation, setCurrentLocation]   = useState({
        latitude: 24.7135517,
        longitude: 46.6752957,
        latitudeDelta,
        longitudeDelta
    });

    const [isMapReady, SetIsmapReady] = useState(false)
    const [routeCoordinates, SetRouteCoordinates] = useState([])
    const onMapLayout = () => {
        SetIsmapReady(true)
    }

    function joinRoom(data) {
        socket.emit('subscribe', data);
    }

    useEffect(() => {
        joinRoom({ room: orderDetails.order_id });
        socket.on('locationUpdated', (data) => {
            console.log('Now u see me', data);
            setRegion({
                latitude: parseFloat(data.lat),
                longitude: parseFloat(data.long),
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            })
        });
    }, [socket]);

    function getLocation() {
        Location.watchPositionAsync({
            enableHighAccuracy: true,
            distanceInterval: 20,
            timeInterval: 5000
        }, (position) => {
            AsyncStorage.getItem('room', (err, data) => {
                if (data) {
                    joinRoom({
                        lat: position.coords.latitude,
                        long: position.coords.longitude,
                        room: data
                    })
                }
            });
        });
    }

    const fetchData = async () => {
        let { status } = await Location.requestPermissionsAsync();
        let userLocation = {};
        if (status !== 'granted') {
            alert('صلاحيات تحديد موقعك الحالي ملغاه');
        } else {
            const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });

            if (route.params && route.params.latitude){
                userLocation = { latitude: route.params.latitude, longitude:route.params.longitude , latitudeDelta , longitudeDelta};
            } else {
                userLocation = { latitude, longitude , latitudeDelta , longitudeDelta};
            }

            setCurrentLocation(userLocation)
        }

    };


    useEffect(() => {
        fetchData();
    }, [route.params]);


    return (
        <ScrollView style={{ flex: 1, }}>
            <Header navigation={navigation} label={i18n.t('followDelegate')} />

            {
                address.latitude_to && region.latitude != null ?
                    <View style={{ flex: 1, height: height * .9, width: width }}>
                        <MapView
                            ref={mapRef}
                            style={{ flex: 1, }}
                            initialRegion={{
                                latitude: region.latitude,
                                longitude: region.longitude,
                                latitudeDelta: 0.001,
                                longitudeDelta: 0.005
                            }}
                            onMapReady={() => { mapRef.current.fitToSuppliedMarkers(['mk1', 'mk2'], { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 } }) }}
                            // onRegionChangeComplete={region => setRegion(region)}
                            onLayout={onMapLayout}
                            showUserLocation
                            followUserLocation
                            minZoomLevel={1}
                            loadingEnabled>
                            <Polyline coordinates={routeCoordinates} strokeWidth={15} />

                            {/*end point -- me -- */}

                            <MapView.Marker
                                ref={markerRef}
                                coordinate={{
                                    latitude: address.latitude_to,
                                    longitude: address.longitude_to,
                                    latitudeDelta: 0.001,
                                    longitudeDelta: 0.005
                                }}
                            >
                                <Image source={require('../../../assets/images/home_location.png')} style={{ height: 45, width: 45 }} resizeMode={'contain'} />
                            </MapView.Marker>

                            {/*start point -- provider -- */}
                            <MapView.Marker
                                ref={markerRef}
                                coordinate={{
                                    latitude: region.latitude,
                                    longitude: region.longitude,
                                    latitudeDelta: 0.001,
                                    longitudeDelta: 0.005
                                }}
                            >
                                <Image source={require('../../../assets/images/car_pin.png')} style={{ height: 50, width: 50 }} resizeMode={'contain'} />
                            </MapView.Marker>

                            <MapView.Marker
                                title={i18n.t('currentLocation')}
                                coordinate={{ latitude: currentLocation.latitude, longitude: currentLocation.longitude }}
                            >
                                <Image source={require('../../../assets/images/home_location.png')} resizeMode={'contain'} style={{ width: 45, height: 44 }}/>

                            </MapView.Marker>


                            {/*{*/}
                            {/*    (markers.length > 0) ?*/}
                            {/*        markers.map((marker, i) => (*/}
                            {/*            <MapView.Marker key={i}*/}
                            {/*                coordinate={marker.coordinates}*/}
                            {/*                title={marker.title}*/}
                            {/*            />*/}
                            {/*        ))*/}
                            {/*        : null*/}
                            {/*}*/}
                        </MapView>



                    </View>
                    :
                    null
            }

        </ScrollView>
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
})
export default Followrepresentative
