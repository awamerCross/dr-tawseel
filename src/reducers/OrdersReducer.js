const INITIAL_STATE = { myOrders: [], orderDetails: [], loader: false };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getMyOrders':
            return { ...state, myOrders: action.payload.data, loader: action.payload.success };
        case 'getOrderDetails':
            return { ...state, orderDetails: action.payload.data, loader: action.payload.success };
        default:
            return state;
    }
};
