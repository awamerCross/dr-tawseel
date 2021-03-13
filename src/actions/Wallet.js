
import consts from '../consts';
import axios from 'axios';
import { Toast } from "native-base";
import { ToasterNative } from '../common/ToasterNatrive';

export const GetWallet = (token, lang) => {
    return async (dispatch) => {
        await axios({
            method: 'GET',
            url: `${consts.url}wallet`,
            headers: { Authorization: 'Bearer ' + token },
            params: { lang }
        }).then((response) => {

            dispatch({ type: 'Get_Wallet', data: response.data.data });

        }).catch(err => ToasterNative(err.message, 'danger', 'bottom'))
    }
}



export const GetAccountBanks = (token, lang) => {
    return async (dispatch) => {
        await axios({
            method: 'GET',
            url: `${consts.url}banks`,
            headers: { Authorization: 'Bearer ' + token },
            params: { lang }
        }).then((response) => {
            dispatch({ type: 'Get_MyBankes', data: response.data });
        }).catch(err => ToasterNative(err.message, 'danger', 'bottom'))
    }
}

export const Withdrawwallet = (token, account_number, lang, navigation) => {
    return async (dispatch) => {
        await axios({
            method: 'POST',
            url: `${consts.url}withdraw-wallet`,
            headers: { Authorization: 'Bearer ' + token },
            data: { account_number },
            params: { lang },
        }).then((response) => {
            if (response.data.success) {
                navigation.navigate('Wallet')
            }
            ToasterNative(response.data.message, response.data.success ? "success" : "danger", 'top')

        }).catch(err => ToasterNative(err.message, 'danger', 'bottom'))
    }
}

export const SendTransferFromACc = (token, lang, AccountId, base64, Bankname, accountNAme, accountnum, money, navigation) => {
    return async (dispatch) => {
        await axios({
            method: 'POST',
            url: `${consts.url}send-transfer`,
            headers: { Authorization: 'Bearer ' + token },
            data: { image: base64, bank_name: Bankname, account_name: accountNAme, account_number: accountnum, total: money, bank_id: AccountId },
            params: { lang }
        }).then((response) => {
            if (response.data.success) {
                navigation.navigate('Wallet')
            }
            ToasterNative(response.data.message, response.data.success ? "success" : "danger", 'bottom')


        }).catch(err => ToasterNative(err.message, 'danger', 'bottom'))
    }
}
