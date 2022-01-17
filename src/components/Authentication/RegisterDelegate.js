import React from "react";
import { Container, Content } from 'native-base'
import { WebView } from 'react-native-webview';
import LogoLogin from "../../common/LogoLogin";
import { useSelector } from "react-redux";

function RegisterDelegate({ navigation }) {

    const lang = useSelector(state => state.lang?.lang);

    return (

        <Container>

            <Content contentContainerStyle={{ flexGrow: 1 }} >
                <LogoLogin navigation={navigation} />
                <WebView
                    source={{ uri: 'https://drtawsel.aait-sa.com/register-delegate/' + lang }}
                    style={{ flex: 1, width: '100%', height: '100%' }}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    scalesPageToFit={false}
                    scrollEnabled={true}
                    javaScriptEnabled={true}
                // onNavigationStateChange={(state) => _onLoad(state, navigation)}
                />

            </Content>

        </Container>
    );
}

export default RegisterDelegate;
