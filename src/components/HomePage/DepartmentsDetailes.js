import React, { useEffect, useState, useCallback, Fragment, useMemo } from 'react'
import { View, StyleSheet, Dimensions, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import Colors from '../../consts/Colors';
import { InputIcon } from '../../common/InputText';
import Header from '../../common/Header';
import i18n from "../locale/i18n";
import { useSelector, useDispatch } from 'react-redux';
import { FetchMoreGooglePlaces, getGooglePlaces, getPlacesType } from '../../actions';
import { _renderRows } from '../../common/LoaderImage';
import { Icon } from 'native-base';
import StroeDetailes from '../../common/StroeDetailes';
import * as Location from 'expo-location';
import SelectCats from '../../common/SelectCats';
import { useIsFocused } from '@react-navigation/native';

const { width, height } = Dimensions.get('window')

function DepartmentsDetailes({ navigation, route }) {

    const MapsRegion = route?.params
    const lang = useSelector(state => state.lang.lang);
    const AllPlacess = useSelector(state => state.categories.googlePlaces);


    const [loadMore, setloadingMore] = useState(false);
    const [mapRegion, setmapRegion] = useState({});

    const dispatch = useDispatch();
    const [loading, setloading] = useState(true);
    const [StoreKey, setStoreKey] = useState('')
    const [search, setSearch] = useState('');
    const [Depounce, setDepounce] = useState(search);


    useEffect(() => {

        const TimeOut = setTimeout(() => {
            setDepounce(search)
        }, 100);

        return () => clearTimeout(TimeOut);

    }, [search])

    useEffect(() => {
        if (!MapsRegion?.mapRegion?.latitude) {
            (async () => {
                setStoreKey('')
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    alert('صلاحيات تحديد موقعك الحالي ملغاه');

                } else {
                    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
                    dispatch(getGooglePlaces(lang, null, search, latitude, longitude, null)).then(() => setloading(false))
                    setmapRegion({ latitude, longitude })
                }
            })()
        }
        else {
            setmapRegion(MapsRegion?.mapRegion)
            dispatch(getGooglePlaces(lang, null, search, MapsRegion?.mapRegion?.latitude, MapsRegion?.mapRegion?.longitude, null)).then(() => setloading(false))

        }
        // return () => { setSearch('') }
    }, [Depounce])

    let loadingAnimated = [];




    const onEndReached = () => dispatch(FetchMoreGooglePlaces(setloadingMore, lang, StoreKey, search, mapRegion.latitude, mapRegion.longitude))

    const changePlaceType = (category) => {
        setStoreKey(category);
        setloading(true);
        dispatch(getGooglePlaces(lang, category, search, mapRegion.latitude, mapRegion.longitude, null)).then(() => setloading(false))
        setloadingMore(false)

    }



    const renderFooter = () => {
        if (!loadMore) return null;
        else return <ActivityIndicator size={20} color={Colors.sky} />;
    };


    const RenderList = () => {
        return (
            loading ?
                _renderRows(loadingAnimated, 10, '2rows', width * .89, 100, { flexDirection: 'column', }, { borderRadius: 5, })
                :
                <FlatList
                    data={AllPlacess}
                    showsVerticalScrollIndicator={false}
                    style={{ marginTop: 5 }}
                    // extraData={loading}
                    keyExtractor={(item, index) => index.toString()}
                    // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListFooterComponent={renderFooter}
                    onMomentumScrollBegin={() => setloadingMore(true)}
                    onEndReached={() => onEndReached()}
                    onEndReachedThreshold={0.9}
                    renderItem={({ item, index }) => {
                        return (
                            <StroeDetailes item={item} key={index} mapRegion={mapRegion} />
                        )
                    }}
                    ListEmptyComponent={
                        <View style={styles.Container}>
                            <Icon type={'MaterialCommunityIcons'} name={'cancel'} style={styles.Icon} />
                            <Text style={styles.Title}>{'NO RESULTS'}</Text>
                        </View>
                    }
                />
        )
    }

    return (

        <View style={{ flex: 1, backgroundColor: Colors.bg, }}>
            <Header navigation={navigation} />
            <InputIcon
                placeholder={i18n.t('search')}
                inputStyle={{ borderRadius: 30, backgroundColor: Colors.bg, borderColor: '#eaeaea' }}
                styleCont={{ height: 45 }}
                image={require('../../../assets/images/search.png')}
                LabelStyle={{ backgroundColor: 'transparent' }}
                // onChangeText={(e) => placeSearch(e)}
                value={search}
                // onSubmitEditing={() => placeSearch(search)}
                onChangeText={(e) => setSearch(e)}

            />

            <SelectCats changePlaceType={(e) => changePlaceType(e)} />


            {RenderList()}
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
        fontSize: 12,

    },
    Container: {
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        flex: 1
    },
    Icon: {
        fontSize: 200,
        color: Colors.fontNormal,
        marginTop: 120
    },
    Title: {
        color: Colors.fontNormal,
        fontFamily: 'flatMedium',
        fontSize: 16,
        alignSelf: 'center'
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
        width: '100%',
        padding: 10,
        borderRadius: 5,
        shadowColor: "#000",

    },
    ImgCard: {
        width: '20%',
        height: 60,
        borderRadius: 5
    }
})
export default DepartmentsDetailes