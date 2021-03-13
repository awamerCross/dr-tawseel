import React, { useState, useEffect } from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, I18nManager } from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import Colors from '../../consts/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { getRooms } from '../../actions';
import I18n from "../locale/i18n";
import Header from "../../common/Header";
import i18n from "../locale/i18n";
import { _renderRows } from '../../common/LoaderImage';
import { useIsFocused } from '@react-navigation/native';

const { width, height } = Dimensions.get('window')

function Chatting({ navigation }) {
    const dispatch = useDispatch();
    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null);
    const rooms = useSelector(state => state.chat.rooms);
    const user = useSelector(state => state.Auth ? state.Auth.user ? state.Auth.user.data : null : null)
    const [spiner, setspiner] = useState(true)
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            setspiner(true)
            dispatch(getRooms(lang, token)).then(() => setspiner(false))
        }
    }, [isFocused]);

    let loadingAnimated = []
    return (
        <ScrollView style={{ flex: 1 }}>
            <Header navigation={navigation} label={I18n.t('chats')} />

            {

                spiner ?
                    _renderRows(loadingAnimated, 10, '2rows', width * .89, 90, { flexDirection: 'column', }, { borderRadius: 5, })

                    :
                    rooms && rooms.length > 0 ?
                        rooms.map((room, i) => (
                            <TouchableOpacity onPress={() => navigation.navigate('OrderChatting', { receiver: user.user_type == 2 ? room.order.delegate : room.order.user, sender: user.user_type == 2 ? room.order.user : room.order.delegate, orderDetails: room.order })} key={i} style={styles.card}>
                                <Image source={{ uri: room.img }} style={styles.ImgCard} />
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={styles.sText}>{room.name}</Text>
                                        <Text style={[styles.yText]}> {room.time}</Text>
                                    </View>
                                    <Text style={[styles.yText, { alignSelf: 'flex-start', writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' }]}>{room.message}</Text>
                                </View>
                            </TouchableOpacity>
                        ))
                        :
                        <View style={{ marginTop: 100 }}>
                            <Image source={require('../../../assets/images/empty.png')} resizeMode={'contain'} style={{ width: 150, height: 150, alignSelf: 'center' }} />
                            {/*<Text style={[styles.textCard, { textAlign: 'center', fontSize: 16 }]}>{ i18n.t('noData') }</Text>*/}
                        </View>
            }

        </ScrollView>
    )
}
const styles = StyleSheet.create({
    BigImg: {
        height: height * .15,
        width: width * .22,
    },
    MenueImg: {
        width: 18,
        height: 18,
        marginHorizontal: 4,

    },
    Text: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: width * .045,
        textAlign: 'center',
        top: width * .19,

    },
    ImgsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: height * .03
    },
    card: {
        shadowColor: Colors.bg,
        backgroundColor: Colors.bg,
        flexDirection: 'row',
        marginHorizontal: 25,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 1,
        marginVertical: 5,
        padding: 10
    },
    ImgCard: {
        width: width * .12,
        height: width * .12,
        borderRadius: 50
    },
    iconImg: {
        width: 12,
        height: 12,
        marginHorizontal: 1,
        marginVertical: 5

    },
    yText: {
        fontFamily: 'flatLight',
        color: Colors.fontNormal,
        fontSize: width * .03,
        marginTop: width * .01,
        marginHorizontal: 10
    },
    sText: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: width * .03,
        marginHorizontal: 10
    },
})
export default Chatting
