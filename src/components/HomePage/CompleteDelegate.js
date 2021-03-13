import React from "react";
import {
    View,
    Image,
    TouchableOpacity,
    I18nManager, Text
} from "react-native";
import {Container, Content} from 'native-base'
import {useSelector} from "react-redux";
import { WebView } from 'react-native-webview';
import {DrawerActions} from "@react-navigation/native";
import i18n from "../locale/i18n";
import Colors from "../../consts/Colors";

function CompleteDelegate({navigation}) {

    const id    = useSelector(state => state.Auth.user ? state.Auth.user.data.id : null);
    const lang  = useSelector(state => state.lang.lang);

    // function _onLoad(state, navigation) {
    //     console.log(state.url);
    //     if (state.url === domain + 'provider/services') {
    //         navigation.navigate('home')
    //     }
    // }

    console.log('https://drtawsel.aait-sa.com/complete-delegate/'+id+'/'+lang)

    return (

        <Container>

            <Content contentContainerStyle={{ flexGrow: 1 }} style={{padding:15}}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between',marginTop:25 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[{alignSelf:'flex-start' , marginBottom:25 , transform : I18nManager.isRTL ? [{ rotate: '180deg' }] : [{ rotate: '0deg' }],}]}>
                        <Image source={require('../../../assets/images/arrblue.png')} style={[{width:25 , height:25}]} resizeMode={'contain'} />
                    </TouchableOpacity>
                    <Text style={{fontFamily: 'flatMedium',
                        color: Colors.IconBlack,
                        fontSize: 15,}}> {i18n.t('delegateReg')}</Text>
                    <View/>
                </View>

                {
                    id ?
                        <WebView
                            source = {{uri: 'https://drtawsel.aait-sa.com/complete-delegate/'+id+'/'+lang }}
                            style  = {{flex:1 , width:'100%' , height:'100%'}}
                            domStorageEnabled={true}
                            startInLoadingState={true}
                            scalesPageToFit={false}
                            scrollEnabled={true}
                            javaScriptEnabled={true}
                            // onNavigationStateChange={(state) => _onLoad(state, navigation)}
                        />
                        :
                        null
                }

            </Content>

        </Container>
    );
}

export default CompleteDelegate;
