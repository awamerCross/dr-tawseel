import React, { useState } from 'react'
import {
    ScrollView,
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Text,
    ActivityIndicator,
    I18nManager,
} from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import Colors from '../../consts/Colors';
import { InputIcon } from '../../common/InputText';
import BTN from '../../common/BTN';
import I18n from "../locale/i18n";
import { useDispatch, useSelector } from "react-redux";
import { sendComp } from "../../actions";
import { Textarea } from "native-base";
import Header from "../../common/Header";
import { ToasterNative } from '../../common/ToasterNatrive';
import { validateEmail, validateUserName } from '../../common/Validation';




const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

function CompSugget({ navigation }) {
    const [name, setName] = useState('');
    const [email, setemail] = useState('');
    const [msg, setMsg] = useState('');
    const [subj, setSubj] = useState('');

    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null);

    const [isSubmitted, setIsSubmitted] = useState(false);

    const dispatch = useDispatch();


    const _Valdiation = () => {
        let NameErr = validateUserName(name)
        let maileErr = validateEmail(email);
        let MessageErr = msg == '' ? I18n.t('enterMsg') : null
        let MessagesErr = subj == '' ? I18n.t('enterMsg') : null

        return NameErr || maileErr || MessageErr || MessagesErr
    }



    const sendMsg = () => {
        let val = _Valdiation();

        if (!val) {

            setIsSubmitted(true)
            dispatch(sendComp(lang, token, name, email, subj, msg)).then(() => setIsSubmitted(false))
            setName('')
            setemail('')
            setSubj('')
            setMsg('')
        }

        else {
            ToasterNative(_Valdiation(), 'danger', 'bottom')

        }


    }


    return (
        <View style={{ flex: 1 }}>
            <Header navigation={navigation} label={I18n.t('compAndSug')} />
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

                <Image source={require('../../../assets/images/logo_black.png')} style={styles.images} resizeMode='contain' />
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
                <InputIcon
                    label={I18n.t('subject')}
                    placeholder={I18n.t('enterSubj')}
                    value={subj}
                    onChangeText={(e) => setSubj(e)}
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

                <BTN title={I18n.t('send')} ContainerStyle={{ marginTop: 20, borderRadius: 25, marginBottom: 30, backgroundColor: Colors.sky }} TextStyle={{ fontSize: 13 }} onPress={sendMsg} />

            </ScrollView>
        </View>

    )
}
const styles = StyleSheet.create({
    BigImg: {
        height: height * .14,
        width: width * .23,
    },
    MenueImg: {
        width: 18,
        height: 18,
        marginHorizontal: 4,

    },
    Text: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: width * .045,
        textAlign: 'center',
        top: width * .14,

    },

    images: {
        width: width * .3,
        height: width * .3,
        alignSelf: 'center',
        marginTop: 5
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
export default CompSugget
