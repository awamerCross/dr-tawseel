const INITIAL_STATE = { cancelReasons : [], loader : false };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getCancelReasons':
            return {
                cancelReasons: action.payload.data,
                loader: action.payload.success
            };
        default:
            return state;
    }
};
