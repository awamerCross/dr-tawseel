import React, { useContext, useState, useEffect } from 'react'
import { ScrollView, Text, StyleSheet, ImageBackground, Dimensions, View, Image, TouchableOpacity, Share } from 'react-native'
import Colors from '../../consts/Colors'
import TextImg from '../../common/TextImg'
import { useDispatch, useSelector } from 'react-redux'
import { LogoutUser } from '../../actions/AuthAction'
import { getAppInfo } from '../../actions'
import i18n from "../locale/i18n";
import axios from "axios";
import CONST from "../../consts";

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')
function CustomDrawerMenue({ navigation }) {
    const dispatch = useDispatch()
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null)
    const user = useSelector(state => state.Auth.user ? state.Auth.user.data : null)
    const lang = useSelector(state => state.lang.lang);
    const appInfo = useSelector(state => state.appInfo.appInfo);

    const [spinnner, setspinnner] = useState(false);


    const Logout = () => {
        dispatch(LogoutUser(token))
    }

    useEffect(() => {
        dispatch(getAppInfo(lang));
    }, []);

    function navigateTo(name){
        navigation.navigate(name)
        axios({
            url: CONST.url + 'update-availability',
            method: 'POST',
            params: { lang },
            data: { available : 1},
            headers: { Authorization: 'Bearer ' + token, },
        }).then(response => {

        });
    }
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.ImgsContainer}>
                <ImageBackground source={require('../../../assets/images/bgmenue.png')} style={styles.BgImg} />
                     <Image source={user ? { uri: user.avatar } : require('../../../assets/images/profile.png')} style={styles.images} resizeMode={user ? 'cover' : 'contain'} />
                <View style={{position:'absolute' , bottom : '30%'}}>
                    <Text style={styles.text}>{user ? user.name : i18n.t('guest')}</Text>
                </View>

            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <TextImg label={i18n.t('home')} image={require('../../../assets/images/home.png')} onPress={() => navigateTo('GoHome')} />
                {token ? <TextImg label={i18n.t('profile')} image={require('../../../assets/images/profile.png')} onPress={() => navigateTo('Profile')} /> : null}
                {token ? <TextImg label={i18n.t('orders')} image={require('../../../assets/images/order.png')} onPress={() => navigateTo('MyOrders')} /> : null}
                <TextImg label={i18n.t('cart')} image={require('../../../assets/images/basket.png')} onPress={() => navigateTo('Basket')} />
                {token ? <TextImg label={i18n.t('wallet')} image={require('../../../assets/images/bill.png')} onPress={() => navigateTo('Wallet')} /> : null}
                {/* <TextImg label={i18n.t('aboutApp')} image={require('../../../assets/images/about.png')} onPress={() => navigation.navigate('About')} /> */}
                {/* <TextImg label={i18n.t('appPolicy')} image={require('../../../assets/images/security.png')} onPress={() => navigation.navigate('politics')} /> */}
                <TextImg label={i18n.t('contactUs')} image={require('../../../assets/images/comolain.png')} onPress={() => navigateTo('Contact')} />
                {/* <TextImg label={i18n.t('compAndSug')} image={require('../../../assets/images/Complaint.png')} onPress={() => navigation.navigate('CompSuggest')} /> */}
                {/* <TextImg label={i18n.t('shareApp')} image={require('../../../assets/images/shareapp.png')} onPress={() => onShare()} /> */}
                {/* <TextImg label={i18n.t('ComplaintsList')} image={require('../../../assets/images/flag.png')} onPress={() => navigation.navigate('complaintsList')} /> */}
                <TextImg label={i18n.t('settings')} image={require('../../../assets/images/global.png')} onPress={() => navigateTo('Settings')} />
                {/* {token ? <TextImg label={i18n.t('myAddresses')} image={require('../../../assets/images/notbook.png')} onPress={() => navigation.navigate('Address')} /> : null} */}
                {token ? <TextImg label={i18n.t('chats')} image={require('../../../assets/images/messag.png')} onPress={() => navigation.navigate('Chatting')} /> : null}
                {/* {token ? <TextImg label={i18n.t('logout')} image={require('../../../assets/images/logoute.png')} onPress={Logout} /> : <TextImg label={i18n.t('login')} image={require('../../../assets/images/logoute.png')} onPress={() => navigation.navigate('Login')} />} */}

                <TouchableOpacity onPress={() => navigation.navigate(token ? 'completeDelegate' : 'registerDelegate')} style={{ marginBottom: 0, bottom: 0, }}>
                    <View style={{ backgroundColor: Colors.sky, width: '100%', marginTop: 10 }}>
                        <Text style={styles.DrText}>{i18n.t('workAsDelegate')}</Text>
                    </View>
                </TouchableOpacity>

            </ScrollView>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    ImgsContainer: {
        justifyContent: 'center',
        alignItems: 'center',

    },
    BgImg: {
        width: '100%',
        height: height * .36,


    },
    images: {
        width: 90,
        height: 90,
        position: 'absolute',
        borderRadius: 80,

    },
    text: {
        textAlign: 'center',
        fontFamily: 'flatMedium',
        color: Colors.bg,
        fontSize: 18
    },
    DrText: {
        textAlign: 'center',
        fontFamily: 'flatMedium',
        color: Colors.bg,
        fontSize: 14,
        padding: 10
    }
})
export default CustomDrawerMenue
