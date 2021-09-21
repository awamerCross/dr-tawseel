const INITIAL_STATE = { categories: [], loader: false, placeDetails: [], placesTypes: [], googlePlaces: [], nextPage: null, Detailes: [], Resture: [], product: [], ProdDetailes: {}, cart: [], BasketStore: [] };

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'categories':
			return { ...state, categories: action.payload.data, };
		case 'placesType':
			return { ...state, placesTypes: action.payload.data, };
		case 'getGooglePlaces': {

			return { ...state, googlePlaces: action.payload, nextPage: action.nextPage };
		}
		case 'placeDetails': {
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
			return { ...state, BasketStore: action.data.data }

		default:
			return state;
	}
};
