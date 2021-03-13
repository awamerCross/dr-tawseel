import React, { useState, useEffect } from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text, FlatList, I18nManager, Platform } from 'react-native'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { useSelector, useDispatch } from 'react-redux';
import { getMyOrders } from '../../actions';
import Container from '../../common/Container';
import { DrawerActions } from '@react-navigation/native';

import Colors from '../../consts/Colors';
import Header from '../../common/Header';
import i18n from "../locale/i18n";
import LoadingBtn from '../../common/Loadbtn';
import { _renderRows } from '../../common/LoaderImage';

const { width, height } = Dimensions.get('window')
const isIOS = Platform.OS === 'ios';

function MyOrders({ navigation }) {
    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null);
    const user = useSelector(state => state.Auth ? state.Auth.user ? state.Auth.user.data : null : null)
    const myOrders = useSelector(state => state.orders.myOrders);
    const dispatch = useDispatch();
    const [delegate, setdelegate] = useState(true)
    const [status, setStatus] = user && user.user_type == 2 ? useState('WAITING') : useState('RUNNING')
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    let loadingAnimated = []

    console.log(myOrders);



    useEffect(() => {
        setIndex(0)
        setStatus(user && user.user_type == 2 ? "WAITING" : 'RUNNING')
        const unsubscribe = navigation.addListener('focus', () => {
            setLoading(true)
            setIndex(0)
            dispatch(getMyOrders(lang, token, status, delegate)).then(() => setLoading(false))
        })
        return unsubscribe
    }, [navigation]);

    const [routes] = useState([
        { key: 'first', title: user && user.user_type == 2 ? i18n.t('waiting') : i18n.t('New') },
        { key: 'second', title: i18n.t('underimplement') },
        { key: 'third', title: i18n.t('CompletedOrder') },
    ]);

    const changeTab = (index) => {
        setLoading(true)

        setIndex(index)
        let newStatus = '';
        setLoading(true)

        if (index === 0)
            newStatus = user && user.user_type == 2 ? 'WAITING' : 'RUNNING';
        else if (index === 1)
            newStatus = user && user.user_type == 2 ? 'RUNNING' : 'DELIVERED';
        else if (index === 2)
            newStatus = 'FINISHED';
        setStatus(newStatus)

        dispatch(getMyOrders(lang, token, newStatus, delegate)).then(() => setLoading(false))
    }

    function renderOrders() {
        if (myOrders && myOrders.length == 0) {
            return (
                <View style={{ marginTop: 100 }}>
                    <Image source={require('../../../assets/images/empty.png')} resizeMode={'contain'} style={{ width: 150, height: 150, alignSelf: 'center' }} />
                    <Text style={[styles.textCard, { textAlign: 'center', fontSize: 16, fontFamily: 'flatMedium', }]}>{i18n.t('noData')}</Text>
                </View>
            )
        }

        return (


            loading ?
                _renderRows(loadingAnimated, 10, '2rows', width * .89, 80, { flexDirection: 'column', }, { borderRadius: 10, })

                :

                <FlatList
                    data={myOrders}
                    style={{ marginTop: 5 }}
                    showsVerticalScrollIndicator={false}
                    extraData={loading}

                    keyExtractor={(item) => (item.order_id).toString()}
                    renderItem={({ item, index }) =>
                        (<TouchableOpacity onPress={() => navigation.navigate('OrderDetailes', { orderId: item.order_id })}>
                            <View style={styles.card}>
                                <View style={{ flexDirection: 'row', flex: .75 }}>
                                    <View style={{ width: 60, height: 60, justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={{ uri: item.provider.avatar }} style={styles.ImgCard} resizeMode={'cover'} />
                                    </View>
                                    <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                                        <Text style={styles.sText}>{(item.provider.name).substr(0, 25)}</Text>
                                        <Text style={[styles.yText, { alignSelf: 'flex-start', fontSize: 12 }]}> {item.date}</Text>
                                    </View>
                                </View>

                                <View style={[styles.sLine]} />
                                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: .25 }}>
                                    <Text style={[styles.sText, { color: Colors.sky, marginHorizontal: 0 }]}>{i18n.t('orderNum')}</Text>
                                    <Text style={[styles.sText, { marginVertical: 5 }]}>{item.order_id}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        )}
                />


        )
    }

    const renderScene = SceneMap({
        first: renderOrders,
        second: renderOrders,
        third: renderOrders,
    });

    const renderTabBar = props => (

        <TabBar
            {...props}
            getLabelText={({ route }) => route.title}
            activeColor={Colors.sky}
            inactiveColor={Colors.IconBlack}
            labelStyle={{
                fontSize: width * 0.035,
                fontFamily: 'flatMedium',
                textAlign: 'center'
            }}
            // onIndexChange={e => changeTab(e)}
            style={{ backgroundColor: Colors.bg }}
            indicatorStyle={{ backgroundColor: Colors.sky }}
            pressColor={Colors.bg}
        />

    );

    return (
        <View style={{ flex: 1 }}>

            <View style={styles.container}>
                <View>
                    <Image source={require('../../../assets/images/bluBack.png')} style={[styles.BigImg, { transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }], }]} resizeMode='contain' />
                    <View style={styles.wrap}>
                        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                            <Image source={require('../../../assets/images/menue.png')} style={[styles.MenueImg, { marginBottom: width * .04, transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }] }]} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ marginTop: 40 }}>
                    <Text style={styles.Text}> {i18n.t('myOrders')}</Text>

                </View>


                <TouchableOpacity style={{ marginTop: 40 }} onPress={user && user.user_type == 2 ? () => navigation.navigate('GoHome') : () => navigation.navigate('RebHome')}>
                    <Image source={require('../../../assets/images/arrBlack.png')} resizeMode='contain' style={[styles.MenueImg, { marginHorizontal: width * .05, transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }] }]} />
                </TouchableOpacity>

            </View>

            <TabView
                navigationState={{ index, routes }}
                onIndexChange={(index) => { changeTab(index); }}
                onSwipeStart={(i) => console.log(i)}
                renderScene={renderScene}
                lazy={true}
                renderLazyPlaceholder={() => _renderRows(loadingAnimated, 10, '2rows', width * .89, 80, { flexDirection: 'column', }, { borderRadius: 10, })}
                initialLayout={width}
                renderTabBar={renderTabBar}
            />



        </View >

    )
}
const styles = StyleSheet.create({
    BigImg: {
        height: height * .15,
        width: width * .22,
    },
    MenueImg: {
        width: 30,
        height: 30,


    },

    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.bg,
        marginTop: isIOS ? 20 : 0
        // marginTop: isIOS ? 20 : 0
    },
    BigImg: {
        left: -13,
        top: -10,
        height: 90,
        width: 90,
    },
    MenueImg: {
        width: 20,
        height: 20,
    },
    wrap: {
        position: 'absolute',
        marginHorizontal: 25,
        bottom: width * .04
    },
    Text: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: width * .04,
        textAlign: 'center',
    },
    sLine: { height: height * .08, width: 1, backgroundColor: '#e5e0e0', },

    tabContainer: {
        backgroundColor: "white",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        alignItems: "center",
        marginTop: 10,
        height: 40
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
        height: 80,
        paddingStart: 10,
        overflow: 'hidden',
        borderRadius: 10,
        marginTop: 0,
        alignItems: 'center',

    },
    ImgCard: {
        width: '100%',
        height: '100%',
        borderRadius: 5
    },
    sText: {
        fontFamily: 'flatMedium',
        color: Colors.IconBlack,
        fontSize: width * .03,
        marginHorizontal: 5,
        flexWrap: 'wrap',
    },
    iconImg: {
        width: 12,
        height: 12,
        marginHorizontal: 1,
        marginVertical: 5

    },
    yText: {
        fontFamily: 'flatLight',
        color: Colors.IconBlack,
        fontSize: width * .026,
        marginTop: width * .02,
        marginHorizontal: 10
    },
})
export default MyOrders
