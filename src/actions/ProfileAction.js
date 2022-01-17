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
        }).catch(err => console.log(err))
    }
};

export const UpdateProfileAction = (token, name, phone, email, avatar, lang, id, navigation) => {
    return async (dispatch, getState) => {
        let { profile } = getState().profile
        await axios({
            url: CONST.url + 'edit-profile',
            method: 'POST',
            data: { name, phone, email, avatar, id },
            headers: { Authorization: 'Bearer ' + token, },
            params: { lang }
        }).then(response => {

            if (response.data.success) {

                profile.data.phone == phone ?
                    navigation.navigate('GoHome')
                    :
                    navigation.navigate('AccountActivation', { token, pathname: 'MyProfile' })

                dispatch({ type: UpdateـProfile, data: response.data });

            }
            ToasterNative(response.data.message, response.data.success ? "success" : "danger", 'bottom')

        }).catch(err => console.log(err))
    }
};



export const EditPasswordSettingsProfile = (token, old_password, current_password, lang, id, navigation) => {
    return async dispatch => {
        await axios({
            url: CONST.url + 'edit-password',
            method: 'POST',
            data: { old_password, current_password, id },
            headers: { Authorization: 'Bearer ' + token, },
            params: { lang, }

        }).then(res => {
            if (res.data.success) {
                navigation.navigate('Profile')

            }

            ToasterNative(res.data.message, res.data.success ? "success" : "danger", 'bottom')

        }
        ).catch(err => console.log(err))


    }
}