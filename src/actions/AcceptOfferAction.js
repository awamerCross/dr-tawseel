import axios from "axios";
import CONST from "../consts";
import { Toast } from 'native-base'
import { ToasterNative } from "../common/ToasterNatrive";


export const acceptOffer = (lang, token, id, orderID, navigation, user) => {
    return async (dispatch) => {
        await axios({
            url: CONST.url + 'accept/offer',
            method: 'POST',
            params: { lang },
            data: { id },
            headers: { Authorization: 'Bearer ' + token, },
        }).then(response => {

            if (response.data.success) {
                const room = response.data.data;
                navigation.navigate('OrderChatting', { receiver: user.user_type == 2 ? room.order.delegate : room.order.user, sender: user.user_type == 2 ? room.order.user : room.order.delegate, orderDetails: room.order })
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
        }).catch(err => console.log(err))
    }
};


