import React, { useContext, useEffect } from 'react'
import {
    ScrollView,
    Text,
    StyleSheet,
    ImageBackground,
    Dimensions,
    View,
    Image,
    TouchableOpacity,
    Share
} from 'react-native'
import Colors from '../../consts/Colors'
import TextImg from '../../common/TextImg'
import { getAppInfo, LogoutUser } from '../../actions';
import { useDispatch, useSelector } from "react-redux";
import i18n from "../../components/locale/i18n";
import UserContext from "../../routes/UserContext";

const { width, height } = Dimensions.get('window')

function DrawerMenueRepresent({ navigation }) {
    const { setLogout, } = useContext(UserContext);
    const token = useSelector(state => state.Auth.user != null ? state.Auth.user.data.token : null)
    const lang = useSelector(state => state.lang.lang);
    const appInfo = useSelector(state => state.appInfo.appInfo);
    // const user           = useSelector(state => !state.profile ? '' : !state.profile.profile ? '' : state.profile.profile);
    const user = useSelector(state => state.Auth.user != null ? state.Auth.user.data : { avatar: null, name: null })
    const dispatch = useDispatch();

    function Logout() {
        dispatch(LogoutUser(lang, token));
    }

    useEffect(() => {
        dispatch(getAppInfo(lang));
    }, []);

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
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.ImgsContainer}>
                <ImageBackground source={require('../../../assets/images/bgmenue.png')} style={styles.BgImg} />
                <Image source={{ uri: user.avatar }} style={styles.images} resizeMode='cover' />
                <Text style={styles.text}>{user.name}</Text>
            </View>

            <ScrollView style={styles.container}>

                <TextImg label={i18n.t('home')} image={require('../../../assets/images/home.png')} onPress={() => navigation.navigate('RebHome')} />
                <TextImg label={i18n.t('profile')} image={require('../../../assets/images/profile.png')} onPress={() => navigation.navigate('RebProfile')} />
                <TextImg label={i18n.t('orders')} image={require('../../../assets/images/order.png')} onPress={() => navigation.navigate('MyOrders')} />
                {/* <TextImg label={i18n.t('aboutApp')} image={require('../../../assets/images/about.png')} onPress={() => navigation.navigate('About')} /> */}
                {/* <TextImg label={i18n.t('appPolicy')} image={require('../../../assets/images/security.png')} onPress={() => navigation.navigate('politics')} /> */}
                <TextImg label={i18n.t('contactUs')} image={require('../../../assets/images/comolain.png')} onPress={() => navigation.navigate('Contact')} />
                {/* <TextImg label={i18n.t('compAndSug')} image={require('../../../assets/images/Complaint.png')} onPress={() => navigation.navigate('CompSuggest')} /> */}
                {/* <TextImg label={i18n.t('shareApp')} image={require('../../../assets/images/shareapp.png')} onPress={() => onShare()} /> */}
                <TextImg label={i18n.t('chats')} image={require('../../../assets/images/messag.png')} onPress={() => navigation.navigate('Chatting')} />
                <TextImg label={i18n.t('wallet')} image={require('../../../assets/images/bill.png')} onPress={() => navigation.navigate('Wallet')} />
                <TextImg label={i18n.t('settings')} image={require('../../../assets/images/global.png')} onPress={() => navigation.navigate('Settings')} />
                {/* <TextImg label={i18n.t('logout')} image={require('../../../assets/images/logoute.png')} onPress={Logout} /> */}

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
        width: '25%',
        height: '25%',
        position: 'absolute',
        borderRadius: 200,
        top: width * 0.2,
    },
    text: {
        position: 'absolute',
        top: width * 0.4,
        textAlign: 'center',
        fontFamily: 'flatMedium',
        color: Colors.bg,
        fontSize: 18
    },
    DrText: {
        textAlign: 'center',
        fontFamily: 'flatMedium',
        color: Colors.bg,
        fontSize: width * .04,
        paddingTop: width * .04
    }
})
export default DrawerMenueRepresent
