import React, { useEffect, useState } from 'react'
import {ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, AsyncStorage} from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import Colors from '../../consts/Colors';
import { InputIcon } from '../../common/InputText';
import Header from '../../common/Header';
import i18n from "../locale/i18n";
import { useSelector, useDispatch } from 'react-redux';
import { getGooglePlaces, getPlacesType } from '../../actions';
import * as Location from 'expo-location';
import Container from '../../common/Container';
import LoadingBtn from '../../common/Loadbtn';
import { _renderRows } from '../../common/LoaderImage';
import axios from "axios";
import CONST from "../../consts";
import {ToasterNative} from "../../common/ToasterNatrive";

const { width, height } = Dimensions.get('window')

function DepartmentsDetailes({ navigation, route }) {
    const {  key }                              = route.params;
    const lang                                  = useSelector(state => state.lang.lang);
    const categories                            = useSelector(state => state.categories.placesTypes);
    let allCategories                           = categories;
    let places                                  = [];
    const dispatch                              = useDispatch();
    const [spinner, setSpinner]                 = useState(true);
    const [loading, setloading]                 = useState(true);
    const [StoreKey, setStoreKey]               = useState('supermarket')
    const [active, setactive]                   = useState(0);
    const [loadMore, setLoadMore]               = useState(false);
    const [search, setSearch]                   = useState(null);
    const [nextPageToken, setNextPageToken]     = useState( null );
    let loadingAnimated                         = [];
    let [allPlaces, setAllPlaces]               = useState([]);
    const [mapRegion, setMapRegion]             = useState({
        latitude: 24.7135517,
        longitude: 46.6752957,
    });


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            setSpinner(true)
            setloading(true)
            setNextPageToken(null)
            setactive(0)
            setAllPlaces([])
            setStoreKey('supermarket')

            let { status } = await Location.requestPermissionsAsync();
            let userLocation = {};
            if (status !== 'granted') {
                alert('صلاحيات تحديد موقعك الحالي ملغاه');
            } else {
                const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Balanced});
                setMapRegion({ latitude, longitude  })
                dispatch(getPlacesType(lang)).then(() => setSpinner(false)).then(() => setloading(false))
                fetchGooglePlaces(null, latitude, longitude, null)
            }
        })
        return unsubscribe
    }, [navigation, route]);

    function fetchGooglePlaces(key, latitude, longitude, nextPage ) {
        console.log('last locations__|||__', allPlaces, nextPageToken)


        if (nextPageToken !== 'last_page'){
            if (StoreKey != key){
                setAllPlaces([])
                setNextPageToken(null)
            }

            setStoreKey(key)
            setloading(true)
            axios({
                url: CONST.url + 'google/places',
                method: 'POST',
                data: { type: key, keyword: search, latitude, longitude, next_page_token: nextPage },
                params: { lang }
            }).then(response => {
                setNextPageToken(response.data.extra.next_page_token)
                setAllPlaces(nextPage ? [ ...allPlaces, ...response.data.data] : response.data.data)
                setloading(false)
                setSearch(null)
            }).catch(err => ToasterNative(err.message, 'danger', 'bottom'))
        }
    }

    function placeSearch() {
        setloading(true)
        setAllPlaces([]);
        fetchGooglePlaces(StoreKey, mapRegion.latitude, mapRegion.longitude, null )
    }

    function fetchMoreListItems(){
        fetchGooglePlaces(StoreKey, mapRegion.latitude, mapRegion.longitude, nextPageToken)
    }

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 1;
    };

    function changePlaceType(i, category){
        setNextPageToken(null);
        // alert(category.key)
        setAllPlaces([])
        fetchGooglePlaces(category.key, mapRegion.latitude, mapRegion.longitude, null );
        setactive(i);
    }

    console.log("StoreKey ____++", allPlaces);
    return (

        <View style={{ flex: 1, backgroundColor: Colors.bg, }}>
            <Header navigation={navigation} />

            <ScrollView onScroll={({ nativeEvent }) => {
                if (isCloseToBottom(nativeEvent) && !loadMore) {
                    fetchMoreListItems();
                }
            }} style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

                <InputIcon
                    placeholder={i18n.t('search')}
                    inputStyle={{ borderRadius: 30, backgroundColor: Colors.bg, borderColor: '#eaeaea' }}
                    styleCont={{ height: 45 }}
                    image={require('../../../assets/images/search.png')}
                    LabelStyle={{ backgroundColor: 'transparent' }}
                    onChangeText={(search) => setSearch(search)}
                    value={search}
                    onSubmitEditing={() => placeSearch()}
                />

                <View style={{ height: 45, backgroundColor: '#fff' }}>
                    <ScrollView horizontal style={{ borderWidth: 1, borderColor: '#ddd', alignSelf: 'flex-start', flexDirection: 'row' }} showsHorizontalScrollIndicator={false}>
                        {
                            spinner ?
                                _renderRows(loadingAnimated, 20, '2rows', width, 120, { flexDirection: 'column', }, { borderRadius: 0, })
                                :
                                categories ?
                                    categories.map((category, i) => (
                                        <TouchableOpacity style={[{ height: '100%', width: width * 33.33333333 / 100, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderLeftWidth: 2, borderRightWidth: 2, borderWidth: 2, borderLeftColor: active === i ? Colors.sky : '#fff', borderRadius: 25, marginHorizontal: 5, borderColor: active === i ? Colors.sky : '#fff', }]} key={i} onPress={() => changePlaceType(i, category)}>
                                            <Image source={{ uri: category.img }} style={{ width: 25, height: 25, marginHorizontal: 5 }} />
                                            <Text style={styles.sText}>{category.name}</Text>
                                        </TouchableOpacity>
                                    )) : null
                        }
                    </ScrollView>
                </View>

                {
                    loading ?
                        _renderRows(loadingAnimated, 10, '2rows', width * .89, 100, { flexDirection: 'column', }, { borderRadius: 5, })
                        :
                        allPlaces.map((place, i) => (
                            <TouchableOpacity onPress={() => navigation.navigate('OrderFromYourStore', { placeId: place.place_id, mapRegion })} key={i}>
                                <View style={styles.card}>
                                    <Image source={{ uri: place.icon }} style={styles.ImgCard} />
                                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginLeft: 10 }}>
                                        <Text style={[styles.sText, { alignSelf: 'flex-start' }]}>{place.name.length > 30 ? (place.name).substr(0, 30) + '...' : place.name} </Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Image source={require('../../../assets/images/pinblue.png')} style={styles.iconImg} resizeMode='contain' />
                                            <Text style={styles.yText}> {place.distance}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                }

            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    BigImg: {
        height: height * .15,
        width: width * .25,
    },
    MenueImg: {
        width: 18,
        height: 18,
        marginHorizontal: 4,
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
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: 14,
        opacity: .6
    },
    card: {
   //     shadowColor: Colors.bg,
        backgroundColor: Colors.bg,
        flexDirection: 'row',
        marginHorizontal: 0,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
        marginVertical: 8,
        width:'100%',
        padding: 10,
        borderRadius: 5,
        shadowColor: "#000",

    },
    ImgCard: {
        width: width * .15,
        height: width * .15,
        borderRadius: 5
    }
})
export default DepartmentsDetailes