import React, { useEffect, useState } from 'react'
import { I18nManager, View, Image, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native'
import { Accordion, Icon } from "native-base";
import { DrawerActions } from '@react-navigation/native';
import Colors from '../../consts/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { getQuestions } from '../../actions';
import I18n from '../locale/i18n'
import Container from "../../common/Container";
import Header from "../../common/Header";

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');



function ComplaintsList({ navigation }) {




    const lang = useSelector(state => state.lang.lang);
    const dispatch = useDispatch();
    const questions = useSelector(state => state.questions.questions);
    const [spinner, setSpinner] = useState(true);
    const [accor, setaccor] = useState()

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setSpinner(true)
            setaccor(null)
            dispatch(getQuestions(lang)).then(() => setSpinner(false))
        })
        return unsubscribe
    }, [navigation]);


    return (
        <Container loading={spinner}>
            <Header navigation={navigation} label={I18n.t('ComplaintsList')} />
            <View style={{ marginTop: 40, alignSelf: 'center', width: '100%', paddingHorizontal: 15 }}>
                {
                    questions.map((re, index) => {
                        return (
                            <View>
                                <TouchableOpacity onPress={() => setaccor(index)} style={{ flexDirection: 'row', justifyContent: 'space-between', width: '96%', marginHorizontal: '2%', backgroundColor: Colors.bg, margin: 5, alignItems: 'center', paddingHorizontal: 5, flex: 1, padding: 25 }}>
                                    <Text style={styles.Text}>{re.question}</Text>
                                    {
                                        accor == index ?
                                            <Icon style={{ fontSize: 13, color: Colors.fontNormal }} name="caretdown" type={'AntDesign'} />
                                            :
                                            <Icon style={{ fontSize: 13, color: Colors.sky }} name="caretup" type={'AntDesign'} />

                                    }
                                </TouchableOpacity>
                                {
                                    accor == index ?
                                        <View>
                                            <Text style={styles.stext}>{re.answer}</Text>

                                        </View>
                                        : null
                                }
                            </View>





                        )


                    })
                }

            </View>
        </Container>
    )
}
const styles = StyleSheet.create({
    BigImg: {
        height: height * .14,
        width: width * .23,
    },
    MenueImg: {
        width: 18,
        height: 18,
        marginHorizontal: 4,
    },
    Text: {
        fontFamily: 'flatMedium',
        color: Colors.fontNormal,
        fontSize: 14,
    },
    ImgsContainer: {
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: height * .03
    },
    images: {
        width: width * .4,
        height: width * .4,
    },
    stext: {
        fontFamily: 'flatLight',
        color: Colors.IconBlack,
        fontSize: 12,
        marginVertical: 10,
        marginStart: 15
    },
    lText: { marginTop: 20, paddingHorizontal: 15, fontFamily: 'flatRegular', lineHeight: 20, color: Colors.fontNormal },
})
export default ComplaintsList