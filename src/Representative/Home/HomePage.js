import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, ScrollView, RefreshControl, Dimensions, TouchableOpacity, I18nManager, Switch, Platform } from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import Colors from '../../consts/Colors';
import { useSelector, useDispatch } from 'react-redux';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { getDelegateOrders, GetDeligate } from "../../actions";
import i18n from "../../components/locale/i18n";
import ToggleSwitch from 'toggle-switch-react-native'
import * as Notifications from 'expo-notifications'
import { ToasterNative } from '../../common/ToasterNatrive';


const { width, height } = Dimensions.get('window')

const latitudeDelta = 0.0922;
const longitudeDelta = 0.0421;


function HomePage({ navigation }) {
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        FetchLocations().then(() => dispatch(getDelegateOrders(lang, token, 'READY', mapRegion.latitude, mapRegion.longitude)))

            .then(() => setSpinner(false), setRefreshing(false))

    }, []);


    const [spinner, setSpinner] = useState(true);
    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null);
    const myOrders = useSelector(state => state.delegate.orders);
    const user = useSelector(state => state.Auth.user ? state.Auth.user.data : null);

    const dispatch = useDispatch();
    const [isEnabled, setIsEnabled] = useState(true);

    const [mapRegion, setMapRegion] = useState({
        latitude: '',
        longitude: '',
        latitudeDelta,
        longitudeDelta
    });

    const HandleChangeStatue = () => {
        setIsEnabled(!isEnabled)
        dispatch(GetDeligate(lang, token))
    }


    const FetchLocations = async () => {


        let { status } = await Location.requestPermissionsAsync();;

        if (status === 'granted') {
            let gpsServiceStatus = await Location.hasServicesEnabledAsync();
            if (gpsServiceStatus) {
                console.log("sss" + gpsServiceStatus);
                let location = await Location.getCurrentPositionAsync({ accuracy: 6 })
                setMapRegion({ latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta, longitudeDelta });

            } else {
                await Location.requestPermissionsAsync();;
                let location = await Location.getCurrentPositionAsync({ accuracy: 6 })
                setMapRegion({ latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta, longitudeDelta });

                ToasterNative("Enable Location services", 'danger', 'bottom'); //or any code to handle if location service is disabled otherwise
            }
        }
        else {
            await Location.requestPermissionsAsync();;
            let location = await Location.getCurrentPositionAsync({ accuracy: 6 })
            setMapRegion({ latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta, longitudeDelta });

            ToasterNative("Enable Location services", 'danger', 'bottom');
        }
    }
    console.log(mapRegion);
    useEffect(() => {

        const subscription = Notifications.addNotificationReceivedListener(notification => {
            console.log(notification);
            let type = notification.request.content.data.type;
            let OrderId = notification.request.content.data.order_id;
            if (type === 'special_order' && OrderId) {
                dispatch(getDelegateOrders(lang, token, 'READY', mapRegion.latitude, mapRegion.longitude)).then(() => setSpinner(false))

            }
        });

        const unsubscribe = navigation.addListener('focus', () => {
            setSpinner(true)
            FetchLocations().then(() => dispatch(getDelegateOrders(lang, token, 'READY', mapRegion.latitude, mapRegion.longitude))).then(() => setSpinner(false))



        })
        return () => { subscription.remove(), unsubscribe }
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
            <ScrollView style={[styles.container,]}

                contentContainerStyle={styles.scrollView}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                showsVerticalScrollIndicator={false}>

                {
                    myOrders ?
                        myOrders.map((order, i) => (
                            <TouchableOpacity key={i} onPress={() => navigation.navigate('OrderDetailes', { orderId: order.order_id })}
                                style={{ marginVertical: 5, width: '90%', alignSelf: 'center' }}>
                                <View style={styles.card}>
                                    <Image source={{ uri: order.provider.avatar }} style={styles.ImgCard} />
                                    <View style={{ flexDirection: 'column', width: '60%' }}>
                                        <Text style={[styles.sText, { alignSelf: 'flex-start' }]}>{order.provider.name} {order.type === 'special' ? ' ( ' + i18n.t('special') + ' ) ' : null}</Text>
                                        <View style={{ flexDirection: 'row', paddingStart: 5 }}>
                                            <Text style={styles.yText}> {order.date}</Text>
                                        </View>
                                    </View>
                                    <View style={{ height: height * .08, width: 1, backgroundColor: '#e5e0e0', }} />
                                    <View style={{ flexDirection: 'column', width: '20%', alignItems: 'center' }}>
                                        <Text style={[styles.sText, { color: Colors.sky, marginHorizontal: 0 }]}>{i18n.t('orderNum')}</Text>
                                        <Text style={[styles.sText, { marginVertical: 5 }]}>{order.order_id}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )) : null
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
        height: height * .15,
        width: width * .23,
    },
    MenueImg: {
        width: 20,
        height: 20,

    },
    LeftImg: {
        width: 20,
        height: 20,
        marginLeft: width * .64

    },
    Text: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        textAlign: 'center',
        fontSize: width * .04
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
