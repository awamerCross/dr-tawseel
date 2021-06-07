import axios from "axios";
import CONST from "../consts";
import { Toast } from 'native-base'
import { ToasterNative } from "../common/ToasterNatrive";


export const sendComp = (lang, token, username, email, subject, description, navigation) => {
    return async (dispatch) => {
        await axios({
            url: CONST.url + 'send-complaint',
            method: 'POST',
            params: { lang },
            data: { username, email, subject, description },
            headers: { Authorization: 'Bearer ' + token, },
        }).then(response => {

            if (response.data.success) {
                navigation.navigate('GoHome')

            }
            Toast.show({
                text: response.data.message,
                type: response.data.success ? "success" : "danger",
                duration: 3000,
                textStyle: {
                    color: "white",
                    fontFamily: 'flatMedium',
                    textAlign: 'center'
                }
            })
        }).catch(err => ToasterNative(err.message, 'danger', 'bottom'))
    }
};


