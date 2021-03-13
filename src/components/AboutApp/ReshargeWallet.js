import React from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, I18nManager } from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import Colors from '../../consts/Colors';
import i18n from "../locale/i18n";
import Header from "../../common/Header";


const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')
function ReshargeWallet({ navigation }) {
    return (
        <View style={{ flex: 1 }}>
            <Header navigation={navigation} label={i18n.t('rechaWallet')} />
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.container}>
                    {/*<TouchableOpacity onPress={() => Alert.alert('SOOOOOOooooooon')}>*/}
                    {/*    <View style={styles.CardWrap}>*/}
                    {/*        <Image source={require('../../../assets/images/visa.png')} style={styles.BImg} resizeMode='contain' />*/}
                    {/*    </View>*/}
                    {/*</TouchableOpacity>*/}

                    <TouchableOpacity onPress={() => navigation.navigate('VisaBank')}>
                        <View style={[styles.CardWrap, { borderColor: Colors.sky, borderWidth: 1 }]}>
                            <Image source={require('../../../assets/images/bank.png')} style={styles.BImg} resizeMode='contain' />
                        </View>
                    </TouchableOpacity>

                    {/*<TouchableOpacity>*/}
                    {/*    <View style={styles.CardWrap}>*/}
                    {/*        <Image source={require('../../../assets/images/mda.png')} style={styles.BImg} resizeMode='contain' />*/}
                    {/*    </View>*/}
                    {/*</TouchableOpacity>*/}


                </View>
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
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: width * .16
    },
    BImg: {
        width: width * .2,
        height: width * .2,


    },
    CardWrap: {
        shadowColor: Colors.bg,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
        marginVertical: 10,
        width: width * .35,
        height: height * .17,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: Colors.bg,


    },
})

export default ReshargeWallet
