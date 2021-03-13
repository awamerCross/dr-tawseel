import axios from "axios";
import CONST from "../consts";
import { Toast } from 'native-base'


export const getPlaces = (lang, token) => {
    return async (dispatch) => {
        await Placess(lang, token, dispatch)
    }
};


export const deletePlace = (lang, id, token) => {
    return (dispatch) => {
        axios({
            url: CONST.url + 'delete-place',
            method: 'POST',
            params: { lang },
            headers: { Authorization: 'Bearer ' + token, },
            data: { id }
        }).then(response => {
            Placess(lang, token, dispatch);
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

export const addPlace = (lang, token, latitude, longitude, address, name, navigation) => {
    return async (dispatch) => {
        await axios({
            url: CONST.url + 'add-place',
            method: 'POST',
            params: { lang },
            data: { latitude, longitude, address, name },
            headers: { Authorization: 'Bearer ' + token, },
        }).then(response => {

            if (response.data.success) {

                navigation.navigate('Address')

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
export const editPlace = (lang, token, id, latitude, longitude, address, name, navigation) => {
    return async (dispatch) => {
        await axios({
            url: CONST.url + 'update-place',
            method: 'POST',
            params: { lang },
            data: { id, latitude, longitude, address, name },
            headers: { Authorization: 'Bearer ' + token, },
        }).then(response => {

            if (response.data.success) {

                navigation.navigate('Address')

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


const Placess = (lang, token, dispatch) => {
    axios({
        url: CONST.url + 'places',
        method: 'POST',
        params: { lang },
        headers: { Authorization: 'Bearer ' + token, },
    }).then(response => {
        dispatch({ type: 'getPlaces', payload: response.data });
    });
};




