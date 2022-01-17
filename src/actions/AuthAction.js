import axios from 'axios';
import { Toast } from 'native-base';
import consts from '../consts';
import CONST from "../consts";
import { ToasterNative } from '../common/ToasterNatrive';
import i18n from '../components/locale/i18n';
import AsyncStorage from "@react-native-async-storage/async-storage";



export const Sign_In = 'Sign_In';
export const Activate_Code = 'Activate_Code'
export const Sign_up = 'Sign_up';
export const login_success = 'login_success'
export const login_failed = 'login_failed';
export const logout = 'logout'
export const ClearـCaSh = 'ClearـCaSh'


export const SignIn = (phone, password, device_id, lang, navigation) => {

    return async (dispatch, getState) => {
        let usertype = getState().lang.usertype;
        await axios({
            method: 'POST',
            url: consts.url + 'sign-in',
            data: { phone, password, device_id, lang, },
            params: { lang }
        })

            .then(res => {
                if (res.data.data.user_type == 2 && usertype == 3) {
                    ToasterNative('يجب ان يكون اختيارك كعميل', 'danger', 'bottom')

                }

                // else if (res.data.data.user_type == 3 && usertype == 2) {
                //     navigation.navigate('GoHome')
                // }

                else {
                    handelLogin(dispatch, res.data, navigation)

                }



            }).catch(err => console.log(err))

        dispatch({ type: Sign_In })

    }
}


const handelLogin = (dispatch, data, navigation) => {
    if (!data.success) {
        loginFailed(dispatch, data, navigation)
    } else {
        loginSuccess(dispatch, data, navigation)
    }
};



const loginSuccess = (dispatch, data, navigation) => {
    if (data.data.user_type == 4) {
        ToasterNative(i18n.t('usertype'), 'danger', 'bottom')

    }
    else if (data.data.active) {

        AsyncStorage.setItem('token', JSON.stringify(data.data.token))
            .then(() => dispatch({ type: login_success, data }));
    }

    else {
        navigation.navigate('AccountActivation', { token: data.data.token, })

    }

    // Toast.show({
    //     text: data.message,
    //     type: data.success ? "success" : "danger",
    //     duration: 3000,
    //     textStyle: {
    //         color: "white",
    //         fontFamily: 'flatMedium',
    //         textAlign: 'center'
    //     }
    // });

};

const loginFailed = (dispatch, error, navigation) => {
    if (!(error.success)) {
        //     navigation.navigate('ActivateCode', {
        //         token: error.data.token,

        //     });
        // }
        dispatch({ type: login_failed, error });

        Toast.show({
            text: error.message,
            type: "danger",
            duration: 3000,
            textStyle: {
                color: "white",
                fontFamily: 'flatMedium',
                textAlign: 'center'
            }
        })

    }
};
export const resendCode = (lang, token) => {
    return async (dispatch) => {
        await axios({
            url: CONST.url + 'resend-code',
            method: 'GET',
            params: { lang },
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
        }).catch(err => console.log(err))
    }
}

export const UserRegister = (name, phone, password, email, user_type, lang, navigation) => {

    return async dispatch => {
        await AsyncStorage.getItem('deviceID').then(async deviceId => {
            await axios({
                method: 'post',
                url: consts.url + 'sign-up',
                data: { name, phone, password, email, user_type, device_id: deviceId },
                params: { lang, }
            }).then(res => {
                if (res.data.success) {
                    dispatch({ type: Sign_up, payload: res.data })

                    navigation.navigate('AccountActivation', { token: res.data.data.token, code: res.data.data.code })
                }
                else {
                    Toast.show({
                        text: res.data.message,
                        type: res.data.success ? "success" : "danger",
                        duration: 3000,
                        textStyle: {
                            color: "white",
                            fontFamily: 'flatMedium',
                            textAlign: 'center'
                        }
                    });
                }
            }).catch(err => console.log(err))
        })

    }

}


export const DelegateRegister = (name, phone, password, email, user_type, identity, city_id, car_model, car_plate_number, identity_img, car_license, user_license, car_plate_front_img, car_plate_end_img, lang, navigation) => {

    return async dispatch => {
        await AsyncStorage.getItem('deviceID').then(deviceId => {
            axios({
                method: 'post',
                url: consts.url + 'sign-up',
                data: { name, phone, password, email, user_type, identity, city_id, car_model, car_plate_number, identity_img, car_license, user_license, car_plate_front_img, car_plate_end_img, device_id: deviceId },
                params: { lang, }
            })
        }).then(res => {
            dispatch({ type: Sign_up, payload: res.data })
            if (res.data.success) {
                navigation.navigate('AccountActivation', { token: res.data.data.token })
            }
            else {
                Toast.show({
                    text: res.data.message,
                    type: res.data.success ? "success" : "danger",
                    duration: 3000,
                    textStyle: {
                        color: "white",
                        fontFamily: 'flatMedium',
                        textAlign: 'center'
                    }
                });
            }
        }).catch(err => console.log(err))

    }

}


export const ActivationCode = (code, token, lang, navigation, route) => {
    return async dispatch => {
        await axios({
            method: 'POST',
            url: consts.url + 'activate',
            data: { code },
            params: { lang },
            headers: {
                Authorization: 'Bearer ' + token,
            }
        }
        ).then(res => {
            if (res.data.success) {
                dispatch({ type: Activate_Code, data: res.data })
                if (route?.pathname == 'MyProfile') {
                    navigation.navigate('Profile')
                }
            }

            ToasterNative(res.data.message, res.data.success ? "success" : "danger", 'bottom')

        }).catch(err => console.log(err))
    }

}


export const ResetPassword = (password, code, token, navigation) => {
    return async dispatch => {
        await axios({
            method: 'POST',
            url: consts.url + 'reset-password',
            data: { password, code },
            headers: {
                Authorization: 'Bearer ' + token,

            }
        }).then(res => {
            if (res.data.success) {
                navigation.navigate('Login')
            }

            Toast.show({
                text: res.data.message,
                type: res.data.success ? "success" : "danger",
                duration: 3000,
                textStyle: {
                    color: "white",
                    fontFamily: 'flatMedium',
                    textAlign: 'center'
                }
            });

        })
    }
}



export const CheckPhone = (lang, phone, navigation) => {
    return async dispatch => {
        await axios({
            method: 'post',
            url: consts.url + 'forget-password',
            data: { phone },
            params: { lang, }
        }).then(res => {
            if (res.data.success) {
                navigation.navigate('PassVerify', { token: res.data.data.token })
            }

            Toast.show({
                text: res.data.message,
                type: res.data.success ? "success" : "danger",
                duration: 3000,
                textStyle: {
                    color: "white",
                    fontFamily: 'flatMedium',
                    textAlign: 'center'
                }
            });

        })

    }
}


export const tempAuth = () => {
    return (dispatch) => {
        dispatch({ type: 'temp_auth' });
    };
};

export const LogoutUser = (token) => {
    return async dispatch => {

        await AsyncStorage.getItem('deviceID').then(async device_id => {
            await axios({
                method: 'POST',
                url: consts.url + 'logout',
                headers: { Authorization: 'Bearer ' + token, },
                data: { device_id }
            }).then(res => {
                dispatch({ type: logout })

            })
        }).catch(err => console.log(err))

    }
}



export const ClearCaSh = (navigation) => {
    return async (dispatch, getState) => {
        const { token } = getState().Auth
        await dispatch({ type: ClearـCaSh })
        navigation.navigate('AccountActivation', { token })



    }
}