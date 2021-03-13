import axios from "axios";
import CONST from "../consts";
import { Toast } from 'native-base'


export const contactUs = (lang, token, name , email , message ) => {
    return async (dispatch) => {
        await axios({
            url: CONST.url + 'contact-us',
            method: 'POST',
            params: { lang },
            data: { name , email , message},
            headers: { Authorization: 'Bearer ' + token, },
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


