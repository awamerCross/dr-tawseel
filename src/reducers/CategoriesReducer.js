const INITIAL_STATE = { categories: [], loader: false, placeDetails: [], placesTypes: [], googlePlaces: [], nextPage: null, Detailes: [], Resture: [], product: [], ProdDetailes: {}, cart: [], BasketStore: [] };

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'categories':
			return { ...state, categories: action.payload.data, loader: action.payload.success };
		case 'placesType':
			return { ...state, placesTypes: action.payload.data, loader: action.payload.success };
		case 'getGooglePlaces': {

			return { ...state, googlePlaces: action.payload.data, nextPage: action.payload.extra };
		}
		case 'placeDetails': {
			console.log('action.payload.data', action.data)
			return { ...state, placeDetails: action.data.data };
		}
		case 'Providerdetailes':
			return { ...state, Detailes: action.data.data, loader: action.data.success };
		case 'RestDetailes':
			return { ...state, Resture: action.data.data }
		case 'Products':
			return { ...state, product: action.data.data }
		case 'ProductsDetailes':
			return { ...state, ProdDetailes: action.data.data }

		case 'BasketStore':
			return { BasketStore: action.data.data }

		default:
			return state;
	}
};
