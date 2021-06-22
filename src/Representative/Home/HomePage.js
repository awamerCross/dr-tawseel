import React, { useEffect, useRef, useState } from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Dimensions,
    TouchableOpacity,
    I18nManager,
    Switch,
    Platform,
    AppState
} from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import Colors from '../../consts/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { getDelegateOrders, GetDeligate, getMyOrders, logout } from "../../actions";
import i18n from "../../components/locale/i18n";
import ToggleSwitch from 'toggle-switch-react-native'
import * as Notifications from 'expo-notifications'
import * as Location from 'expo-location';
import { _renderRows } from '../../common/LoaderImage';
import axios from "axios";
import CONST from "../../consts";

const { width, height } = Dimensions.get('window')

const latitudeDelta = 0.0922;
const longitudeDelta = 0.0421;


function HomePage({ navigation }) {
    const [refreshing, setRefreshing] = React.useState(false);

    const [spinner, setSpinner] = useState(true);
    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null);
    const myOrders = useSelector(state => state.delegate.orders);
    const user = useSelector(state => state.Auth.user ? state.Auth.user.data : null);
    let loadingAnimated = []
    const dispatch = useDispatch();
    const [isEnabled, setIsEnabled] = useState(true);

    const [mapRegion, setMapRegion] = useState({
        latitude: 24.7135517,
        longitude: 46.6752957,
        latitudeDelta,
        longitudeDelta
    });

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    useEffect(() => {
        AppState.addEventListener('change', _handleAppStateChange);

        return () => {
            AppState.removeEventListener('change', _handleAppStateChange);
        };
    }, []);

    const _handleAppStateChange = (nextAppState) => {
        if (
            appState.current.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            console.log('App has come to the foreground!');
        }

        appState.current = nextAppState;

        setAppStateVisible(appState.current);
        if (appState.current === 'active') {
            axios({
                url: CONST.url + 'update-availability',
                method: 'POST',
                params: { lang },
                data: { available: 1 },
                headers: { Authorization: 'Bearer ' + token, },
            }).then(response => {

            });
        } else {
            axios({
                url: CONST.url + 'update-availability',
                method: 'POST',
                params: { lang },
                data: { available: 1 },
                headers: { Authorization: 'Bearer ' + token, },
            }).then(response => {

            });
        }

        console.log('AppState', appState.current);
    };
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setSpinner(true)
        FetchLocations().then(() => setSpinner(false), setRefreshing(false))

    }, []);

    const HandleChangeStatue = () => {
        setIsEnabled(!isEnabled)
        dispatch(GetDeligate(lang, token))
    }

    const FetchLocations = async () => {

        let { status } = await Location.requestPermissionsAsync();
        if (status === 'granted') {
            const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            const userLocation = { latitude, longitude, latitudeDelta, longitudeDelta };
            setMapRegion(userLocation)
            dispatch(getDelegateOrders(lang, token, 'READY', latitude, longitude))
        } else {
            alert('صلاحيات تحديد موقعك الحالي ملغاه');
        }
    }


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setSpinner(true)
            FetchLocations().then(() => setSpinner(false))
        })
        return unsubscribe
    }, [navigation]);

    useEffect(() => {
        const subscription = Notifications.addNotificationReceivedListener(notification => {

            let type = notification.request.content.data.type;
            let OrderId = notification.request.content.data.order_id;

            if (type === 'special_order' && OrderId) {
                dispatch(getDelegateOrders(lang, token, 'READY', mapRegion.latitude, mapRegion.longitude)).then(() => setSpinner(false))
            }
        });

        return () => { subscription.remove() }
    }, [navigation]);

    useEffect(() => {
        const subscription = Notifications.addNotificationResponseReceivedListener(res => {

            let notification = res.notification;

            let type = notification.request.content.data.type;
            let OrderId = notification.request.content.data.order_id
            let room = notification.request.content.data.room


            if (type === 'block') {
                dispatch(logout(token))
            }
            else if (type === 'admin')
                navigation.navigate('NotificationsList')
            else if (type === 'wallet')
                navigation.navigate('Wallet')
            else if (type === 'order_offer')
                navigation.navigate('AllOffers', { id: OrderId })
            else if (type === 'order' && OrderId) {
                navigation.navigate('OrderDetailes', { orderId: OrderId, latitude: mapRegion.latitude, longitude: mapRegion.longitude })
            } else if (type === 'special_order' && OrderId) {
                navigation.navigate('OrderDetailes', { OrderId: notification.request.content.data.order_id, latitude: mapRegion.latitude, longitude: mapRegion.longitude })
            } else if (type === 'chat' && room) {
                navigation.navigate('OrderChatting', { receiver: user.user_type == 2 ? room.order.delegate : room.order.user, sender: user.user_type == 2 ? room.order.user : room.order.delegate, orderDetails: room.order })
            }

        });

        return () => subscription.remove();

    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bg }}>
            <View style={styles.wrapImg}>

                <Image source={require('../../../assets/images/bluBack.png')} style={[styles.BigImg, { transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }], }]} resizeMode='stretch' />
                <View style={{ marginHorizontal: 20, bottom: 40, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} style={{}}>
                        <Image source={require('../../../assets/images/menue.png')} style={[styles.MenueImg, { padding: 10, transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }], }]} />
                    </TouchableOpacity>
                    <Text style={styles.Text}>{i18n.t('home')}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../../../assets/images/circlegreen.png')} style={{ width: 10, height: 10, borderRadius: 25, bottom: 10, left: 5 }} />
                        <TouchableOpacity onPress={() => navigation.navigate('RebProfile')}>
                            <Image source={{ uri: user ? user.avatar : null }} style={{ width: 25, height: 25, borderRadius: 25 }} />
                        </TouchableOpacity>
                        <Image source={require('../../../assets/images/circleSky.png')} style={{ width: 10, height: 10, borderRadius: 25, bottom: 8, left: 12 }} />

                        <TouchableOpacity onPress={() => navigation.navigate('NotificationsList')}>
                            <Image source={require('../../../assets/images/bell.png')} style={styles.MenueImg} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: '5%', marginBottom: 15, }}>
                <Text style={{ color: Colors.fontBold, fontFamily: 'flatMedium', fontSize: 16 }}>{i18n.t('Receivingrequests')}</Text>
                <TouchableOpacity onPress={HandleChangeStatue} >
                    <ToggleSwitch
                        isOn={isEnabled}
                        onColor={Colors.sky}
                        offColor={Colors.IconBlack}
                        size="small"
                        onToggle={HandleChangeStatue}
                    />
                </TouchableOpacity>
            </View>

            <View style={{ width: '90%', height: 40, borderRadius: 10, borderWidth: 1, borderColor: Colors.sky, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', padding: 3 }}>
                <Text style={{ color: Colors.fontBold, fontFamily: 'flatMedium', textAlign: 'center' }}>{i18n.t('seeClosestOrders')}</Text>
            </View>

            <ScrollView style={[styles.container,]}

                contentContainerStyle={styles.scrollView}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                showsVerticalScrollIndicator={false}>

                {

                    spinner ?
                        _renderRows(loadingAnimated, 5, '2rows', width * .89, 100, { flexDirection: 'column', }, { borderRadius: 5, })
                        :
                        myOrders &&
                        myOrders.map((order, i) => (
                            <TouchableOpacity key={i} onPress={() => navigation.navigate('OrderDetailes', { orderId: order.order_id, latitude: mapRegion.latitude, longitude: mapRegion.longitude })}
                                style={{ marginVertical: 5, width: '90%', alignSelf: 'center' }}>
                                <View style={styles.card}>
                                    <Image source={{ uri: order.provider.avatar }} style={styles.ImgCard} />
                                    <View style={{ flexDirection: 'column', width: '60%' }}>
                                        <Text style={[styles.sText, { alignSelf: 'flex-start' }]}>{order.provider.name} {order.type === 'special' ? ' ( ' + i18n.t('special') + ' ) ' : null}</Text>
                                        <View style={{ flexDirection: 'row', paddingStart: 5 }}>
                                            <Text style={styles.yText}> {order.date}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', paddingStart: 5 }}>
                                            <Text style={styles.yText}> {i18n.t('farFrom')} : {order.distance}</Text>
                                        </View>
                                    </View>
                                    <View style={{ height: height * .08, width: 1, backgroundColor: '#e5e0e0', }} />
                                    <View style={{ flexDirection: 'column', width: '20%', alignItems: 'center' }}>
                                        <Text style={[styles.sText, { color: Colors.sky, marginHorizontal: 0 }]}>{i18n.t('orderNum')}</Text>
                                        <Text style={[styles.sText, { marginVertical: 5 }]}>{order.order_id}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                }

            </ScrollView>
        </View >
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapImg: {
        // paddingTop: Constants.statusBarHeight,
        justifyContent: 'center',
    },
    BigImg: {
        height: 80,
        width: 80,
    },
    MenueImg: {
        width: 20,
        height: 20,

    },

    Text: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        textAlign: 'center',
        fontSize: 14
    },
    scroll: {
        flex: 1, marginVertical: 20,
    },
    card: {
        shadowColor: Colors.bg,
        backgroundColor: Colors.bg,
        flexDirection: 'row',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        backgroundColor: Colors.bg,
        elevation: 3,

    },
    ImgCard: {
        width: width * .15,
        height: width * .15,
        borderRadius: 5
    },
    sText: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: width * .026,
        marginHorizontal: 10
    },
    iconImg: {
        width: 12,
        height: 12,
        marginHorizontal: 1,
        marginVertical: 5

    },
    yText: {
        fontFamily: 'flatLight',
        color: Colors.fontNormal,
        fontSize: width * .03,
        marginTop: width * .02,
        marginHorizontal: 10
    },
})
export default HomePage
