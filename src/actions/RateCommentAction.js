import axios from "axios";
import CONST from "../consts";
import { Toast } from 'native-base'
import { ToasterNative } from "../common/ToasterNatrive";


export const sendRate = (lang, token, rated_id, rate, comment) => {
    return async (dispatch) => {
        await axios({
            url: CONST.url + 'rateComment',
            method: 'POST',
            params: { lang },
            data: { rated_id, rate, comment },
            headers: { Authorization: 'Bearer ' + token, },
        }).then(response => {
            Toast.show({
                text: response.data.message,
                type: response.data.success ? "success" : "danger",
                duration: 3000,
                textStyle: {
                    color: "white",
                    fontFamily: 'flatMedium',
                    textAlign: 'center'
                }
            });
        }).catch(err => console.log(err))
    }
};


