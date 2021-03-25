import React, { useState } from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, I18nManager } from 'react-native'
import Colors from '../../consts/Colors';
import BTN from '../../common/BTN';
import { InputIcon } from '../../common/InputText';
import Header from '../../common/Header';
import i18n from "../locale/i18n";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Button, Textarea } from "native-base";
import { ToasterNative } from '../../common/ToasterNatrive';


const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')
let base64 = [];

function YourOrder({ navigation, route }) {

    const [photos, setPhotos] = useState([]);
    const { place } = route.params;
    const [desc, setDesc] = useState('');

    function confirmDelete(i) {
        photos.splice(i, 1);
        setPhotos([...photos]);
        base64.splice(i, 1);
    };

    function renderUploadImgs() {
        let imgBlock = [];
        for (let i = 0; i < photos.length; i++) {
            imgBlock.push(
                <TouchableOpacity key={i} onPress={() => _pickImage(i)} style={[{ width: 100, height: 100, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', marginHorizontal: 10 }]}>
                    <Image source={{ uri: photos[i].image }} style={{ width: '90%', height: '88%', borderRadius: 10 }} resizeMode={'cover'} />
                    {
                        photos[i] ?
                            <TouchableOpacity onPress={() => confirmDelete(i)} style={{ position: 'absolute', top: 0, right: 0, zIndex: 2, backgroundColor: Colors.sky, padding: 3, borderRadius: 30, width: 25, height: 25, justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={require('../../../assets/images/close.png')} resizeMode='stretch' style={{ width: 15, height: 15 }} />
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

    function renderBTN() {
        if (desc == '') {
            return (
                <Button style={{ marginVertical: 10, borderRadius: 20, backgroundColor: '#999', width: '85%', alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} disabled={true}>
                    <Text style={[styles.sText, { color: '#fff', textAlign: 'center', alignSelf: 'center' }]}>{i18n.t('sentOrder')}</Text>
                </Button>
            )
        }


        return (
            <BTN title={i18n.t('done')} onPress={() => navigation.navigate('DeliveryReceiptLoaction', { place, desc, base64 })} ContainerStyle={{ marginTop: 35, borderRadius: 20, marginBottom: 30, paddingVertical: 10, }} TextStyle={{ fontSize: 16 }} />
        )
    }


    return (
        <View style={{ flex: 1 }}>
            <Header navigation={navigation} label={i18n.t('orderStore')} />
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={styles.ImgText}>
                        <Image source={{ uri: place.icon }} style={styles.ResImgNm} />
                        <Text style={[styles.sText, { alignSelf: 'flex-start', writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr', lineHeight: 22 }]}>{place.name}</Text>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text style={[styles.labelText,
                        {
                            color: desc ? Colors.sky : Colors.IconBlack, paddingHorizontal: 10, fontSize: 13,
                            top: 10
                        },
                        ]}  >
                            {i18n.t('orderDetails')}
                        </Text>
                        <Textarea
                            style={{
                                backgroundColor: '#eaeaea', borderColor: '#eaeaea', textAlignVertical: 'top', paddingTop: 10, height: 150, marginTop: 40,
                                width: '100%', alignSelf: 'center', fontFamily: 'flatMedium', fontSize: 13, textAlign: I18nManager.isRTL ? 'right' : 'left', borderRadius: 5
                            }}
                            onChangeText={(e) => setDesc(e)}
                            value={desc}
                            placeholder={i18n.t('writeOrderDet')}
                            placeholderTextColor={Colors.fontNormal}
                        />
                    </View>

                </View>
                <TouchableOpacity onPress={photos.length == 3 ? () => ToasterNative(i18n.t('exNum'), "danger", "bottom") : _pickImage}>
                    <Image source={require('../../../assets/images/fileupload.png')} style={styles.fileupload} resizeMode='contain' />
                </TouchableOpacity>
                <Text style={[styles.sText, { textAlign: 'center', marginTop: 5 }]}>{i18n.t('uploadImg')}</Text>
                <View>
                    <ScrollView style={{ alignSelf: 'flex-start', marginTop: 20 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                        {renderUploadImgs()}
                    </ScrollView>
                </View>

                {renderBTN()}

            </ScrollView>
        </View>

    )
}
const styles = StyleSheet.create({
    BigImg: {
        height: height * .15,
        width: width * .22,
    },
    MenueImg: {
        width: 20,
        height: 20,


    },
    Text: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: width * .04,
        textAlign: 'center',
        top: width * .19
    },
    sText: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: width * .036,
        marginHorizontal: 10
    },
    BText: {
        fontFamily: 'flatMedium',
        color: Colors.fontBold,
        fontSize: width * .036,
    },
    MText: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: width * .02,
        alignSelf: 'center',
        marginHorizontal: width * .39
    },
    container: {
        padding: 15,
        marginTop: width * .07,
        marginBottom: 20
    },
    ImgText: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    ResImgNm: {
        width: width * .14,
        height: width * .14,
        borderRadius: 50
    },
    fileupload: {
        width: width * .2,
        height: width * .2,
        alignSelf: 'center'
    },
    orderImg: {
        width: width * .22,
        height: width * .22,
        borderRadius: 5
    },
    imgWrap: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        marginHorizontal: width * .1
    },
    labelText: {
        left: 0,
        alignSelf: "flex-start",
        fontSize: width * .03,
        zIndex: 10,
        position: "absolute",
        fontFamily: 'flatMedium',


    },

})
export default YourOrder