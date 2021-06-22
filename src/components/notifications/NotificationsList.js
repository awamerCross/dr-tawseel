import React, { useState, useEffect } from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, ActivityIndicator } from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import Colors from '../../consts/Colors';
import BTN from '../../common/BTN';
import Header from '../../common/Header';
import { useDispatch, useSelector } from "react-redux";
import { getNotifications, deleteNoti, acceptOffer } from '../../actions';
import Container from "../../common/Container";
import i18n from "../locale/i18n";
import Modal from "react-native-modal";
import StarRating from "react-native-star-rating";

const { width, height } = Dimensions.get('window')

function NotificationsList({ navigation }) {
    const [visible, setvisible] = useState(false)
    const [orderData, setOrderData] = useState({
        offerID: 0,
        order_id: 0,
        delegateName: '',
        image: '',
        offersNum: '',
        away: '',
        delivryPrice: '',
        deliverTime: '',
        rate: '',
    })
    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.Auth.user != null ? state.Auth.user.data.token : null);
    const user = useSelector(state => state.Auth.user != null ? state.Auth.user.data : null);

    const notifications = useSelector(state => state.notifications.notifications);
    const notificationsLoader = useSelector(state => state.notifications.loader);
    const dispatch = useDispatch();
    const [spinner, setSpinner] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setSpinner(true)
            dispatch(getNotifications(lang, token)).then(() => setSpinner(false))
        })
        return unsubscribe
    }, [navigation]);

    function deleteNotify(id) {
        dispatch(deleteNoti(lang, id, token))
    }

    function renderConfirm() {


        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                <BTN title={i18n.t('accept')} spinner={isSubmitted} onPress={() => acceptOfferAction(orderData.offerID, orderData.order_id)} ContainerStyle={{ borderRadius: 20, width: '35%', marginTop: 0, }} TextStyle={{ fontSize: 12, color: Colors.IconBlack }} />
            </View>

        );
    }

    function acceptOfferAction(id, orderID) {
        setIsSubmitted(true)
        dispatch(acceptOffer(lang, token, id, orderID, navigation, user)).then(() => { setShowModal(false); setIsSubmitted(false); })
    }

    function notificationNavigation(type) {
        if (type === 'admin')
            return false
    }

    return (
        <Container loading={spinner}>
            <View style={{ flex: 1 }}>
                <Header navigation={navigation} label={i18n.t('notifications')} />

                <ScrollView style={{ flex: 1 }}>
                    <View style={styles.container}>

                        {
                            !notifications || notifications.length === 0 ?
                                <View style={{ marginTop: 100 }}>
                                    <Image source={require('../../../assets/images/empty.png')} resizeMode={'contain'} style={{ width: 150, height: 150, alignSelf: 'center' }} />
                                    <Text style={[styles.textCard, { fontSize: 16, alignSelf: 'center' }]}>{i18n.t('noData')}</Text>
                                </View>
                                :
                                notifications.map((noty, i) => (
                                    <TouchableOpacity key={i} onPress={() => {
                                        if (noty.type === 'order_offer') {
                                            setShowModal(true);
                                            setOrderData({
                                                ...orderData,
                                                order_id: noty.order_id,
                                                offerID: noty.data.id,
                                                delegateName: noty.data.user.name,
                                                rate: noty.data.user.rate,
                                                image: noty.data.user.avatar,
                                                away: noty.data.distance,
                                                delivryPrice: noty.data.price,
                                                deliverTime: noty.data.time,
                                                offersNum: noty.data.offers_count,
                                            })
                                        }
                                        else if (noty.type === 'normal') {
                                            navigation.navigate('OrderDetailes', { orderId: noty.order_id })
                                        }

                                    }}
                                    >
                                        <View style={styles.card}>
                                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                                <TouchableOpacity onPress={() => deleteNotify(noty.id)} style={[{
                                                    backgroundColor: Colors.sky
                                                    , position: 'absolute', right: 7, top: 0, paddingVertical: 5, paddingHorizontal: 5, borderRadius: 50
                                                }]}>
                                                    <Image source={require('../../../assets/images/delet.png')} style={{ width: 15, height: 15 }} resizeMode={'contain'} />
                                                </TouchableOpacity>
                                                <View style={{ flexDirection: 'column' }}>
                                                    <Text style={styles.textCard}>{noty.title}</Text>
                                                    <Text style={[styles.textCard, { color: Colors.fontNormal }]}>{noty.body}</Text>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                                        <Image source={require('../../../assets/images/clock_gray.png')} style={[styles.colock]} resizeMode={'contain'} />
                                                        <Text style={[styles.textClock, { marginHorizontal: 5 }]}>{noty.time}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))
                        }

                    </View>
                </ScrollView>
            </View>
            <Modal
                onBackdropPress={() => setShowModal(false)}
                onBackButtonPress={() => setShowModal(false)}
                isVisible={showModal}
                style={styles.bgModel}
                avoidKeyboard={true}
            >

                <View style={styles.modalView}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={{ uri: orderData.image }} style={styles.ImgModal} />
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={[styles.textClock, { alignSelf: 'flex-start' }]}>{orderData.delegateName}</Text>
                                <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    rating={orderData.rate}
                                    fullStarColor={'orange'}
                                    starSize={15}
                                    starStyle={{ marginHorizontal: 0 }}
                                />
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => { setShowModal(false); navigation.navigate('AllOffers', { id: orderData.order_id }) }}>
                            <View style={styles.centerd}>
                                <View style={styles.circle}>
                                    <Text style={{ color: Colors.bg, alignSelf: 'center', fontSize: width * .03 }}>{orderData.offersNum}</Text>
                                </View>
                                <Text style={styles.textCard}>{i18n.t('allOffers')}</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                    <View style={styles.SWrap}>
                        <View style={styles.centerd}>
                            <Text style={styles.price}>{orderData.away}</Text>
                            <Text style={styles.textClock}>{i18n.t('away')}</Text>
                        </View>
                        <View style={[styles.line, { marginHorizontal: 0 }]}></View>
                        <View style={styles.centerd}>
                            <Text style={styles.price}>{orderData.delivryPrice}</Text>
                            <Text style={styles.textClock}>{i18n.t('delivryPrice')}</Text>
                        </View>
                        <View style={[styles.line, { marginHorizontal: 0 }]}></View>
                        <View style={styles.centerd}>
                            <Text style={styles.nText}>{orderData.deliverTime}</Text>
                            <Text style={styles.textClock}>{i18n.t('deliverTime')}</Text>
                        </View>
                    </View>
                    <View style={styles.Bline}></View>

                    {renderConfirm()}

                </View>
            </Modal>
        </Container>
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
    colock: {
        width: 15,
        height: 15,

    },
    WarpAll: {
        // marginLeft: width * .07,
        // marginTop: width * .06
    },
    Text: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: width * .045,
        textAlign: 'center',
        top: width * .19
    },
    sText: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: width * .03,
        marginHorizontal: 10
    },
    container: {
        alignSelf: 'center',
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
        paddingTop: 10,
        paddingStart: 10
    },
    ImgCard: {
        width: width * .1,
        height: width * .1,
        borderRadius: 50,
        marginRight: 10
    },
    ImgModal: {
        width: width * .14,
        height: width * .14,
        borderRadius: 50,
        marginRight: 10
    },
    textCard: {
        fontFamily: 'flatMedium',
        color: Colors.fontBold,
        fontSize: 12,
        alignSelf: 'flex-start',
        paddingVertical: 5
    },
    textClock: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: 11,
        opacity: .5,
        marginVertical: 3,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#737373',
        opacity: .9,

    },
    modalView: {
        backgroundColor: "white",
        width: 300,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
        padding: 15,
        alignSelf: 'center'
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
        marginHorizontal: 25
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
        marginVertical: 20
    },
    circle: {
        width: 25,
        height: 25,
        borderRadius: 50,
        backgroundColor: Colors.sky,
        justifyContent: 'center'
    },
    Bline: {
        width: '95%',
        height: 1,
        backgroundColor: Colors.fontNormal,
        opacity: .5,
        alignSelf: 'center'
    },
    bgModel: {
        width: "100%",
        flex: 1,
        alignSelf: 'center',
    },


})

export default NotificationsList
