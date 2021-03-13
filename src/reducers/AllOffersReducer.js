const INITIAL_STATE = { allOffers: [],loader: false };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getAllOffers':
            return { ...state, allOffers: action.payload.data, loader: action.payload.success };
        default:
            return state;
    }
};
