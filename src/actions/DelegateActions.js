import axios from "axios";
import CONST from "../consts";
import { Toast } from 'native-base'
import { ToasterNative } from "../common/ToasterNatrive";

export const getDelegateOrders = (lang, token, status, latitude, longitude) => {
    return async (dispatch) => {
        await axios({
            url: CONST.url + 'delegates/orders',
            method: 'POST',
            params: { lang },
            data: { status, latitude, longitude },
            headers: { Authorization: 'Bearer ' + token, },
        }).then(response => {
            dispatch({ type: 'getDelegateOrders', payload: response.data });
        });
    }
};


export const GetDeligate = (lang, token,) => {
    return async (dispatch) => {
        await axios({
            url: CONST.url + 'delegate-availability',
            method: 'POST',
            params: { lang },
            headers: { Authorization: 'Bearer ' + token, },
        }).then(response => {

            ToasterNative(response.data.message, 'success', 'bottom')
        });
    }
};


export const delegateUpdateOrder = (lang, token, id, customer_paid = null) => {
    return async (dispatch) => {
        await axios({
            url: CONST.url + 'delegates/update-orders',
            method: 'POST',
            params: { lang },
            data: { id, customer_paid },
            headers: { Authorization: 'Bearer ' + token, },
        }).then(response => {
            if (!response.data.success) {
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
            }
        });
    }
};

export const sendOffer = (lang, token, order_id, price) => {
    return async (dispatch) => {
        await axios({
            url: CONST.url + 'delegates/send/offer',
            method: 'POST',
            params: { lang },
            data: { order_id, price },
            headers: { Authorization: 'Bearer ' + token, },
        }).then(response => {
            ToasterNative(response.data.message, response.data.success ? "success" : "danger", 'bottom')
        });
    }
};

export const removeOffer = (lang, token, order_id) => {
    return async (dispatch) => {
        await axios({
            url: CONST.url + 'delegates/cancel/offer',
            method: 'POST',
            params: { lang },
            data: { order_id },
            headers: { Authorization: 'Bearer ' + token, },
        }).then(response => {
            ToasterNative(response.data.message, response.data.success ? "success" : "danger", 'bottom')

        });
    }
};

export const sendBill = (lang, token, order_id, price, image) => {
    return async (dispatch) => {
        await axios({
            url: CONST.url + 'delegates/create/bill',
            method: 'POST',
            params: { lang },
            data: { order_id, price, image },
            headers: { Authorization: 'Bearer ' + token, },
        }).then(response => {

        });
    }
};

