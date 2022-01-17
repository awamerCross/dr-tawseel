import React, { useState, useEffect } from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, I18nManager, Platform } from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import Colors from '../../consts/Colors';
import { InputIcon } from '../../common/InputText';
import Header from '../../common/Header';
import i18n from "../locale/i18n";
import { useSelector, useDispatch } from 'react-redux';
import { Providerdetailes } from '../../actions';
import Container from '../../common/Container';
import StarRating from "react-native-star-rating";
import { _renderRows } from '../../common/LoaderImage';


const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')


function Department({ navigation, route }) {

    const { categoryId, mapRegion } = route.params;
    const [name, setname] = useState('')
    const [label, setLabel] = useState('')

    const ProviderDetaile = useSelector(state => state.categories.Detailes ? state.categories.Detailes : []);
    const lang = useSelector(state => state.lang.lang);
    const [spinner, setSpinner] = useState(true);
    const dispatch = useDispatch();
    let loadingAnimated = []


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setname('');

            setSpinner(true)
            dispatch(Providerdetailes(lang, categoryId, label, mapRegion.latitude, mapRegion.longitude)).then(() => setSpinner(false))
        })
        return unsubscribe
    }, [navigation, route]);

    const handleChange = (e) => {
        setname(e);

        if (e == '') {
            dispatch(Providerdetailes(lang, categoryId, e, mapRegion.latitude, mapRegion.longitude))
        }
        setTimeout(() => dispatch(Providerdetailes(lang, categoryId, e, mapRegion.latitude, mapRegion.longitude)), 0)
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bg }}>
            <Header navigation={navigation} label={i18n.t('category')} />

            <ScrollView style={{ flex: 1 }}>

                <InputIcon
                    placeholder={i18n.t('search')}
                    inputStyle={{ borderRadius: 30, backgroundColor: Colors.bg, borderColor: '#eaeaea' }}
                    styleCont={{ height: 45 }}
                    value={name}
                    onChangeText={(e) => handleChange(e)}
                    image={require('../../../assets/images/search.png')}
                    LabelStyle={{ backgroundColor: 'transparent' }}
                />


                {
                    spinner ?
                        _renderRows(loadingAnimated, 5, '2rows', width * .89, 100, { flexDirection: 'column', }, { borderRadius: 5, })
                        :
                        ProviderDetaile &&
                            ProviderDetaile.length == 0 ?
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 160, flex: 1 }}>
                                <Text style={[styles.sText, { alignSelf: 'center', fontSize: 16, }]}>{i18n.t('adddepartment')}</Text>
                            </View>


                            :
                            ProviderDetaile.map((item, i) => {
                                return (


                                    <TouchableOpacity onPress={() => navigation.navigate('RestaurantDepartment', { Resid: item.id, mapRegion })} key={i}>
                                        <View style={styles.card}>
                                            <View style={{ flexDirection: 'row', padding: Platform.isPad ? 30 : 10, alignItems: 'center', }}>
                                                <Image source={{ uri: item.avatar }} style={styles.ImgCard} />
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                                                    <View style={{ flexDirection: 'column', marginStart: 10 }}>
                                                        <Text style={[styles.sText, { alignSelf: 'flex-start', fontSize: 12 }]}>{item.name}</Text>
                                                        <Text style={[styles.sText, { alignSelf: 'flex-start', fontFamily: 'flatLight', marginTop: 10 }]}>{item.available == 0 ? i18n.t('close') : i18n.t('open')}</Text>

                                                        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginTop: 10 }}>
                                                            <Image source={require('../../../assets/images/pinblue.png')} style={styles.iconImg} resizeMode='contain' />
                                                            <Text style={[styles.yText, { alignSelf: 'flex-start', writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr', lineHeight: 22 }]}>{i18n.t('distance')} : </Text>
                                                            <Text style={[styles.yText, { alignSelf: 'flex-start', lineHeight: 22, color: Colors.fontBold }]}>{item.distance}</Text>

                                                        </View>
                                                    </View>

                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
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
                                                </View>


                                            </View>

                                        </View>
                                    </TouchableOpacity>
                                )
                            })

                }

            </ScrollView>

        </View >


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
        fontSize: 11,
        opacity: .6
    },
    card: {
        backgroundColor: Colors.bg,
        borderRadius: 5,
        flex: 1,

        elevation: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    ImgCard: {
        width: Platform.isPad ? 100 : 80,
        height: Platform.isPad ? 100 : 80,
        borderRadius: 10
    }
})
export default Department
