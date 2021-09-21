const INITIAL_STATE = { BasketLength: {}, loader: false };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'GetBasketLength':
            return {
                ...state,
                BasketLength: action.payload.data,
                loader: action.payload.success
            };
        default:
            return state;
    }
};
