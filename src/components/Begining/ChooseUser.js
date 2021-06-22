import React, { Fragment } from 'react'
import { View, TouchableOpacity, Text, Image } from 'react-native'
import { Icon } from 'native-base'
import Colors from '../../consts/Colors'
import i18n from "../locale/i18n";
import { useSelector, useDispatch } from 'react-redux'
import WayToAuth from './WayToAuth'
import { SText } from '../../common/SText';
import { ChooseUserCaptain } from '../../actions';


function ChooseUser({ navigation }) {

    const type = useSelector(state => state.lang.type);
    const dispatch = useDispatch();

    const ChooseUserType = (type) => {
        dispatch(ChooseUserCaptain(type))
        navigation.navigate('Login')
    }
    return (

        <Fragment>
            {
                !type ?
                    <WayToAuth />
                    :
                    <View style={{ flex: 1 }}>
                        <View style={{ width: '100%', backgroundColor: Colors.sky, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={require('../../../assets/images/LogoLogin.png')} style={{ width: '50%', height: '30%', }} resizeMode='contain' />
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'row', flex: 1 }}>

                            <TouchableOpacity style={{ flexDirection: 'column', alignItems: 'center' }} onPress={() => ChooseUserType(2)}>
                                <Icon type={'MaterialCommunityIcons'} name={'account-group'} style={{ fontSize: 80, color: Colors.sky }} />
                                <Text style={{ fontFamily: 'flatMedium' }}>{i18n.t('Client')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ flexDirection: 'column', alignItems: 'center' }} onPress={() => ChooseUserType(3)}>
                                <Icon type={'MaterialCommunityIcons'} name={'car'} style={{ fontSize: 80, color: Colors.sky }} />
                                <Text style={{ fontFamily: 'flatMedium' }}>{i18n.t('Captin')}</Text>
                            </TouchableOpacity>

                        </View>
                        <SText title={i18n.t("DrPolicy")} style={{ paddingVertical: 10, color: Colors.IconBlack, marginLeft: 5, marginHorizontal: 10, fontSize: 12 }} onPress={() => navigation.navigate('politics', { typeName: 'Register' })} />

                    </View>
            }
        </Fragment>

    )
}

export default ChooseUser
