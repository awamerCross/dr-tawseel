import { Get_Cities, Get_Debartmets } from "../actions/CitiesAction";

const initialState = { cities: [], deparment: [] }

export default (state = initialState, action) => {
    switch (action.type) {

        case Get_Cities:
            return { ...state, cities: action.payload.data, }

        case Get_Debartmets:
            return { ...state, deparment: action.payload.data }

        default:
            return state;
    }
}
