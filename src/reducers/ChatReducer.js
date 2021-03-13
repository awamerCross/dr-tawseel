const initialState = { messages: [], rooms: [] }

export default (state = initialState, action) => {
    switch (action.type) {
        case 'getInbox':
            return { ...state, messages: action.payload.data }
        case 'getRooms':
            return { ...state, rooms: action.payload.data }
        default:
            return state;
    }
}
