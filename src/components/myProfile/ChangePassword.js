import React, { useEffect, useState } from "react";
import {

    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    TouchableOpacity
} from "react-native";
import Colors from "../../consts/Colors";
import { InputIcon } from "../../common/InputText";
import BTN from "../../common/BTN";
import i18n from "../locale/i18n";
import { validateTwoPasswords } from "../../common/Validation";
import { useDispatch, useSelector } from "react-redux";
import { EditPasswordSettingsProfile } from '../../actions/ProfileAction';
import { Toaster } from '../../common/Toaster'

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')
const ChangePassword = ({ navigation }) => {

    const [password, setPassword] = useState('');
    const [Newpassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const token = useSelector(state => state.Auth.user ?state.Auth.user.data.token : null);
    const lang = useSelector(state => state.lang.lang);

    const dispatch = useDispatch()
    const _validate = () => {

        let passConfirmErr = validateTwoPasswords(Newpassword, confirmPassword)

        return passConfirmErr;
    };

    const ChanPasswordProfile = () => {
        const isVal = _validate();
        if (!isVal) {
            dispatch(EditPasswordSettingsProfile(token, password, Newpassword, lang, navigation))
            setPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }

        else {
            Toaster(_validate());
        }

    }


    return (
        <View style={{ backgroundColor: '#696969', flex: 1, }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.WrapText}>
                        <Text style={styles.fText}>{i18n.t('changePass')}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{ alignSelf: 'flex-end', bottom: 20, paddingEnd: 10 }}  >
                            <Image source={require('../../../assets/images/close.png')} style={{ width: 20, height: 20, alignSelf: 'center', }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: '110%' }}>
                        <InputIcon
                            label={i18n.t('oldPassword')}
                            placeholder={i18n.t('oldPassword')}
                            onChangeText={(e) => setPassword(e)}
                            value={password}
                            inputStyle={{ borderRadius: 30, height: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                            styleCont={{ height: width * .13, marginTop: 30, marginHorizontal: 25 }}
                            LabelStyle={{ bottom: width * .13, backgroundColor: 0 }}
                            image={require('../../../assets/images/view.png')}
                        />
                        <InputIcon
                            label={i18n.t('newPassword')}
                            placeholder={i18n.t('newPassword')}
                            onChangeText={(e) => setNewPassword(e)}
                            value={Newpassword}
                            secureTextEntry
                            inputStyle={{ borderRadius: 30, height: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                            styleCont={{ height: width * .13, marginHorizontal: 25, marginTop: 30 }}
                            LabelStyle={{ bottom: width * .13, backgroundColor: 0 }}
                            image={require('../../../assets/images/view.png')}
                        />
                        <InputIcon
                            label={i18n.t('enNewPass')}
                            placeholder={i18n.t('enNewPass')}
                            onChangeText={(e) => setConfirmPassword(e)}
                            value={confirmPassword}
                            secureTextEntry
                            inputStyle={{ borderRadius: 30, height: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                            styleCont={{ height: width * .13, marginHorizontal: 25, marginTop: 30 }}
                            LabelStyle={{ bottom: width * .13, backgroundColor: 0 }}
                            image={require('../../../assets/images/view.png')}
                        />
                    </View>
                    <BTN title={i18n.t('confirm')} onPress={ChanPasswordProfile} ContainerStyle={[styles.Btn, { marginTop: 15, marginVertical: 30 }]} TextStyle={{ fontSize: width * .03, }} />

                </View>

            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",


    },
    modalView: {
        backgroundColor: Colors.bg,
        alignItems: "center",
        shadowColor: Colors.IconBlack,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: width * .9
    },
    WrapText: {
        backgroundColor: Colors.sky,
        width: width * .9,
        height: width * .12,
    },
    fText: {
        fontFamily: 'flatMedium',
        color: Colors.bg,
        fontSize: width * .035,
        textAlign: 'center',
        paddingTop: 10
    },
    Btn: {
        borderRadius: 30
    }
});

export default ChangePassword;
