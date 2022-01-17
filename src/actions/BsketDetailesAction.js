import axios from "axios";
import CONST from "../consts";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToasterNative } from "../common/ToasterNatrive";


export const BasketStoreDetailes = (id, token, lang, coupon, latitude, longitude, navigation) => {

    return async (dispatch) => {

        await AsyncStorage.getItem('deviceID').then(async deviceId => {
            await axios({
                url: `${CONST.url}cart-details`,
                method: 'POST',
                data: { id, latitude, longitude, device_id: deviceId, coupon },
                headers: token ? { Authorization: 'Bearer ' + token, } : null,
                params: { lang }
            }).then(response => {

                if ((response.data.data.products).length <= 0) {
                    navigation.navigate('Basket')
                }
                else {
                    dispatch({ type: 'BasketDetailes', data: response.data, Loader: response.data.success });

                }



            }).catch(err => console.log(err))
        })
    }
}




export const DeleteBasketStoreCart = (cart_id, id, token,) => {

    return async (dispatch) => {
        await AsyncStorage.getItem('deviceID').then(async deviceId => {
            await axios({
                url: `${CONST.url}delete-cart-item`,
                method: 'POST',
                data: { cart_id, id, device_id: deviceId },
                headers: token ? { Authorization: 'Bearer ' + token, } : null,
            }).then(response => {
                ToasterNative(response.data.message, 'danger', 'bottom')

            }).catch(err => console.log(err))
        })

    }
}

export const CalculateCountProduct = (cart_id, id, token, type) => {

    return async (dispatch) => {
        await AsyncStorage.getItem('deviceID').then(async deviceId => {
            await axios({
                url: `${CONST.url}change-quantity`,
                method: 'POST',
                data: { cart_id, id, type, device_id: deviceId },
                headers: token ? { Authorization: 'Bearer ' + token, } : null,
            }).then(response => {
            }).catch(err => console.log(err))
        })
    }
}


export const ValdiateCoupon = (token, coupon) => {
    return async (dispatch) => {
        await axios({
            url: `${CONST.url}validate/coupon`,
            method: 'POST',
            data: { coupon },
            headers: { Authorization: 'Bearer ' + token, },
        }).then(response => {

            ToasterNative(response.data.message, response.data.success ? "success" : 'danger', 'bottom')





        }).catch(err => console.log(err))

    }

}

export const GetDliveryCost = (id, latitude, longitude, token) => {

    return async (dispatch) => {
        await AsyncStorage.getItem('deviceID').then(async deviceId => {
            await axios({
                url: `${CONST.url}delivery-price`,
                method: 'POST',
                data: { id, latitude, longitude, device_id: deviceId },
                headers: token ? { Authorization: 'Bearer ' + token, } : null,
            }).then(response => {
                dispatch({ type: 'GetDliveryCost', data: response.data });
            }).catch(err => console.log(err))
        })
    }
}


export const GetSavedLoacation = (token) => {
    return async (dispatch) => {
        await axios({
            url: `${CONST.url}places`,
            method: 'POST',
            headers: { Authorization: 'Bearer ' + token, },
        }).then(response => {
            dispatch({ type: 'GetSavedLoacation', data: response.data });
        }).catch(err => console.log(err))

    }

}

export const CofirmOrder = (token, provider_id, latitude, longitude, address, payment_type, coupon, lang, shipping_price, navigation) => {

    return async (dispatch) => {
        await axios({
            url: `${CONST.url}send-order`,
            method: 'POST',
            data: { provider_id, latitude, longitude, address, payment_type, coupon, shipping_price },
            headers: { Authorization: 'Bearer ' + token, },
            params: { lang },
        }).then(response => {
            if (response.data.success) {
                dispatch({ type: 'CofirmOrder', data: response.data });
                navigation.navigate('BasketSuccessOrder', { orderId: response.data.data.id })
            }
            ToasterNative(response.data.message, response.data.success ? "success" : 'danger', 'bottom')

        }).catch(err => console.log(err))

    }

}