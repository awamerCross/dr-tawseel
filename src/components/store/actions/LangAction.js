import { I18nManager, AsyncStorage } from "react-native";
import i18n from "../../locale/i18n";
import Expo, { Updates } from "expo";

export const chooseLang = "choose_Lang";

export const changeLanguage = (lang, direction) => {
    return async (dispatch) => {
        try {
            await AsyncStorage.setItem("lang", lang, () =>
                AsyncStorage.setItem("direction", direction)
            );

            await AsyncStorage.getItem("direction", (err, res) => {
                if (res === "RTL") {
                    I18nManager.forceRTL(true);
                } else {
                    I18nManager.forceRTL(false);
                }
            });


            dispatch({
                type: chooseLang,
                lang,
                direction,
            }).then(await Updates.reload());
        } catch (e) {
            console.log("chang lang err", e);
        }
    };
};
