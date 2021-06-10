import React from 'react'
import { View, Dimensions, Image, Text, StyleSheet } from 'react-native'
import Colors from '../../consts/Colors'
import BTN from '../../common/BTN'
import i18n from "../locale/i18n";
import { useSelector } from 'react-redux';



const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

function SuccessEvaluation({ navigation }) {
    const user = useSelector(state => state.Auth.user ? state.Auth.user.data : null);
    console.log(user);
    return (
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'space-between', marginHorizontal: 30 }}>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, width: '100%', }}>
                <Image source={require('../../../assets/images/right.png')} style={styles.orderImg} resizeMode='contain' />
                <Text style={styles.tText}>{i18n.t('rateSent')}</Text>
                <BTN title={i18n.t('backHome')} onPress={user && user.user_type == 3 ? () => navigation.navigate('RebHome') : () => navigation.navigate('GoHome')} ContainerStyle={{ marginTop: 50, borderRadius: 20, flex: .1 }} TextStyle={{ fontSize: 13 }} />
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

    tText: {
        fontFamily: 'flatMedium',
        color: Colors.sky,
        fontSize: width * .1,
        marginVertical: width * .03,
        textAlign: 'center',
    },
    building: {
        width,
        height: 100,
    },
})

export default SuccessEvaluation
