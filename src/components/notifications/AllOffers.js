import React, { useState, useEffect, useRef } from 'react'
import {
    ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, ActivityIndicator, FlatList, RefreshControl, AppState
} from 'react-native'
import Colors from '../../consts/Colors';
import BTN from '../../common/BTN';
import Header from '../../common/Header';
import i18n from "../locale/i18n";
import { useSelector, useDispatch } from 'react-redux';
import { getAllOffers, acceptOffer, logout, cancelOrder, getCancelReasons } from '../../actions';
import StarRating from "react-native-star-rating";
import * as Notifications from "expo-notifications";
import Modal from "react-native-modal";


const { width, height } = Dimensions.get('window')

function AllOffers({ navigation, route }) {

    const id = route.params?.id;
    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null);
    const user = useSelector(state => state.Auth ? state.Auth.user ? state.Auth.user.data : null : null);
    const allOffers = useSelector(state => state.allOffers.allOffers);
    const cancelReasons = useSelector(state => state.cancelReasons.cancelReasons);
    const dispatch = useDispatch();
    const [spinner, setSpinner] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedRadion, setSelectedRadio] = useState(0)
    const [refreshing, setRefreshing] = useState(false);

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    function fetchData() {
        setSpinner(true)
        dispatch(getAllOffers(lang, token, id)).then(() => setSpinner(false))
        dispatch(getCancelReasons(lang))
    }
    console.log(id);

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
            setSpinner(true)
            dispatch(getAllOffers(lang, token, route.params?.id)).then(() => setSpinner(false))
        } else {

            setSpinner(true)
            dispatch(getAllOffers(lang, token, route.params?.id)).then(() => setSpinner(false))
        }

    };


    useEffect(() => {
        fetchData()
    }, [navigation, id]);

    useEffect(() => {
        Notifications.addNotificationReceivedListener(handleNotification);
    }, []);

    function handleNotification(notification) {
        if (notification && notification.origin !== 'received') {
            let { type, order_id } = notification.request.content.data;

            if (type === 'order_offer') {
                setSpinner(true)
                dispatch(getAllOffers(lang, token, order_id)).then(() => setSpinner(false))
            }
        }

    }

    function renderConfirm(offerID) {
        if (isSubmitted) {
            return (
                <View style={[{ justifyContent: 'center', alignItems: 'center', marginBottom: 20 }]}>
                    <ActivityIndicator size="large" color={Colors.sky} style={{ alignSelf: 'center' }} />
                </View>
            )
        }

        return (

            <BTN title={i18n.t('accept')} onPress={() => acceptOfferAction(offerID)} ContainerStyle={{ borderRadius: 20, width: '70%', marginTop: 0, marginBottom: 20, }} TextStyle={{ fontSize: 13, color: '#fff' }} />
        );
    }

    function acceptOfferAction(offerID) {
        setIsSubmitted(true)
        dispatch(acceptOffer(lang, token, offerID, id, navigation, user)).then(() => setIsSubmitted(false))
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        dispatch(getAllOffers(lang, token, id)).then(() => setRefreshing(false))

    }, []);

    return (
        <View style={{ flex: 1 }}>
            <Header navigation={navigation} label={i18n.t('allOffers')} />

            <ScrollView style={{ flex: 1 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={styles.warp}>
                    <Text style={styles.sText}>{i18n.t('orderNumber')}</Text>
                    <Text style={{ fontFamily: 'flatMedium', opacity: .5, fontSize: 15, marginLeft: 5 }}>{id}</Text>
                </View>


                {
                    allOffers && allOffers.length > 0 ?
                        allOffers.map((offer, i) => (
                            <View key={i} style={styles.CardView}>
                                <View style={styles.WarpAll}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                        <Image source={{ uri: offer.user.avatar }} style={styles.ImgModal} />
                                        <View style={{ flexDirection: 'column', marginStart: 5 }}>
                                            <Text style={[styles.textClock, { alignSelf: 'flex-start' }]}>{offer.user.name}</Text>
                                            <StarRating
                                                disabled={true}
                                                maxStars={5}
                                                rating={offer.rate}
                                                fullStarColor={'orange'}
                                                starSize={15}
                                                starStyle={{ marginHorizontal: 0 }}
                                            />
                                        </View>


                                    </View>
                                    <View style={styles.SWrap}>
                                        <View style={styles.centerd}>
                                            <Text style={styles.price}>{offer.distance}</Text>
                                            <Text style={styles.textClock}>{i18n.t('away')}</Text>
                                        </View>
                                        <View style={styles.line}></View>
                                        <View style={styles.centerd}>
                                            <Text style={styles.price}>{offer.price}</Text>
                                            <Text style={styles.textClock}>{i18n.t('delivryPrice')}</Text>
                                        </View>
                                        <View style={styles.line}></View>
                                        <View style={styles.centerd}>
                                            <Text style={styles.nText}>{offer.time}</Text>
                                            <Text style={styles.textClock}>{i18n.t('deliverTime')}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.Bline}></View>
                                {renderConfirm(offer.id)}
                            </View>
                        ))
                        :
                        <View style={{ alignItems: 'center', height: height * 0.7 }}>
                            <Image source={require('../../../assets/images/wait_offer.gif')} style={{ width: 120, height: 120, alignSelf: 'center', marginVertical: 50 }} />
                            <Text style={styles.textClock}>{i18n.t('waitOffers')}</Text>

                            <TouchableOpacity onPress={() => { setShowModal(true) }} style={{ alignSelf: 'center', position: 'absolute', bottom: 0, borderRadius: 20, backgroundColor: '#ff7177', width: 100, alignItems: 'center', justifyContent: 'center', height: 40 }}>
                                <Text style={[styles.textClock, { color: '#fff', textAlign: 'center' }]}>{i18n.t('cancelOrder')}</Text>
                            </TouchableOpacity>
                        </View>
                }

                <Modal
                    onBackdropPress={() => setShowModal(!showModal)}
                    onBackButtonPress={() => setShowModal(!showModal)}
                    isVisible={showModal}
                    style={styles.bgModel}
                    avoidKeyboard={true}

                >
                    <View style={[{ backgroundColor: '#eee', width: '100%', overflow: 'hidden', bottom: -20 }]}>
                        <View style={{ backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 15, marginBottom: 15 }}>
                            <Text style={[{ fontFamily: 'flatMedium', color: Colors.IconBlack, fontSize: 14 }]}>{i18n.t('chooseReason')}</Text>
                        </View>
                        <FlatList data={cancelReasons}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item, index }) => {
                                return (
                                    <View>
                                        <TouchableOpacity key={index} onPress={() => setSelectedRadio(item.id)} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginTop: 15 }}>
                                            <View >
                                                <View style={{
                                                    height: 15,
                                                    width: 15,
                                                    borderRadius: 12,
                                                    borderWidth: 2,
                                                    borderColor: selectedRadion === item.id ? Colors.sky : Colors.fontNormal,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                    {
                                                        selectedRadion === item.id ?
                                                            <View style={{
                                                                height: 7,
                                                                width: 7,
                                                                borderRadius: 6,
                                                                backgroundColor: Colors.sky,
                                                            }} />
                                                            : null
                                                    }
                                                </View>
                                            </View>
                                            <Text style={[styles.sText, { color: selectedRadion === item.id ? Colors.sky : Colors.fontNormal, fontSize: 13, marginHorizontal: 5 }]}>{item.reason}</Text>
                                        </TouchableOpacity>
                                        <View style={{ height: 1, width: '100%', backgroundColor: '#ddd', marginTop: 15, }} />
                                    </View>
                                )
                            }} />

                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 10, marginVertical: 25 }}>
                            <BTN title={i18n.t('send')} onPress={() => { dispatch(cancelOrder(lang, token, selectedRadion, route.params.id)).then(() => { setShowModal(false); navigation.navigate('GoHome') }) }} ContainerStyle={{ borderRadius: 50, width: 120, marginTop: 15, marginBottom: 15, height: 40 }} TextStyle={{ fontSize: 13 }} />
                            <View style={{ backgroundColor: '#ddd', width: 2, height: '100%', marginHorizontal: 30 }} />
                            <BTN title={i18n.t('cancelOrder')} onPress={() => { setShowModal(false) }} ContainerStyle={{ borderRadius: 50, width: 120, marginTop: 15, marginBottom: 15, backgroundColor: '#ddd', height: 40 }} TextStyle={{ fontSize: 13, color: Colors.IconBlack }} />
                        </View>
                    </View>
                </Modal>

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    BigImg: {
        height: height * .15,
        width: width * .23,
    },
    MenueImg: {
        width: 18,
        height: 18,
        marginHorizontal: 4,

    },
    warp: {
        height: height * .09,
        width,
        backgroundColor: '#d5d5d599',
        // marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10

    },
    Text: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: width * .045,
        textAlign: 'center',
        top: width * .19,
        opacity: 0.6
    },
    sText: {
        fontFamily: 'flatMedium',
        color: Colors.sky,
        fontSize: 15,
    },
    CardView: {
        backgroundColor: "white",
        borderRadius: 5,
        width: '80%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
        alignSelf: 'center',
        marginTop: height * .02,
        marginBottom: 10,
    },
    WarpAll: {
        marginTop: width * .06,
        paddingHorizontal: 10
    },

    container: {
        marginTop: width * .14,
        marginLeft: width * .02
    },
    card: {
        shadowColor: Colors.bg,
        backgroundColor: Colors.bg,
        flexDirection: 'row',
        marginHorizontal: width * .06,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 1,
        marginVertical: 5,
        width: width * .85,
        height: height * .1,
        paddingTop: 10,
        paddingStart: 10
    },
    ImgCard: {
        width: width * .1,
        height: width * .1,
        borderRadius: 50
    },
    ImgModal: {
        width: 70,
        height: 70,
        borderRadius: 50
    },
    textCard: {
        fontFamily: 'flatMedium',
        color: Colors.fontBold,
        fontSize: width * .03,
    },
    textClock: {
        fontFamily: 'flatMedium',
        color: Colors.fontBold,
        fontSize: 14,
        marginVertical: 3
    },


    nText: {
        color: Colors.sky,
        fontSize: width * .03,
        fontFamily: 'flatMedium',
    },
    line: {
        height: 30,
        width: 2,
        backgroundColor: Colors.fontNormal,
        opacity: .5,
        marginHorizontal: 10
    },
    centerd: {
        flexDirection: 'column',
        alignItems: 'center'
    },
    price: {
        color: Colors.sky,
        fontSize: width * .03,
        fontFamily: 'flatMedium',
    },
    SWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: width * .06,
    },
    circle: {
        width: 25,
        height: 25,
        borderRadius: 50,
        backgroundColor: Colors.sky,
        justifyContent: 'center'
    },
    Bline: {
        width: '100%',
        height: 1,
        backgroundColor: Colors.fontNormal,

        marginVertical: 20,
        opacity: .5
    }

})
export default AllOffers
