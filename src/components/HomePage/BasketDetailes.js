import React, { useState, useEffect } from 'react'
import {
    ScrollView,
    View,
    Image,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    I18nManager,
    FlatList,
    KeyboardAvoidingView,
} from 'react-native'
import { useIsFocused } from '@react-navigation/native';

import Colors from '../../consts/Colors';
import BTN from '../../common/BTN';
import Header from '../../common/Header';
import i18n from "../locale/i18n";
import { InputIcon } from "../../common/InputText";
import { BasketStoreDetailes, DeleteBasketStoreCart, CalculateCountProduct, ValdiateCoupon } from '../../actions/BsketDetailesAction';
import { useSelector, useDispatch } from 'react-redux';
import Container from '../../common/Container';
import BasketCount from './BasketCount'
import LoadingBtn from '../../common/Loadbtn';
import { SwipeItem, SwipeButtonsContainer } from 'react-native-swipe-item';

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')


function BasketDetailes({ navigation, route }) {

    const isFocused = useIsFocused();

    const { BasketId, mapRegion } = route.params
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null)
    const lang = useSelector(state => state.lang.lang);
    const BasketDtailes = useSelector(state => state.BasketDetailes.BaketDetailes)
    const [loading, setLoading] = useState(false);
    const Myloader = useSelector(state => state.BasketDetailes.Loader)



    const dispatch = useDispatch();
    const [Cuboun, setCuboun] = useState('')
    const [spinner, setSpinner] = useState(true);



    useEffect(() => {

        const unsubscribe = navigation.addListener('focus', () => {
            setSpinner(true)
            setCuboun('')
            dispatch(BasketStoreDetailes(BasketId, token, lang, Cuboun, mapRegion.latitude, mapRegion.longitude)).then(() => setSpinner(false))
        })
        return unsubscribe;
    }, [navigation, route])

    function DeleteCartItem(CartId, ProviderId) {
        dispatch(DeleteBasketStoreCart(CartId, ProviderId, token)).then(() => dispatch(BasketStoreDetailes(BasketId, token, lang, Cuboun)))



    }

    function Increase(CartId, ProviderId, type) {
        setLoading(true)
        dispatch(CalculateCountProduct(CartId, ProviderId, token, type)).then(() => dispatch(BasketStoreDetailes(BasketId, token, lang, Cuboun))).then(() => setLoading(false))

    }

    function Decrease(CartId, ProviderId, type) {
        setLoading(true)
        dispatch(CalculateCountProduct(CartId, ProviderId, token, type)).then(() => dispatch(BasketStoreDetailes(BasketId, token, lang, Cuboun)))

    }

    const HandleChange = (e) => {
        setCuboun(e)

        dispatch(ValdiateCoupon(token, e)).then(() => dispatch(BasketStoreDetailes(BasketId, token, lang, e)))

    }



    return (

        <Container loading={spinner}>


            <Header navigation={navigation} label={i18n.t('cart')} />

            <ScrollView style={{ flex: 1, }} showsVerticalScrollIndicator={false}>

                <View style={{ backgroundColor: Colors.bg, }}>
                    {
                        BasketDtailes && BasketDtailes.provider &&
                        <View style={styles.card}>

                            <Image source={{ uri: BasketDtailes.provider.avatar }} style={styles.ImgCard} />
                            <View style={{ flexDirection: 'column', justifyContent: 'space-between', }}>

                                <Text style={[styles.sText, { alignSelf: 'flex-start', flex: 1, marginStart: 5 }]}>{BasketDtailes.provider.name}</Text>
                                <Text style={[styles.sText, { alignSelf: 'flex-start', marginStart: 5, fontSize: 12, }]}>{BasketDtailes.provider.available}</Text>

                                <View style={{ flexDirection: 'row', alignItems: 'center', width: '85%' }}>
                                    <Image source={require('../../../assets/images/pinblue.png')} style={styles.iconImg} resizeMode='contain' />
                                    <Text style={[styles.yText, { writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr', alignSelf: 'flex-start', lineHeight: 22 }]}>{BasketDtailes.provider.distance}</Text>
                                </View>
                            </View>

                        </View>
                    }
                    <View style={styles.product}>
                        <Image source={require('../../../assets/images/product.png')} style={[styles.iconImg, { alignSelf: 'center', width: 25, height: 25, }]} resizeMode='contain' />
                        <Text style={[styles.pro, { fontSize: 20, }]}>{i18n.t('Products')}</Text>
                    </View>

                    {
                        !BasketDtailes ? [] :

                            !BasketDtailes.products ? []
                                :
                                BasketDtailes.products.length ?


                                    <FlatList
                                        data={BasketDtailes.products}
                                        extraData={loading}
                                        keyExtractor={(item) => (item.id).toString()}
                                        renderItem={({ item, index }) => {
                                            return (

                                                <BasketCount pro={item} i={index} DeleteCartItem={() => DeleteCartItem(item.id, BasketDtailes.provider.id)} Decrease={() => Decrease(item.id, BasketDtailes.provider.id, 'minus')} Increase={() => Increase(item.id, BasketDtailes.provider.id, 'increase')} key={(item.id).toString()} />

                                            )
                                        }}
                                    />
                                    :
                                    navigation.navigate('Basket')





                    }

                    <KeyboardAvoidingView>
                        <View style={styles.product}>
                            <Image source={require('../../../assets/images/cpon.png')} style={[styles.iconImg, { alignSelf: 'center', width: 18, height: 18, }]} resizeMode='contain' />
                            <Text style={[styles.yText, { color: '#fff', fontSize: width * .04, marginTop: 0, opacity: 1, }]}> {i18n.t('addCoupon')}</Text>
                        </View>

                        <InputIcon
                            label={i18n.t('discountCode')}
                            value={Cuboun}
                            onChangeText={(e) => HandleChange(e)}

                        />


                        <View>
                            {BasketDtailes &&
                                BasketDtailes.prices &&
                                <View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15, paddingHorizontal: 30 }}>
                                        <Text style={[styles.sText, { marginRight: 0, color: Colors.fontBold, fontSize: 14 }]}>{i18n.t('taxes')} </Text>
                                        <Text style={[styles.sText, { color: Colors.sky, marginRight: 0 }]}>{BasketDtailes.prices.added_value} {i18n.t('RS')}</Text>
                                    </View>
                                    <View style={{ width, height: height * .06, justifyContent: 'space-between', paddingHorizontal: 30, paddingVertical: 5, flexDirection: 'row', backgroundColor: Colors.bg }}>
                                        <Text style={[styles.oText, { color: Colors.fontBold, fontSize: 14, }]}>{i18n.t('sum')}</Text>
                                        <Text style={[styles.SPrice, { marginRight: 0 }]}> {BasketDtailes.prices.sum} {i18n.t('RS')}</Text>
                                    </View>
                                    <View style={{ width: '90%', marginHorizontal: '4%', height: 60, paddingHorizontal: 10, alignItems: 'center', flexDirection: 'row', marginTop: 20, borderColor: '#DBDBDB', justifyContent: 'space-between', backgroundColor: Colors.sky }}>
                                        <Text style={[styles.oText, { marginLeft: 0, color: Colors.bg }]}>{i18n.t('total')}</Text>
                                        <Text style={{ color: Colors.bg, fontFamily: 'flatMedium', fontSize: 16 }}> {(BasketDtailes.prices.total)} {i18n.t('RS')}</Text>
                                    </View>

                                </View>

                            }
                            <BTN title={i18n.t('confirm')} onPress={() => token ? navigation.navigate('PaymentDetailes', { providerID: BasketDtailes.provider.id, BasketId: BasketId, Cuboun: Cuboun }) : navigation.navigate('Login')} ContainerStyle={{ marginVertical: width * .1, borderRadius: 20, }} TextStyle={{ fontSize: 16 }} />

                        </View>
                    </KeyboardAvoidingView>







                </View>



            </ScrollView>

        </Container>


    )
}

const styles = StyleSheet.create({
    BigImg: {
        height: height * .15,
        width: width * .22,
    },
    MenueImg: {
        width: 18,
        height: 20,
        marginHorizontal: 4,

    },
    Text: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: width * .04,
        textAlign: 'center',
        top: width * .19
    },
    SPrice: {
        color: Colors.sky,
        marginHorizontal: 5,
        fontFamily: 'flatMedium',
        marginRight: 25,
        fontSize: 14
    },
    sText: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: 14,
    },
    button: {
        width: '80%',
        height: 100,
        marginVertical: 5,
        flexDirection: 'row'
    },
    swipeContentContainerStyle: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        borderColor: '#e3e3e3',
        borderWidth: 1,
        flexDirection: 'row'
    },
    oText: {
        fontFamily: 'flatMedium',
        color: Colors.fontBold,
        fontSize: 18,
    },
    yText: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: 11,
        opacity: .6
    },
    card: {
        shadowColor: Colors.bg,
        backgroundColor: Colors.bg,
        flexDirection: 'row',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 1,
        padding: 10,
        width: '90%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        marginStart: '5%'

    },
    ImgCard: {
        width: 100,
        height: 65,
        borderRadius: 5,
    },
    product: {
        marginVertical: 15,
        backgroundColor: Colors.IconBlack,
        height: width * .13,
        width: '92%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: '4%'
    },
    copon: {
        marginVertical: 10,
        backgroundColor: Colors.IconBlack,
        height: width * .13,
        justifyContent: 'center',
    },
    iconImg: {
        width: 15,
        height: 15,


    },
    pro: {
        color: Colors.bg,
        fontFamily: 'flatMedium',


    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#737373',
        opacity: .9

    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 5,
        width: width * .9,
        height: height * .5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5
    },
    modetext: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: width * .035,
        marginHorizontal: 10
    },
})
export default BasketDetailes
