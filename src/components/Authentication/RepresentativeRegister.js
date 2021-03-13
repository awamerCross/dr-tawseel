import React, { useState, useEffect } from 'react'
import { View, Text, Dimensions, StyleSheet, ScrollView, Image, Platform, I18nManager } from 'react-native'
import Constants from "expo-constants";
import axios from 'axios';
import {
    validatePhone,
    validatePassword,
    validateEmail,
    validateUserName,
    validateCode
} from "../../common/Validation";

import LogoLogin from '../../common/LogoLogin'
import { InputIcon } from '../../common/InputText';
import Colors from '../../consts/Colors'
import BTN from '../../common/BTN';
import { Toaster } from '../../common/Toaster';
import { SText } from '../../common/SText';
import { CheckBox, Form, Label } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import i18n from "../locale/i18n";
import RNPickerSelect from 'react-native-picker-select';
import { useSelector, useDispatch } from 'react-redux';
import { getCititis } from '../../actions/CitiesAction';
import Container from '../../common/Container';
import { DelegateRegister } from '../../actions/AuthAction';
import LoadingBtn from '../../common/Loadbtn';

const { width } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';
function RepresentativeRegister({ navigation, route }) {
    const { userType } = route.params;


    const cities = useSelector(state => state.Cities.cities)
    let cityName = cities.map(city => ({ label: city.name, value: city.id }));
    const lang = useSelector(state => state.lang.lang);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState("");
    const [carModel, setcarModel] = useState('')
    const [License, setLisence] = useState('');
    const [carNum, setCarNum] = useState('');
    const [password, setPassword] = useState('');
    const [isSelected, setSelection] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [country, setCountry] = useState(null);
    const [spinner, setSpinner] = useState(true);
    const [email, setemail] = useState('');


    const [LicenseImg, setLisenceImg] = useState('');
    const [Lisencebase64, setLisenceBase64] = useState('');
    const [CarImg, setCarImg] = useState('');
    const [Carbase64, setCarBase64] = useState('');
    const [nationalImage, setnationalImage] = useState('');
    const [nationalImagebase64, setnationalImageBase64] = useState('');
    const [carFormImg, setcarFormImg] = useState('');
    const [carFormImgbase64, setcarFormImgBase64] = useState('');
    const [plateBack, setplateBackImg] = useState('');
    const [carplateBackbase64, setplateBackBase64] = useState('');

    const dispatch = useDispatch()


    const _validate = () => {
        let nameErr = validateUserName(name)
        let phoneErr = validatePhone(phone);
        let passwordErr = validatePassword(password);
        let emailErr = validateEmail(email)
        let CityID = country === null ? i18n.t('CityId') : null
        let Lisencebase64Err = Lisencebase64 && Carbase64 && nationalImagebase64 && carFormImgbase64 && carplateBackbase64 == '' ? i18n.t('picErr') : null


        return nameErr || phoneErr || passwordErr || emailErr || CityID || Lisencebase64Err
    };



    const SubmitLoginHandler = () => {
        setSpinner(true)
        // const field = data.getParts().find(item => item.fieldName === 'key'));
        // if (field) {
        //     const value = field.string;
        // }
        formData.append('name', name)
        formData.append('phone', phone)
        formData.append('password', password)
        formData.append('email', email)
        formData.append('user_type', 3)
        formData.append('identity', License)
        formData.append('city_id', country)
        formData.append('car_model', carModel)
        formData.append('car_plate_number', carNum)
        formData.append('device_id', '1221122212')

        formData.append('identity_img', {
            "name": 552,
            "type": "image/jpeg",
            "uri": "file:/data/user/0/host.exp.exponent/cache/ExperienceData/%2540yasserelbatal%252FDRTawseel/ImagePicker/41ff16f5-0c83-4e67-8462-d90ebb904494.jpg",
        })


        formData.append('car_license', {
            "name": 552,
            "type": "image/jpeg",
            "uri": "file:/data/user/0/host.exp.exponent/cache/ExperienceData/%2540yasserelbatal%252FDRTawseel/ImagePicker/41ff16f5-0c83-4e67-8462-d90ebb904494.jpg",
        })

        formData.append('user_license', {
            "name": 552,
            "type": "image/jpeg",
            "uri": "file:/data/user/0/host.exp.exponent/cache/ExperienceData/%2540yasserelbatal%252FDRTawseel/ImagePicker/41ff16f5-0c83-4e67-8462-d90ebb904494.jpg",
        })

        formData.append('car_plate_front_img', {
            "name": 552,
            "type": "image/jpeg",
            "uri": "file:/data/user/0/host.exp.exponent/cache/ExperienceData/%2540yasserelbatal%252FDRTawseel/ImagePicker/41ff16f5-0c83-4e67-8462-d90ebb904494.jpg",
        })

        formData.append('car_plate_end_img', {
            "name": 552,
            "type": "image/jpeg",
            "uri": "file:/data/user/0/host.exp.exponent/cache/ExperienceData/%2540yasserelbatal%252FDRTawseel/ImagePicker/41ff16f5-0c83-4e67-8462-d90ebb904494.jpg",
        })

        axios.post('https://drtawsel.aait-sa.com/api/v1/sign-up', formData)
            .then((rs) => { console.log(rs) }).catch((e) => {
                console.log(e)
            });
        setSpinner(false)
        console.log(formData.getParts())

        // let val = _validate()
        // if (!val) {
        //     setSpinner(true)
        //dispatch(DelegateRegister(name, phone, password, email, userType, License, country, carModel, carNum, Lisencebase64, Carbase64, nationalImagebase64, carFormImgbase64, carplateBackbase64, lang, navigation))
        //     setSpinner(false)
        // }
        // else {
        //     setSpinner(false);
        //     Toaster(_validate());

        // }
    }

    const askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);

    };

    useEffect(() => {
        setSpinner(true)
        dispatch(getCititis(lang)).then(() => setSpinner(false))
    }, [])

    const formData = new FormData()



    const _pickImage = async (type) => {

        askPermissionsAsync();


        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
        });


        if (!result.cancelled) {
            if (type === 'LicenseImg') {
                console.log('a7000000')
                setLisenceImg(result.uri.split('/').pop());
                let identity_img = {
                    uri: result.uri,
                    type: 'image/jpeg',
                    name: result.width || `temp_image_${result.height}.jpg`
                };
                formData.append('identity_img', {
                    uri: result.uri,
                    type: 'image/jpeg',
                    name: result.width || `temp_image_${result.height}.jpg`
                })
                console.log(identity_img)
            }
            else if (type === 'CarImg') {
                setCarImg(result.uri.split('/').pop());
                formData.append('car_license', {
                    uri: result.uri,
                    type: 'image/jpeg',
                    name: result.width || `temp_image_${result.height}.jpg`
                })
            }
            else if (type === 'nationalImage') {
                setnationalImage(result.uri.split('/').pop());
                formData.append('user_license', {
                    uri: result.uri,
                    type: 'image/jpeg',
                    name: result.width || `temp_image_${result.height}.jpg`
                })
            }
            else if (type === 'carFormImg') {
                setcarFormImg(result.uri.split('/').pop());
                formData.append('car_plate_front_img', {
                    uri: result.uri,
                    type: 'image/jpeg',
                    name: result.width || `temp_image_${result.height}.jpg`
                })
            }
            else if (type === 'plateBack') {
                setplateBackImg(result.uri.split('/').pop());
                formData.append('car_plate_end_img', {
                    uri: result.uri,
                    type: 'image/jpeg',
                    name: result.width || `temp_image_${result.height}.jpg`
                })
            }
        }
    };

    const [image, setimage] = useState('')
    // this.state.formData.append('id', response.data.id);


    // let result = await ImagePicker.launchImageLibraryAsync({
    //     allowsEditing: true,
    //     aspect: [4, 3],
    //     mediaTypes: 'Images',
    // });
    // if (!result.cancelled) {
    //     // setimage(result.uri);
    //     console.log(result.uri);

    // }
    // let localUri = result.uri;
    // let filename = localUri.split('/').pop();
    // let match = /\.(\w+)$/.exec(filename);
    // let type = match ? video / ${ match[1]}: video;
    // this.state.formData.append('media', {
    //     uri: localUri, name: filename, type
    // });


    // formData: new FormData(),




    // function dddd() {


    //     // formData: new FormData(),
    //     let result = await ImagePicker.launchImageLibraryAsync({
    //         allowsEditing: true,
    //         aspect: [4, 3],
    //         mediaTypes: 'Images',
    //         quality: 0
    //     });
    //     if (!result.cancelled) {
    //         this.setState({ video: result.uri, video_base64: result.base64, image: result.uri });
    //     }
    //     let localUri = result.uri;
    //     let filename = localUri.split('/').pop();
    //     let match = /\.(\w+)$/.exec(filename);
    //     // let type = match ? video / ${ match[1]}: video;
    //     this.state.formData.append('media', {
    //         uri: localUri, name: filename, type
    //     });

    // }
    return (

        <View style={styles.container}>
            <LogoLogin navigation={navigation} />
            <ScrollView style={{ flex: 1 }} >
                <Text style={[styles.sText, { marginBottom: 50 }]}>{i18n.t("createAcc")}</Text>
                <View style={{ marginTop: width * .01, }}>
                    <InputIcon
                        label={i18n.t("fullName")}
                        onChangeText={(e) => setName(e)}
                        value={name}
                        LabelStyle={{ paddingHorizontal: 10 }}
                    />
                    <InputIcon
                        label={i18n.t('phone')}
                        // placeholder='الرجاء ادخال رقم الجوال'
                        onChangeText={(e) => setPhone(e)}
                        value={phone}
                        keyboardType='phone-pad'
                        LabelStyle={{ paddingHorizontal: 10 }}
                        styleCont={{ marginTop: 15 }}

                    />
                    <InputIcon
                        label={i18n.t("idNum")}
                        onChangeText={(e) => setLisence(e)}
                        value={License}
                        secureTextEntry
                        keyboardType='numeric'
                        styleCont={{ marginTop: 15 }}
                        LabelStyle={{ paddingHorizontal: 10 }}
                    />

                    <InputIcon
                        label={i18n.t('email')}
                        // placeholder='الرجاء ادخال البريد الاكتروني'
                        onChangeText={(e) => setemail(e)}
                        value={email}
                        keyboardType='email-address'
                        LabelStyle={{ paddingHorizontal: 10 }}
                        styleCont={{ marginTop: 15 }}
                    />

                    <View style={[styles.inputPicker, styles.flexCenter, { width: '90%', borderColor: country ? Colors.sky : Colors.fontNormal }]}>
                        <Label style={[styles.label, { color: country ? Colors.sky : Colors.fontNormal, fontFamily: 'flatMedium', top: country ? -13 : 15 }]}>{i18n.t("cityWork")}</Label>

                        <RNPickerSelect
                            style={{
                                inputAndroid: {
                                    fontFamily: 'flatMedium',
                                    color: Colors.fontNormal,
                                    textAlign: I18nManager.isRTL ? 'right' : 'left',
                                    fontSize: 14,
                                },
                                inputIOS: {
                                    fontFamily: 'flatMedium',
                                    color: Colors.fontNormal,
                                    alignSelf: 'flex-start',
                                    textAlign: I18nManager.isRTL ? 'right' : 'left',
                                    fontSize: 14,
                                },
                            }}
                            placeholder={{
                                label: i18n.t("city"),
                            }}
                            onValueChange={(country) => setCountry(country)}
                            items={cityName}

                            Icon={() => {
                                return <Image source={require('../../../assets/images/arro.png')} style={[styles.icon15, { top: isIOS ? 7 : 18, width: 10, height: 10 }]} resizeMode={'contain'} />
                            }}
                        />
                    </View>

                    <InputIcon
                        label={i18n.t("carModel")}
                        onChangeText={(e) => setcarModel(e)}
                        value={carModel}
                        LabelStyle={{ paddingHorizontal: 10 }}
                        styleCont={{ marginTop: 15 }}
                    />
                    <InputIcon
                        label={i18n.t("carPlate")}
                        onChangeText={(e) => setCarNum(e)}
                        value={carNum}
                        styleCont={{ marginTop: 15 }}
                        LabelStyle={{ paddingHorizontal: 10 }}
                    />
                    <InputIcon
                        label={i18n.t("nationalImage")}
                        LabelStyle={{ paddingHorizontal: 10 }}
                        styleCont={{ marginTop: 15 }}
                        image={require('../../../assets/images/cameragray.png')}
                        imageFocused={require('../../../assets/images/upload.png')}
                        value={nationalImage.substr(0, 35)}
                        editable={false}
                        onPress={() => _pickImage("nationalImage")}
                    />
                    <InputIcon
                        label={i18n.t("carFormImg")}
                        LabelStyle={{ paddingHorizontal: 10 }}
                        styleCont={{ marginTop: 15 }}
                        image={require('../../../assets/images/cameragray.png')}
                        imageFocused={require('../../../assets/images/upload.png')}
                        value={carFormImg.substr(0, 35)}
                        editable={false}
                        onPress={() => _pickImage("carFormImg")}
                    />
                    <InputIcon
                        label={i18n.t("driverLicense")}
                        LabelStyle={{ paddingHorizontal: 10 }}
                        styleCont={{ marginTop: 15 }}
                        image={require('../../../assets/images/cameragray.png')}
                        imageFocused={require('../../../assets/images/upload.png')}
                        value={LicenseImg.substr(0, 35)}
                        editable={false}
                        onPress={() => _pickImage("LicenseImg")}
                    />
                    <InputIcon
                        label={i18n.t("plateFront")}
                        LabelStyle={{ paddingHorizontal: 10 }}
                        styleCont={{ marginTop: 15 }}
                        image={require('../../../assets/images/cameragray.png')}
                        imageFocused={require('../../../assets/images/upload.png')}
                        value={CarImg.substr(0, 35)}
                        editable={false}
                        onPress={() => _pickImage("CarImg")}
                    />
                    <InputIcon
                        label={i18n.t("plateBack")}
                        LabelStyle={{ paddingHorizontal: 10 }}
                        styleCont={{ marginTop: 15 }}
                        image={require('../../../assets/images/cameragray.png')}
                        imageFocused={require('../../../assets/images/upload.png')}
                        value={plateBack.substr(0, 35)}
                        editable={false}
                        onPress={() => _pickImage("plateBack")}
                    />
                    <InputIcon
                        label={i18n.t("password")}
                        onChangeText={(e) => setPassword(e)}
                        value={password}
                        secureTextEntry={!showPass}
                        keyboardType='numeric'
                        styleCont={{ marginTop: 15 }}
                        LabelStyle={{ paddingHorizontal: 10 }}
                        image={require('../../../assets/images/view.png')}
                        onPress={() => setShowPass(!showPass)}

                    />
                </View>
                <LoadingBtn loading={spinner}>

                    <BTN title={i18n.t('createAcc')} onPress={SubmitLoginHandler} />
                </LoadingBtn>

                <View style={styles.WrapText}>
                    <Text style={styles.Text}>{i18n.t("haveAcc")}</Text>
                    <SText title={i18n.t("clickHere")} style={{ paddingTop: 0, color: Colors.sky, marginLeft: 5 }} onPress={() => navigation.navigate('Login')} />
                </View>
                <Image source={require('../../../assets/images/building.png')} style={styles.building} resizeMode='cover' />
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg,
        width
    },
    Text: {
        fontFamily: 'flatMedium',
        color: '#A8A8A8',
        fontSize: 12
    },
    sText: {
        textAlign: 'center',
        fontFamily: 'flatMedium',
        color: Colors.sky,
        fontSize: 18,
        marginTop: 20
    },
    WrapText: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    checkboxContainer: {
        flexDirection: "row",
        justifyContent: 'center'

    },
    building: {
        width,
        height: 100,
        marginTop: 20,
    },
    checkbox: {
        alignSelf: "center",
    },
    inputPicker: {
        paddingRight: 17,
        paddingLeft: isIOS ? 10 : 15,
        height: width * .15,
        flex: 1,
        justifyContent: "flex-end",
        borderWidth: 1,
        borderRadius: 5,
        color: Colors.fontNormal,
        textAlign: I18nManager.isRTL ? "right" : "left",
        fontFamily: "flatMedium",
        fontSize: 13,
        marginTop: 15,
        marginBottom: 10
    }
    , flexCenter: {
        alignSelf: 'center',
    },
    label: {
        left: 9,
        paddingRight: 10,
        paddingLeft: 10,
        alignSelf: 'flex-start',
        fontFamily: 'flatMedium',
        fontSize: 14,
        zIndex: 10,
        position: 'absolute',
        backgroundColor: '#fff'
    },


})
export default RepresentativeRegister
