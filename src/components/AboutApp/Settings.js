import React, { useState, useEffect } from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, I18nManager, Share } from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import Colors from '../../consts/Colors';
import i18n from "../locale/i18n";
import Header from "../../common/Header";
import { useSelector, useDispatch } from "react-redux";
import { getAppInfo, LogoutUser } from '../../actions';



const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

function Settings({ navigation }) {

    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null)
    const lang = useSelector(state => state.lang.lang);
    const appInfo = useSelector(state => state.appInfo.appInfo);

    const dispatch = useDispatch()


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            dispatch(getAppInfo(lang));
        })
        return unsubscribe
    }, [navigation]);


    const onShare = async () => {
        try {
            const result = await Share.share({
                message: appInfo.share_link
            })

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };


    const Logout = () => {
        dispatch(LogoutUser(token))
    }

    return (
        <View style={{ flex: 1 }}>
            <Header navigation={navigation} label={i18n.t('settings')} />

            <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>

                <View style={{ flexDirection: 'row', marginTop: width * .2, paddingStart: width * .05, }}>
                    <Image source={require('../../../assets/images/Lang.png')} style={{ width: 30, height: 30 }} />
                    <Text style={styles.stext}>{i18n.t('settings')}</Text>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', flex: 1, marginTop: 60, }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Lang')}>
                        <View style={{ justifyContent: 'space-between', backgroundColor: '#FCFAFA', width, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ padding: 20, color: Colors.fontBold, fontFamily: 'flatMedium', }}>{i18n.t('language')}</Text>
                            <Image source={require('../../../assets/images/arrBlack.png')} resizeMode='contain' style={[styles.MenueImg, { marginRight: 20, transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }] }]} />
                        </View>
                    </TouchableOpacity>

                    <View style={{ width, height: .5, backgroundColor: Colors.fontBold, opacity: .5 }} />

                    <TouchableOpacity onPress={() => onShare()} >
                        <View style={{ justifyContent: 'space-between', backgroundColor: '#FCFAFA', width, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ padding: 20, color: Colors.fontBold, fontFamily: 'flatMedium', }}>{i18n.t('shareApp')}</Text>
                            <Image source={require('../../../assets/images/arrBlack.png')} resizeMode='contain' style={[styles.MenueImg, { marginRight: 20, transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }] }]} />
                        </View>
                    </TouchableOpacity>

                    <View style={{ width, height: .5, backgroundColor: Colors.fontBold, opacity: .5 }} />

                    <TouchableOpacity onPress={() => navigation.navigate('politics')} >
                        <View style={{ justifyContent: 'space-between', backgroundColor: '#FCFAFA', width, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ padding: 20, color: Colors.fontBold, fontFamily: 'flatMedium', }}>{i18n.t('appPolicy')}</Text>
                            <Image source={require('../../../assets/images/arrBlack.png')} resizeMode='contain' style={[styles.MenueImg, { marginRight: 20, transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }] }]} />
                        </View>
                    </TouchableOpacity>

                    <View style={{ width, height: .5, backgroundColor: Colors.fontBold, opacity: .5 }} />


                    <TouchableOpacity onPress={() => navigation.navigate('About')} >
                        <View style={{ justifyContent: 'space-between', backgroundColor: '#FCFAFA', width, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ padding: 20, color: Colors.fontBold, fontFamily: 'flatMedium', }}>{i18n.t('aboutApp')}</Text>
                            <Image source={require('../../../assets/images/arrBlack.png')} resizeMode='contain' style={[styles.MenueImg, { marginRight: 20, transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }] }]} />
                        </View>
                    </TouchableOpacity>
                    <View style={{ width, height: .5, backgroundColor: Colors.fontBold, opacity: .5 }} />

                    {token ?

                        <TouchableOpacity onPress={Logout} >
                            <View style={{ justifyContent: 'space-between', backgroundColor: '#FCFAFA', width, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ padding: 20, color: Colors.fontBold, fontFamily: 'flatMedium', }}>{i18n.t('logout')}</Text>
                                <Image source={require('../../../assets/images/arrBlack.png')} resizeMode='contain' style={[styles.MenueImg, { marginRight: 20, transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }] }]} />
                            </View>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => navigation.navigate('Login')} >
                            <View style={{ justifyContent: 'space-between', backgroundColor: '#FCFAFA', width, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ padding: 20, color: Colors.fontBold, fontFamily: 'flatMedium', }}>{i18n.t('signIn')}</Text>
                                <Image source={require('../../../assets/images/arrBlack.png')} resizeMode='contain' style={[styles.MenueImg, { marginRight: 20, transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }] }]} />
                            </View>
                        </TouchableOpacity>
                    }
                </View>
            </ScrollView >
        </View>

    )
}
const styles = StyleSheet.create({
    BigImg: {
        height: height * .14,
        width: width * .22,
    },
    MenueImg: {
        width: 12,
        height: 12,
        marginHorizontal: 4,

    },
    Text: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: width * .045,
        textAlign: 'center',
        top: width * .14,

    },

    stext: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: 18,
        alignSelf: 'flex-start'

    },
})
export default Settings
