import React, { useMemo } from 'react'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native'
import Colors from '../consts/Colors'

function StroeDetailes({ item, mapRegion, }) {
    const navigation = useNavigation();
    return useMemo(() => {

        return (
            <TouchableOpacity onPress={() => navigation.navigate('OrderFromYourStore', { placeId: item.place_id, mapRegion })}>
                <View style={styles.card}>
                    <Image source={{ uri: item.icon }} style={styles.ImgCard} resizeMode='contain' />
                    <View style={{ flexDirection: 'column', justifyContent: 'space-evenly', marginStart: 5 }}>
                        <Text style={[styles.sText, { alignSelf: 'flex-start' }]}>{item.name.length > 30 ? (item.name).substr(0, 30) + '...' : item.name} </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('../../assets/images/pinblue.png')} style={styles.iconImg} resizeMode='contain' />
                            <Text style={styles.yText}> {item.distance}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }, [item]);
};
const styles = StyleSheet.create({
    card: {
        //     shadowColor: Colors.bg,
        backgroundColor: Colors.bg,
        flexDirection: 'row',
        marginHorizontal: 0,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
        width: '100%',
        padding: 10,
        borderRadius: 5,
        shadowColor: "#000",

    },
    ImgCard: {
        width: '20%',
        height: 60,
        borderRadius: 5
    },
    sText: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: 12,

    },
    iconImg: {
        width: 12,
        height: 12,
        marginHorizontal: 1,
        marginVertical: 5

    },
    yText: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: 14,
        opacity: .6
    },
})

export default StroeDetailes
