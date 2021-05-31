import React from 'react'
import { ImageBackground, Image, StyleSheet, Dimensions, View, I18nManager, TouchableOpacity } from 'react-native'

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')


function LogoLogin({ navigation }) {
    return (
        <View >
            <ImageBackground source={require('../../assets/images/LoginBackGround.png')} style={styles.container} resizeMode='cover'>
                <Image source={require('../../assets/images/LogoLogin.png')} style={styles.images} resizeMode='contain' />
            </ImageBackground>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 40, alignSelf: 'flex-end', position: 'absolute', padding: 10 }}>
                <Image source={require('../../assets/images/arrs.png')} style={{ height: 20, width: 20, transform: I18nManager.isRTL ? [{ rotate: '0deg' }] : [{ rotate: '180deg' }] }} resizeMode='contain' />
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: '104%',
        height:280,
        alignItems: 'center',
        alignSelf: 'center'
    },
    images: {
        width: '100%',
        height: '50%',
        marginVertical: width * .17,

    },
})
export default LogoLogin