import React from 'react'
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, Platform, I18nManager } from 'react-native'
import { DrawerActions } from '@react-navigation/native';



import Colors from '../consts/Colors';



const { width } = Dimensions.get('window')
const isIOS = Platform.OS === 'ios';

function Header({ label, navigation, image, onPress }) {
    return (

        <View style={styles.container}>
            <Image source={require('../../assets/images/bluBack.png')} style={[styles.BigImg, { transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }], }]} resizeMode='contain' />
            <View style={styles.wrap}>
                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} style={{ alignSelf: 'center' }}>
                    <Image source={require('../../assets/images/menue.png')} style={[styles.MenueImg, { padding: 10, marginBottom: width * .04, transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }] }]} />
                </TouchableOpacity>
            </View>

            <Text style={styles.Text}> {label}</Text>

            <View style={{ flexDirection: 'row', }}>
                <TouchableOpacity onPress={onPress}>
                    <Image source={image} style={[styles.MenueImg, { top: width * .16, }]} resizeMode='contain' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../../assets/images/arrBlack.png')} resizeMode='contain' style={[styles.MenueImg, { padding: 10, marginHorizontal: width * .05, top: 40, transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }] }]} />
                </TouchableOpacity>
            </View>

        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.bg,
        // marginTop: isIOS ? 25 : 10
        // marginTop: isIOS ? 20 : 0
    },
    BigImg: {
        left: -13,
        top: -10,
        height: 90,
        width: 90,
    },
    MenueImg: {
        width: 20,
        height: 20,
    },
    wrap: {
        position: 'absolute',
        marginHorizontal: 25,
        bottom: width * .04,
    },
    Text: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: width * .04,
        textAlign: 'center',
        top: 40
    },
})
export default Header
