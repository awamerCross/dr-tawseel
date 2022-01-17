import React, { useState, useContext, useEffect, useRef } from 'react'
import { View, Text, Dimensions, StyleSheet, ScrollView, ActivityIndicator, Image, ImageBackground, Alert, Platform, Button, Linking, Vibration } from 'react-native'
import { validatePhone, validatePassword, } from "../../common/Validation";

import LogoLogin from '../../common/LogoLogin'
import { InputIcon } from '../../common/InputText';
import Colors from '../../consts/Colors'
import BTN from '../../common/BTN';
import { SText } from '../../common/SText';
import { useIsFocused } from '@react-navigation/native';
import i18n from "../locale/i18n";
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useSelector, useDispatch } from 'react-redux';
import { SignIn } from '../../actions/AuthAction';
import { ToasterNative } from '../../common/ToasterNatrive';
import { getAppInfo } from '../../actions';
import AsyncStorage from "@react-native-async-storage/async-storage";


const { width } = Dimensions.get('window')

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

function Login({ navigation }) {

    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState('');
    const [spinner, setSpinner] = useState(false);
    const lang = useSelector(state => state.lang.lang);
    const dispatch = useDispatch();

    const [showPass, setShowPass] = useState(false);
    const isFocused = useIsFocused();
    const appInfo = useSelector(state => state.appInfo.appInfo);
    const UserType = useSelector(state => state.lang.usertype);


    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();


    useEffect(() => {

        if (isFocused) {
            dispatch(getAppInfo(lang));

        }
    }, [isFocused])

    useEffect(() => {

        setTimeout(() => registerForPushNotificationsAsync().then(token => setExpoPushToken(token)), 300)


        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
            Notifications.removeNotificationSubscription(responseListener);
        };
    }, []);


    async function registerForPushNotificationsAsync() {
        let token;
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }


            token = (await Notifications.getExpoPushTokenAsync()).data;

            await AsyncStorage.setItem('deviceID', token)
        } else {
            alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return token;
    }


    const _validate = () => {
        let phoneErr = validatePhone(phone);
        let passwordErr = validatePassword(password);
        return phoneErr || passwordErr;
    };

    const SubmitLoginHandler = () => {
        const isVal = _validate();
        if (!isVal) {
            setSpinner(true)
            dispatch(SignIn(phone, password, expoPushToken, lang, navigation)).then(() => setSpinner(false))
        }
        else {
            setSpinner(false)
            ToasterNative(_validate(), 'danger', 'bottom')
        }
    }


    return (

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

            <LogoLogin navigation={navigation} />
            <Text style={styles.sText}>{i18n.t("signIn")}</Text>
            <View style={{ marginTop: 20, }}>
                <InputIcon
                    label={i18n.t("phone")}
                    onChangeText={(e) => setPhone(e)}
                    value={phone}
                    keyboardType='numeric' />

                <InputIcon
                    label={i18n.t("password")}
                    onChangeText={(e) => setPassword(e)}
                    value={password}
                    secureTextEntry={!showPass}
                    image={require('../../../assets/images/view.png')}
                    onPress={() => setShowPass(!showPass)}
                    styleCont={{ marginTop: 10 }}
                />
            </View>

            <BTN title={i18n.t("signIn")} onPress={SubmitLoginHandler} spinner={spinner} />

            <BTN title={i18n.t("logInAsVisitor")} onPress={() => navigation.navigate('GoHome')} ContainerStyle={{ marginTop: 10, backgroundColor: '#EBEBEB' }} TextStyle={{ color: '#BDBDBD' }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 15 }}>
                <SText title={i18n.t("forgetPassword")} style={{ marginTop: 5, color: Colors.IconBlack }} onPress={() => navigation.navigate('PassRecover')} />
            </View>
            <View style={styles.WrapText}>
                <Text style={styles.Text}>{i18n.t("haveNoAcc")}</Text>
                <SText title={i18n.t("clickHere")} style={{ paddingTop: 0, color: Colors.sky, marginLeft: 5 }} onPress={() => navigation.navigate('Register')} />
            </View>

            {/* <View style={[styles.WrapText, { marginTop: 30 }]}>
                <Image source={require('../../../assets/images/whatsapp.png')} style={{ width: 20, height: 20 }} resizeMode='contain' />
                <SText title={i18n.t("broblem")} style={{ paddingTop: 0, color: Colors.IconBlack, fontFamily: 'flatLight', marginLeft: 5 }} onPress={() => Linking.openURL(`https://api.whatsapp.com/send?phone=${appInfo.whatapp}`)} />
            </View> */}

            {/* <Image source={require('../../../assets/images/building.png')} style={styles.building} resizeMode='cover' /> */}
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg

    },
    Text: {
        fontFamily: 'flatMedium',
        color: '#A8A8A8',
        fontSize: 14
    },
    sText: {
        textAlign: 'center',
        fontFamily: 'flatMedium',
        color: Colors.sky,
        fontSize: 18,
        marginTop: 20

    },
    building: {
        width,
        height: 100,
        alignSelf: 'flex-end'
    },
    WrapText: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    }

})
export default Login
