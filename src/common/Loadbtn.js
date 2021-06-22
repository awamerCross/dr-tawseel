


import React from 'react'
import { View, Image } from 'react-native';
import Colors from '../consts/Colors';


const LoadingBtn = ({ loading, children, styleCount }) => {

    if (loading) {

        return (
            <View style={[{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100%',
                height: '100%',
                zIndex: 99999,
                backgroundColor: 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',

            }, styleCount]}>
                <Image source={require('../../assets/images/load.gif')} style={{ width: 40, height: 40 }} resizeMode='contain' />

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
export default LoadingBtn