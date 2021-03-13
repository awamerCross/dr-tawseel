import { chooseLang } from "../actions/LangAction";
import { getLocale } from "../../locale/i18n";

const initalstate = {
    language: getLocale(),
};

export default (state = initalstate, action) => {
    switch (action.type) {
        case chooseLang:
            return { ...state, language: action.lang };

        default:
            return state;
    }
};
