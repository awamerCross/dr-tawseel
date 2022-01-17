import React from 'react'
import { View,  StyleSheet } from 'react-native';
import Colors from '../consts/Colors';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import {LinearGradient} from 'expo-linear-gradient'

export const _renderRows = (loadingAnimated, numberRow, uniqueKey, width, height, Containner, ShimerPlaceholder) => {
    let shimmerRows = [];
    for (let index = 0; index < numberRow; index++) {
        shimmerRows.push(
            <ShimmerPlaceHolder
                key={`loading-${index}-${uniqueKey}`}
                ref={(ref) => loadingAnimated.push(ref)}
                style={[styles.Shhimer, ShimerPlaceholder]}
                width={width}
                height={height}
                colorShimmer={[Colors.sky, Colors.sky, Colors.sky]}
                duration={2600}
                LinearGradient={LinearGradient}
            />
        )
    }
    return (
        <View style={Containner}>
            {shimmerRows}
        </View>
    )
}


const styles = StyleSheet.create({
    Shhimer: { marginVertical: 7, marginHorizontal: 5, alignSelf: 'center', borderRadius: 25, }
})
