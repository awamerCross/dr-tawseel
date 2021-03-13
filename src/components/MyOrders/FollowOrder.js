import React, { useState } from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import Colors from '../../consts/Colors';
import Header from '../../common/Header';
import i18n from "../locale/i18n";



const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')


function FollowOrder({ navigation }) {


    const [region, setRegion] = useState({
        latitude: 52.5200066,
        longitude: 13.404954,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
    });

    const [isMapReady, SetIsmapReady] = useState(false)
    const onMapLayout = () => {
        SetIsmapReady(true)
    }

    return (
        <ScrollView style={{ flex: 1, }}>
            <Header navigation={navigation} label={i18n.t('followOrder')} />

            <View style={{ flex: 1, height: height * .9, width: width, marginTop: 20 }}>
                <MapView
                    style={{ flex: 1, }}
                    region={region}
                    onRegionChangeComplete={region => setRegion(region)}
                    customMapStyle={mapStyle}
                    onLayout={onMapLayout}
                    provider={PROVIDER_GOOGLE} >
                    <Marker
                        coordinate={{ latitude: 52.5200066, longitude: 13.404954 }}
                        draggable />
                </MapView>
            </View>
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
export default FollowOrder
