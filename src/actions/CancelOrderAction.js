import axios from "axios";
import CONST from "../consts";
import { Toast } from 'native-base'
import { ToasterNative } from "../common/ToasterNatrive";


export const cancelOrder = (lang, token, cancel_order_reason_id, id) => {
    return async (dispatch) => {
        await axios({
            url: CONST.url + 'cancel/order/chat',
            method: 'POST',
            params: { lang },
            data: { cancel_order_reason_id, id },
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
            })
        }).catch(err => onsole.log(err))
    }
};


