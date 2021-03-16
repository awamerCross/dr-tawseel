const INITIAL_STATE = { BaketDetailes: {}, ValCoupon: null, DeliverCoast: {}, Products: [], cartProduct: [], GetSavedLoacation: [], Loader: true }


export default (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case 'BasketDetailes':
            return {
                ...state, BaketDetailes: action.data.data, Products: action.data.data.products,
                Loader: false
            };

        case 'ValdiateCoupon':
            return { ValCoupon: action.data }
        case 'GetDliveryCost':
            return { ...state, DeliverCoast: action.data.data }
        case 'GetSavedLoacation':
            return { GetSavedLoacation: action.data.data }
        case 'Loaders':
            return { ...state, Loader: action.loading }

        default:
            return state;

    }
}