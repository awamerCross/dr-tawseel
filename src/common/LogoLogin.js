import React from 'react'
import { ImageBackground, Image, StyleSheet, Dimensions, SafeAreaView, I18nManager, TouchableOpacity } from 'react-native'

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')


function LogoLogin({ navigation }) {
    return (
        <SafeAreaView >
            <ImageBackground source={require('../../assets/images/LoginBackGround.png')} style={styles.container} resizeMode='cover'>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10, alignSelf: 'flex-end', marginTop: 20 }}>
                    <Image source={require('../../assets/images/arrs.png')} style={{ height: 20, width: 20, transform: I18nManager.isRTL ? [{ rotate: '0deg' }] : [{ rotate: '180deg' }] }} resizeMode='contain' />
                </TouchableOpacity>
                <Image source={require('../../assets/images/LogoLogin.png')} style={styles.images} resizeMode='contain' />
            </ImageBackground>

        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 280,
        alignItems: 'center',
    },
    images: {
        width: '50%',
        height: '50%',
        // marginVertical: width * .17,
        alignSelf: 'center'

    },
})
export default LogoLogin