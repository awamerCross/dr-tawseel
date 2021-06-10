import axios from "axios";
import CONST from "../consts";
import { Toast } from 'native-base'
import { AsyncStorage } from "react-native";
import { ToasterNative } from "../common/ToasterNatrive";


export const getCategories = lang => {
	return async (dispatch) => {

		await axios({
			url: CONST.url + 'categories',
			method: 'GET',
			params: { lang }
		}).then(response => {
			dispatch({ type: 'categories', payload: response.data });
		}).catch(err => ToasterNative(err.message, 'danger', 'bottom'))
	}
};

export const getPlacesType = lang => {
	return async (dispatch) => {
		await AsyncStorage.getItem('deviceID').then(async deviceId => {
			await axios({
				url: CONST.url + 'places/types',
				method: 'GET',
				params: { lang },
				// data: {device_id: deviceId },
			}).then(response => {
				dispatch({ type: 'placesType', payload: response.data });
			}).catch(err => ToasterNative(err.message, 'danger', 'bottom'))
		})
	}
};

export const getGooglePlaces = (lang, category, keyword, latitude, longitude, next_page_token) => {
	return async (dispatch) => {
		await AsyncStorage.getItem('deviceID').then(async deviceId => {
			await axios({
				url: CONST.url + 'google/places',
				method: 'POST',
				data: { type: category, keyword, latitude, longitude, next_page_token, device_id: deviceId },
				params: { lang }
			}).then(response => {
				dispatch({ type: 'getGooglePlaces', payload: response.data });
			}).catch(err => ToasterNative(err.message, 'danger', 'bottom'))
		})
	}
};

export const getPlaceDetails = (lang, place_id, latitude, longitude) => {
	return async (dispatch) => {
		await AsyncStorage.getItem('deviceID').then(async deviceId => {
			await axios({
				url: CONST.url + 'places/details',
				method: 'POST',
				data: { place_id, latitude, longitude, device_id: deviceId },
				params: { lang }
			}).then(response => {
				dispatch({ type: 'placeDetails', data: response.data });
			}).catch(err => ToasterNative(err.message, 'danger', 'bottom'))
		})
	}
}


export const Providerdetailes = (lang, category_id, name, latitude, longitude) => {
	return async (dispatch) => {
		await AsyncStorage.getItem('deviceID').then(async deviceId => {
			await axios({
				url: CONST.url + 'providers',
				method: 'POST',
				data: { category_id, name, latitude, longitude, device_id: deviceId },
				params: { lang }
			}).then(response => {
				dispatch({ type: 'Providerdetailes', data: response.data });
			}).catch(err => ToasterNative(err.message, 'danger', 'bottom'))
		})
	}
}

export const ResturantDetailes = (id, lang, latitude, longitude) => {
	return async (dispatch) => {
		await AsyncStorage.getItem('deviceID').then(async deviceId => {
			await axios({
				url: CONST.url + 'provider-details',
				method: 'POST',
				data: { id, device_id: deviceId, latitude, longitude },
				params: { lang }
			}).then(response => {
				dispatch({ type: 'RestDetailes', data: response.data });
			}).catch(err => ToasterNative(err.message, 'danger', 'bottom'))
		})
	}
}

export const Products = (provider_id, lang, menu_id,) => {

	return async (dispatch) => {
		await AsyncStorage.getItem('deviceID').then(async deviceId => {
			await axios({
				url: CONST.url + 'products',
				method: 'POST',
				data: { provider_id, menu_id, device_id: deviceId },
				params: { lang }
			}).then(response => {
				dispatch({ type: 'Products', data: response.data });
			}).catch(err => ToasterNative(err.message, 'danger', 'bottom'))
		})
	}
}


export const ProductDetailesRest = (id, lang) => {

	return async (dispatch) => {
		await AsyncStorage.getItem('deviceID').then(async deviceId => {
			await axios({
				url: `${CONST.url}product?id=${id}`,
				method: 'Post',
				params: { lang },
				data: { device_id: deviceId },
			}).then(response => {
				dispatch({ type: 'ProductsDetailes', data: response.data });
			}).catch(err => ToasterNative(err.message, 'danger', 'bottom'))
		})
	}
}

export const AddTOCart = (product_id, size_id, quantity, extras, kilos, price, lang, token,) => {
	return async (dispatch) => {
		await AsyncStorage.getItem('deviceID').then(async deviceId => {

			await axios({
				url: `${CONST.url}add-cart`,
				method: 'POST',
				data: { product_id, size_id, quantity, extras, kilos, price, device_id: deviceId },
				params: { lang },
				headers: token ? { Authorization: 'Bearer ' + token, } : null,

			}).then(response => {
				if (response.data.success) {
					dispatch({ type: 'Addtocart', data: response.data });
				}
				ToasterNative(response.data.message, response.data.success ? "success" : "danger", 'bottom')

			}).catch(err => ToasterNative(err.message, 'danger', 'bottom'))
		})
	}
}

export const BasketStore = (token, lang, name) => {

	return async (dispatch) => {
		await AsyncStorage.getItem('deviceID').then(async deviceId => {
			await axios({
				url: `${CONST.url}cart`,
				method: 'POST',
				data: { name, device_id: deviceId },
				headers: token ? { Authorization: 'Bearer ' + token, } : null,
				params: { lang }
			}).then(response => {
				dispatch({ type: 'BasketStore', data: response.data });
			}).catch(err => ToasterNative(err.message, 'danger', 'bottom'))
		})
	}
}