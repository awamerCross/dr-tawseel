import React, {useEffect, useState} from 'react'
import {ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, ActivityIndicator , I18nManager} from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import Colors from '../../consts/Colors';
import {useSelector, useDispatch} from 'react-redux';
import {getAboutApp} from '../../actions';
import style from "../../../assets/styles";
import I18n from '../locale/i18n'

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');


function AboutApp({ navigation }) {
	const lang          = useSelector(state => state.lang.lang);
	const aboutApp      = useSelector(state => state.aboutApp.aboutApp);
	const loader        = useSelector(state => state.intro.loader);
	const dispatch      = useDispatch();

	useEffect(() => {
		dispatch(getAboutApp(lang));
	}, []);


	function renderLoader(){
		if (loader === false){
			return(
				<View style={[style.loading, {height:'100%', alignSelf: 'center'}]}>
					<ActivityIndicator size="large" color={Colors.sky} style={{ alignSelf: 'center' }} />
				</View>
			);
		}
	}

    return (
        <ScrollView style={{ flex: 1 }}>
            { renderLoader() }
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                <Image source={require('../../../assets/images/bluBack.png')} style={[styles.BigImg , {transform : I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }],} ]} resizeMode='contain' />
                <View style={{ position: 'absolute', marginHorizontal: 30, bottom: width * .08 }}>
                    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                        <Image source={require('../../../assets/images/menue.png')} style={[styles.MenueImg , {transform : I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }],} ]} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
                <Text style={styles.Text}>{ I18n.t('aboutApp') }</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../../../assets/images/arrBlack.png')} style={[styles.MenueImg, { top: width * .16, marginHorizontal: width * .06 }]} />
                </TouchableOpacity>
            </View>
            <View style={styles.ImgsContainer}>
              <Image source={require('../../../assets/images/logo_black.png')} style={styles.images} resizeMode='contain' />
              <Text  style={styles.lText}> { aboutApp ? aboutApp.page : null } </Text>
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
    lText: { marginTop: 20, paddingHorizontal: 15, fontFamily: 'flatRegular', lineHeight: 20, color: Colors.fontNormal },

})
export default AboutApp
