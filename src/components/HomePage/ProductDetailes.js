

import React, { useState, useEffect } from 'react'
import {
    ScrollView,
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Text,
    ImageBackground,
    FlatList,
    Platform,
    I18nManager
} from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import { CheckBox } from 'native-base';

import Colors from '../../consts/Colors';
import Constants from "expo-constants";
import BTN from '../../common/BTN';
import { InputIcon } from '../../common/InputText';
import i18n from "../locale/i18n";
import { useDispatch, useSelector } from 'react-redux';
import Container from '../../common/Container';
import { ProductDetailesRest, AddTOCart } from '../../actions';
import LoadingBtn from '../../common/Loadbtn';
import { ToasterNative } from '../../common/ToasterNatrive';
import { _renderRows } from '../../common/LoaderImage';

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')
const isIOS = Platform.OS === 'ios';

function ProductDetailes({ navigation, route }) {

    const [AvailableKiloes, setAvailableKiloes] = useState('')
    const { productId } = route.params;
    const lang = useSelector(state => state.lang.lang);
    const ProductDetailes = useSelector(state => state.categories.ProdDetailes)
    const [count, setCount] = useState(1)
    const [selectedRadion, setSelectedRadio] = useState(0);
    const [spinner, setSpinner] = useState(true);
    const dispatch = useDispatch();
    const [GetID, setGetID] = useState([]);
    const [ExtraPrice, setExtraPrice] = useState(0);
    const [ExtraArr, setExtraArr] = useState([]);
    const [AdditoonPrice, setAdditoonPrice] = useState(0)
    const [total, setTotal] = useState(0);
    const [loader, setloader] = useState(false)
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null)
    const [loadingImage, setloadingImage] = useState(false);

    const [loading, setloading] = useState(false);
    let loadingAnimated = [];

    useEffect(() => {

        const unsubscribe = navigation.addListener('focus', () => {
            setSpinner(true);
            setloader(false)
            setloading(true)
            setSelectedRadio(0)
            setExtraPrice(0)
            setExtraArr([])
            setCount(1)
            setGetID([])
            setTotal(0)
            setAvailableKiloes('')
            setAdditoonPrice(0)
            dispatch(ProductDetailesRest(productId, lang)).then(() => setSpinner(false)).then(() => setloading(false))

        })
        return unsubscribe

    }, [navigation, route]);



    let data = ProductDetailes && [

        { id: 1, title: i18n.t('large'), price: ProductDetailes.large_price },
        { id: 2, title: i18n.t('medium'), price: ProductDetailes.mid_price },
        { id: 3, title: i18n.t('small'), price: ProductDetailes.small_price },
    ];





    const toggleChecked = (item) => {

        let newArr = ExtraArr;
        let check = newArr.indexOf(item);

        if (check != -1) {
            newArr.splice(check, 1)
        } else {
            newArr.push(item)
        }
        console.log('newArr', newArr)

        let Price = newArr.reduce((a, { price }) => a + price, 0)

        setAdditoonPrice(Price)
        setExtraArr([...newArr]);

        let Id = newArr.map(id => id.id);

        setGetID([...Id])
        // setTotal((count * ExtraPrice) + Price)
        setTotal(((ExtraPrice == 0 ? ProductDetailes.price : ExtraPrice) + Price) * count)

        console.log('fuck total', total, count, ExtraPrice, Price)
    };


    const handleChange = (e) => {
        if (e <= ProductDetailes.available_kilos) {
            setAvailableKiloes(e)
        }
        else {
            ToasterNative(i18n.t('extraCount'), 'danger', 'bottom')
            return ProductDetailes.available_kilos
        }
    }

    const increment = () => {
        if (count >= ProductDetailes.quantity) {
            setCount(count);
        }
        else {
            setCount(count + 1);
            // setTotal(((count + 1) * ExtraPrice) + AdditoonPrice)
            setTotal(((ExtraPrice == 0 ? ProductDetailes.price : ExtraPrice) + AdditoonPrice) * (count + 1))

        }
    }

    const decrement = () => {
        if (count === 1) {
            setCount(1);
        } else {
            setCount(count - 1);
            // setTotal(((count - 1) * ExtraPrice) + AdditoonPrice)
            setTotal(((ExtraPrice == 0 ? ProductDetailes.price : ExtraPrice) + AdditoonPrice) * (count - 1))

            console.log('total :', total, 'ExtraPrice', ExtraPrice, 'AdditoonPrice', AdditoonPrice)
        }

    }



    const AddProductToCarts = () => {
        setloader(true)

        if (selectedRadion == 0) {
            setloader(false)

            ToasterNative(i18n.t('EnterSize'), 'danger', 'bottom')
        }
        else {
            dispatch(AddTOCart(productId, selectedRadion, count, GetID, AvailableKiloes, ProductDetailes.price, lang, token,)).then(() => setloader(false))

        }
    }
    const onLoadImg = (e) => {
        if (e !== undefined) {
            setloadingImage(true)
        }
    }

    console.log(ProductDetailes)
    return (



        <Container loading={spinner}>
            <ScrollView style={{ flex: 1, backgroundColor: Colors.bg, }} showsVerticalScrollIndicator={false}>

                {
                    loading ?
                        _renderRows(loadingAnimated, 1, '2rows', width, height * .35, {}, { borderRadius: 0, })

                        :
                        ProductDetailes &&
                        <View style={{ flex: 1 }}>
                            <ImageBackground

                                onLoadStart={(e) => setloadingImage(true)}
                                onLoad={onLoadImg}
                                source={loadingImage ? { uri: ProductDetailes.image } : require('../../../assets/images/default.png')} style={{ width: width, height: 250, }}>
                                <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', flex: 1, }}>
                                    <View style={styles.wrap}>
                                        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                                            <Image source={require('../../../assets/images/menue.png')} style={[styles.MenueImg, { transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }], padding: 12 }]} resizeMode='contain' />
                                        </TouchableOpacity>
                                        <Text style={[styles.Text, { color: Colors.bg, }]}>{i18n.t('productDetails')}</Text>
                                        <TouchableOpacity onPress={() => navigation.goBack()}>
                                            <Image source={require('../../../assets/images/arrs.png')} style={[styles.MenueImg, { padding: 12, transform: I18nManager.isRTL ? [{ rotate: '0deg' }] : [{ rotate: '180deg' }] }]} resizeMode='contain' />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ImageBackground>

                            <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20, flex: 1 }}>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={styles.Text}>{ProductDetailes.name} </Text>

                                    {
                                        ProductDetailes.price_discount === 0 ?
                                            <Text style={{ fontSize: 14, fontFamily: 'flatMedium', color: Colors.sky, paddingTop: 5, alignSelf: 'flex-start' }}>{ProductDetailes.price} {i18n.t('RS')}</Text>

                                            :
                                            <View style={{ flexDirection: 'column', alignItems: 'center', }}>
                                                <Text style={{ fontSize: 14, fontFamily: 'flatMedium', color: Colors.sky }}>{ProductDetailes.price_discount} {i18n.t('RS')}</Text>
                                                <Text style={{ fontSize: 10, fontFamily: 'flatRegular', color: Colors.fontNormal, textDecorationLine: 'line-through', marginStart: 20 }}>{ProductDetailes.price} {i18n.t('RS')}</Text>


                                            </View>

                                    }
                                </View>
                                <Text style={[styles.yText, { alignSelf: 'flex-start' }]}>{ProductDetailes.details}</Text>
                                <View style={{ marginTop: 40 }}>



                                    {/* <InputIcon
                                        label={i18n.t('orderQuantity')}
                                        value={AvailableKiloes}
                                        onChangeText={(e) => handleChange(e)}
                                        keyboardType='numeric'
                                        styleCont={{ marginHorizontal: '1%' }}
                                    /> */}


                                    <Text style={[styles.yText, { marginTop: 0, marginVertical: 20, fontFamily: 'flatMedium', opacity: .9, fontSize: 12, alignSelf: 'flex-start' }]}>{i18n.t('avalQuantities')} {ProductDetailes.available_kilos} {i18n.t('kilo')}</Text>
                                </View>
                                <View style={{ height: 1, backgroundColor: '#C0C0C0', marginVertical: 15, }} />


                                <View >
                                    <Text style={[styles.Text, { alignSelf: 'flex-start' }]}>{i18n.t('size')} </Text>
                                </View>
                                <FlatList
                                    data={data}
                                    keyExtractor={(item) => (item.id).toString()}
                                    renderItem={({ item, index }) => {
                                        return (
                                            item.price === 0 ? null :
                                                <View>
                                                    <TouchableOpacity onPress={() => {
                                                        setSelectedRadio(index + 1); setExtraPrice(item.price); setTotal((item.price + AdditoonPrice) * count)
                                                    }} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginStart: 5 }}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <View style={{
                                                                height: 20,
                                                                width: 20,
                                                                borderRadius: 12,
                                                                borderWidth: 2,
                                                                borderColor: selectedRadion === index + 1 ? Colors.sky : Colors.fontNormal,
                                                                alignItems: 'center',
                                                                justifyContent: 'center',

                                                            }}>
                                                                {
                                                                    selectedRadion === index + 1 ?
                                                                        <View style={{
                                                                            height: 10,
                                                                            width: 10,
                                                                            borderRadius: 10,
                                                                            backgroundColor: Colors.sky,
                                                                        }} />
                                                                        : null
                                                                }
                                                            </View>
                                                            <Text style={[styles.sText, { color: selectedRadion === index + 1 ? Colors.sky : Colors.fontNormal, left: 6, bottom: 1 }]}>{item.title}</Text>

                                                        </View>

                                                        <View >
                                                            <Text style={[styles.Text, { color: Colors.sky, fontSize: 14, }]}>{item.price} {i18n.t('RS')}</Text>
                                                        </View>

                                                    </TouchableOpacity>
                                                </View>

                                        )
                                    }} />





                                {ProductDetailes.extras && ProductDetailes.extras.length ?
                                    <>
                                        <View style={{ width: '100%', height: 1, backgroundColor: '#C0C0C0', marginVertical: 15, }}></View>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}>
                                            <Text style={styles.Text}>{i18n.t('extras')}</Text>
                                            <Text style={[styles.yText, { marginTop: 0, fontFamily: 'flatMedium', fontSize: 14, marginLeft: 5 }]}> ({i18n.t('optional')})</Text>
                                        </View>

                                        <FlatList
                                            showsVerticalScrollIndicator={false}
                                            data={ProductDetailes.extras}
                                            extraData={spinner}
                                            keyExtractor={(item) => item.id.toString()}
                                            renderItem={({ item, index }) =>
                                                (
                                                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 10 }} onPress={() => toggleChecked(item)}  >
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                            <CheckBox checked={ExtraArr.indexOf(item) !== -1} color={ExtraArr.indexOf(item) !== -1 ? Colors.sky : '#DBDBDB'} style={{ backgroundColor: ExtraArr.indexOf(item) !== -1 ? Colors.sky : Colors.bg, width: 20, height: 20, alignItems: 'center' }} onPress={() => toggleChecked(item,)} />

                                                            <Text style={[styles.Text, { fontSize: 14, marginHorizontal: 15, color: ExtraArr.indexOf(item) !== -1 ? Colors.fontBold : Colors.fontNormal }]}>{item.name}</Text>
                                                        </View>
                                                        <Text style={[styles.Text, { color: Colors.sky, fontSize: 14 }]}>{item.price} {i18n.t('RS')}</Text>
                                                    </TouchableOpacity>
                                                )}
                                        />
                                    </>
                                    : null
                                }
                                <View style={{ width: '100%', height: 1, backgroundColor: '#C0C0C0', marginVertical: 15, }} />


                                {/* size */}

                                <Text style={[styles.Text, { alignSelf: 'flex-start' }]}>{i18n.t('selectRequiredQuantity')}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, }}>
                                    <TouchableOpacity onPress={increment}>
                                        <Image source={require('../../../assets/images/plus.png')} style={{ width: 30, height: 30, borderRadius: 5 }} />
                                    </TouchableOpacity>

                                    <Text style={{ color: Colors.sky, fontFamily: 'flatMedium', fontSize: 24, paddingHorizontal: 30 }}> {count} </Text>
                                    <TouchableOpacity onPress={decrement} >
                                        <Image source={require('../../../assets/images/munic.png')} style={{ width: 30, height: 30 }} />
                                    </TouchableOpacity>

                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 30, marginEnd: 15 }}>
                                    <Text style={[styles.Text, { fontSize: 24, marginHorizontal: 30 }]}>{i18n.t('total')} :</Text>
                                    <Text style={[styles.Text, { color: Colors.sky, fontSize: 20 }]}>{total == 0 ? ProductDetailes.price : total} {i18n.t('RS')}</Text>

                                </View>



                            </View>


                        </View>


                }
                <LoadingBtn loading={loader} >
                    <BTN title={i18n.t('orderNow')} onPress={AddProductToCarts} ContainerStyle={{ marginVertical: 0, marginBottom: 20, marginTop: 0, borderRadius: 20, backgroundColor: Colors.fontBold }} TextStyle={{ fontSize: 13 }} />
                </LoadingBtn>
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
        height: 18,
        marginTop: 5

    },
    Text: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: 14,
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
        fontSize: 14,
        marginTop: 10,
        lineHeight: 20
    },
    sText: {
        fontFamily: 'flatMedium',
        color: Colors.fontBold,
        fontSize: 14,
        left: 20
    },
    wrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 40,
        marginHorizontal: width * .07
    }
})
export default ProductDetailes