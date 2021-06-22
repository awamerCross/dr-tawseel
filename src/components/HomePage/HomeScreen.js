import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, TouchableOpacity, AppState, } from 'react-native'
import Colors from '../../consts/Colors';
import { useSelector, useDispatch } from 'react-redux';
import StarRating from "react-native-star-rating";
import { getCategories, getLatestProviders, getBanners, logout } from '../../actions';
import style from "../../../assets/styles";
import Swiper from 'react-native-swiper';
import i18n from "../locale/i18n";
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import axios from "axios";
import { Platform } from 'react-native'

import HeaderHome from '../../common/HeaderHome';
import { _renderRows } from '../../common/LoaderImage';
import { useIsFocused } from '@react-navigation/native';
import { ToasterNative } from '../../common/ToasterNatrive';
import CONST from "../../consts";
import { GetBasketLength } from '../../actions/BasketLength';


const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const latitudeDelta = 0.0922;
const longitudeDelta = 0.0421;

function HomeScreen({ navigation }) {

    const lang = useSelector(state => state.lang.lang);
    const categories = useSelector(state => state.categories.categories);
    const providers = useSelector(state => state.providers.providers);
    const banners = useSelector(state => state.banners.banners);
    const user = useSelector(state => state.Auth ? state.Auth.user ? state.Auth.user.data : null : null);
    const BasketLength = useSelector(state => state.BasketLength.BasketLength?.count);
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null)
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    let loadingAnimated = [];
    const [spinner, setSpinner] = useState(true);
    const [mapRegion, setMapRegion] = useState({
        latitude: null,
        longitude: null,
        latitudeDelta,
        longitudeDelta
    });
    const [loadingImage, setloadingImage] = useState(false);

    const onLoadImg = (e) => {
        if (e !== undefined) {
            setloadingImage(true)
        }
    }
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

    };

    const fetchData = async () => {
        let { status } = await Location.requestPermissionsAsync();

        if (status === 'granted') {
            let gpsServiceStatus = await Location.hasServicesEnabledAsync();
            if (gpsServiceStatus) {
                console.log("sss" + gpsServiceStatus);
                const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});

                setMapRegion({ latitude, longitude, latitudeDelta, longitudeDelta });

            } else {
                const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
                setMapRegion({ latitude, longitude, latitudeDelta, longitudeDelta });

                ToasterNative("Enable Location services", 'danger', 'bottom'); //or any code to handle if location service is disabled otherwise
            }
        }
        else {
            const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
            setMapRegion({ latitude, longitude, latitudeDelta, longitudeDelta });

        }

    }


    useEffect(() => {
        if (isFocused)
            setSpinner(true)
        fetchData()
        dispatch(getLatestProviders());
        dispatch(getBanners(lang))
        dispatch(GetBasketLength(lang, token))
        dispatch(getCategories(lang)).then(() => setSpinner(false))

    }, [isFocused]);


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
                console.log('oferrrrrrrrrrrrrrrrrrrrr', OrderId)
            // navigation.navigate('AllOffers', { id: OrderId })
            else if (type === 'order' && OrderId) {
                navigation.navigate('OrderDetailes', { orderId: OrderId, latitude: mapRegion.latitude, longitude: mapRegion.longitude })
            } else if (type === 'chat' && room) {
                navigation.navigate('OrderChatting', { receiver: user.user_type == 2 ? room.order.delegate : room.order.user, sender: user.user_type == 2 ? room.order.user : room.order.delegate, orderDetails: room.order })
            }

        });

        return () => subscription.remove();

    }, []);


    return (
        <View style={{ flex: 1, backgroundColor: Colors.bg }}>
            <HeaderHome navigation={navigation} count={BasketLength} />

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

                <Swiper
                    removeClippedSubviews={false}
                    autoplay={true}
                    autoplayTimeout={3.5}
                    autoplayDirection={true}
                    showsPagination={false}
                    key={banners.length}
                    containerStyle={{ width: '100%' }}
                    showsButtons={false}
                    style={{ flexDirection: 'row-reverse', height: 140, }}
                >
                    {
                        banners.map((img, i) => {
                            return (
                                <TouchableOpacity style={[style.Width_100, { padding: 15, borderRadius: 10, overflow: 'hidden' }]} key={'_' + i} onPress={img.id == 1 ? () => { } : () => navigation.navigate('RestaurantDepartment', { Resid: img.id, mapRegion })}>
                                    <Image source={{ uri: img.image }} style={{ height: 120, width: '100%', borderRadius: 5 }} resizeMode={Platform.isPad ? 'stretch' : 'contain'} />
                                </TouchableOpacity>
                            )
                        })
                    }

                </Swiper>

                {
                    spinner ?
                        _renderRows(loadingAnimated, 2, '2rows', width * .43, height * .25, { flexDirection: 'row', marginHorizontal: 20, marginTop: 25, alignItems: 'center' }, { borderRadius: 25, })

                        :

                        <View style={styles.WrabCard}>

                            <TouchableOpacity style={styles.IMGCard} onPress={() => token ? navigation.navigate('SpecialOrder') : navigation.navigate('Login')}>
                                <Image source={require('../../../assets/images/deliver.jpg')} style={styles.OdrerImg} resizeMode='contain' />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.IMGCard} onPress={() => token ? navigation.navigate('DepartmentsDetailes', { mapRegion: mapRegion, pathName: 'orderStore' }) : navigation.navigate('Login')}>
                                <Image source={require('../../../assets/images/con.jpg')} style={styles.OdrerImg} resizeMode='contain' />
                            </TouchableOpacity>

                        </View>
                }
                <Text style={[styles.sText, { alignSelf: 'flex-start', fontSize: 16, marginStart: 15, marginVertical: 25 }]}>{i18n.t('categories')} </Text>

                <ScrollView horizontal style={styles.scroll} showsHorizontalScrollIndicator={false} >


                    {
                        spinner ?
                            _renderRows(loadingAnimated, categories && categories.length, '2rows', width * .4, height * .3, { flexDirection: 'row', }, { borderRadius: 25, borderTopStartRadius: 0, })

                            :
                            categories &&
                            categories.map((category, i) => (
                                <TouchableOpacity key={i} onPress={() => navigation.navigate('Department', { categoryId: category.id, mapRegion: mapRegion })} >
                                    <View style={styles.TextImg}>
                                        <Image
                                            onLoadStart={(e) => setloadingImage(true)}
                                            onLoad={onLoadImg}
                                            source={loadingImage ? { uri: category.img } : require('../../../assets/images/default.png')}
                                            style={styles.allImg}
                                            resizeMode='cover'
                                        />

                                        <Text style={styles.mText}>{category.name}</Text>
                                        <View style={[styles.imgOverLay]} />
                                    </View>
                                </TouchableOpacity>
                            ))
                    }


                </ScrollView>

                {providers.length > 0 ? <Text style={[styles.sText, { alignSelf: 'flex-start' }]}>{i18n.t('bestStores')}</Text> : null}
                <ScrollView horizontal style={styles.scroll} showsHorizontalScrollIndicator={false} >

                    {
                        providers &&
                        providers.map((provider, i) => (
                            <TouchableOpacity key={i} onPress={() => navigation.navigate('RestaurantDepartment', { Resid: provider.id })}>
                                <View style={styles.TextImge}>

                                    <Image

                                        source={{ uri: provider.avatar }}
                                        style={{ width: '80%', height: 70, alignSelf: 'center' }}
                                        resizeMode='cover'

                                    />

                                    <View style={{ Width: '100%', paddingHorizontal: 20, flexDirection: 'column' }}>
                                        <Text style={[styles.wText, { alignSelf: 'flex-start' }]}>{provider.name}</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <StarRating
                                                disabled={false}
                                                maxStars={5}
                                                rating={provider.rate}
                                                fullStarColor={'orange'}
                                                starSize={18}
                                                starStyle={{ marginHorizontal: 0 }}
                                            />
                                            <Text style={{ color: Colors.fontNormal, fontFamily: 'flatRegular', fontSize: 14, }}>{provider.rate}/5</Text>
                                        </View>
                                    </View>
                                    {/*<View style={[styles.imgOverLay]} />*/}
                                </View>
                            </TouchableOpacity>
                        ))
                    }

                </ScrollView>

            </ScrollView >

        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 5,
        width: '100%',
    },
    wrapImg: {
        // paddingTop: Constants.statusBarHeight,
        justifyContent: 'center',
        height: 100
    },
    BigImg: {
        height: height * .17,
        width: width * .27,
    },
    MenueImg: {
        width: 25,
        height: 25,
        marginHorizontal: 4,
        padding: 10

    },
    starImg: {
        width: 12,
        height: 12,
        marginHorizontal: 1,
        marginVertical: 5
    },
    IMGCard: {

        backgroundColor: Colors.bg,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderRadius: 25,
        marginStart: 5,
        width: '49%',
        alignItems: 'center'

    },
    WrabCard: {
        flexDirection: 'row',
        marginTop: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    LeftImg: {
        width: 25,
        height: 25,
        padding: 5
    },

    OdrerImg: {
        height: 180,
        width: 160,
    },


    Text: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        textAlign: 'center',
        fontSize: 13,
        lineHeight: 22
    },
    sText: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: width * .05,
    },
    scroll: {
        flex: 1,
        alignSelf: 'flex-start',
    },
    TextImg: {
        justifyContent: 'center',
        borderRadius: 25,
        borderTopStartRadius: 0,
        marginHorizontal: 10,
        alignItems: 'center',
        overflow: 'hidden',
        flex: 1,
        marginBottom: 10
    },
    allImg: {
        width: 180,
        height: 200,
    },
    mText: {
        color: Colors.bg,
        position: 'absolute',
        fontFamily: 'flatMedium',
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 18,
        zIndex: 2,
        flex: .5
    },
    TextImge: {
        width: 170,
        height: height * .3,
        justifyContent: 'center',
        borderRadius: 25,
        borderTopStartRadius: 0,
        overflow: 'hidden',
        backgroundColor: '#fff',
        marginRight: 15

    },
    allImge: {
        width: '100%',
        height: '100%',
        borderRadius: 25,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        marginHorizontal: 10,
        alignItems: 'center'
    },
    wText: {
        color: Colors.fontNormal,
        fontFamily: 'flatRegular',
        fontSize: 14,
        marginTop: 15,
        marginBottom: 5
    },
    imgOverLay: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        position: 'absolute',
        height: '100%',
        width: '100%',
        zIndex: 1,
    },

})
export default HomeScreen