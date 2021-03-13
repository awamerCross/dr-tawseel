import axios from "axios";
import CONST from "../consts";
import { Toast } from 'native-base'
import { ToasterNative } from "../common/ToasterNatrive";


export const acceptOffer = (lang, token, id, orderID, navigation) => {
    return async (dispatch) => {
        await axios({
            url: CONST.url + 'accept/offer',
            method: 'POST',
            params: { lang },
            data: { id },
            headers: { Authorization: 'Bearer ' + token, },
        }).then(response => {

            if (response.data.success) {

                navigation.navigate('OrderDetailes', { orderId: orderID })

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
            });
        }).catch(err => ToasterNative(err.message, 'danger', 'bottom'))
    }
};


