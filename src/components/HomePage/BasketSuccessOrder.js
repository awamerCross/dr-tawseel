import React from 'react'
import { View, Dimensions, Image, Text, StyleSheet } from 'react-native'
import Colors from '../../consts/Colors'
import BTN from '../../common/BTN'
import i18n from "../locale/i18n";



const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

function BasketSuccessOrder({ navigation, route }) {

    const { orderId } = route.params;

    return (
        <View style={{ flex: 1 }}>
            <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', flex: 1 }}>
                <Image source={require('../../../assets/images/vector.png')} style={styles.orderImg} resizeMode='contain' />
                <Text style={styles.tText}>{i18n.t('orderSentSucc')}</Text>
                <BTN title={i18n.t('followOrder')} onPress={() => navigation.navigate('OrderDetailes', { orderId })} ContainerStyle={{ marginTop: 50, borderRadius: 15, flex: .1 }} TextStyle={{ fontSize: 16 }} />
                <BTN title={i18n.t('backHome')} onPress={() => navigation.navigate('GoHome')} ContainerStyle={{ marginTop: 10, borderRadius: 15, flex: .1 }} TextStyle={{ fontSize: 16 }} />
            </View>
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
        fontSize: width * .02,
        textAlign: 'center'
    },
    tText: {
        fontFamily: 'flatMedium',
        color: Colors.sky,
        fontSize: width * .06,
        marginVertical: width * .03
    }
})
export default BasketSuccessOrder
