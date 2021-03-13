import { UpdateـProfile } from "../actions/ProfileAction";


const INITIAL_STATE = { profile: null };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'GetProfileAction':
            return { profile: action.data };
        case UpdateـProfile:
            return { ...state, profile: action.data };

        default:
            return state;
    }
};
