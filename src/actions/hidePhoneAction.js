import axios from "axios";
import CONST from "../consts";
import { Toast } from 'native-base'


export const hidePhone = (token, lang) => {
    return async (dispatch) => {
        await axios({
            url: CONST.url + 'hide-phone',
            method: 'GET',
            headers: { Authorization: 'Bearer ' + token, },
            params: { lang }
        }).then(response => {

            Toast.show({
                text        : response.data.message,
                type        : response.data.success ? "success" : "danger",
                duration    : 3000,
                textStyle   : {
                    color: "white",
                    fontFamily: 'flatMedium',
                    textAlign: 'center'
                }
            });
        });
    }
};


