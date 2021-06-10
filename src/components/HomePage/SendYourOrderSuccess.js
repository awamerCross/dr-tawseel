import React from 'react'
import { View, Dimensions, Image, Text, StyleSheet, ScrollView, Platform } from 'react-native'
import Colors from '../../consts/Colors'
import BTN from '../../common/BTN'
import i18n from "../locale/i18n";



const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

function SendYourOrderSuccess({ navigation }) {
    return (
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'space-between', marginHorizontal: 30, marginTop: 40 }}>
            <View style={{ alignItems: 'center', flex: .55, justifyContent: 'center', width: '100%', marginTop: 150, marginHorizontal: 30 }}>
                <Image source={require('../../../assets/images/vector.png')} style={styles.orderImg} resizeMode='contain' />
                <Text style={styles.tText}>{i18n.t('orderSent')}</Text>
                <Text style={styles.sText}>{i18n.t('orderAccepted')}</Text>
                <BTN title={i18n.t('backHome')} onPress={() => navigation.navigate('GoHome')} ContainerStyle={{ marginTop: 60, borderRadius: 20, paddingVertical: 25, }} TextStyle={{ fontSize: 18, }} />

            </View>

            {/* <Image source={require('../../../assets/images/building.png')} style={styles.building} resizeMode='cover' /> */}
        </View>
    )
}
const styles = StyleSheet.create({
    orderImg: {
        width: width * .3,
        height: width * .3,
        borderRadius: 5
    },
    sText: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: width * .036,
    },
    tText: {
        fontFamily: 'flatMedium',
        color: Colors.sky,
        fontSize: width * .06,
        marginVertical: width * .03
    },
    building: {
        width,
        height: 100,
    },
})
export default SendYourOrderSuccess
