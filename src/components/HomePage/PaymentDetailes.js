import React, { useState, useEffect } from 'react'
import { ScrollView, View, Image, TouchableOpacity, Text, StyleSheet, Dimensions, FlatList, Alert } from 'react-native'
import Colors from '../../consts/Colors';
import BTN from '../../common/BTN';
import { InputIcon } from '../../common/InputText';
import Header from '../../common/Header';
import i18n from "../locale/i18n";
import { BasketStoreDetailes, GetDliveryCost, CofirmOrder } from '../../actions/BsketDetailesAction';
import { useSelector, useDispatch } from 'react-redux';
import Container from '../../common/Container';
import { SText } from '../../common/SText';
import { Toast } from "native-base";
import { ToasterNative } from '../../common/ToasterNatrive';
import LoadingBtn from '../../common/Loadbtn';


const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')
const latitudeDelta = 0.0922;
const longitudeDelta = 0.0421;

function PaymentDetailes({ navigation, route }) {

    const lang = useSelector(state => state.lang.lang);
    const [cityName, setCityName] = useState('');
    const { providerID, BasketId, Cuboun } = route.params;
    const BasketDetailes = useSelector(state => state.BasketDetailes.BaketDetailes)
    const MinPriceCoast = useSelector(state => state.BasketDetailes.DeliverCoast)

    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null)
    const dispatch = useDispatch();
    const [Paied, setPaied] = useState('');
    const [mapRegion, setMapRegion] = useState({
        latitude: null,
        longitude: null,
        latitudeDelta,
        longitudeDelta
    });
    const [spinner, setSpinner] = useState(true);
    const [loading, setloading] = useState(false);


    const [selectedRadion, setSelectedRadio] = useState()
    const [data, setData] = useState([
        { id: 1, title: i18n.t('recievePay') },
        { id: 2, title: i18n.t('byWallet') },
        { id: 3, title: i18n.t('online') },
        // { id: 4, title: i18n.t('byMada') },
        // { id: 5, title: i18n.t('byApple') }
    ]);

    console.log(cityName);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setSpinner(true)
            setPaied('')
            setloading(false)
            setSelectedRadio()
            if (route.params?.cityName) {
                dispatch(BasketStoreDetailes(BasketId, token, lang, route.params.mapRegion.latitude, route.params.mapRegion.longitude)).then(() => dispatch(GetDliveryCost(providerID, route.params.mapRegion.latitude, route.params.mapRegion.longitude, token))).then(() => setSpinner(false))

                setCityName(route.params.cityName.substr(0, 40))
                setMapRegion(route.params.mapRegion)

            }

            dispatch(BasketStoreDetailes(BasketId, token, lang, mapRegion.latitude, mapRegion.longitude)).then(() => setSpinner(false))

        });


        return unsubscribe;
    }, [navigation, route.params?.cityName]);

    function PaidZero() {
        Alert.alert('Sooooooooooooon');
        setPaied('')

    }
    const handleChange = (id, index) => {
        setSelectedRadio(index);

        id == 1 ? setPaied('cash') :
            id == 2 ? setPaied('wallet') :
                id == 3 ? PaidZero()
                    :
                    setPaied('')
    }
    const _Valdiate = () => {
        let CityNameErr = cityName == '' ? i18n.t('addressRequired') : null
        let paiedErr = Paied == '' ? i18n.t('selectPaymentway') : null

        return CityNameErr || paiedErr


    }
    const SendConfirmaationOrders = () => {
        let val = _Valdiate()

        if (!val) {
            setloading(true)
            dispatch(CofirmOrder(token, providerID, mapRegion.latitude, mapRegion.longitude, cityName, Paied, Cuboun, lang, MinPriceCoast.delivery.min, navigation)).then(() => setloading(false))
        } else {

            setloading(false)

            ToasterNative(_Valdiate(), 'danger', 'bottom')

        }
    }


    return (
        <Container loading={spinner}>

            <Header navigation={navigation} label={i18n.t('orderDetails')} />
            <ScrollView style={{ flex: 1, backgroundColor: Colors.bg }} showsVerticalScrollIndicator={false}>

                <View style={{ marginTop: 50 }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>

                        <TouchableOpacity style={{ width: '100%', marginHorizontal: 10 }} onPress={() => { navigation.navigate('getLocation', { providerID, pathName: 'PaymentDetailes' }) }}>
                            <InputIcon
                                label={i18n.t('deliveryLocation')}
                                placeholder={i18n.t('selectLocation')}
                                inputStyle={{ borderRadius: 0, height: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                                styleCont={{ height: 40, marginTop: 20 }}
                                LabelStyle={{ bottom: 60, backgroundColor: 0, color: Colors.IconBlack, left: 0 }}
                                image={require('../../../assets/images/pingray.png')}
                                onPress={() => navigation.navigate('getLocation', { providerID, pathName: 'PaymentDetailes' })}
                                editable={false}
                                value={cityName ? cityName : ''}
                            />

                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <SText title={`+ ${i18n.t('ChooseSavedPlaces')}`} style={{ color: Colors.sky, fontSize: 14, alignSelf: 'flex-start', paddingHorizontal: 20, }} onPress={() => navigation.navigate('chooseSavedPlaces')} />

                    </View>


                    {
                        BasketDetailes && MinPriceCoast && MinPriceCoast.delivery && cityName ?
                            <View>
                                <View style={{ paddingVertical: 10, width, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', borderColor: '#DBDBDB', borderTopWidth: 1, borderBottomWidth: 1, marginTop: 20, backgroundColor: Colors.bg }}>
                                    <Text style={[{ fontFamily: 'flatMedium', marginLeft: 25, fontSize: 12 }]}>{i18n.t('delevierPrice')}</Text>
                                    <Text style={{ fontFamily: 'flatMedium', marginRight: 25, fontSize: 12 }}> {MinPriceCoast.delivery && MinPriceCoast.delivery.min}{i18n.t('RS')}</Text>
                                </View>


                                <View style={{ paddingVertical: 10, width, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, borderColor: '#DBDBDB', borderBottomWidth: 1, backgroundColor: Colors.bg }}>
                                    <Text style={[{ fontFamily: 'flatMedium', marginLeft: 25, }]}>{i18n.t('sum')}</Text>
                                    <Text style={{ fontFamily: 'flatMedium', marginRight: 25 }}> {MinPriceCoast && MinPriceCoast.delivery && (BasketDetailes.prices.total) + (MinPriceCoast.delivery.min)}{i18n.t('RS')}</Text>
                                </View>


                            </View>
                            :
                            null
                    }

                    <Text style={[styles.sText, { marginTop: 30, alignSelf: 'flex-start', marginHorizontal: 20, fontSize: 14 }]}>{i18n.t('selectPayment')} : </Text>

                    <FlatList data={data}
                        keyExtractor={(item) => (item.id).toString()}
                        renderItem={({ item, index }) => {
                            return (
                                <View>
                                    <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: width * .04, }}>
                                        <TouchableOpacity onPress={() => handleChange(item.id, index)} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
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
                                            <Text style={[styles.sText, { color: selectedRadion === index ? Colors.sky : Colors.fontNormal, left: 8 }]}>{item.title}</Text>
                                        </TouchableOpacity>

                                    </View>

                                </View>

                            )
                        }} />
                </View>

                <BTN title={i18n.t('confirm')} spinner={loading} onPress={SendConfirmaationOrders} ContainerStyle={{ margin: 20, borderRadius: 10, }} TextStyle={{ fontSize: 18 }} />

            </ScrollView>
        </Container>


    )
}

const styles = StyleSheet.create({


    Text: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: 13,
        textAlign: 'center',
    },
    sText: {
        fontFamily: 'flatMedium',
        color: Colors.fontBold,
        fontSize: 12,
    },
})
export default PaymentDetailes
