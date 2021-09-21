import I18n from 'ex-react-native-i18n';
import AsyncStorage from "@react-native-async-storage/async-storage";
import ar from './ar';
import en from './en';

I18n.fallbacks = true;

I18n.translations = {
    en,
    ar
};

I18n.locale = 'ar';

AsyncStorage.getItem('lang').then(lang => {
    I18n.locale = lang;
});

export default I18n;



// import I18n from "i18n-js";
// import { AsyncStorage } from "react-native";
// import ar from "./ar";
// import en from "./en";
//
// export const getLocale = async () => {
//     I18n.locale = "ar";
//     const lang = await AsyncStorage.getItem("lang");
//     return (I18n.locale = lang);
// };
//
// getLocale()
//     .then((lan) => console.log(lan))
//     .catch((e) => console.log("no lang", e));
//
//
// I18n.fallbacks = true;
// I18n.translations = { en, ar };
//
// export default I18n;


