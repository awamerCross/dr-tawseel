import axios from "axios";
import CONST from "../consts";
import { AsyncStorage } from "react-native";
import { ToasterNative } from "../common/ToasterNatrive";

export const getBanners = (lang) => {
	return async (dispatch) => {
		axios({
			url: CONST.url + 'banners',
			method: 'GET',
			// data: {device_id: deviceId },
			params: { lang },
		}).then(response => {
			dispatch({ type: 'getBanners', payload: response.data });
		}).catch(err => ToasterNative(err.message, 'danger', 'bottom'))
	}
};
