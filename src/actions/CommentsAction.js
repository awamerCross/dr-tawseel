import axios from "axios";
import CONST from "../consts";
import { Toast } from 'native-base'


export const getDelegateComments = (lang, token) => {
    return async (dispatch) => {
        await axios({
            url: CONST.url + 'comments',
            method: 'POST',
            params: { lang },
            headers: { Authorization: 'Bearer ' + token, },
        }).then(response => {
            dispatch({ type: 'getDelegateComments', payload: response.data });
        });
    }
};


