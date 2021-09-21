import axios from "axios";
import CONST from "../consts";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const getLatestProviders = () => {
	return (dispatch) => {
		axios({
			url: CONST.url + 'best-providers',
			method: 'GET',
		}).then(response => {
			dispatch({ type: 'latestProviders', payload: response.data });
		}).catch(err => onsole.log(err))
	}
};
