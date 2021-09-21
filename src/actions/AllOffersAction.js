import axios from "axios";
import CONST from "../consts";
import { Toast } from 'native-base'
import { ToasterNative } from "../common/ToasterNatrive";


export const getAllOffers = (lang, token, id) => {
    return async (dispatch) => {
        await axios({
            url: CONST.url + 'order/offers',
            method: 'POST',
            params: { lang },
            data: { id },
            headers: { Authorization: 'Bearer ' + token, },
        }).then(response => {
            dispatch({ type: 'getAllOffers', payload: response.data });
        }).catch(err => onsole.log(err))
    }
};


