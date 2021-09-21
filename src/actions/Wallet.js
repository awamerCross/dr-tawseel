
import consts from '../consts';
import axios from 'axios';
import { Toast } from "native-base";
import { ToasterNative } from '../common/ToasterNatrive';
import { sendNewMessage } from './ChatAction';

export const GetWallet = (token, lang) => {
    return async (dispatch) => {
        await axios({
            method: 'GET',
            url: `${consts.url}wallet`,
            headers: { Authorization: 'Bearer ' + token },
            params: { lang }
        }).then((response) => {

            dispatch({ type: 'Get_Wallet', data: response.data.data });

        }).catch(err => onsole.log(err))
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
        }).catch(err => onsole.log(err))
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

        }).catch(err => onsole.log(err))
    }
}

export const SendTransferFromACc = (token, lang, AccountId, base64, Bankname, accountNAme, accountnum, money, iban_num, stc_num, navigation) => {
    return async (dispatch) => {
        await axios({
            method: 'POST',
            url: `${consts.url}send-transfer`,
            headers: { Authorization: 'Bearer ' + token },
            data: { image: base64, bank_name: Bankname, account_name: accountNAme, account_number: accountnum, total: money, bank_id: AccountId, iban_num, stc_num, },
            params: { lang }
        }).then((response) => {
            if (response.data.success) {
                navigation.navigate('Wallet')
            }
            ToasterNative(response.data.message, response.data.success ? "success" : "danger", 'bottom')


        }).catch(err => onsole.log(err))
    }
}

export const PayWithWallet = (token, order_id, lang, onSendsMsg) => {
    return async (dispatch) => {
        await axios({
            method: 'POST',
            url: `${consts.url}pay-with-wallet`,
            headers: { Authorization: 'Bearer ' + token },
            data: { order_id },
            params: { lang },
        }).then((response) => {

            if (response.data.success) {
                onSendsMsg()
            }
            ToasterNative(response.data.message, response.data.success ? "success" : "danger", 'top')

        }).catch(err => onsole.log(err))
    }
}
