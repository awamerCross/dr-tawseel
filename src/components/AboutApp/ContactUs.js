import React, { useState, useEffect } from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, I18nManager, ActivityIndicator, Linking, Platform, Share } from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import Colors from '../../consts/Colors';
import { InputIcon } from '../../common/InputText';
import BTN from '../../common/BTN';
import I18n from "../locale/i18n";
import { useSelector, useDispatch } from 'react-redux';
import { getAppInfo, contactUs, getLatestProviders, getBanners, getCategories } from '../../actions';
import style from "../../../assets/styles";
import { Icon, Textarea, Toast } from "native-base";
import Header from "../../common/Header";
import { validateEmail } from '../../common/Validation';
import i18n from "../locale/i18n";

const { width, height } = Dimensions.get('window')
const isIOS = Platform.OS === 'ios';

function ContactUs({ navigation }) {
    const [name, setName] = useState('');
    const [email, setemail] = useState('');
    const [msg, setMsg] = useState('');
    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null);
    const appInfo = useSelector(state => state.appInfo.appInfo);
    const loader = useSelector(state => state.appInfo.loader);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setShow(false)
            dispatch(getAppInfo(lang));
        })
        return unsubscribe
    }, [navigation]);

    function renderLoader() {
        if (loader === false) {
            return (
                <View style={[style.loading, { height: '100%', alignSelf: 'center' }]}>
                    <ActivityIndicator size="large" color={Colors.sky} style={{ alignSelf: 'center' }} />
                </View>
            );
        }
    }

    function renderConfirm() {
        if (name && email && msg) {
            return (
                <BTN title={I18n.t('send')} onPress={() => sendMsg()} ContainerStyle={[styles.Btn, { marginTop: 20, borderRadius: 25 }]} TextStyle={{ fontSize: 13 }} />
            );
        }
        else {
            return (
                <BTN title={I18n.t('send')} ContainerStyle={[styles.Btn, { marginTop: 20, borderRadius: 25, backgroundColor: '#ccc' }]} TextStyle={{ fontSize: 13 }} />

            );
        }


    }

    function sendMsg() {

        if (validateEmail(email) == null) {
            setIsSubmitted(true)
            dispatch(contactUs(lang, token, name, email, msg)).then(() => setIsSubmitted(false))
            setName('')
            setemail('')
            setMsg('')
        } else {
            Toast.show({
                text: validateEmail(email),
                type: "danger",
                duration: 3000,
                textStyle: {
                    color: "white",
                    fontFamily: "flatMedium",
                    textAlign: 'center'
                }
            });
        }
    }



    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.bg }}>
            {renderLoader()}
            <Header navigation={navigation} label={I18n.t('contactUs')} />
            {
                show ?
                    <>
                        <Text style={styles.stext}>{I18n.t('sendMsg')}</Text>
                        <InputIcon
                            label={I18n.t('username')}
                            placeholder={I18n.t('enterUsername')}
                            value={name}
                            onChangeText={(e) => setName(e)}
                            inputStyle={{ borderRadius: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                            styleCont={{ height: 45, marginTop: width * .2 }}
                            LabelStyle={{ bottom: 60, backgroundColor: 0 }}
                        />
                        <InputIcon
                            label={I18n.t('email')}
                            placeholder={I18n.t('enterEmail')}
                            value={email}
                            onChangeText={(e) => setemail(e)}
                            inputStyle={{ borderRadius: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                            styleCont={{ height: 45, marginTop: 40 }}
                            LabelStyle={{ bottom: 60, backgroundColor: 0 }}
                        />

                        <View>
                            <Text style={[styles.labelText,
                            {
                                color: msg ? Colors.sky : Colors.fontNormal, paddingHorizontal: 10, fontSize: 13,
                                top: 10
                            },
                            ]}  >
                                {I18n.t('msg')}
                            </Text>
                            <Textarea
                                style={{
                                    backgroundColor: '#eaeaea', borderColor: '#eaeaea', textAlignVertical: 'top', paddingTop: 10, height: 150, marginTop: 40,
                                    width: '85%', alignSelf: 'center', fontFamily: 'flatMedium', fontSize: 13, textAlign: I18nManager.isRTL ? 'right' : 'left', borderRadius: 5
                                }}
                                onChangeText={(e) => setMsg(e)}
                                value={msg}
                                placeholder={I18n.t('writeComment')}
                                placeholderTextColor={Colors.fontNormal}
                            />
                        </View>

                        {renderConfirm()}

                        <Text style={[styles.stext, { fontSize: width * .04 }]}>{I18n.t('throughSocial')}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 30 }}>


                            {
                                appInfo ?
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity onPress={() => Linking.openURL(appInfo.facebook)}>
                                            <Image source={require('../../../assets/images/facebook.png')} style={{ width: 30, height: 30, borderRadius: 50, }} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => Linking.openURL(appInfo.twitter)}>
                                            <Image source={require('../../../assets/images/twitter.png')} style={{ width: 30, height: 30, borderRadius: 50, marginHorizontal: 10 }} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => Linking.openURL(appInfo.instagram)}>
                                            <Image source={require('../../../assets/images/instagram.png')} style={{ width: 30, height: 30, borderRadius: 50 }} />
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    null
                            }

                        </View>


                    </>
                    : null
            }
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 30 }}>
                <TouchableOpacity onPress={() => setShow(!show)} >
                    <View style={{ justifyContent: 'space-between', backgroundColor: '#E5E5E5', width, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ padding: 20, color: Colors.fontBold, fontFamily: 'flatMedium', }}>{i18n.t('contactUs')}</Text>
                        <Image source={require('../../../assets/images/arrBlack.png')} resizeMode='contain' style={[styles.MenueImg, { marginRight: 20, transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }] }]} />
                    </View>
                </TouchableOpacity>


                <View style={{ width, height: .5, backgroundColor: Colors.fontBold, opacity: .5 }} />

                <TouchableOpacity onPress={() => navigation.navigate('CompSuggest')} >
                    <View style={{ justifyContent: 'space-between', backgroundColor: '#E5E5E5', width, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ padding: 20, color: Colors.fontBold, fontFamily: 'flatMedium', }}>{i18n.t('compAndSug')}</Text>
                        <Image source={require('../../../assets/images/arrBlack.png')} resizeMode='contain' style={[styles.MenueImg, { marginRight: 20, transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }] }]} />
                    </View>
                </TouchableOpacity>
                <View style={{ width, height: .5, backgroundColor: Colors.fontBold }} />

                <TouchableOpacity onPress={() => navigation.navigate('complaintsList')} >
                    <View style={{ justifyContent: 'space-between', backgroundColor: '#E5E5E5', width, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ padding: 20, color: Colors.fontBold, fontFamily: 'flatMedium', }}>{i18n.t('ComplaintsList')}</Text>
                        <Image source={require('../../../assets/images/arrBlack.png')} resizeMode='contain' style={[styles.MenueImg, { marginRight: 20, transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }] }]} />
                    </View>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => Linking.openURL(`https://telegram.me/${appInfo.telegram}`)} style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 50, marginBottom: 10 }}>
                <Icon type='MaterialCommunityIcons' name='tag-faces' style={{ fontSize: 22, color: Colors.sky }} />
                <Text style={{ padding: 5, color: Colors.fontBold, fontFamily: 'flatMedium', }}>{i18n.t('JoinTel')}</Text>
            </TouchableOpacity>

        </ScrollView>
    )
}
const styles = StyleSheet.create({
    BigImg: {
        height: height * .14,
        width: width * .23,
    },
    MenueImg: {
        width: 15,
        height: 15,
        marginHorizontal: 4,

    },
    Text: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: width * .045,
        textAlign: 'center',
        top: width * .14,

    },
    ImgsContainer: {
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: height * .03
    },
    images: {
        width: width * .4,
        height: width * .4,


    },
    stext: {
        fontFamily: 'flatMedium',
        color: Colors.sky,
        fontSize: width * .05,
        marginTop: height * .05,
        alignSelf: 'center'
    },
    lText: {
        marginTop: 10,
        paddingHorizontal: 25,
        fontFamily: 'flatRegular',
        lineHeight: 20,
        color: Colors.fontNormal,
        alignSelf: 'center',
        fontSize: width * .03
    },
    labelText: {
        left: 25,
        alignSelf: "flex-start",
        fontSize: width * .03,
        zIndex: 10,
        position: "absolute",
        fontFamily: 'flatMedium',


    },
})
export default ContactUs