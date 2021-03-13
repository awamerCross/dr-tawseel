import React from 'react'
import { View } from 'react-native'
import Header from '../../common/Header'

function DeliveryDetailes({ navigation }) {
    return (
        <View style={{ flex: 1 }}>
            <Header navigation={navigation} label='تفاصيل التوصيل' />

        </View>
    )
}

export default DeliveryDetailes
