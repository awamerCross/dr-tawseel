const INITIAL_STATE = { comments: [],loader: false };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getDelegateComments':
            return { ...state, comments: action.payload.data, loader: action.payload.success };
        default:
            return state;
    }
};
