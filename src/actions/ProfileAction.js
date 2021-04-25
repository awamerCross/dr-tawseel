import axios from "axios";
import CONST from "../consts";
import { Toast } from 'native-base';
import { ToasterNative } from "../common/ToasterNatrive";

export const UpdateـProfile = 'UpdateـProfile'

export const GetProfileAction = (token, lang) => {
    return async (dispatch) => {

        await axios({
            url: CONST.url + 'profile',
            method: 'GET',
            headers: { Authorization: 'Bearer ' + token, },
            params: { lang }
        }).then(response => {
            dispatch({ type: 'GetProfileAction', data: response.data });
        }).catch(err => ToasterNative(err.message, 'danger', 'bottom'))
    }
};

export const UpdateProfileAction = (token, name, phone, email, avatar, lang, navigation) => {
    return async (dispatch) => {

        await axios({
            url: CONST.url + 'edit-profile',
            method: 'POST',
            data: { name, phone, email, avatar, },
            headers: { Authorization: 'Bearer ' + token, },
            params: { lang }
        }).then(response => {
            if (response.data.success) {

                dispatch({ type: UpdateـProfile, data: response.data });
                // navigation.navigate('GoHome')

            }
            ToasterNative(response.data.message, response.data.success ? "success" : "danger", 'bottom')

        }).catch(err => ToasterNative(err.message, 'danger', 'bottom'))
    }
};



export const EditPasswordSettingsProfile = (token, old_password, current_password, lang, navigation) => {
    return async dispatch => {
        await axios({
            url: CONST.url + 'edit-password',
            method: 'POST',
            data: { old_password, current_password },
            headers: { Authorization: 'Bearer ' + token, },
            params: { lang, }

        }).then(res => {
            if (res.data.success) {
                navigation.navigate('Profile')

            }

            ToasterNative(res.data.message, res.data.success ? "success" : "danger", 'bottom')

        }
        ).catch(err => ToasterNative(err.message, 'danger', 'bottom'))


    }
}