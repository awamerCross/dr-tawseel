
const initialState = { wallet: {}, Banks: [] }


export default (state = initialState, action) => {
    switch (action.type) {


        case 'Get_Wallet':
            return { ...state, wallet: action.data }

        case 'Get_MyBankes':
            return { Banks: action.data.data }
        default:
            return state;
    }
}