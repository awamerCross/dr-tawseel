import React, { useEffect } from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, ActivityIndicator, I18nManager, Platform } from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import Colors from '../../consts/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { getPolicy } from '../../actions';
import style from "../../../assets/styles";
import i18n from '../locale/i18n'
import Header from "../../common/Header";


const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';


function Politics({ navigation, route }) {
    const lang = useSelector(state => state.lang.lang);
    const policy = useSelector(state => state.policy.policy);
    const loader = useSelector(state => state.intro.loader);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPolicy(lang));
    }, []);

    function renderLoader() {
        if (loader === false) {
            return (
                <View style={[style.loading, { height: '100%', alignSelf: 'center' }]}>
                    <ActivityIndicator size="large" color={Colors.sky} style={{ alignSelf: 'center' }} />
                </View>
            );
        }
    }

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Image source={require('../../../assets/images/bluBack.png')} style={[styles.BigImg, { transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }], }]} resizeMode='contain' />
                <View style={styles.wrap}>
                    {
                        route && route.params && route.params.typeName === 'Register' ?
                            null
                            :
                            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                                <Image source={require('../../../assets/images/menue.png')} style={[styles.MenueImg, { marginBottom: width * .04, transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }] }]} />
                            </TouchableOpacity>
                    }

                </View>

                <Text style={styles.Text}> {i18n.t("policytext")}</Text>

                <View style={{ flexDirection: 'row', }}>

                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('../../../assets/images/arrBlack.png')} resizeMode='contain' style={[styles.MenueImg, { marginHorizontal: width * .05, top: 40, transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }] }]} />
                    </TouchableOpacity>
                </View>

            </View>
            {renderLoader()}
            <View style={styles.ImgsContainer}>
                <Image source={require('../../../assets/images/logo_black.png')} style={styles.images} resizeMode='contain' />
                <Text style={styles.lText}>{policy ? policy.page : ''} </Text>
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    BigImg: {
        height: height * .14,
        width: width * .23,
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
    ImgsContainer: {
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: height * .03
    },
    images: {
        width: width * .4,
        height: width * .4,


    },
    stext: {
        fontFamily: 'flatMedium',
        color: Colors.sky,
        fontSize: width * .05,
        marginTop: height * .09
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.bg,
        marginTop: isIOS ? 20 : 0
        // marginTop: isIOS ? 20 : 0
    },
    BigImg: {
        left: -13,
        top: -10,
        height: 90,
        width: 90,
    },
    MenueImg: {
        width: 20,
        height: 20,
    },
    wrap: {
        position: 'absolute',
        marginHorizontal: 25,
        bottom: width * .04
    },
    Text: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: width * .04,
        textAlign: 'center',
        top: 40
    },
    lText: { marginTop: 20, paddingHorizontal: 15, fontFamily: 'flatRegular', lineHeight: 20, color: Colors.fontNormal },

})
export default Politics
