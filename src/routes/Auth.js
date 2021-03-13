import React, { useState } from 'react'
import MainStackNav, { DrawerNav, DrawerNavRebresentative } from './MainStackNav'
import { UserProvider } from './UserContext';
import { useSelector } from 'react-redux';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';

export const AuthContext = React.createContext();

function MainRoot(props) {
    const [userType, setuserType] = useState("");

    const setLogin = (type) => { setuserType(type); };
    const setLogout = () => { setuserType(" "); };

    const user = useSelector(state => state.Auth.user != null ? state.Auth.user.data : null)

    const RootStack = createStackNavigator()

    return (

        <UserProvider value={{ setLogin, setLogout }}>

            <NavigationContainer>
                <RootStack.Navigator screenOptions={{ headerShown: false }} >
                    {
                        user == null ?
                            <RootStack.Screen name={'MainStack'} component={MainStackNav} />
                            :
                            user.user_type == 2 ?
                                <RootStack.Screen name={'DrawerNav'} component={DrawerNav} />
                                : user.user_type == 3 ?
                                    <RootStack.Screen name={'DrawerNavRebresentative'} component={DrawerNavRebresentative} />
                                    :
                                    <RootStack.Screen name={'MainStack'} component={MainStackNav} />

                    }
                </RootStack.Navigator>
            </NavigationContainer>


        </UserProvider>
    )
}

export default MainRoot