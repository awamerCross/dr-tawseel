import React, { useEffect, useState } from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, ActivityIndicator, I18nManager } from 'react-native'
import Colors from '../../consts/Colors';
import { InputIcon } from '../../common/InputText';
import Header from '../../common/Header';
import Container from '../../common/Container';
import { useDispatch, useSelector } from 'react-redux';
import { BasketStore } from '../../actions';
import * as Location from 'expo-location';
import axios from "axios";
import i18n from "../locale/i18n";
import { DrawerActions } from '@react-navigation/native';
import StarRating from "react-native-star-rating";
import { useIsFocused } from '@react-navigation/native';
import { _renderRows } from '../../common/LoaderImage';

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')



const latitudeDelta = 0.0922;
const longitudeDelta = 0.0421;
function Basket({ navigation }) {

    const lang = useSelector(state => state.lang.lang);
    const [spinner, setSpinner] = useState(true);
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null)
    const Basket = useSelector(state => state.categories.BasketStore ? state.categories.BasketStore : []);
    const [search, setsearch] = useState('');
    const [mapRegion, setMapRegion] = useState({
        latitude: '',
        longitude: '',
        latitudeDelta,
        longitudeDelta
    });
    const [error, setError] = useState(false);
    let loadingAnimated = []

    const isFocused = useIsFocused();
    const dispatch = useDispatch()


    const fetchData = async () => {

        let { status } = await Location.requestPermissionsAsync();

        let userLocation = {};
        if (status !== 'granted') {
            alert('صلاحيات تحديد موقعك الحالي ملغاه');
        } else {
            const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});

            userLocation = { latitude, longitude, latitudeDelta, longitudeDelta };

            setMapRegion(userLocation);
        }

    }


    useEffect(() => {


        if (isFocused) {
            setSpinner(true)
            fetchData()
            dispatch(BasketStore(token, lang, search)).then(() => setSpinner(false))


        }


    }, [isFocused])


    const handleChange = (e) => {
        if (e == '') {
            dispatch(BasketStore(token, lang, e))
        }
        setsearch(e);
        setTimeout(() => dispatch(BasketStore(token, lang, e)), 0)
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bg }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                <Image source={require('../../../assets/images/bluBack.png')} style={[styles.BigImg, { transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }], }]} resizeMode='contain' />
                <View style={styles.wrap}>
                    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                        <Image source={require('../../../assets/images/menue.png')} style={[styles.MenueImg, { marginBottom: width * .04, paddingHorizontal: 10 }]} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.Text}> {i18n.t('cart')}</Text>
                <View style={{ flexDirection: 'row', }}>
                    <TouchableOpacity onPress={() => navigation.navigate('GoHome')}>
                        <Image source={require('../../../assets/images/arrBlack.png')} resizeMode='contain' style={[styles.MenueImg, { marginHorizontal: width * .05, top: width * .16, transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }] }]} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={{ flex: 1, }}>


                <InputIcon
                    placeholder={i18n.t('search')}
                    inputStyle={{ borderRadius: 30, backgroundColor: Colors.bg, borderColor: '#eaeaea' }}
                    styleCont={{ height: 45 }}
                    image={require('../../../assets/images/search.png')}
                    LabelStyle={{ backgroundColor: 'transparent' }}
                    value={search}
                    onChangeText={(e) => handleChange(e)}
                />

                {


                    error ?
                        (
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Text>Error while loading data 😢</Text>
                            </View>
                        )
                        :
                        spinner ?
                            _renderRows(loadingAnimated, 10, '2rows', width * .89, 110, { flexDirection: 'column', }, { borderRadius: 5, })

                            : Basket && Basket.length == 0 ?
                                <View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center', backgroundColor: Colors.bg, flex: 1, marginTop: 150, }}>
                                    <Image source={require('../../../assets/images/emptycart.png')} style={{ height: 150, width: 150, }} resizeMode='stretch' />
                                    <Text style={{ alignSelf: 'center', fontSize: 14, fontFamily: 'flatRegular', }}>{i18n.t('BasketEmpty')}</Text>

                                    {/* <Text style={{ alignSelf: 'center', fontSize: 14, fontFamily: 'flatRegular', marginTop: 50, }}>{i18n.t('noOrder')}</Text> */}
                                </View>
                                :


                                (

                                    Basket.map((item, index) => {
                                        return (
                                            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BasketDetailes', { BasketId: item.id, mapRegion: mapRegion })} key={index}>
                                                <View style={{ flexDirection: 'row', padding: 10 }}>
                                                    <Image source={{ uri: item.avatar }} style={styles.ImgCard} />
                                                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginLeft: 10, flex: 1 }}>
                                                        <Text style={[styles.sText, { alignSelf: 'flex-start', flex: 1 }]}>{item.name}</Text>
                                                        <Text style={[styles.sText, { alignSelf: 'flex-start', }]}>{item.available}</Text>

                                                        <View style={{ flexDirection: 'row', marginVertical: 5, alignItems: 'center' }}>
                                                            <StarRating
                                                                disabled={true}
                                                                maxStars={5}
                                                                rating={item.rate}
                                                                fullStarColor={'yellow'}
                                                                starSize={14}
                                                                starStyle={{ marginHorizontal: 1 }}
                                                            />
                                                            <Text style={{ color: Colors.fontNormal, fontFamily: 'flatRegular', fontSize: 10, }}>{item.rate}/5</Text>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Image source={require('../../../assets/images/pinblue.png')} style={styles.iconImg} resizeMode='contain' />
                                                            <Text style={[styles.yText, { alignSelf: 'flex-start', writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' }]}> {item.distance}</Text>
                                                        </View>

                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }
                                    )

                                )
                }


            </ScrollView>


        </View>


    )
}
const styles = StyleSheet.create({

    sText: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: 13,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    BigImg: {
        height: height * .15,
        width: width * .22,
    },
    MenueImg: {
        width: 22,
        height: 22,

    },
    wrap: {
        position: 'absolute',
        marginHorizontal: 30,
        bottom: width * .04
    },
    Text: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: width * .04,
        textAlign: 'center',
        top: width * .15
    },
    iconImg: {
        width: 12,
        height: 12,
        marginHorizontal: 1,
        marginVertical: 5

    },
    yText: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: 13,
        opacity: .6
    },
    card: {
        shadowColor: Colors.bg,
        backgroundColor: Colors.bg,
        marginHorizontal: 20,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
        marginVertical: 8,
        width: width * .89,
        padding: 10,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        flex: 1
    },
    ImgCard: {
        width: width * .2,
        height: '100%',
        borderRadius: 5
    }
})
export default Basket
