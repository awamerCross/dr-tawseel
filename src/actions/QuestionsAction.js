import axios from "axios";
import CONST from "../consts";
import { ToasterNative } from "../common/ToasterNatrive";

export const getQuestions = (lang) => {
    return async (dispatch) => {

        await axios({
            url: CONST.url + 'questions',
            method: 'GET',
            params: { lang },
        }).then(response => {
            dispatch({ type: 'getQuestions', payload: response.data });
        }).catch(err => onsole.log(err))
    }
};
