import React, { useEffect } from 'react'
import SwiperFlatList from 'react-native-swiper-flatlist';
import { View, StyleSheet, Dimensions, Text, Image, TouchableOpacity, ActivityIndicator, Platform, AsyncStorage } from 'react-native';
import i18n from "../locale/i18n";
import Colors from '../../consts/Colors';
import style from '../../../assets/styles';
import { useSelector, useDispatch } from 'react-redux';
import { getIntro } from '../../actions';

const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';


function WayToAuth({ navigation }) {

	const lang = useSelector(state => state.lang.lang);
	const intro = useSelector(state => state.intro.intro);
	const loader = useSelector(state => state.intro.loader);

	const dispatch = useDispatch();

	useEffect(() => {

		AsyncStorage.getItem("Inro", (err, res) => {
			if (res === "true") {
				navigation.navigate("Login");
			}
		});


		dispatch(getIntro(lang))
	}, [loader]);

	const Begin = async () => {
		await AsyncStorage.setItem('Inro', 'true').then(() => navigation.navigate('Login'))

	}

	return (
		<View style={styles.container}>
			<SwiperFlatList
				index={0}
				showPagination
				paginationActiveColor={Colors.sky}
				paginationStyle={styles.DotContainer}
				paginationStyleItem={{ width: 8, height: 8 }}
			>

				{
					intro.map((intr, i) => (
						<View key={i} style={styles.child}>
							<Image source={{ uri: intr.image }} style={styles.images} />
							<View style={styles.wrapText}>
								<Text style={styles.sText}>{intr.title}</Text>
								<Text numberOfLines={3} style={styles.lText}> {intr.details} </Text>
							</View>
							{
								intro.length == i + 1 ?
									<TouchableOpacity style={styles.Button} onPress={Begin}>
										<Text style={styles.textBtn}>
											{i18n.t('start')}
										</Text>
									</TouchableOpacity> : null
							}
						</View>
					))
				}
			</SwiperFlatList>
		</View>
	)
}


const styles = StyleSheet.create({
	container: { flex: 1 },
	wrapText: { flexDirection: 'column', top: width * 1.2, position: 'absolute', width: '100%' },
	sText: { textAlign: 'center', fontSize: 20, fontFamily: 'flatMedium', color: Colors.fontBold },
	lText: { marginTop: 20, paddingHorizontal: 15, fontFamily: 'flatLight', lineHeight: 20, color: Colors.fontNormal, textAlign: 'center' },
	DotContainer: { marginVertical: width * .2 },
	child: { width, },
	images: { width, height: '100%' },
	Button: { position: 'absolute', bottom: 0, width, backgroundColor: Colors.sky, height: 60, justifyContent: 'center' },
	textBtn: { color: Colors.bg, fontFamily: 'flatMedium', textAlign: 'center', padding: 10, fontWeight: '200', fontSize: 18 }

});



export default WayToAuth
