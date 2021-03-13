import React, {useEffect, useState} from 'react'
import { ScrollView, View, Image, StyleSheet, Dimensions, Text, FlatList } from 'react-native'
import Colors from '../../consts/Colors';
import StarRating from "react-native-star-rating";
import i18n from "../../components/locale/i18n";

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

function ClientComments({comments}) {

    return (
        < View style={{ flex: 1, marginTop: 20 }}>
            {
                comments.length > 0 ?
                    <FlatList
                        data={comments}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => (item.id).toString()}
                        renderItem={({ item, index }) =>
                            (
                                <>
                                    <View style={{ flexDirection: 'row', paddingHorizontal: 20,paddingVertical:5}}>
                                        <Image source={{uri:item.user.avatar}} style={{ width: 35, height:35, borderRadius: 50,marginRight:10 , borderWidth:1 , borderColor:'#ddd'}} />
                                        <View style={{ flexDirection: 'column'  , flex:1}}>
                                            <View style={{flexDirection:'row' , justifyContent:'space-between' , width:200}}>
                                                <Text style={{fontSize:15,fontFamily: 'flatMedium',}}>{item.user.name}</Text>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' , alignItems:'center'}}>
                                                    <StarRating
                                                        disabled={false}
                                                        maxStars={5}
                                                        rating={item.rate}
                                                        fullStarColor={'#fbd96f'}
                                                        starSize={12}
                                                        starStyle={{ marginHorizontal: 0 }}
                                                    />
                                                    <Text style={{ fontFamily: 'flatRegular', fontSize: 12, marginLeft:5}}>{item.rate}/5</Text>
                                                </View>
                                            </View>
                                            <Text style={[styles.AText , {alignSelf:'flex-start'}]}>{item.comment}</Text>
                                        </View>
                                    </View>

                                    <View style={{ width, height: 2, backgroundColor: '#ebebeb', marginVertical: 15 }}/>
                                </>
                            )} />
                            :
                            <View style={{ marginTop: 100 }}>
                                <Image source={require('../../../assets/images/empty.png')} resizeMode={'contain'} style={{ width: 150, height: 150, alignSelf: 'center' }} />
                                <Text style={[styles.textCard, { textAlign: 'center', fontSize: 16 }]}>{ i18n.t('noData') }</Text>
                            </View>
            }

        </View >
    )
}

const styles = StyleSheet.create({

    AText: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: 12,
        marginTop:5
    },
    BText: {
        fontFamily: 'flatMedium',
        color: Colors.fontBold,
        fontSize: width * .03,

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



})

export default ClientComments
