import React from 'react'
import { View, ActivityIndicator, Image, Dimensions } from 'react-native';
import Colors from '../consts/Colors';


const { height } = Dimensions.get('window')
const Container = ({ loading, children }) => {

    if (loading) {

        return (
            <View style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100%',
                height: '100%',
                zIndex: 99999,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                flex: 1

            }}>
                <Image source={require('../../assets/images/ss.gif')} style={{ width: 200, height: 200, }} resizeMode='contain' />
            </View>
        );
    }
    else {
        return (
            <View style={{ flex: 1 }}>
                {children}
            </View>
        )
    }



}
export default Container