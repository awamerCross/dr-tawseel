import React, { useState } from 'react'
import MainStackNav, { DrawerNav, DrawerNavRebresentative } from './MainStackNav'
import { useSelector } from 'react-redux';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';

export const AuthContext = React.createContext();

function MainRoot(props) {


    const user = useSelector(state => state.Auth.user != null ? state.Auth.user.data : null)
    const usertype = useSelector(state => state.lang.usertype);


    const RootStack = createStackNavigator()

    return (


        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }} >
                {
                    user == null ?
                        <RootStack.Screen name={'MainStack'} component={MainStackNav} />
                        :
                        (user.user_type == 2 || usertype == 2 && user.user_type == 3) ?
                            <RootStack.Screen name={'DrawerNav'} component={DrawerNav} />
                            : user.user_type == 3 ?
                                <RootStack.Screen name={'DrawerNavRebresentative'} component={DrawerNavRebresentative} />
                                :
                                <RootStack.Screen name={'MainStack'} component={MainStackNav} />

                }
            </RootStack.Navigator>
        </NavigationContainer>


    )
}

export default MainRoot