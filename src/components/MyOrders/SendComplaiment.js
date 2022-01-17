import React, { useState, useEffect } from 'react'
import {
    ScrollView,
    View,
    Image,
    TouchableOpacity,
    Text,
    StyleSheet,
    Dimensions,
    Modal,
    I18nManager,
    Platform
} from 'react-native'
import { DrawerActions } from '@react-navigation/native';

import Colors from '../../consts/Colors';
import { InputIcon } from '../../common/InputText';
import BTN from '../../common/BTN';
import RadioButton from '../../common/RadioButton';
import RNPickerSelect from 'react-native-picker-select';
import Header from '../../common/Header';
import i18n from "../locale/i18n";
import { Label } from "native-base";
import * as ImagePicker from 'expo-image-picker';
import { ToasterNative } from '../../common/ToasterNatrive';




const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')
const isIOS = Platform.OS === 'ios';
let base64 = [];

function SendComplaiment({ navigation }) {
    const [reason, setReason] = useState(null);
    const [photos, setPhotos] = useState([]);

    function confirmDelete(i) {
        photos.splice(i, 1);
        setPhotos([...photos]);
        base64.splice(i, 1);
        console.log('base64', base64)
        console.log('photos', photos)
    };


    function renderUploadImgs() {
        let imgBlock = [];
        for (let i = 0; i < photos.length; i++) {
            imgBlock.push(
                <TouchableOpacity key={i} onPress={() => _pickImage(i)} style={[{ width: 100, height: 100, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', marginHorizontal: 10 }]}>
                    <Image source={{ uri: photos[i].image }} style={{ width: '90%', height: '88%', borderRadius: 10 }} resizeMode={'cover'} />
                    {
                        photos[i] ?
                            <TouchableOpacity onPress={() => confirmDelete(i)} style={{ position: 'absolute', top: 0, right: 0, zIndex: 2 }}>
                                <Image source={require('../../../assets/images/close.png')} resizeMode='stretch' style={{ width: 20, height: 20 }} />
                            </TouchableOpacity>
                            :
                            null
                    }
                </TouchableOpacity>
            )
        }
        return imgBlock
    }

    

    const _pickImage = async (i) => {
        askPermissionsAsync();
        const { status } = await ImagePicker.launchCameraAsync();

        if (status === 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,

                base64: true,
                aspect: [4, 3],
                quality: .5,
            });

            if (!result.cancelled) {
                let tempPhotos = photos;
                if (photos[i]) {
                    tempPhotos[i] = { id: i, image: result.uri };
                    base64[i] = result.base64;
                } else {
                    tempPhotos.push({ id: i, image: result.uri });
                    base64.push(result.base64);
                }

                setPhotos([...tempPhotos]);

            }

        }
        else {
            ToasterNative(i18n.t('CammeraErr'), "danger", 'top')


        }
    };


    return (
        <View style={{ flex: 1, }}>
            <Header navigation={navigation} label={i18n.t('upComplaint')} />

            <ScrollView style={{ flex: 1 }}>
                <View style={{ marginTop: 30, alignItems: 'center' }}>

                    <View style={[styles.inputPicker, styles.flexCenter, { width: '90%', borderColor: Colors.fontNormal, marginBottom: 50 }]}>
                        <Label style={[{ color: Colors.IconBlack, fontFamily: 'flatMedium', top: -13, fontSize: 13 }]}>{i18n.t("compReason")}</Label>

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
                                label: i18n.t("reasonComp"),
                            }}
                            onValueChange={(reason) => setReason(reason)}
                            items={[
                                { label: 'سبب ١', value: 'reason 1' },
                                { label: 'سبب ٢', value: 'reason 2' },
                                { label: 'سبب ٣', value: 'reason 3' },
                            ]}

                            Icon={() => {
                                return <Image source={require('../../../assets/images/arro.png')} style={[{ top: isIOS ? 7 : 18, width: 10, height: 10 }]} resizeMode={'contain'} />
                            }}
                        />
                    </View>
                    <InputIcon
                        label={i18n.t('orderDetails')}
                        placeholder={i18n.t("writeUrDet")}
                        inputStyle={{ backgroundColor: '#eaeaea', borderColor: '#eaeaea', textAlignVertical: 'top', paddingTop: 10, borderRadius: 10 }}
                        styleCont={{ height: width * .3, marginHorizontal: 0, width: width * .85 }}
                        LabelStyle={{ left: 0, bottom: 120, backgroundColor: 0, color: Colors.IconBlack }}
                    />
                </View>
                <TouchableOpacity onPress={_pickImage} style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                    <Image source={require('../../../assets/images/fileupload.png')} style={styles.MenueImgs} resizeMode='contain' />
                    <Text style={styles.sText}>{i18n.t('uploads')}</Text>
                </TouchableOpacity>

                <View>
                    <ScrollView style={{ alignSelf: 'flex-start', marginTop: 20 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                        {renderUploadImgs()}
                    </ScrollView>
                </View>
                <BTN title={i18n.t('send')} onPress={() => { navigation.navigate('NotificationsList') }} ContainerStyle={{ marginTop: 30, borderRadius: 20, }} TextStyle={{ fontSize: 13 }} />

            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    BigImg: {
        height: height * .15,
        width: width * .22,
    },
    Text: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: width * .04,
        textAlign: 'center',
        top: width * .19
    },
    MenueImg: {
        width: 18,
        height: 20,
        marginHorizontal: 4,

    },

    MenueImgs: {
        width: width * .1,
        height: width * .1,

    },

    sText: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: width * .036,
        marginHorizontal: 10,
        alignSelf: 'center'
    },
    inputPicker: {
        paddingRight: 17,
        paddingLeft: isIOS ? 10 : 15,
        height: width * .15,
        flex: 1,
        justifyContent: "flex-end",
        borderWidth: 0,
        color: Colors.fontNormal,
        textAlign: I18nManager.isRTL ? "right" : "left",
        fontFamily: "flatMedium",
        fontSize: 13,
        marginTop: 15,
        marginBottom: 10,
        borderRadius: 30, backgroundColor: '#eaeaea', borderColor: 'transparent',
        alignSelf: 'center'
    }
    , flexCenter: {
        alignSelf: 'center',
    },
})
export default SendComplaiment
