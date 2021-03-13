import React, { useState, useEffect } from 'react'
import BTN from '../../common/BTN'
import {
    ScrollView,
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Text,
    I18nManager,
    ActivityIndicator
} from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import Colors from '../../consts/Colors';
import { InputIcon } from '../../common/InputText';
import i18n from "../locale/i18n";
import { editPlace } from "../../actions";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../common/Header";


const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

const latitudeDelta = 0.0922;
const longitudeDelta = 0.0421;


function EditAddress({ navigation, route }) {

    const pathName = route.params.pathName;
    const id = route.params.id;
    const [Address, setAddress] = useState('');
    const [cityName, setCityName] = useState('');
    const [mapRegion, setMapRegion] = useState({
        latitude: null,
        longitude: null,
        latitudeDelta,
        longitudeDelta
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null);
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setIsSubmitted(false)
            if (pathName && pathName === 'myAddresses') {
                setAddress(route.params.name)
                setCityName(route.params.address)
                setMapRegion({
                    latitude: route.params.latitude,
                    longitude: route.params.longitude,
                    latitudeDelta,
                    longitudeDelta
                })

            }
            else {
                if (route.params?.cityName) {
                    setCityName(route.params.cityName.substr(0, 40))
                    setMapRegion(route.params.mapRegion)

                }
            }

        });


        return unsubscribe;
    }, [navigation, route.params?.cityName, route.params]);

    function renderConfirm() {
        if (isSubmitted) {
            return (
                <View style={[{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }]}>
                    <ActivityIndicator size="large" color={Colors.sky} style={{ alignSelf: 'center' }} />
                </View>
            )
        }

        if (cityName && Address && mapRegion.longitude && mapRegion.longitude) {
            return (
                <BTN title={i18n.t('edit')} onPress={() => addConfirm()} ContainerStyle={{ marginTop: 30, borderRadius: 30 }} TextStyle={{ fontSize: 13 }} />

            );
        }

        return (
            <BTN title={i18n.t('edit')} ContainerStyle={{ marginTop: 30, borderRadius: 30, backgroundColor: '#ccc' }} TextStyle={{ fontSize: 13 }} />

        );
    }

    function addConfirm() {
        setIsSubmitted(true)
        dispatch(editPlace(lang, token, id, mapRegion.latitude, mapRegion.longitude, cityName, Address, navigation)).then(() => {
            setIsSubmitted(false)
            setAddress('')
            setCityName('')
            setMapRegion({
                latitude: null,
                longitude: null,
                latitudeDelta,
                longitudeDelta
            })
        })
    }


    return (
        <ScrollView style={{ flex: 1 }}>

            <Header navigation={navigation} label={i18n.t('editAddress')} />

            <InputIcon
                label={i18n.t('addressName')}
                placeholder={i18n.t('homeComp')}
                value={Address}
                onChangeText={(e) => setAddress(e)}
                inputStyle={{ borderRadius: 30, height: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                styleCont={{ height: 40, marginTop: 80 }}
                LabelStyle={{ bottom: 60, backgroundColor: 0, left: 0 }}
            />

            <TouchableOpacity onPress={() => navigation.navigate('getLocation', { pathName: 'EditAddress', latitude: mapRegion.latitude, longitude: mapRegion.longitude })}>
                <InputIcon
                    label={i18n.t('deliveryLocation')}
                    placeholder={i18n.t('selectLocation')}
                    inputStyle={{ borderRadius: 30, height: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                    styleCont={{ height: 40, marginTop: 50 }}
                    LabelStyle={{ bottom: 60, backgroundColor: 0, left: 0 }}
                    image={require('../../../assets/images/pingray.png')}
                    onPress={() => navigation.navigate('getLocation', { pathName: 'EditAddress', latitude: mapRegion.latitude, longitude: mapRegion.longitude })}
                    editable={false}
                    value={cityName ? cityName : ''}
                />
            </TouchableOpacity>

            {renderConfirm()}

        </ScrollView>
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
        top: width * .19,

    },
    ImgsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: height * .03
    }
})
export default EditAddress
