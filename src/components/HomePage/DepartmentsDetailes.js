import React, { useEffect, useState } from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import Colors from '../../consts/Colors';
import { InputIcon } from '../../common/InputText';
import Header from '../../common/Header';
import i18n from "../locale/i18n";
import { useSelector, useDispatch } from 'react-redux';
import { getGooglePlaces, getPlacesType } from '../../actions';
import Container from '../../common/Container';
import LoadingBtn from '../../common/Loadbtn';
import { _renderRows } from '../../common/LoaderImage';

const { width, height } = Dimensions.get('window')

function DepartmentsDetailes({ navigation, route }) {
    const { mapRegion, key } = route.params;
    const lang = useSelector(state => state.lang.lang);
    const categories = useSelector(state => state.categories.placesTypes);
    let allCategories = categories;
    const places = useSelector(state => state.categories.googlePlaces);
    const dispatch = useDispatch();
    const [spinner, setSpinner] = useState(true);
    const [loading, setloading] = useState(true);
    const [StoreKey, setStoreKey] = useState('supermarket')
    const [active, setactive] = useState(0);
    let loadingAnimated = [];

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setSpinner(true)
            setloading(true)
            setactive(0)
            setStoreKey('supermarket')
            dispatch(getPlacesType(lang)).then(() => {
                if (allCategories && allCategories.length > 0)
                    fetchGooglePlaces(allCategories[0].key)
                else
                    fetchGooglePlaces(null)
            }).then(() => setSpinner(false)).then(() => setloading(false))
        })
        return unsubscribe
    }, [navigation, route]);

    function fetchGooglePlaces(key) {
        setStoreKey(key)
        setloading(true)
        dispatch(getGooglePlaces(lang, key, null, mapRegion.latitude, mapRegion.longitude)).then(() => setloading(false))
    }

    function placeSearch(search) {
        setloading(true)
        dispatch(getGooglePlaces(lang, StoreKey, search, mapRegion.latitude, mapRegion.longitude)).then(() => setSpinner(false)).then(() => setloading(false))
    }
    console.log("StoreKey" + StoreKey);
    return (

        <View style={{ flex: 1, backgroundColor: Colors.bg, }}>
            <Header navigation={navigation} />

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

                <InputIcon
                    placeholder={i18n.t('search')}
                    inputStyle={{ borderRadius: 30, backgroundColor: Colors.bg, borderColor: '#eaeaea' }}
                    styleCont={{ height: 45 }}
                    image={require('../../../assets/images/search.png')}
                    LabelStyle={{ backgroundColor: 'transparent' }}
                    onChangeText={placeSearch}
                />

                <View style={{ height: 45, backgroundColor: '#fff' }}>
                    <ScrollView horizontal style={{ borderWidth: 1, borderColor: '#ddd', alignSelf: 'flex-start', flexDirection: 'row' }} showsHorizontalScrollIndicator={false}>
                        {
                            spinner ?
                                _renderRows(loadingAnimated, 20, '2rows', width, 120, { flexDirection: 'column', }, { borderRadius: 0, })
                                :
                                categories ?
                                    categories.map((category, i) => (
                                        <TouchableOpacity style={[{ height: '100%', width: width * 33.33333333 / 100, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderLeftWidth: 1, backgroundColor: active === i ? Colors.sky : Colors.bg, borderLeftColor: '#ddd' }]} key={i} onPress={() => { fetchGooglePlaces(category.key); setactive(i) }}>
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
                        places &&

                        places.map((place, i) => (

                            <TouchableOpacity onPress={() => navigation.navigate('OrderFromYourStore', { placeId: place.place_id, mapRegion })} key={i}>
                                <View style={styles.card}>
                                    <Image source={{ uri: place.icon }} style={styles.ImgCard} />
                                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginLeft: 10 }}>
                                        <Text style={[styles.sText, { alignSelf: 'flex-start' }]}>{place.name.length > 30 ? (place.name).substr(0, 30) + '...' : place.name}</Text>
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
        fontSize: 13,

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
        fontSize: 11,
        opacity: .6
    },
    card: {
        shadowColor: Colors.bg,
        backgroundColor: Colors.bg,
        flexDirection: 'row',
        marginHorizontal: 20,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
        marginVertical: 8,
        width: width * .89,
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