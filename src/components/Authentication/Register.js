import React, { useState, useEffect } from 'react'
import { View, Text, Dimensions, StyleSheet, ScrollView, Image, Linking } from 'react-native'
import Constants from "expo-constants";
import LogoLogin from '../../common/LogoLogin'
import BTN from '../../common/BTN';
import Colors from '../../consts/Colors';
import i18n from "../locale/i18n";
import { SText } from '../../common/SText';
import { useIsFocused } from '@react-navigation/native';
import { getAppInfo } from '../../actions';
import { useDispatch, useSelector } from 'react-redux';

const { width } = Dimensions.get('window')

function Register({ navigation }) {


    const isFocused = useIsFocused();
    const dispatch = useDispatch()
    const lang = useSelector(state => state.lang.lang);
    const appInfo = useSelector(state => state.appInfo.appInfo);

    useEffect(() => {
        if (isFocused) {
            dispatch(getAppInfo(lang));

        }
    }, [isFocused])

    return (
        <View style={styles.container}>
            <ScrollView>
                <LogoLogin navigation={navigation} />
                <View  >
                    <Text style={styles.sText}>{i18n.t("createAcc")}</Text>

                    <BTN title={i18n.t("clientReg")} onPress={() => navigation.navigate('ClientReg', { userType: 2 })} ContainerStyle={[styles.Btn, { marginVertical: 20 }]} />

                    <BTN title={i18n.t("delegateReg")} onPress={() => navigation.navigate('registerDelegate')} ContainerStyle={[styles.Btn, { marginVertical: 20 }]} />

                    <View style={[styles.WrapText, { marginTop: 30 }]}>
                        <Image source={require('../../../assets/images/whatsapp.png')} style={{ width: 20, height: 20 }} resizeMode='contain' />
                        <SText title={i18n.t("broblem")} style={{ paddingTop: 0, color: Colors.IconBlack, fontFamily: 'flatLight', marginLeft: 5 }} onPress={() => Linking.openURL(`https://api.whatsapp.com/send?phone=${appInfo.whatapp}`)} />
                    </View>
                </View>
            </ScrollView>
            {/* <Image source={require('../../../assets/images/building.png')} style={styles.building} resizeMode='cover' /> */}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg,
        paddingTop: 0,
    },
    sText: {
        textAlign: 'center',
        fontFamily: 'flatMedium',
        color: Colors.sky,
        fontSize: 20,
        marginVertical: 20,
    },
    building: {
        width,
        height: 100,
        marginTop: 20,
    },
    Btn: {
        borderRadius: 30
    },
    WrapText: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 }

})
export default Register
