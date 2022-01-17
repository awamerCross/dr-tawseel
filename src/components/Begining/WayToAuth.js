import React, { useEffect, Fragment } from 'react'
import SwiperFlatList from 'react-native-swiper-flatlist';
import { View, StyleSheet, Dimensions, Text, Image, TouchableOpacity, ActivityIndicator, Platform,  } from 'react-native';
import i18n from "../locale/i18n";
import Colors from '../../consts/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { getIntro, SwiperBegines } from '../../actions';
import ChooseLang from './ChooseLang';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get('window');

function WayToAuth() {

	const lang = useSelector(state => state.lang.lang);
	const intro = useSelector(state => state.intro.intro);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getIntro(lang))
	}, []);

	const Begin = () => dispatch(SwiperBegines('start'))

	return (

		<Fragment>
			{
				!lang ?
					<ChooseLang />
					:
					< View style={styles.container}>
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
										<Image source={{ uri: intr.image }} style={styles.images} resizeMode='contain' />
										<View style={styles.wrapText}>
											<Text style={styles.sText}>{intr.title}</Text>
											<Text style={styles.lText}> {intr.details} </Text>
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
			}
		</Fragment>

	)
}


const styles = StyleSheet.create({
	container: { flex: 1 },
	wrapText: { flexDirection: 'column', bottom: 80, position: 'absolute', width: '100%' },
	sText: { textAlign: 'center', fontSize: 14, fontFamily: 'flatMedium', color: Colors.fontBold },
	lText: { marginTop: 10, paddingHorizontal: 15, fontFamily: 'flatLight', color: Colors.fontNormal, textAlign: 'center', marginBottom: 10 },
	DotContainer: { marginVertical: width * .2 },
	child: { width, },
	images: { width, height: '100%' },
	Button: { position: 'absolute', bottom: 0, width, backgroundColor: Colors.sky, height: 60, justifyContent: 'center' },
	textBtn: { color: Colors.bg, fontFamily: 'flatMedium', textAlign: 'center', padding: 10, fontWeight: '200', fontSize: 18 }

});



export default WayToAuth
