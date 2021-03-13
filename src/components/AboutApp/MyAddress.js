import React, { useState, useEffect } from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, I18nManager } from 'react-native'
import Colors from '../../consts/Colors';
import BTN from '../../common/BTN';
import { Icon } from "native-base";
import I18n from "../locale/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getPlaces, deletePlace } from '../../actions';
import Header from "../../common/Header";
import LoadingBtn from '../../common/Loadbtn';

const { width, height } = Dimensions.get('window')

function MyAddress({ navigation }) {
    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null);
    const places = useSelector(state => state.places.places);
    const placesLoader = useSelector(state => state.places.loader);
    const dispatch = useDispatch();
    const [spinner, setSpinner] = useState(true);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            dispatch(getPlaces(lang, token)).then(() => setSpinner(false))
        })
        return unsubscribe
    }, [navigation]);

    function deletePlaceFunc(id) {
        dispatch(deletePlace(lang, id, token))
    }

    return (
        <ScrollView style={{ flex: 1 }}>
            <LoadingBtn loading={spinner}>

                <Header navigation={navigation} label={I18n.t('myAddresses')} />
                <View style={{ marginTop: 20 }}>
                    {
                        !places ?
                            <Image source={require('../../../assets/images/empty.png')} style={{ width: 50, height: 50, alignSelf: 'center' }} />
                            :
                            places.map((place, i) => (
                                <View style={styles.card} key={i}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Image source={require('../../../assets/images/pinblue.png')} style={styles.iconImg} resizeMode='contain' />
                                            <Text style={styles.yText}>{(place.name).substr(0, 35)}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <TouchableOpacity onPress={() => navigation.navigate('editAddress', { pathName: 'myAddresses', id: place.id, latitude: place.latitude, longitude: place.longitude, address: place.address, name: place.name })}>
                                                <Icon style={{ fontSize: 18, color: Colors.sky }} name="edit" type={'AntDesign'} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => deletePlaceFunc(place.id)}>
                                                <Icon style={{ fontSize: 18, color: 'red', marginLeft: 10 }} name="delete" type={'AntDesign'} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            ))
                    }
                </View>
            </LoadingBtn>
            <BTN title={I18n.t('addNewAdd')} onPress={() => navigation.navigate('AddAddress', { pathName: 'myAddress' })} ContainerStyle={{ marginTop: 30, borderRadius: 30, marginBottom: 30 }} TextStyle={{ fontSize: 13 }} />
        </ScrollView >
    )
}
const styles = StyleSheet.create({
    BigImg: {
        height: height * .14,
        width: width * .22,
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
        top: width * .14,

    },

    stext: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: width * .035,

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
        padding: 20
    },


    iconImg: {
        width: 12,
        height: 12,
        marginRight: 5
    },
    yText: {
        fontFamily: 'flatLight',
        color: Colors.fontNormal,
        fontSize: 14
    },
    EditText: {
        fontFamily: 'flatMedium',
        color: Colors.sky,
        fontSize: width * .04,
        marginHorizontal: width * .25
    },
})
export default MyAddress
