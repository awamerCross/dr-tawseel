const initialState = { orders: [] }

export default (state = initialState, action) => {
    switch (action.type) {
        case 'getDelegateOrders':
            return { ...state, orders: action.payload.data, }

        default:
            return state;
    }
}
