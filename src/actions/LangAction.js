import { I18nManager, } from 'react-native';
import i18n from '../components/locale/i18n'
import * as Updates from 'expo-updates';
import AsyncStorage from "@react-native-async-storage/async-storage";


export const chooseLang = lang => {

    if (lang === 'en') {
        I18nManager.forceRTL(false);
    } else {
        I18nManager.forceRTL(true);
    }

    i18n.locale = lang;
    setLang(lang);

    return {
        type: 'chooseLang',
        payload: lang
    }
};

const setLang = async lang => {
    await AsyncStorage.setItem('lang', lang).then(() => {

        Updates.reloadAsync()
    });
};


export const SwiperBegines = type => {
    return async (dispatch) => {
        await dispatch({ type: 'SwiperBegines', data: type });

    }
}



export const ChooseUserCaptain = type => {
    return async (dispatch) => {
        await dispatch({ type: 'ChooseUserCaptain', data: type });

    }
}