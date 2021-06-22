import React, { useEffect, useState } from 'react'
import { ScrollView, View, Image, I18nManager, StyleSheet, Dimensions, Text } from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import Colors from '../../consts/Colors';
import BTN from '../../common/BTN';
import Header from '../../common/Header';
import i18n from "../locale/i18n";
import StarRating from "react-native-star-rating";
import { useSelector, useDispatch } from 'react-redux';
import { getPlaceDetails } from '../../actions';
import Container from '../../common/Container';
import { useIsFocused } from '@react-navigation/native';


const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

function OrderYourStore({ navigation, route }) {
    const { placeId, mapRegion } = route.params;
    const lang = useSelector(state => state.lang.lang);
    const place = useSelector(state => state.categories.placeDetails);
    const dispatch = useDispatch();
    const [spinner, setSpinner] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            setSpinner(true)
            dispatch(getPlaceDetails(lang, placeId, mapRegion.latitude, mapRegion.longitude)).then(() => setSpinner(false))
        }


    }, [isFocused]);

    return (
        <View style={{ flex: 1 }}>
            <Header navigation={navigation} />
            <Container loading={spinner}>
                <ScrollView style={{ flex: 1, backgroundColor: Colors.bg, }}>
                    {
                        place ?
                            <View style={styles.container}>
                                <View style={styles.ImgText}>
                                    <Image source={{ uri: place.icon }} style={styles.ResImgNm} resizeMode='contain' />
                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                        <Text style={[styles.sText,]}>{place.name}</Text>
                                        <View style={[styles.rowDirect,]}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <StarRating
                                                    disabled={false}
                                                    maxStars={5}
                                                    rating={place.rating}
                                                    fullStarColor={'#fec104'}
                                                    starSize={13}
                                                    starStyle={{ marginHorizontal: 1 }}
                                                />
                                                <Text style={{ color: Colors.fontNormal, fontFamily: 'flatRegular', fontSize: 12, textAlign: 'right' }}>({place.reviews})</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>


                                <View style={styles.dotted} />

                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <Image source={require('../../../assets/images/pinblue.png')} style={styles.iconImg} resizeMode='contain' />
                                    <Text style={[styles.yText, { alignSelf: 'flex-start', writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr', paddingHorizontal: 10 }]}>{place.distance}</Text>
                                </View>
                                <View style={[styles.dotted, { marginVertical: 0, marginTop: 10 }]} />

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 15 }}>
                                    <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                                        <Image source={require('../../../assets/images/pinblue.png')} style={[styles.iconImg, { marginVertical: 0 }]} resizeMode='contain' />
                                        <Text style={[styles.yText, { marginTop: 0 }]}> {place.opening_hours ? i18n.t('open') : i18n.t('close')}</Text>
                                    </View>
                                </View>

                                {
                                    place.hours ?
                                        place.hours.map((hour, i) => (
                                            <Text key={i} style={{ fontFamily: 'flatMedium', color: Colors.fontNormal, fontSize: 13, alignSelf: 'flex-start', margin: 10 }}>{hour}</Text>
                                        )) : null
                                }

                                <View style={styles.dotted} />
                            </View> : null
                    }

                    <BTN title={i18n.t('cotinue')} onPress={() => navigation.navigate('YourOrder', { place })} ContainerStyle={{ marginTop: 15, borderRadius: 20, marginBottom: 20, paddingVertical: 10 }} TextStyle={{ fontSize: 16 }} />
                </ScrollView>
            </Container>

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
        fontSize: width * .04,
        textAlign: 'center',
        top: width * .19
    },
    sText: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: 14

    },
    BText: {
        fontFamily: 'flatMedium',
        color: Colors.fontBold,
        fontSize: 14,
    },
    MText: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: 12,
        alignSelf: 'center',
    },
    container: {
        marginTop: 20,
        marginStart: 5
    },
    ImgText: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ResImgNm: {
        width: 50,
        height: 50,
        borderRadius: 50
    },
    rowDirect: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    starImg: {
        width: width * .03,
        height: width * .03,
        marginHorizontal: 1,
        marginVertical: 5

    },
    dotted: {
        width: width * .87, height: 1,
        backgroundColor: '#B4B4B4',
        marginVertical: 15,
    },
    iconImg: {
        width: 12,
        height: 12,
        marginHorizontal: 1,
        marginVertical: 5

    },
    yText: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: 13,
        marginTop: width * .01,
        lineHeight: 22
    },
})
export default OrderYourStore
