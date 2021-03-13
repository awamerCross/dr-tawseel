import React from "react";
import {

    StyleSheet,
    Text,
    View,
    Dimensions,

} from "react-native";
import Colors from "../../consts/Colors";
import { InputIcon } from "../../common/InputText";
import i18n from "../../components/locale/i18n";
import BTN from '../../common/BTN';

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')
const ChangePass = ({ navigation }) => {


    return (
        <View style={{ backgroundColor: '#696969', flex: 1, }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.WrapText}>
                        <Text style={styles.fText}>{i18n.t('cnagePass')}</Text>
                    </View>
                    <View style={{ width }}>
                        <InputIcon
                            label={i18n.t('oldPass')}
                            placeholder={i18n.t('enteroldPass')}
                            inputStyle={{ borderRadius: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                            styleCont={{ height: width * .12, marginTop: width * .1, marginHorizontal: 25 }}
                            LabelStyle={{ bottom: width * .14, backgroundColor: 0, left: 0, color: Colors.IconBlack }}
                            image={require('../../../assets/images/view.png')}
                        />
                        <InputIcon
                            label={i18n.t('newpass')}
                            placeholder={i18n.t('enternewPass')}
                            inputStyle={{ borderRadius: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                            styleCont={{ height: width * .12, marginHorizontal: 25, marginTop: 20 }}
                            LabelStyle={{ bottom: width * .14, backgroundColor: 0, left: 0, color: Colors.IconBlack }}
                            image={require('../../../assets/images/view.png')}
                        />
                        <InputIcon
                            label={i18n.t('confirmnewPass')}
                            placeholder={i18n.t('enterconfirmnewPass')}
                            inputStyle={{ borderRadius: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                            styleCont={{ height: width * .12, marginHorizontal: 25, marginTop: 20 }}
                            LabelStyle={{ bottom: width * .14, backgroundColor: 0, left: 0, color: Colors.IconBlack }}
                            image={require('../../../assets/images/view.png')}
                        />
                    </View>
                    <BTN title={i18n.t('confirm')} onPress={() => navigation.navigate('RebProfile')} ContainerStyle={[styles.Btn, { marginTop: 15 }]} TextStyle={{ fontSize: width * .03, }} />

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
        height: height * .55,
        width: width * .9
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
    Btn: {
        borderRadius: 30
    }
});

export default ChangePass;
