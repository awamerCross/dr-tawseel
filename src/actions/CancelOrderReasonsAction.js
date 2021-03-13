import axios from "axios";
import CONST from "../consts";

export const getCancelReasons = (lang) => {
    return async (dispatch) => {

        await axios({
            url: CONST.url + 'cancel-order-reasons',
            method: 'GET',
            params: { lang },
        }).then(response => {
            dispatch({ type: 'getCancelReasons', payload: response.data });
        });
    }
};
