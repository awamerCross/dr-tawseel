import axios from "axios";
import CONST from "../consts";


export const GetBasketLength = (lang, token) => {
    return async (dispatch) => {
        axios({
            url: CONST.url + 'cart-count',
            method: 'POST',
            params: { lang },
            headers: { Authorization: 'Bearer ' + token, },
        }).then(response => {
            dispatch({ type: 'GetBasketLength', payload: response.data });
        })
    }
};
