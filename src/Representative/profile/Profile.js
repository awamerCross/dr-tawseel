import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions, } from 'react-native'
import Colors from '../../consts/Colors';
import Header from '../../common/Header';
import i18n from "../../components/locale/i18n";
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import PersonalProfile from './PersonalProfile';
import ClientComments from './ClientComments';
import { useSelector, useDispatch } from 'react-redux';
import { getDelegateComments } from '../../actions';

const { width } = Dimensions.get('window')

function Profile({ navigation }) {

    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.Auth.user ? state.Auth.user.data.token : null);
    const comments = useSelector(state => state.comments.comments);
    const dispatch = useDispatch();
    const [spinner, setSpinner] = useState(false);

    console.log(comments)

    function fetchData() {
        setSpinner(true)
        dispatch(getDelegateComments(lang, token)).then(() => setSpinner(false))
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchData()
        })
        return unsubscribe
    }, [navigation]);


    const [routes] = useState([
        { key: 'first', title: i18n.t('myProfile') },
        { key: 'second', title: i18n.t('clientsComments') },

    ]);
    const [index, setIndex] = useState(0);

    const FirstRoute = () => (
        <PersonalProfile navigation={navigation} />
    )


    const SecondRoute = () => (
        <ClientComments navigation={navigation} comments={comments} />
    )

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,

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
            }}
            style={{ backgroundColor: Colors.bg }}
            indicatorStyle={{ backgroundColor: Colors.sky }}
            pressColor={Colors.bg}
        />
    );

    return (
        <View style={{ flex: 1 }}>
            <Header navigation={navigation} label={i18n.t('myProfile')} />

            <View style={{ flex: 1 }}>
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={width}
                    renderTabBar={renderTabBar}
                />
            </View>



        </View>

    )

}


export default Profile