import I18n from '../components/locale/i18n'

export const validatePhone = (phone) =>
    phone === '' ?  I18n.t('correctPhone')  : phone.length < 9 ? I18n.t('correctPhone') : null

export const validatePassword = (password) =>
    password.length < 6 ? I18n.t('passLength') : null;

export const validateTwoPasswords = (password, confirmPassword) => {

    return password != confirmPassword
        ? I18n.t('notmatch')
        : null;
};

export const agreePolicy = (status) => {
    return !status
        ? I18n.t('agreePolicy')
        : null;
};

export const validateCode = (isValid) =>
    !isValid ? I18n.t('checkCode') : null;

export const validateEmail = email => {
    let mailReg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return !mailReg.test(String(email).toLowerCase())
        ? I18n.t('checkEmail')
        : null;
};

export const validateUserName = userName => {
    return userName.length < 3 ? I18n.t('checkUsername') : null;
}

export const validateBankName = userName =>
    userName.length < 3 ? I18n.t('checkBankName') : null;

export const validateAccountNum = (code) =>
    code === '' || code.length < 14 ? I18n.t('checkAccLength') : null;

export const valdiateMoney = (code) =>
    code === '' || code.length <= 0 ? I18n.t('checkPrice') : null;