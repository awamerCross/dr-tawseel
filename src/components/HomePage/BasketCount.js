import React, { useState, useEffect } from 'react'
import {
    ScrollView,
    View,
    Image,
    TouchableOpacity,
    Text,
    StyleSheet,
    Dimensions,

} from 'react-native'
import Modal from "react-native-modal";

import Colors from '../../consts/Colors';
import i18n from "../locale/i18n";

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')


const BasketCount = ({ pro, i, DeleteCartItem, Decrease, Increase }) => {

    const [count, setCount] = useState(pro.quantity)
    const [click, setClick] = useState(false)
    const [ModelProduct, setModelProduct] = useState([])
    useEffect(() => {
        // setCount()
    }, [])



    const increment = () => {
        if (count <= pro.quantity) {
            Increase()
            setCount(count + 1);
        }


    }

    const decrement = () => {

        if (count > 1) {
            setCount(count - 1);
            Decrease()

        }

    }



    return (
        <View style={{ flex: 1, }}>
            <View style={{  height: 1, backgroundColor: '#DBDBDB' }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, justifyContent: 'space-between' }}>
                {/* // */}
                <View style={{ maxWidth: '33%', alignItems: 'flex-start' }} >
                    <Text style={[styles.oText, { width: '100%', textAlign: 'left' }]} numberOfLines={1} >{pro.name}</Text>
                    <TouchableOpacity onPress={() => { setClick(true); setModelProduct(pro.details) }}>
                        <Text style={[styles.oText, { color: Colors.sky, fontSize: 14, }]}>({i18n.t('details')})</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' ,marginHorizontal : 20}}>
                    <View style={{ height: height * .04, width: 2, backgroundColor: '#DBDBDB' }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 5 }}>
                        <TouchableOpacity onPress={increment}>
                            <Image source={require('../../../assets/images/plus.png')} style={{ width: 20, height: 20, borderRadius: 5, padding: 8 }} />
                        </TouchableOpacity>

                        <Text style={{ color: Colors.sky, marginHorizontal: 10, fontFamily: 'flatMedium', fontSize: 15 }}> {pro.quantity} </Text>

                        <TouchableOpacity onPress={decrement} >
                            <Image source={require('../../../assets/images/munic.png')} style={{ width: 20, height: 20, borderRadius: 5, padding: 8 }} />
                        </TouchableOpacity>
                        <View style={{ height: height * .04, width: 2, backgroundColor: '#DBDBDB', marginHorizontal: 5 }} />
                        <Text style={{ color: Colors.sky, marginHorizontal: 5, fontFamily: 'flatMedium', fontSize: 14, paddingHorizontal: 5 }}>{pro.price} {i18n.t('RS')} </Text>

                        <TouchableOpacity onPress={DeleteCartItem} style={{ alignSelf: 'flex-end', backgroundColor: 'red' }}>
                            <Image source={require('../../../assets/images/delet.png')} style={{ width: 25, height: 25, padding: 15 }} resizeMode='contain' />
                        </TouchableOpacity>
                    </View>

                </View>

            </View>

            <View style={{ width, height: 1, backgroundColor: '#DBDBDB', marginVertical: 3, marginBottom: 15 }} />

            <Modal
                onBackdropPress={() => setClick(false)}
                onBackButtonPress={() => setClick(false)}
                isVisible={click}
                style={{ flex: 1, alignSelf: 'center', }}
            >

                <View style={styles.modalView}>

                    <View style={{ backgroundColor: Colors.sky, width: '100%', height: height * .08, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                        <Text style={[styles.modetext, { color: Colors.bg, }]}>{i18n.t('details')}</Text>
                    </View>
                    <View style={{ flexDirection: 'column', marginTop: 10, marginLeft: 10, }}>

                        {
                            !ModelProduct.extras ?
                                <Text
                                    style={{
                                        fontFamily: 'flatMedium',
                                        color: Colors.IconBlack,
                                        fontSize: width * .04,
                                    }}>
                                    {i18n.t('noDetailss')}
                                </Text> :
                                ModelProduct.extras.map((ex, i) => {
                                    return (
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }} key={'_' + i}>
                                            <Text style={[styles.modetext, { color: Colors.IconBlack, marginVertical: 5 }]}>{ex.name}</Text>
                                            <Text style={[styles.modetext, { color: Colors.sky, marginVertical: 5 }]}>{ex.price} {i18n.t('RS')}</Text>
                                        </View>
                                    )
                                })}


                        <View style={{ flexDirection: 'row' }} >
                            <Text style={[styles.modetext, { color: Colors.IconBlack, marginVertical: 5, }]}>{i18n.t('size')} : </Text>
                            <Text style={[styles.modetext, { color: Colors.sky, marginVertical: 5, marginHorizontal: 3 }]}> {ModelProduct.size} </Text>
                        </View>



                    </View>


                </View>
            </Modal>

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
    Text: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: width * .04,
        textAlign: 'center',
        top: width * .19
    },
    SPrice: {
        color: Colors.sky,
        marginHorizontal: 5,
        fontFamily: 'flatMedium',
        marginRight: 25,
        fontSize: width * .04
    },
    sText: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: 13,
        marginRight: width * .18
    },
    oText: {
        fontFamily: 'flatMedium',
        color: Colors.fontBold,
        fontSize: 10,
    },
    yText: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: 11,
        opacity: .6
    },
    button: {
        width: '80%',
        height: 100,
        alignSelf: 'center',
        marginVertical: 5,
    },
    swipeContentContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        borderColor: '#e3e3e3',
        borderWidth: 1,
    },
    card: {
        shadowColor: Colors.bg,
        backgroundColor: Colors.bg,
        flexDirection: 'row',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 1,
        marginTop: 20,
        padding: 10
    },
    ImgCard: {
        width: 60,
        height: 55,
        borderRadius: 5,
    },
    product: {
        marginTop: 10,
        backgroundColor: '#dcdada94',
        height: width * .13,
        justifyContent: 'center'
    },
    copon: {
        marginVertical: 10,
        backgroundColor: Colors.IconBlack,
        height: width * .13,
        justifyContent: 'center',
    },
    iconImg: {
        width: 12,
        height: 12,
        marginHorizontal: 1,
        marginVertical: 0
    },
    pro: {
        marginLeft: 30,
        color: Colors.sky,
        fontFamily: 'flatMedium',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#737373',
        opacity: Platform.OS === 'ios' ? .99 : .95,
        overflow: 'hidden'


    },
    modalView: {

        backgroundColor: "white",
        borderRadius: 15,
        width: width * .9,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
        paddingBottom: 50
    },
    modetext: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: 12,
        marginHorizontal: 10,
    },
})

export default BasketCount;
