import React, { useState, useEffect } from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, I18nManager } from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import Colors from '../../consts/Colors';
import i18n from "../locale/i18n";
import { GetProfileAction } from '../../actions/ProfileAction';
import { useDispatch, useSelector } from "react-redux";
import { hidePhone } from "../../actions";





const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')
function MobileStatues({ navigation }) {

    const [status, setStatus] = useState('');
    const Profile = useSelector(state => !state.profile ? '' : !state.profile.profile ? '' : state.profile.profile.data);
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null);
    const hide = Profile.hide_phone;
    const lang = useSelector(state => state.lang.lang);
    const dispatch = useDispatch()

    useEffect(() => {
        setStatus(hide ? 'hide' : 'show')
        const unsubscribe = navigation.addListener('focus', () => {
            dispatch(GetProfileAction(token, lang)).then(() => {
                setStatus(hide ? 'hide' : 'show')
            })
        })
        return unsubscribe
    }, [navigation, Profile]);

    function onChange(type) {
        if (type !== hide) {
            dispatch(hidePhone(token, lang)).then(() => {
                setStatus(type)
            })
        }
    }


    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                <Image source={require('../../../assets/images/bluBack.png')} style={[styles.BigImg, { transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }], }]} resizeMode='contain' />
                <View style={{ position: 'absolute', marginHorizontal: 20, bottom: width * .08 }}>
                    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                        <Image source={require('../../../assets/images/menue.png')} style={[styles.MenueImg, { transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }], }]} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
                <Text style={styles.Text}>{i18n.t('phonee')}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../../../assets/images/arrBlack.png')} style={[styles.MenueImg, { top: width * .16, marginHorizontal: width * .06 }]} />
                </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1 }}>

                <View style={{ flexDirection: 'row', marginTop: width * .2, paddingStart: width * .05 }}>
                    <Image source={require('../../../assets/images/Lang.png')} style={{ width: 30, height: 30 }} />
                    <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Text style={styles.stext}>{i18n.t('phonee')}</Text>
                        <Text style={[styles.stext, { fontFamily: 'flatRegular' }]}>{i18n.t('changeStatus')}</Text>
                    </View>
                </View>
                <View style={{ marginTop: width * .1, }}>
                    <TouchableOpacity onPress={() => onChange('show')} style={{ backgroundColor: '#FCFAFA', width }}>
                        <Text style={{ padding: 20, color: status === 'show' ? '#FDCD52' : Colors.fontNormal, fontFamily: 'flatMedium', alignSelf: 'flex-start' }}>{i18n.t('show')}</Text>
                    </TouchableOpacity>
                    <View style={{ width, backgroundColor: '#eaeaea', height: 2 }}></View>
                    <TouchableOpacity onPress={() => onChange('hide')} style={{ backgroundColor: '#FCFAFA', width, }}>
                        <Text style={{ padding: 20, color: status === 'hide' ? '#FDCD52' : Colors.fontNormal, fontFamily: 'flatMedium', alignSelf: 'flex-start' }}>{i18n.t('hide')}</Text>
                    </TouchableOpacity>
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
        width: 18,
        height: 18,
        marginHorizontal: 4,

    },
    Text: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: 16,
        textAlign: 'center',
        top: width * .14,

    },

    stext: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: 14,

    },
})
export default MobileStatues