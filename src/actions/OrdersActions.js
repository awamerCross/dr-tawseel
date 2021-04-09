import axios from "axios";
import CONST from "../consts";
import { Toast } from 'native-base'


export const specialOrder = (lang, token, latitude, longitude, address, latitude_to, longitude_to, address_to, time, details, images, payment_type, icon, phone, rating, name, Cuboun, navigation) => {
    return async (dispatch) => {
        await axios({
            url: CONST.url + 'send-special-order',
            method: 'POST',
            params: { lang },
            data: { latitude, longitude, address, latitude_to, longitude_to, address_to, time, details, payment_type, images: null, icon, phone, rating, name, coupon: Cuboun },
            headers: { Authorization: 'Bearer ' + token, },
        }).then(response => {
            if (response.data.success){
                navigation.navigate('AllOffers', { id: response.data.data.id });

                for (let i=0; i < images.length; i++){
                    let formData    = new FormData();
                    let localUri    = images[i].image;
                    let filename    = localUri.split('/').pop();
                    let match       = /\.(\w+)$/.exec(filename);
                    let type        = `image/${match[1]}`;

                    formData.append('images', { uri: localUri, name: filename, type });
                    formData.append('id', JSON.stringify(response.data.data.id));

                    axios.post(CONST.url + 'upload-image', formData).then(res => {
                        console.log(res)
                    });
                }

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
        });
    }
};


export const getMyOrders = (lang, token, status, delegate) => {
    return async (dispatch) => {
        await axios({
            url: CONST.url + 'my-orders',
            method: 'POST',
            params: { lang },
            data: { status, delegate },
            headers: { Authorization: 'Bearer ' + token, },
        }).then(response => {
            dispatch({ type: 'getMyOrders', payload: response.data });
        });
    }
};


export const getOrderDetails = (lang, token, id, latitude, longitude) => {
    return async (dispatch) => {
        await axios({
            url: CONST.url + 'order-details',
            method: 'POST',
            params: { lang },
            data: { id, latitude, longitude },
            headers: { Authorization: 'Bearer ' + token, },
        }).then(response => {
            dispatch({ type: 'getOrderDetails', payload: response.data });
        });
    }
};


