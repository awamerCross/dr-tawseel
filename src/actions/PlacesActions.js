import axios from "axios";
import CONST from "../consts";
import { Toast } from 'native-base'


export const setPlace = (lang, token, latitude, longitude, name, address) => {
    return async (dispatch) => {
        await axios({
            url: CONST.url + 'add-place',
            method: 'POST',
            params: { lang },
            data: { name, latitude, longitude, address },
            headers: { Authorization: 'Bearer ' + token, },
        }).then(response => {
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


