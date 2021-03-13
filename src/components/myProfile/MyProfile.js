import React, { useState, useEffect } from 'react'
import { ScrollView, View, Image, StyleSheet, Dimensions, Text, TouchableOpacity, I18nManager, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Colors from '../../consts/Colors';
import { InputIcon } from '../../common/InputText';
import BTN from '../../common/BTN';
import {
    validateUserName,
    validatePhone,
    validatePassword,
    validateEmail,
    validateTwoPasswords
} from '../../common/Validation';
import Header from '../../common/Header';
import i18n from "../locale/i18n";
import { useDispatch, useSelector } from 'react-redux';
import { EditPasswordSettingsProfile, GetProfileAction, UpdateProfileAction } from '../../actions/ProfileAction';
import Container from '../../common/Container';
import Modal from "react-native-modal";
import { ToasterNative } from '../../common/ToasterNatrive';
import LoadingBtn from '../../common/Loadbtn';

const { width, height } = Dimensions.get('window')

function MyProfile({ navigation }) {


    const user = useSelector(state => state.Auth ? state.Auth.user ? state.Auth.user.data : null : null)

    const [showModal, setShowModal] = useState(false);
    const Profile = useSelector(state => state.profile.profile ? state.profile.profile.data : '');
    const [name, setName] = useState(Profile.name);
    const [phone, setPhone] = useState(Profile.phone);
    const [email, setemail] = useState(Profile.email);
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null);
    const lang = useSelector(state => state.lang.lang);
    const [spinner, setSpinner] = useState(false);
    const [base64, setBase64] = useState(null);
    const [userImage, setUserImage] = useState(Profile.avatar);
    const [error, setError] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConNewPass, setShowConNewPass] = useState(false);
    const [password, setPassword] = useState('');
    const [Newpassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setloading] = useState(false)




    const dispatch = useDispatch()

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setModalVisible(false)
            setSpinner(true)
            dispatch(GetProfileAction(token, lang)).then(() => setSpinner(false))
        })
        setName(Profile.name)
        setPhone(Profile.phone)
        setemail(Profile.email)
        setUserImage(Profile.avatar)
        return unsubscribe
    }, [navigation, spinner])


    const _validate = () => {
        let nameErr = validateUserName(name)
        let phoneErr = validatePhone(phone);
        let emailErr = validateEmail(email)

        return nameErr || phoneErr || emailErr
    };



    const ChanPasswordProfile = () => {

        if (Newpassword.length < 6) {

            ToasterNative(i18n.t('passreq'), "danger", 'top')

            return false

        } else if (Newpassword !== confirmPassword) {
            ToasterNative(i18n.t('passError'), "danger", 'top')


            return false
        } else {
            dispatch(EditPasswordSettingsProfile(token, password, Newpassword, lang, navigation))
            setPassword('');
            setNewPassword('');
            setConfirmPassword('');

        }

    }

    const _pickImage = async () => {


        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();

        if (status === 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,

                base64: true,
                aspect: [4, 3],
                quality: .5,
            });

            if (!result.cancelled) {
                setUserImage(result.uri);
                setBase64(result.base64);
            }

        }
        else {
            ToasterNative(i18n.t('CammeraErr'), "danger", 'top')

        }



    };


    const UpdateProfile = () => {

        const isVal = _validate();
        if (!isVal) {

            setloading(true)
            dispatch(UpdateProfileAction(token, name, phone, email, base64, lang, navigation)).then(() => setloading(false))
        }

        else {
            setloading(false)
            ToasterNative(_validate(), 'danger', 'bottom');
        }

    }






    return (

        <Container loading={spinner}>
            <Header navigation={navigation} label={i18n.t('profile')} />
            <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>



                <ScrollView style={{ flex: 1, width, backgroundColor: Colors.bg }} showsVerticalScrollIndicator={false}>
                    {user && modalVisible ?
                        <>

                            <View style={styles.ImgsContainer}>
                                <View style={{ width: 70, height: 70, borderRadius: 50, backgroundColor: '#ffffff42', padding: 5, marginBottom: 5 }}>
                                    <Image source={{ uri: userImage }} style={{ width: '100%', height: '100%', borderRadius: 50 }} resizeMode='cover' />
                                    <TouchableOpacity onPress={_pickImage} style={{ position: 'absolute', bottom: 0, zIndex: 1, right: 0 }}>
                                        <Image source={require('../../../assets/images/camera.png')} style={{ width: 20, height: 20 }} resizeMode='contain' />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.stext}>{name}</Text>
                            </View>

                            <InputIcon
                                label={i18n.t('username')}
                                value={name}
                                onChangeText={(e) => setName(e)}
                                image={require('../../../assets/images/edit.png')}
                                styleCont={{ marginTop: 30, }}


                                inputStyle={{ borderRadius: 20, height: 30, backgroundColor: '#fff', borderColor: Colors.sky, paddingTop: Platform.OS == 'ios' ? 25 : 0 }}

                            />
                            <InputIcon
                                label={i18n.t('phone')}
                                value={phone}
                                onChangeText={(e) => setPhone(e)}
                                inputStyle={{ borderRadius: 20, height: 30, backgroundColor: '#fff', borderColor: Colors.sky, paddingTop: Platform.OS == 'ios' ? 25 : 0 }}
                                styleCont={{ marginTop: 20, }}
                                image={require('../../../assets/images/edit.png')}

                            />
                            <InputIcon
                                label={i18n.t('email')}
                                placeholder={i18n.t('enterEmail')}
                                value={email}
                                onChangeText={(e) => setemail(e)}
                                inputStyle={{ borderRadius: 20, height: 30, backgroundColor: '#fff', borderColor: Colors.sky, paddingTop: Platform.OS == 'ios' ? 25 : 0 }}
                                styleCont={{ marginTop: 20, }}

                                image={require('../../../assets/images/edit.png')}

                            />
                            <BTN title={i18n.t('changePass')} onPress={() => { setShowModal(true); }} ContainerStyle={[styles.Btn, { borderRadius: 20 }]} TextStyle={{ fontSize: 13 }} />
                            <LoadingBtn loading={loading}>
                                <BTN title={i18n.t('confirm')} onPress={UpdateProfile} ContainerStyle={[styles.Btn, { marginTop: 10, borderRadius: 20, marginBottom: 10 }]} TextStyle={{ fontSize: 13 }} />

                            </LoadingBtn>
                        </>

                        :
                        null
                    }
                    {
                        modalVisible ?
                            null :
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 80, flex: 1 }}>

                                <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                                    <View style={{ justifyContent: 'space-between', backgroundColor: '#E5E5E5', width, flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ padding: 20, color: Colors.fontBold, fontFamily: 'flatMedium', }}>{i18n.t('profile')}</Text>
                                        <Image source={require('../../../assets/images/arrBlack.png')} resizeMode='contain' style={[styles.MenueImg, { marginRight: 20, transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }] }]} />
                                    </View>
                                </TouchableOpacity>


                                <View style={{ width, height: .5, backgroundColor: Colors.fontBold, opacity: .5 }} />

                                <TouchableOpacity onPress={() => navigation.navigate('Address')}>
                                    <View style={{ justifyContent: 'space-between', backgroundColor: '#E5E5E5', width, flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ padding: 20, color: Colors.fontBold, fontFamily: 'flatMedium', }}>{i18n.t('addAddress')}</Text>
                                        <Image source={require('../../../assets/images/arrBlack.png')} resizeMode='contain' style={[styles.MenueImg, { marginRight: 20, transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }] }]} />
                                    </View>
                                </TouchableOpacity>

                                <View style={{ width, height: .5, backgroundColor: Colors.fontBold, opacity: .8 }} />

                                <TouchableOpacity onPress={() => navigation.navigate('MobileStatues')} >
                                    <View style={{ justifyContent: 'space-between', backgroundColor: '#E5E5E5', width, flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ padding: 20, color: Colors.fontBold, fontFamily: 'flatMedium', }}>{i18n.t('phonee')}</Text>
                                        <Image source={require('../../../assets/images/arrBlack.png')} resizeMode='contain' style={[styles.MenueImg, { marginRight: 20, transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }] }]} />
                                    </View>
                                </TouchableOpacity>


                            </View>

                    }


                </ScrollView>




                <Modal
                    onBackdropPress={() => setShowModal(false)}
                    onBackButtonPress={() => setShowModal(false)}
                    backdropColor="rgba(255,255,255,0.6)"

                    isVisible={showModal}
                    style={{ marginTop: 50 }}
                    avoidKeyboard={true}
                >
                    <View style={styles.modalView}>
                        <View style={{ backgroundColor: '#FFA903', width: '100%', height: height * .08, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={[styles.sText, { color: Colors.bg, fontFamily: 'flatMedium', }]}>{i18n.t('changePass')}</Text>
                        </View>
                        <View style={{ width: '100%' }}>
                            <InputIcon
                                label={i18n.t('oldPassword')}
                                placeholder={i18n.t('oldPassword')}
                                inputStyle={{ borderRadius: 20, height: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                                styleCont={{ height: 45, marginTop: 50 }}
                                LabelStyle={{ bottom: 60, backgroundColor: 0, color: Colors.fontNormal }}
                                image={require('../../../assets/images/view.png')}
                                onPress={() => setShowPass(!showPass)}
                                secureTextEntry={!showPass}
                                onChangeText={(e) => setPassword(e)}
                                value={password}
                            />
                            <InputIcon
                                label={i18n.t('newPassword')}
                                placeholder={i18n.t('newPassword')}
                                inputStyle={{ borderRadius: 20, height: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                                styleCont={{ height: 45, marginTop: 50 }}
                                LabelStyle={{ bottom: 60, backgroundColor: 0, color: Colors.fontNormal }}
                                image={require('../../../assets/images/view.png')}
                                onPress={() => setShowNewPass(!showNewPass)}
                                secureTextEntry={!showNewPass}
                                onChangeText={(e) => setNewPassword(e)}
                                value={Newpassword}
                            />
                            <InputIcon
                                label={i18n.t('enNewPass')}
                                placeholder={i18n.t('enNewPass')}
                                inputStyle={{ borderRadius: 20, height: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                                styleCont={{ height: 45, marginTop: 50 }}
                                LabelStyle={{ bottom: 60, backgroundColor: 0, color: Colors.fontNormal }}
                                image={require('../../../assets/images/view.png')}
                                onPress={() => setShowConNewPass(!showConNewPass)}
                                secureTextEntry={!showConNewPass}
                                onChangeText={(e) => setConfirmPassword(e)}
                                value={confirmPassword}
                            />
                        </View>
                        <BTN title={i18n.t('confirm')} onPress={ChanPasswordProfile} ContainerStyle={[styles.Btn, { marginTop: 15, marginBottom: 15, flex: Platform.OS === 'android' ? .19 : .1 }]} TextStyle={{ fontSize: 18 }} />
                    </View>
                </Modal>
            </View>
        </Container>


    )
}
const styles = StyleSheet.create({
    BigImg: {
        height: height * .15,
        width: width * .25,
    },
    MenueImg: {
        width: 12,
        height: 12,
        marginHorizontal: 4,

    },
    AText: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: width * .026,
        alignSelf: 'center'
    },
    BText: {
        fontFamily: 'flatMedium',
        color: Colors.fontBold,
        fontSize: width * .03,
        marginLeft: 10,
        marginRight: 50
    },
    Text: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: width * .045,
        textAlign: 'center',
        top: width * .19,

    },
    starImg: {
        width: width * .04,
        height: width * .04,
        marginVertical: 5

    },
    ImgsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    images: {
        width: 100,
        height: 100,
        borderRadius: 100,


    },
    stext: {
        fontFamily: 'flatMedium',
        color: Colors.sky,
        fontSize: width * .035
    },
    Btn: {
        borderRadius: 30,
        width: '90%'
    }, centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#737373',
        opacity: .9,

    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 5,
        width: width * .9,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
        height: height * .7
    },
    WrapText: {
        backgroundColor: Colors.sky,
        width: width * .9,
        height: width * .12
    },
    fText: {
        fontFamily: 'flatMedium',
        color: Colors.bg,
        fontSize: width * .035,
        textAlign: 'center',
        paddingTop: 10
    },
})
export default MyProfile
