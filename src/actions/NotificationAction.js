import axios from "axios";
import CONST from "../consts";
import { Toast } from 'native-base'


export const getNotifications = (lang, token) => {
    return async (dispatch) => {
        await Notifications(lang, token, dispatch)
    }
};


export const deleteNoti = (lang, id, token) => {
    return (dispatch) => {
        axios({
            url: CONST.url + 'delete-notification',
            method: 'POST',
            params: { lang },
            headers: { Authorization: 'Bearer ' + token, },
            data: { id }
        }).then(response => {
            Notifications(lang, token, dispatch);
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
        });

    }
};


const Notifications = async (lang, token, dispatch) => {
    await axios({
        url: CONST.url + 'notifications',
        method: 'GET',
        params: { lang },
        headers: { Authorization: 'Bearer ' + token, },
    }).then(response => {
        dispatch({ type: 'getNotifications', payload: response.data });
    });
};



