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
    I18nManager,
    ActivityIndicator,
    Platform
} from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import Colors from '../../consts/Colors';
import i18n from "../locale/i18n";
import StarRating from "react-native-star-rating";
import { useDispatch, useSelector } from 'react-redux';
import { ResturantDetailes, Products } from '../../actions';
import Container from '../../common/Container';
import LoadingBtn from '../../common/Loadbtn';
import { _renderRows } from '../../common/LoaderImage';


const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')
const isIOS = Platform.OS === 'ios';


function RestaurantDepartment({ navigation, route }) {

    const { Resid } = route.params
    const [spinner, setSpinner] = useState(true);
    const lang = useSelector(state => state.lang.lang);
    const [loading, setloading] = useState(false);
    let loadingAnimated = [];
    const [loadingImage, setloadingImage] = useState(false);

    const dispatch = useDispatch();
    const RestDetailes = useSelector(state => state.categories.Resture ? state.categories.Resture : {});
    const Product = useSelector(state => state.categories.product);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setSpinner(true);
            setloading(true)
            dispatch(ResturantDetailes(Resid, lang)).then(() => dispatch(Products(Resid, lang))).then(() => setSpinner(false)).then(() => setloading(false))
            setActiveType(0)

        })
        return unsubscribe
    }, [navigation, route])


    const SHowProduct = (id) => {

        setloading(true)
        dispatch(Products(Resid, lang, id)).then(() => setloading(false))



    }
    const showMEnue = (id) => {
        setloading(true)
        dispatch(Products(Resid, lang, id)).then(() => setloading(false))
    }

    const [activeType, setActiveType] = useState(0);

    const onLoadImg = (e) => {
        if (e !== undefined) {
            setloadingImage(true)
        }
    }

    function Item({ name, price, id, image, discount, menue, price_discount }) {
        return (

            <TouchableOpacity onPress={() => navigation.navigate('ProductDetailes', { productId: id })} style={[styles.notiBlock]}>

                <Image
                    onLoadStart={(e) => setloadingImage(true)}
                    onLoad={onLoadImg}
                    source={loadingImage ? { uri: image } : require('../../../assets/images/default.png')}
                    style={styles.restImg}
                    resizeMode={'cover'} />

                <View style={[styles.directionColumn, { flex: 1, marginStart: 5 }]}>
                    <Text style={{ fontSize: 14, fontFamily: 'flatMedium', alignSelf: 'flex-start', paddingVertical: 5 }}>{name.length > 25 ? (name).substr(0, 25) + '...' : name}</Text>
                    <Text style={[{ fontFamily: 'flatRegular', writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr', fontSize: 10, color: Colors.fontNormal, }]}>{menue.length > 25 ? (menue).substr(0, 25) + '...' : menue}</Text>

                    {
                        discount === 0 ?
                            <Text style={{ fontSize: 14, fontFamily: 'flatMedium', color: Colors.sky, paddingTop: 5, alignSelf: 'flex-start' }}>{price} {i18n.t('RS')}</Text>

                            :
                            <View style={{ flexDirection: 'column', alignItems: 'center', paddingTop: 5, alignSelf: 'flex-start', marginStart: 0 }}>
                                <Text style={{ fontSize: 14, fontFamily: 'flatMedium', color: Colors.sky }}>{price_discount} {i18n.t('RS')}</Text>
                                <Text style={{ fontSize: 10, fontFamily: 'flatRegular', color: Colors.fontNormal, textDecorationLine: 'line-through', marginStart: 20 }}>{price} {i18n.t('RS')}</Text>


                            </View>

                    }


                </View>
            </TouchableOpacity>
        );
    }




    return (
        <Container loading={spinner}>
            <ScrollView style={{ flex: 1, backgroundColor: Colors.bg }} showsVerticalScrollIndicator={false}>

                {
                    RestDetailes && !RestDetailes ?

                        <Image source={require('../../../assets/images/empty.png')} style={{ width: 50, height: 50, alignSelf: 'center', marginTop: 50 }} />
                        :

                        <ImageBackground
                            onLoadStart={(e) => setloadingImage(true)}
                            onLoad={onLoadImg}
                            source={loadingImage ? { uri: RestDetailes.cover } : require('../../../assets/images/default.png')}
                            style={{ width: width, height: 320 }}>
                            <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: isIOS ? 65 : 40, marginHorizontal: width * .04, opacity: 1, }}>

                                    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                                        <Image source={require('../../../assets/images/menue.png')} style={[styles.MenueImg, { transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }], }]} resizeMode='contain' />
                                    </TouchableOpacity>

                                    <Text style={[styles.Text, { color: Colors.bg }]}>{i18n.t('restDet')}</Text>

                                    <TouchableOpacity onPress={() => navigation.goBack()}>
                                        <Image source={require('../../../assets/images/arrs.png')} style={[styles.MenueImg]} resizeMode='contain' />
                                    </TouchableOpacity>

                                </View>
                                <View style={{ alignItems: 'center', marginTop: 10, }}>
                                    <View style={{ width: 70, height: 70, borderRadius: 50, backgroundColor: '#ffffff42', padding: 5 }}>
                                        <Image source={{ uri: RestDetailes.avatar }} style={{ width: '100%', height: '100%', borderRadius: 50 }} resizeMode='cover' />
                                    </View>
                                    <Text style={[styles.Text, { color: Colors.bg, fontSize: 18, marginTop: 10 }]}> {RestDetailes.name}</Text>
                                    <Text style={[styles.Text, { color: Colors.bg, fontSize: 18, marginTop: 10 }]}> {RestDetailes.available}</Text>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginHorizontal: 5, }}>
                                        <Image source={require('../../../assets/images/pinblue.png')} style={styles.iconImg} resizeMode='contain' />
                                        <Text style={styles.yText} numberOfLines={2}> {RestDetailes.distance}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginVertical: 5, alignItems: 'center' }}>
                                        <StarRating
                                            disabled={true}
                                            maxStars={5}
                                            rating={RestDetailes.rate}
                                            fullStarColor={'yellow'}
                                            starSize={14}
                                            starStyle={{ marginHorizontal: 1 }}
                                        />
                                        <Text style={{ color: Colors.fontNormal, fontFamily: 'flatRegular', fontSize: 10, }}>{RestDetailes.rate}/5</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[styles.yText, { marginBottom: 5, color: Colors.sky }]}> {i18n.t('preparingTime')} : </Text>
                                        <Text style={styles.yText}>  ({RestDetailes.preparing_time_from} - {RestDetailes.preparing_time_to}) {i18n.t('minute')}</Text>

                                    </View>

                                </View>
                            </View>
                        </ImageBackground>
                }



                <View style={styles.mainScroll}>
                    <ScrollView style={{ alignSelf: 'flex-start' }} horizontal={true} showsHorizontalScrollIndicator={false}>
                        <TouchableOpacity onPress={() => { SHowProduct(null); setActiveType(0); }} style={styles.scrollView}>
                            <Text style={[styles.scrollText, { color: activeType === 0 ? Colors.sky : Colors.fontNormal }]}>{i18n.t('all')}</Text>
                            <View style={[styles.triangle, { borderBottomColor: activeType === 0 ? Colors.sky : 'transparent' }]} />
                        </TouchableOpacity>
                        {
                            RestDetailes && RestDetailes.menus && RestDetailes.menus.map((item, i) => {
                                return (
                                    <TouchableOpacity onPress={() => { setActiveType(i + 1); showMEnue(item.id) }} style={styles.scrollView} key={'_' + i}>
                                        <Text style={[styles.scrollText, { color: activeType === i + 1 ? Colors.sky : Colors.fontNormal }]}>{item.name}</Text>
                                        <View style={[styles.triangle, { borderBottomColor: activeType === i + 1 ? Colors.sky : 'transparent' }]} />
                                    </TouchableOpacity>
                                )
                            })
                        }


                    </ScrollView>
                </View>

                {

                    Product && Product.length ?
                        loading ?
                            _renderRows(loadingAnimated, Product && Product.length, '2rows', width * .9, 100, { flexDirection: 'column', }, { borderRadius: 25, })

                            :
                            <FlatList
                                data={Product}
                                extraData={spinner}
                                horizontal={false}
                                numColumns={1}

                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) => <Item
                                    name={item.name}
                                    price={item.price}
                                    menue={item.menu}
                                    id={item.id}
                                    image={item.image}
                                    price={item.price}
                                    price_discount={item.price_discount}
                                    discount={item.discount}
                                    index={index}
                                />}
                                keyExtractor={item => item.id.toString()}
                            />

                        :
                        <Image source={require('../../../assets/images/empty.png')} style={{ width: 150, height: 150, alignSelf: 'center' }} />




                }
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
        width: 15,
        height: 15,
        padding: 12,
        transform: I18nManager.isRTL ? [{ rotate: '0deg' }] : [{ rotate: '180deg' }]

    },
    Text: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: 16,
        textAlign: 'center',
    },
    iconImg: {
        width: 12,
        height: 12,
        marginHorizontal: 1,
        marginVertical: 5

    },
    yText: {
        fontFamily: 'flatMedium',
        color: Colors.bg,
        fontSize: 14,
    },
    card: {
        shadowColor: Colors.bg,
        backgroundColor: Colors.bg,
        flexDirection: 'row',
        marginHorizontal: 20,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 1,
        marginVertical: 5,
        width: width * .89,
        height: height * .1,
        paddingTop: 10,
        paddingStart: 10,
        overflow: 'hidden'

    },
    ImgCard: {
        width: width * .15,
        height: width * .15,
        borderRadius: 5
    },
    sText: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: width * .03,
        marginHorizontal: 10
    }, mainScroll: {
        borderBottomWidth: 2,
        borderBottomColor: '#dcdada94',
        height: 50,
    },
    scrollView: {
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        marginHorizontal: 1,
        paddingHorizontal: 5,
        paddingVertical: 20,

    },
    scrollText: {
        fontSize: 12,
        fontFamily: 'flatMedium',
        height: 50,
        lineHeight: 50
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderBottomWidth: 7,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        position: 'absolute',
        bottom: 0
    },
    notiBlock: {
        borderWidth: 1,
        borderColor: '#f2f2f2',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#F8F8F8',
        marginHorizontal: '2%',
        width: '95%',
        marginTop: 5,
        borderRadius: 5,
        flex: 1,
        padding: 10
    },
    restImg: {
        width: 100,
        height: '100%',
        borderRadius: 5,


    },
    directionColumn: {
        flexDirection: 'column',
    },
    directionColumnCenter: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    directionRow: {
        flexDirection: 'row',
    },
    directionRowCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    directionRowSpace: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        paddingVertical: 10,
        marginHorizontal: 5

    }, locationView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },

})
export default RestaurantDepartment
