import React, { useState, useEffect } from 'react'
import { View, FlatList, Dimensions, TouchableOpacity, Text } from 'react-native'
import Container from '../../common/Container'
import { useDispatch, useSelector } from 'react-redux';
import { GetSavedLoacation } from '../../actions/BsketDetailesAction';
import Colors from '../../consts/Colors';
import Header from '../../common/Header';
import i18n from "../locale/i18n";
import BTN from '../../common/BTN';

const { width } = Dimensions.get('window')


const latitudeDelta = 0.0922;
const longitudeDelta = 0.0421;
function chooseSavedPlaces({ navigation }) {

    const [spinner, setSpinner] = useState(false);
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null);
    const SavedLocation = useSelector(state => state.BasketDetailes.GetSavedLoacation);
    const [selectedRadion, setSelectedRadio] = useState()
    const [mapRegion, setMapRegion] = useState({
        latitude: '',
        longitude: '',
        latitudeDelta,
        longitudeDelta,
        cityName: ''
    });

    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            dispatch(GetSavedLoacation(token)).then(() => setSpinner(false))
        });
        return unsubscribe;
    }, [navigation]);

    const HandleChange = (item, index) => {

        setSelectedRadio(index);
        setMapRegion({
            latitude: item.latitude, longitude: item.longitude, latitudeDelta,
            longitudeDelta, cityName: item.address

        })
    }
    return (
        <Container loading={spinner}>
            <Header navigation={navigation} label={i18n.t('ChooseSavedPlaces')} />
            {
                SavedLocation && SavedLocation.length == 0 ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontFamily: 'flatMedium', fontSize: 20 }}>لا يوجد اماكن محفوظة</Text>
                    </View>
                    :

                    <FlatList
                        data={SavedLocation}
                        extraData={spinner}
                        keyExtractor={(item) => (item.id).toString()}
                        renderItem={({ item, index }) => {
                            return (
                                <View>
                                    <View style={{ flexDirection: 'row', marginTop: 30, margin: width * .05, }}>
                                        <TouchableOpacity onPress={() => HandleChange(item, index)} >

                                            <Text style={{ color: selectedRadion === index ? Colors.sky : Colors.IconBlack, fontFamily: 'flatMedium', paddingVertical: 5 }}>{
                                                item.name}
                                            </Text>

                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <View style={{
                                                    height: 16,
                                                    width: 16,
                                                    borderRadius: 12,
                                                    borderWidth: 2,
                                                    borderColor: selectedRadion === index ? Colors.sky : Colors.fontNormal,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                    {
                                                        selectedRadion === index ?
                                                            <View style={{
                                                                height: 8,
                                                                width: 8,
                                                                borderRadius: 6,
                                                                backgroundColor: Colors.sky,
                                                            }} />
                                                            : null
                                                    }
                                                </View>
                                                <Text style={{ color: selectedRadion === index ? Colors.sky : Colors.fontNormal, left: 8, fontFamily: 'flatMedium', }}>{item.address}</Text>
                                            </View>

                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ height: 1, width: '90%', opacity: .5, marginHorizontal: '1%', backgroundColor: Colors.fontNormal }}></View>
                                    <BTN title={i18n.t("EnsureSite")} ContainerStyle={{ marginTop: 20, backgroundColor: Colors.sky, borderRadius: 25, }} onPress={() => navigation.navigate('PaymentDetailes', { cityName: mapRegion.cityName, mapRegion })} />

                                </View>

                            )
                        }} />
            }

        </Container>

    )
}

export default chooseSavedPlaces
