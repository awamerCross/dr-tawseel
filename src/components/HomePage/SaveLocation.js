import React, { useEffect, useState } from "react";
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    Dimensions,
    ScrollView
} from "react-native";
import Colors from "../../consts/Colors";
import { InputIcon } from "../../common/InputText";
import BTN from "../../common/BTN";

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')
function SaveLocation({ navigation }) {
    return (
        <View style={{ backgroundColor: '#696969', flex: 1, }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.WrapText}>
                        <Text style={styles.fText}>حفظ الموقع</Text>
                    </View>
                    <View >
                        <Text style={styles.sText}>مصر .al Adi2.المنصوره (قسم2) المنصوره الدقهليه المنصوره القسم </Text>
                        <InputIcon
                            label={'اسم المكان'}
                            placeholder='ادخل اسم المكان الذي تريد حفظه '
                            inputStyle={{ borderRadius: 30, height: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                            styleCont={{ height: width * .18, marginHorizontal: 35, marginTop: 10 }}
                            LabelStyle={{ bottom: width * .2, backgroundColor: 0 }}
                        />
                    </View>
                    <BTN title='حفظ ' onPress={() => navigation.navigate('SpecialOrder')} ContainerStyle={[styles.Btn, { marginTop: 15 }]} TextStyle={{ fontSize: width * .03, paddingTop: width * .025 }} />
                    <BTN title='الغاء ' onPress={() => navigation.navigate('SpecialOrder')} ContainerStyle={{ marginTop: 10, borderRadius: 20, backgroundColor: '#B4B4B4' }} TextStyle={{ fontSize: width * .03, paddingTop: width * .025 }} />


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
    },
    sText: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: width * .036,
        marginVertical: width * .11,
        marginHorizontal: width * .1
    },
});
export default SaveLocation
