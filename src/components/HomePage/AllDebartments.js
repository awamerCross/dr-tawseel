import React, { useEffect, useState } from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, ActivityIndicator } from 'react-native'
import Colors from '../../consts/Colors';
import Header from '../../common/Header';
import { useSelector, useDispatch } from 'react-redux';
import { getCategories, getPlacesType } from '../../actions';
import style from "../../../assets/styles";
import i18n from "../locale/i18n";
import Container from '../../common/Container';
import { _renderRows } from '../../common/LoaderImage';


const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

function AllDebartments({ navigation, route }) {


    const { mapRegion, pathName } = route.params
    const lang = useSelector(state => state.lang.lang);
    const categories = useSelector(state => pathName == 'orderStore' ? state.categories.placesTypes ? state.categories.placesTypes : [] : state.categories.categories ? state.categories.categories : []);
    const dispatch = useDispatch();
    const [spinner, setSpinner] = useState(true);
    let loadingAnimated = [];

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setSpinner(true)

            if (pathName == 'orderStore')
                dispatch(getPlacesType(lang)).then(() => setSpinner(false))
            else
                dispatch(getCategories(lang)).then(() => setSpinner(false))
        })
        return unsubscribe
    }, [navigation, route]);


    return (

        <View style={{ flex: 1, backgroundColor: Colors.bg }}>
            <Header navigation={navigation} label={i18n.t('categories')} />

            <ScrollView style={{ flex: 1, marginTop: 30, }}>
                {
                    spinner ?
                        _renderRows(loadingAnimated, categories && categories.length, '2rows', width * .9, 150, { flexDirection: 'column', }, { borderTopRightRadius: 0, })
                        :
                        categories && categories.length == 0 ?
                            <Image source={require('../../../assets/images/empty.png')} style={{ width: 50, height: 50, alignSelf: 'center' }} />
                            :
                            categories.map((category, i) => (
                                <TouchableOpacity key={i} onPress={() => navigation.navigate(pathName === 'allDep' ? 'Department' : 'DepartmentsDetailes', { categoryId: category.id, mapRegion: mapRegion, key: pathName === 'allDep' ? null : category.key })}>
                                    <View style={styles.WrapTexImg}>
                                        <Image source={{ uri: category.img }} style={styles.BImage} />
                                        <Text style={styles.BText}>{category.name}</Text>
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
        fontSize: width * .045,
        textAlign: 'center',
        top: width * .19
    },

    WrapTexImg: {
        alignSelf: 'center',
        borderRadius: 25,
        borderTopRightRadius: 0,
        overflow: 'hidden',
        marginBottom: 20,
        width: width * .9,
        height: 150,

    },
    BImage: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.IconBlack,
        opacity: .76,
    },
    BText: {
        position: 'absolute',
        fontSize: width * .06,
        left: 25,
        bottom: 20,
        color: Colors.bg,
        fontFamily: 'flatMedium'
    }
})
export default AllDebartments
