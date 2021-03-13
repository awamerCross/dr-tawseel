import React, { useState, useEffect } from 'react'
import { ScrollView, View, Image, TouchableOpacity, Text, StyleSheet, Dimensions, Modal, FlatList } from 'react-native'
import { AppLoading } from 'expo';

import Colors from '../../consts/Colors';
import { InputIcon } from '../../common/InputText';




const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')
import Header from '../../common/Header';

function ChatOrderDetailes({ navigation }) {
    const [isLoading, Setisloading] = useState(false);
    if (isLoading) {
        return <AppLoading />;
    } else {
        return (
            <View style={{ flex: 1 }}>

                <Header navigation={navigation} label='تفاصيل الطلب' image={require('../../../assets/images/bill.png')} />
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ width, height: height * .1, backgroundColor: '#dbdbdb', marginTop: 30 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../../../assets/images/girl.jpg')} style={styles.ResImgNm} />
                            <Text style={[styles.sText, { color: Colors.IconBlack }]}>اوامر الشبكه</Text>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Image source={require('../../../assets/images/yellowstar.png')} style={styles.starImg} />
                                <Image source={require('../../../assets/images/yellowstar.png')} style={styles.starImg} />
                                <Image source={require('../../../assets/images/yellowstar.png')} style={styles.starImg} />
                                <Image source={require('../../../assets/images/yellowstar.png')} style={styles.starImg} />
                            </View>
                            <TouchableOpacity>
                                <Image source={require('../../../assets/images/callchat.png')} style={styles.ResImgNm} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('FollowOrder')}>
                                <Image source={require('../../../assets/images/mapchat.png')} style={[styles.ResImgNm, { marginLeft: 0 }]} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: -width * .05 }}>
                            <Image source={require('../../../assets/images/money.png')} style={styles.ResImg} resizeMode='contain' />
                            <Text style={[styles.sText, { fontSize: width * .026 }]}>تكلفه التوصيل 50ريال </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}>
                        <View style={{ backgroundColor: Colors.sky, width: '70%', marginHorizontal: 5, marginTop: 20, height: width * .16, borderRadius: 20 }}>
                            <Text style={[styles.sText, { color: Colors.bg, marginTop: 10 }]}>هذا النص هو مثال لنص يمكن ان يستبدل في نفس المساحه</Text>
                        </View>
                        <Image source={require('../../../assets/images/girl.jpg')} style={[styles.ResImgNm, { alignSelf: 'center', marginRight: width * .05 }]} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginTop: 10, }}>
                        <Text style={[styles.sText, { fontSize: width * .025 }]}>11:43 AM</Text>
                        <Image source={require('../../../assets/images/tickblue.png')} style={styles.MenueImgs} resizeMode='contain' />
                        <Image source={require('../../../assets/images/tickblue.png')} style={styles.MenueImgs} resizeMode='contain' />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}>
                        <Image source={require('../../../assets/images/girl.jpg')} style={[styles.ResImgNm, { alignSelf: 'center', }]} />

                        <View style={{ backgroundColor: '#DBDBDB', width: '70%', marginTop: 20, height: width * .16, borderRadius: 20, marginRight: width * .03 }}>
                            <Text style={[styles.sText, { color: Colors.IconBlack, marginTop: 10 }]}>هذا النص هو مثال لنص يمكن ان يستبدل في نفس المساحه</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, marginRight: width * .09 }}>
                        <Image source={require('../../../assets/images/tickblue.png')} style={styles.MenueImgs} resizeMode='contain' />
                        <Text style={[styles.sText, { fontSize: width * .025, marginHorizontal: 0 }]}>11:43 AM</Text>
                        <Image source={require('../../../assets/images/tickblue.png')} style={styles.MenueImgs} resizeMode='contain' />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}>
                        <View style={{ backgroundColor: Colors.sky, width: '70%', marginHorizontal: 20, marginTop: 20, height: width * .16, borderRadius: 20 }}>
                            <Text style={[styles.sText, { color: Colors.bg, marginTop: 10 }]}>هذا النص هو مثال لنص يمكن ان يستبدل في نفس المساحه</Text>
                        </View>
                        <Image source={require('../../../assets/images/girl.jpg')} style={[styles.ResImgNm, { alignSelf: 'center', marginLeft: 0, marginRight: width * .05 }]} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginTop: 10, }}>
                        <Text style={[styles.sText, { fontSize: width * .025 }]}>11:43 AM</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}>
                        <Image source={require('../../../assets/images/girl.jpg')} style={[styles.ResImgNm, { alignSelf: 'center', }]} />

                        <View style={{ backgroundColor: '#DBDBDB', width: '70%', marginTop: 20, height: width * .16, borderRadius: 20, marginRight: width * .03 }}>
                            <Text style={[styles.sText, { color: Colors.IconBlack, marginTop: 10 }]}>هذا النص هو مثال لنص يمكن ان يستبدل في نفس المساحه</Text>
                        </View>
                    </View>




                </ScrollView>


                <View style={{ bottom: 0, flexDirection: 'row', width, height: height * .09, backgroundColor: Colors.bg }}>

                    <TouchableOpacity >
                        <View style={{ flexDirection: 'column', marginLeft: width * .05, top: width * .05 }}>
                            <View style={{ width: 5, height: 5, borderRadius: 5, backgroundColor: Colors.fontNormal }}></View>
                            <View style={{ width: 5, height: 5, borderRadius: 5, backgroundColor: Colors.fontNormal, marginVertical: 3 }}></View>
                            <View style={{ width: 5, height: 5, borderRadius: 5, backgroundColor: Colors.fontNormal }}></View>
                        </View>
                    </TouchableOpacity>

                    <InputIcon
                        placeholder='اكتب تعليقك هنا'
                        inputStyle={{ borderRadius: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                        styleCont={{ height: width * .17, marginTop: width * .03, width: '70%', marginHorizontal: 9 }}
                        LabelStyle={{ backgroundColor: 0 }}
                    />
                    <Image source={require('../../../assets/images/sendmassege.png')} style={styles.SendIcon} resizeMode='contain' />
                </View>


            </View>
        )
    }
}

const styles = StyleSheet.create({
    BigImg: {
        height: height * .15,
        width: width * .22,
    },
    MenueImg: {
        width: 18,
        height: 20,
        marginHorizontal: 4,

    },
    MenueIm: {
        width: width * .07,
        height: width * .07,
        marginHorizontal: 5

    },
    MenueImgs: {
        width: width * .03,
        height: width * .03,

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
        marginHorizontal: 10,
        alignSelf: 'center'
    },
    starImg: {
        width: width * .04,
        height: width * .04,
        marginVertical: 5

    },
    ResImgNm: {
        width: width * .1,
        height: width * .1,
        borderRadius: 50,
        marginTop: height * .026,
        marginLeft: width * .09,
        marginHorizontal: width * .03

    },
    ResIm: {
        width: width * .16,
        height: width * .16,
        borderRadius: 50,
        marginTop: width * .05,
        alignSelf: 'center'

    },
    ResImg: {
        width: width * .06,
        height: width * .08,
        borderRadius: 50,
        marginLeft: width * .24
    },
    SendIcon: {
        width: width * .1,
        bottom: width * .02
    },
    centeredView: {
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
        height: height * .59,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5
    },
})

export default ChatOrderDetailes
