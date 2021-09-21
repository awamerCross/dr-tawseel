import axios from "axios";
import CONST from "../consts";
import { ToasterNative } from "../common/ToasterNatrive";


export const getAboutApp = lang => {
	return (dispatch) => {

		axios({
			url: CONST.url + 'about?lang=' + lang,
			method: 'GET',
		}).then(response => {
			dispatch({ type: 'getAboutApp', payload: response.data });
		}).catch(err => onsole.log(err))
	}
};


export const getPolicy = lang => {
	return (dispatch) => {
		axios({
			url: CONST.url + 'policy?lang=' + lang,
			method: 'GET',
		}).then(response => {
			dispatch({ type: 'getPolicy', payload: response.data });
		}).catch(err => onsole.log(err))
	}
};
