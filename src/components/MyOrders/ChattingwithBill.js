import React, { useState, useEffect } from 'react'
import { ScrollView, View, Image, TouchableOpacity, Text, StyleSheet, Dimensions, Modal, FlatList } from 'react-native'
import { DrawerActions } from '@react-navigation/native';

import Colors from '../../consts/Colors';
import { InputIcon } from '../../common/InputText';
import BTN from '../../common/BTN';
import Header from '../../common/Header';
import StarRating from "react-native-star-rating";
import i18n from "../locale/i18n";




const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

function ChattingWithBill({ navigation }) {

    const [selected, setisSelected] = useState(false);
    const [IsDeliverMoadl, setIsDeliverMoadl] = useState(false)
    const [isopened, setIsopend] = useState(false)
    const [selectedRadion, setSelectedRadio] = useState(0)
    const [data, setData] = useState([
        { id: '1', title: 'هذا النص هو مثال لنص يمكن ان يستبدل', },
        { id: '2', title: 'هذا النص هو مثال لنص يمكن ان يستبدل', },
        { id: '3', title: 'هذا النص هو مثال لنص يمكن ان يستبدل', },
        { id: '4', title: 'هذا النص هو مثال لنص يمكن ان يستبدل', },
        { id: '5', title: 'هذا النص هو مثال لنص يمكن ان يستبدل', }])
    const [starCount, setStarCount] = useState(0);



    return (
        <View style={{ flex: 1, }}>
            <Header navigation={navigation} label={i18n.t('orderDetails')} />

            <ScrollView style={{ flex: 1 }}>

                {/* Chat */}


                <View style={{ width, height: 75, backgroundColor: '#dbdbdb', marginTop: 30 }}>
                    <View style={{ flexDirection: 'row' , justifyContent: 'space-between'}}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../../../assets/images/girl.jpg')} style={styles.ResImgNm} />
                            <Text style={[styles.sText, { color: Colors.IconBlack }]}>اوامر الشبكه</Text>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <StarRating
                                    disabled={false}
                                    maxStars={5}
                                    rating={4}
                                    fullStarColor={'#fec104'}
                                    starSize={13}
                                    starStyle={{ marginHorizontal: 0 }}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/callchat.png')} style={styles.ResImgNm} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginRight:20 , marginLeft:10}} onPress={() => navigation.navigate('FollowOrder')}>
                                <Image source={require('../../../assets/images/mapchat.png')} style={[styles.ResImgNm, { marginLeft: 0 }]} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: -8 }}>
                        <Image source={require('../../../assets/images/money.png')} style={styles.ResImg} resizeMode='contain' />
                        <Text style={[{ fontFamily: 'flatMedium', color: Colors.fontNormal,fontSize: 11 }]}>{i18n.t('delivryPrice')} 50ريال </Text>
                    </View>
                </View>
                <View style={{ width, height: 40, backgroundColor: '#C0C0C0', justifyContent: 'center' }}>
                    <Text style={[styles.sText, { color: Colors.IconBlack, }]}>{i18n.t('getBill')}</Text>
                </View>


                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' , paddingHorizontal:15}}>
                        <View style={{ backgroundColor: Colors.sky, width: '85%', marginTop: 20 , paddingVertical:10, borderRadius: 20 , justifyContent:'center'}}>
                            <Text style={[styles.sText, { color: Colors.bg, lineHeight:20}]}>هذا النص هو مثال لنص يمكن ان يستبدل في نفس المساحه</Text>
                        </View>
                        <Image source={require('../../../assets/images/girl.jpg')} style={[styles.ResImgNm, { alignSelf: 'center' , marginLeft:0}]} />
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginTop: 10, }}>
                        <Text style={[styles.sText, { fontSize: width * .025 }]}>11:43 AM</Text>
                        <Image source={require('../../../assets/images/tickblue.png')} style={styles.MenueImgs} resizeMode='contain' />
                        <Image source={require('../../../assets/images/tickblue.png')} style={styles.MenueImgs} resizeMode='contain' />
                    </View>
                </View>


                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' , paddingHorizontal:15}}>
                        <Image source={require('../../../assets/images/girl.jpg')} style={[styles.ResImgNm, { alignSelf: 'center', marginLeft:0}]} />

                        <View style={{ backgroundColor: '#DBDBDB', width: '85%', marginTop: 20, paddingVertical:10, borderRadius: 20 , justifyContent:'center'}}>
                            <Text style={[styles.sText, { color: Colors.IconBlack,lineHeight:20 }]}>هذا النص هو مثال لنص يمكن ان يستبدل في نفس المساحه</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, marginRight: width * .09 }}>
                        <Image source={require('../../../assets/images/tickblue.png')} style={styles.MenueImgs} resizeMode='contain' />
                        <Text style={[styles.sText, { fontSize: width * .025, marginHorizontal: 0 }]}>11:43 AM</Text>
                        <Image source={require('../../../assets/images/tickblue.png')} style={styles.MenueImgs} resizeMode='contain' />

                    </View>
                </View>


                {/* Delivered  order*/}
                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={IsDeliverMoadl}
                    >

                        <View   style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <TouchableOpacity style={{position:'absolute' , right:10 ,top:10}} onPress={() => setIsDeliverMoadl(false)}>
                                    <Image source={require('../../../assets/images/close.png')} style={[styles.ResImgNm, { alignSelf: 'center', marginLeft: 0, marginTop: 0,
                                        width: 20, height: 20 }]} />
                                </TouchableOpacity>
                                <Image source={require('../../../assets/images/yass.jpg')} style={styles.ResIm} />
                                <Text style={[styles.sText, { color: Colors.IconBlack , marginTop:10 }]}>ياسر البطل</Text>
                                <View style={{ flexDirection: 'row', marginTop: 10 , marginBottom:15, alignSelf: 'center' }}>
                                    <StarRating
                                        maxStars={5}
                                        rating={starCount}
                                        selectedStar={(rating) => setStarCount(rating)}
                                        fullStarColor={'#fec104'}
                                        starSize={24}
                                        starStyle={{ marginHorizontal: 5 }}
                                    />
                                </View>
                                <InputIcon
                                    placeholder={i18n.t('writeComment')}
                                    inputStyle={{ backgroundColor: '#eaeaea', borderColor: '#eaeaea', textAlignVertical: 'top', paddingTop: 10, borderRadius: 5 }}
                                    styleCont={{ height: width * .3, marginHorizontal: 10, width: '90%' , alignSelf:'center' }}
                                    LabelStyle={{ bottom: width * .42, backgroundColor: 0, left: 10, color: Colors.IconBlack }}
                                />
                                <BTN title={i18n.t('sendRate')} onPress={() => { setIsDeliverMoadl(false); navigation.navigate('SuccessEvaluation') }} ContainerStyle={{ marginTop: 10, borderRadius: 20, }} TextStyle={{ fontSize:13 }} />
                            </View>
                        </View>
                    </Modal>
                </View>

                {/* cancelOrder */}

                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isopened}   >

                        <View  style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Colors.bg, padding: 15 , marginBottom:15}}>
                                    <Text style={[styles.sText, { marginHorizontal: 0, color: Colors.IconBlack }]}>{i18n.t('cancellationReason')}</Text>
                                    <TouchableOpacity onPress={() => setIsopend(false)}>
                                        <Image source={require('../../../assets/images/close.png')} style={[styles.ResImgNm, { alignSelf: 'center', marginLeft: 0, marginTop: 0,  width: 20, height: 20 }]} />
                                    </TouchableOpacity>
                                </View>
                                <FlatList data={data}
                                          keyExtractor={(item) => item.id}
                                          renderItem={({ item, index }) => {
                                              return (
                                                  <View>
                                                      <View style={{ flexDirection: 'row', alignItems: 'center' , paddingHorizontal:15}}>
                                                          <TouchableOpacity onPress={() => setSelectedRadio(index)} >
                                                              <View style={{
                                                                  height: 15,
                                                                  width: 15,
                                                                  borderRadius: 12,
                                                                  borderWidth: 2,
                                                                  borderColor: selectedRadion === index ? Colors.sky : Colors.fontNormal,
                                                                  alignItems: 'center',
                                                                  justifyContent: 'center',
                                                              }}>
                                                                  {
                                                                      selectedRadion === index ?
                                                                          <View style={{
                                                                              height: 7,
                                                                              width: 7,
                                                                              borderRadius: 6,
                                                                              backgroundColor: Colors.sky,
                                                                          }} />
                                                                          : null
                                                                  }
                                                              </View>
                                                          </TouchableOpacity>
                                                          <Text style={[styles.sText, { color: selectedRadion === index ? Colors.sky : Colors.fontNormal , fontSize:13 }]}>{item.title}</Text>

                                                      </View>
                                                      <View style={{ height: 1, width: '100%', backgroundColor: Colors.fontNormal, marginVertical: 15, }}></View>
                                                  </View>
                                              )
                                          }} />

                                <BTN title={i18n.t('send')} onPress={() => { setIsopend(false); navigation.navigate('NotificationsList') }} ContainerStyle={{ marginBottom: width * .1, borderRadius: 50, }} TextStyle={{ fontSize:13 }} />
                            </View>
                        </View>
                    </Modal>
                </View>
            </ScrollView>
            {/* Points Bottom */}
            {
                selected ?
                    <View style={{ bottom: 0, flexDirection: 'column', marginLeft: width * .05, width: width * .34, borderRadius: 5, height: height * .18, borderWidth: 1, backgroundColor: Colors.bg, borderColor: Colors.sky, alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => setIsDeliverMoadl(true)}>
                            <Text style={[styles.sText, { bottom: width * .01, marginVertical: 5 }]}>{i18n.t('received')}</Text>
                        </TouchableOpacity>
                        <View style={{ height: 1, width: '100%', backgroundColor: '#E8E8E8', marginVertical: 5 }}></View>
                        <TouchableOpacity onPress={() => navigation.navigate('SendComplaiment')}>
                            <Text style={[styles.sText, { bottom: width * .01, marginVertical: 5 }]}>{i18n.t('upComplaint')}</Text>
                        </TouchableOpacity>
                        <View style={{ height: 1, width: '100%', backgroundColor: '#E8E8E8', marginVertical: 5 }}></View>
                        <TouchableOpacity onPress={() => setIsopend(true)}>
                            <Text style={[styles.sText, { marginVertical: 5 }]}>{i18n.t('cancelOrder')}</Text>
                        </TouchableOpacity>
                    </View> : null
            }


            <View style={{ bottom: 0, flexDirection: 'row', width, height:70, backgroundColor: Colors.bg , justifyContent: 'center' }}>

                <TouchableOpacity onPress={() => setisSelected(!selected)}>
                    <View style={{ flexDirection: 'column', top: width * .05 }}>
                        <View style={{ width: 5, height: 5, borderRadius: 5, backgroundColor: Colors.fontNormal }}></View>
                        <View style={{ width: 5, height: 5, borderRadius: 5, backgroundColor: Colors.fontNormal, marginVertical: 3 }}></View>
                        <View style={{ width: 5, height: 5, borderRadius: 5, backgroundColor: Colors.fontNormal }}></View>
                    </View>
                </TouchableOpacity>

                <InputIcon
                    placeholder={i18n.t('writeUrMsg')}
                    inputStyle={{ borderRadius: 30, backgroundColor: '#eaeaea', borderColor: '#eaeaea' }}
                    styleCont={{ height: 40, marginTop: width * .03, width: '70%', marginHorizontal: 9 }}
                    LabelStyle={{ backgroundColor: 0 }}
                />
                <Image source={require('../../../assets/images/sendmassege.png')} style={styles.SendIcon} resizeMode='contain' />
            </View>


        </View>
    )
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
        marginLeft: 25,

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
export default ChattingWithBill
