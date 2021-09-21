import React, { useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, AsyncStorage } from 'react-native'
import i18n from "../locale/i18n";
import Colors from '../../consts/Colors';
import { useDispatch } from 'react-redux';
import { chooseLang } from '../../actions';
import { useSelector } from "react-redux";
import { set } from "react-native-reanimated";

function ChooseLang({ navigation }) {


    const [lan, setLang] = useState('ar')

    const language = useSelector(state => state.lang);

    const dispatch = useDispatch()

    function changeLang(lang) {
        if (language !== lang) {
            dispatch(chooseLang(lang));
        }
    }

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', }} >
                <Image source={require('../../../assets/images/logo_black.png')} style={{ height: 150, width: 150 }} resizeMode='contain' />
                <Text style={{ fontFamily: 'flatMedium', }}>اختر اللغة المفضلة لديك</Text>

                <TouchableOpacity onPress={() => changeLang('ar')} style={{ backgroundColor: '#eee', borderWidth: 1, borderColor: lan === 'ar' ? Colors.sky : '#F7F7F7', width: 200, height: 150, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginTop: 20, flexDirection: 'column' }}>
                    <Image source={require('../../../assets/images/saudi_arabia.png')} style={{ height: 100, width: 100 }} resizeMode='contain' />
                    <Text style={{ fontFamily: 'flatMedium', }}>العربيه</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => changeLang('en')} style={{ backgroundColor: '#eee', borderWidth: 1, borderColor: lan === 'en' ? Colors.sky : '#F7F7F7', width: 200, height: 150, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginTop: 20, flexDirection: 'column' }}>
                    <Image source={require('../../../assets/images/english_language.png')} style={{ height: 100, width: 100 }} resizeMode='contain' />
                    <Text style={{ fontFamily: 'flatMedium', }}>English</Text>
                </TouchableOpacity>

            </View>
        </View>

    )
}

export default ChooseLang