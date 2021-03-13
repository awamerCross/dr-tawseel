import React from 'react'
import { View, ActivityIndicator } from 'react-native';
import Colors from '../consts/Colors';


const SpinnerLaoding = ({ loading, children }) => {

    if (loading) {

        return (
            <View style={{
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
            }}>
                <ActivityIndicator size="large" color={Colors.sky} style={{ alignSelf: 'center' }} />
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
export default SpinnerLaoding