import axios from "axios";
import CONST from "../consts";
import { Toast } from 'native-base'
import { ToasterNative } from "../common/ToasterNatrive";

export const getRooms = (lang, token,) => {
    return async (dispatch) => {
        await axios({
            url: CONST.url + 'chat',
            method: 'GET',
            params: { lang },
            headers: { Authorization: 'Bearer ' + token, },
        }).then(response => {
            dispatch({ type: 'getRooms', payload: response.data });
        }).catch(err => onsole.log(err))
    }
};

export const getInbox = (lang, token, room) => {
    return async (dispatch) => {
        await axios({
            url: CONST.url + 'inbox',
            method: 'POST',
            params: { lang },
            data: { room },
            headers: { Authorization: 'Bearer ' + token },
        }).then(response => {
            dispatch({ type: 'getInbox', payload: response.data });
        }).catch(err => onsole.log(err))
    }
};

export const sendNewMessage = (lang, token, message, order_id) => {
    return async (dispatch) => {
        await axios({
            url: CONST.url + 'send-message',
            method: 'POST',
            params: { lang },
            data: { message, order_id },
            headers: { Authorization: 'Bearer ' + token },
        }).then(response => {

        }).catch(err => onsole.log(err))
    }
};

