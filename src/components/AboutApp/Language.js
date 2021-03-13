import React, { useState } from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, I18nManager } from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import Colors from '../../consts/Colors';
import i18n from "../locale/i18n";
import {useDispatch, useSelector} from "react-redux";
import { chooseLang } from '../../actions';
import Header from "../../common/Header";





const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')
function Language({ navigation }) {

    const lang                  = useSelector(state => state.lang.lang);

    const dispatch = useDispatch()
    function onChooseLang(language){
        if(language !== lang){
            dispatch(chooseLang(language))
        }
    }


    return (
        <View style={{ flex: 1 }}>
            <Header navigation={navigation} label={i18n.t('language')} />
            <ScrollView style={{ flex: 1 }}>

                <View style={{ flexDirection: 'row', marginTop: width * .2, paddingStart: width * .05 }}>
                    <Image source={require('../../../assets/images/Lang.png')} style={{ width: 30, height: 30 }} />
                    <View style={{ flexDirection: 'column' , alignItems:'flex-start'}}>
                        <Text style={styles.stext}>{i18n.t('language')}</Text>
                        <Text style={[styles.stext, { fontFamily: 'flatRegular' }]}>{i18n.t('selectLang')}</Text>
                    </View>
                </View>
                <View style={{ marginTop: width * .1, }}>
                    <TouchableOpacity onPress={() => onChooseLang('ar')} style={{ backgroundColor: '#FCFAFA', width }}>
                        <Text style={{ padding: 20, color: lang === 'ar' ? '#FDCD52' :  Colors.fontNormal, fontFamily: 'flatMedium', alignSelf:'flex-start'}}>عربي</Text>
                    </TouchableOpacity>
                    <View style={{ width, backgroundColor: '#eaeaea', height: 2 }}></View>
                    <TouchableOpacity onPress={() => onChooseLang('en')} style={{ backgroundColor: '#FCFAFA', width, }}>
                        <Text style={{ padding: 20, color: lang === 'en' ? '#FDCD52' :  Colors.fontNormal, fontFamily: 'flatMedium', alignSelf:'flex-start' }}>English</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView >
        </View>

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
})
export default Language