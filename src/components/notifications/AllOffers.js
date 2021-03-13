import React, { useState, useEffect } from 'react'
import {
    ScrollView,
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Text,
    Modal,
    ActivityIndicator
} from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import Colors from '../../consts/Colors';
import BTN from '../../common/BTN';
import Header from '../../common/Header';
import i18n from "../locale/i18n";
import { useSelector, useDispatch } from 'react-redux';
import { getAllOffers, acceptOffer } from '../../actions';
import StarRating from "react-native-star-rating";



const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')
function AllOffers({ navigation, route }) {

    const id = route.params.id;
    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null);
    const allOffers = useSelector(state => state.allOffers.allOffers);
    const dispatch = useDispatch();
    const [spinner, setSpinner] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);


    function fetchData() {
        setSpinner(true)
        dispatch(getAllOffers(lang, token, id)).then(() => setSpinner(false))
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchData()
        })
        return unsubscribe
    }, [navigation]);

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
        dispatch(acceptOffer(lang, token, offerID, id, navigation)).then(() => setIsSubmitted(false))
    }


    return (
        <View style={{ flex: 1 }}>
            <Header navigation={navigation} label={i18n.t('allOffers')} />

            <ScrollView style={{ flex: 1 }}>
                <View style={styles.warp}>
                    <Text style={styles.sText}>{i18n.t('orderNumber')}</Text>
                    <Text style={{ fontFamily: 'flatMedium', opacity: .5, fontSize: 15, marginLeft: 5 }}>{id}</Text>

                </View>


                {
                    allOffers ?
                        allOffers.map((offer, i) => (
                            <View key={i} style={styles.CardView}>
                                <View style={styles.WarpAll}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                        <Image source={require('../../../assets/images/yass.jpg')} style={styles.ImgModal} />
                                        <View style={{ flexDirection: 'column', marginHorizontal: width * .07 }}>
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
                        null
                }

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
        marginTop: 20,
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
        width: width * .14,
        height: width * .14,
        borderRadius: 50
    },
    textCard: {
        fontFamily: 'flatMedium',
        color: Colors.fontBold,
        fontSize: width * .03,
        opacity: .8
    },
    textClock: {
        fontFamily: 'flatMedium',
        color: Colors.fontBold,
        fontSize: 14,
        opacity: .5,
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
