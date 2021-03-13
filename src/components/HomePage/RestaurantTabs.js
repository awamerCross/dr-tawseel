import React from 'react'
import { Tab, Tabs, ScrollableTab, Container, Header } from 'native-base';
import Colors from '../../consts/Colors';
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, ImageBackground } from 'react-native'
import i18n from "../locale/i18n";


const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')
function RestaurantTabs({ navigation }) {
    return (
        <Container>

            <Tabs style={{ flex: 1 }} renderTabBar={() => <ScrollableTab underlineStyle={styles.lineTab} />} >
                <Tab heading={i18n.t('all')} activeTextStyle={{ color: Colors.sky, fontFamily: 'flatMedium', }} textStyle={{ color: '#939393', fontFamily: 'flatMedium', }} activeTabStyle={{ backgroundColor: 'white', }} tabStyle={{ backgroundColor: Colors.bg }}>
                    <ScrollView style={{ flex: 1, marginTop: 20 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('ProductDetailes')}>
                            <View style={styles.card}>
                                <Image source={require('../../../assets/images/pic.png')} style={styles.ImgCard} />
                                <View style={{ flexDirection: 'column' }}>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={styles.sText}>اسم المنتج</Text>
                                        <Text style={[styles.sText, { color: Colors.sky, marginHorizontal: 0, marginLeft: width * .26 }]}>25:00 رس</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingStart: 5 }}>
                                        <Text style={[styles.yText, { color: Colors.fontNormal, fontSize: width * .022, marginTop: 5 }]}> هذا النص هو مثال لنص يمكن ان يتولد في نفس المساحه</Text>
                                    </View>
                                </View>

                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { }}>
                            <View style={styles.card}>
                                <Image source={require('../../../assets/images/pic.png')} style={styles.ImgCard} />
                                <View style={{ flexDirection: 'column' }}>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={styles.sText}>اسم المنتج</Text>
                                        <Text style={[styles.sText, { color: Colors.sky, marginHorizontal: 0, marginLeft: width * .26 }]}>25:00 رس</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingStart: 5 }}>
                                        <Text style={[styles.yText, { color: Colors.fontNormal, fontSize: width * .022, textAlign: 'center', marginTop: 5 }]}> هذا النص هو مثال لنص يمكن ان يتولد في نفس المساحه</Text>
                                    </View>
                                </View>

                            </View>
                        </TouchableOpacity>

                    </ScrollView>
                </Tab>
                <Tab heading="مشويات" activeTextStyle={{ color: Colors.sky, fontFamily: 'flatMedium', fontSize: width * .03 }} textStyle={{ color: '#939393', fontFamily: 'flatMedium', fontSize: width * .03 }} activeTabStyle={{ backgroundColor: 'white', }} tabStyle={{ backgroundColor: Colors.bg }}>
                    <ScrollView style={{ flex: 1, marginTop: 20 }}>
                    </ScrollView>
                </Tab>
                <Tab heading="حلويات" activeTextStyle={{ color: Colors.sky, fontFamily: 'flatMedium', fontSize: width * .03 }} textStyle={{ color: '#939393', fontFamily: 'flatMedium', fontSize: width * .03 }} activeTabStyle={{ backgroundColor: 'white', }} tabStyle={{ backgroundColor: Colors.bg }}>
                    <ScrollView style={{ flex: 1, marginTop: 20 }}>
                    </ScrollView>
                </Tab>
                <Tab heading="سلطات" activeTextStyle={{ color: Colors.sky, fontFamily: 'flatMedium', fontSize: width * .03 }} textStyle={{ color: '#939393', fontFamily: 'flatMedium', fontSize: width * .03 }} activeTabStyle={{ backgroundColor: 'white', }} tabStyle={{ backgroundColor: Colors.bg }}>
                    <ScrollView style={{ flex: 1, marginTop: 20 }}>
                    </ScrollView>
                </Tab>
                <Tab heading="معجنات" activeTextStyle={{ color: Colors.sky, fontFamily: 'flatMedium', fontSize: width * .03 }} textStyle={{ color: '#939393', fontFamily: 'flatMedium', fontSize: width * .03 }} activeTabStyle={{ backgroundColor: 'white', }} tabStyle={{ backgroundColor: Colors.bg }}>
                    <ScrollView style={{ flex: 1, marginTop: 20 }}>
                    </ScrollView>
                </Tab>
                <Tab heading="مشروبات" activeTextStyle={{ color: Colors.sky, fontFamily: 'flatMedium', fontSize: width * .03 }} textStyle={{ color: '#939393', fontFamily: 'flatMedium', fontSize: width * .03 }} activeTabStyle={{ backgroundColor: 'white', }} tabStyle={{ backgroundColor: Colors.bg }}>
                    <ScrollView style={{ flex: 1, marginTop: 20 }}>
                    </ScrollView>
                </Tab>

            </Tabs>
        </Container>


    )
}
const styles = StyleSheet.create({

    Text: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: width * .045,
        textAlign: 'center',
    },
    lineTab: {
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderBottomWidth: 10,
        borderBottomColor: Colors.sky,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        marginHorizontal: height * .06,
        alignItems: 'center',
        justifyContent: 'center'
    },
    yText: {
        fontFamily: 'flatMedium',
        color: Colors.bg,
        fontSize: width * .03,
        marginTop: width * .01
    },
    card: {
        shadowColor: Colors.bg,
        backgroundColor: Colors.bg,
        flexDirection: 'row',
        marginHorizontal: 20,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 1,
        marginVertical: 5,
        width: width * .89,
        height: height * .1,
        paddingTop: 10,
        paddingStart: 10,
        overflow: 'hidden'

    },
    ImgCard: {
        width: width * .15,
        height: width * .15,
        borderRadius: 5
    },
    sText: {
        fontFamily: 'flatMedium',
        color: Colors.fontBold,
        fontSize: width * .036,
        marginHorizontal: 10
    },

})
export default RestaurantTabs
