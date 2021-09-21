import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react'
import { TouchableOpacity, Image, Text, StyleSheet, Dimensions, ScrollView, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { getPlacesType } from '../actions';
import Colors from '../consts/Colors';
import { _renderRows } from './LoaderImage';


const { width, } = Dimensions.get('window')

function SelectCats({ changePlaceType }) {

    const [StoreKey, setStoreKey] = useState(null);
    const [spinner, setSpinner] = useState(true);
    const categories = useSelector(state => state.categories.placesTypes);
    const lang = useSelector(state => state.lang.lang);
    const navigation = useNavigation()
    const dispatch = useDispatch();
    let loadingAnimated = [];

    useEffect(() => {
        setStoreKey(null)
        dispatch(getPlacesType(lang)).then(() => setSpinner(false))
    }, []);

    const changePlaceTypes = (key, i) => {
        setStoreKey(i)
        changePlaceType(key)
    }

    return useMemo(() => {

        return (
            <View style={{ height: 45, backgroundColor: '#fff' }}>
                <ScrollView horizontal style={{ borderWidth: 1, borderColor: '#ddd', alignSelf: 'flex-start', flexDirection: 'row' }} showsHorizontalScrollIndicator={false}>
                    {
                        spinner ?
                            _renderRows(loadingAnimated, 20, '2rows', width, 120, { flexDirection: 'column', }, { borderRadius: 0, })
                            :
                            categories && categories.map((cat, i) => (
                                <TouchableOpacity key={i} onPress={() => changePlaceTypes(cat.key, i)} style={{ height: '100%', borderColor: StoreKey == i ? Colors.sky : '#fff', borderLeftColor: StoreKey == i ? Colors.sky : '#fff', width: width * 33.33333333 / 100, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderLeftWidth: 2, borderRightWidth: 2, borderWidth: 2, borderRadius: 25, marginHorizontal: 5, }}  >
                                    <Image source={{ uri: cat.img }} style={{ width: 25, height: 25, marginHorizontal: 5 }} resizeMode='contain' />
                                    <Text style={styles.sText}>{cat.name}</Text>
                                </TouchableOpacity>
                            ))
                    }
                </ScrollView>
            </View>
        )
    }, [categories, spinner, StoreKey, navigation]);

}

const styles = StyleSheet.create({
    Container: {
        height: '100%',

        width: width * 33.33333333 / 100,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderWidth: 2,
        borderRadius: 25,
        marginHorizontal: 5,
    },
    sText: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: 12,

    },
})

export default SelectCats
