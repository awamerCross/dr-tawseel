

import React from 'react'
import { View, Image, TouchableOpacity, Dimensions, StyleSheet, I18nManager, Text } from 'react-native'
import { useSelector } from 'react-redux'
import Constants from "expo-constants";
import Colors from '../consts/Colors';



const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

function HeaderHome({ navigation, count }) {

    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null)


    return (
        <View style={styles.wrapImg}>
            <Image source={require('../../assets/images/bluBack.png')} style={[styles.BigImg, { transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }], }]} resizeMode='contain' />
            <View style={{ flexDirection: 'row', position: 'absolute', paddingHorizontal: 15, bottom: 20, alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Image source={require('../../assets/images/menue.png')} style={[styles.MenueImg, { transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }], }]} resizeMode='contain' />
                    </TouchableOpacity>

                    {
                        token ?
                            <TouchableOpacity onPress={() => navigation.navigate('NotificationsList')}>
                                <Image source={require('../../assets/images/notify.png')} style={styles.MenueImg} resizeMode='contain' />
                            </TouchableOpacity>
                            :
                            null
                    }
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('Basket')} style={{ flexDirection: 'row' }}>
                    <View style={{
                        backgroundColor: Colors.sky,
                        borderRadius: 5,
                        elevation: 1,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        alignSelf: 'flex-end',
                        bottom: 0,
                        height: 18,
                        width: 18,
                        alignItems: 'center',
                        justifyContent: 'center',
                        top: 5,
                        left: 5,

                    }}>
                        <Text style={{
                            fontFamily: 'flatMedium', color: Colors.IconBlack, fontSize: 14,
                        }}>{count}</Text>
                    </View>
                    <Image source={require('../../assets/images/basket.png')} style={styles.LeftImg} resizeMode='contain' />
                </TouchableOpacity>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    BigImg: {
        height: 100,
        width: 150,
        right: 35
    },
    wrapImg: {
        // marginTop: Constants.statusBarHeight,
        justifyContent: 'center',
        height: 100
    },

    MenueImg: {
        width: 25,
        height: 25,
        marginHorizontal: 4,
        padding: 10

    },

    LeftImg: {
        width: 25,
        height: 25,
        padding: 5
    },
})

export default HeaderHome
