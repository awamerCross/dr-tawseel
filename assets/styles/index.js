import { Dimensions, I18nManager, Platform } from "react-native";
import COLORS from '../../src/consts/Colors';
import Colors from "../../src/consts/Colors";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const IS_IPHONE_X = (height === 812 || height === 896) && Platform.OS === 'ios';

const style = ({

	container: {
		flex: 1
	},
	// Style Color ConText

	text_orange: {
		color: Colors.sky
	},
	text_blue: {
		color: Colors.fontNormal
	},
	text_black: {
		color: Colors.IconBlack
	},
	text_gray: {
		color: Colors.fontNormal
	},
	text_red: {
		color: 'red'
	},
	text_White: {
		color: '#FFF'
	},

	// Style Font
	borderGray: {
		borderWidth: 1,
		borderColor: '#ddd',
	}, text_mstarda: {
		color: Colors.sky
	},
	textRegular: {
		fontFamily: 'flatMedium',
	},
	textBold: {
		fontFamily: 'flatMedium'
	},
	textDecoration: {
		textDecorationLine: "underline"
	},
	linethrough: {
		textDecorationLine: "line-through"
	},
	fontBold: {
		fontWeight: "bold"
	},
	fontSpacing: {
		letterSpacing: 1,
	},
	textSize_11: {
		fontSize: 11,
	},
	textSize_12: {
		fontSize: 12,
	},
	textSize_13: {
		fontSize: 13,
	},
	textSize_14: {
		fontSize: 14,
	},
	textSize_15: {
		fontSize: 15,
	},
	textSize_16: {
		fontSize: 16,
	},
	textSize_18: {
		fontSize: 18,
	},
	textSize_20: {
		fontSize: 20,
	},
	textSize_22: {
		fontSize: 22,
	},
	textSize_24: {
		fontSize: 24,
	},
	textSize_26: {
		fontSize: 26,
	},
	textSize_28: {
		fontSize: 28,
	},
	textSize_30: {
		fontSize: 30,
	},
	textSize_32: {
		fontSize: 32,
	},

	// Style Direction Text

	textCenter: {
		textAlign: "center"
	},
	textRight: {
		textAlign: "left"
	},
	textLeft: {
		textAlign: "left"
	},

	// Margin Space Vertical

	marginVertical_5: {
		marginVertical: 5
	},
	marginVertical_10: {
		marginVertical: 10
	},
	marginVertical_15: {
		marginVertical: 15
	},
	marginVertical_20: {
		marginVertical: 20
	},
	marginVertical_25: {
		marginVertical: 25
	},
	marginBottom_150: {
		marginBottom: 150
	},
	marginTop_120: {
		marginTop: 120
	},
	marginBottom_40: {
		marginBottom: 40
	},
	marginBottom_50: {
		marginBottom: 50
	},
	marginBottom_80: {
		marginBottom: 80
	},
	marginBottom_5: {
		marginBottom: 5
	},
	marginBottom_10: {
		marginBottom: 10
	},
	marginBottom_15: {
		marginBottom: 15
	},
	marginBottom_20: {
		marginBottom: 20
	},
	marginBottom_25: {
		marginBottom: 25
	},
	marginBottom_35: {
		marginBottom: 35
	},
	marginTop_5: {
		marginTop: 5
	},
	marginTop_15: {
		marginTop: 15
	},
	marginTop_25: {
		marginTop: 25
	},
	marginTop_35: {
		marginTop: 35
	},
	marginTop_55: {
		marginTop: 55
	},
	marginTop_20: {
		marginTop: 20
	},
	marginTop_125: {
		marginTop: 125
	},

	// Margin Space Horizontal

	marginHorizontal_0: {
		marginHorizontal: 0
	},
	marginHorizontal_5: {
		marginHorizontal: 5
	},
	marginHorizontal_10: {
		marginHorizontal: 10
	},
	marginHorizontal_15: {
		marginHorizontal: 15
	},
	marginHorizontal_20: {
		marginHorizontal: 20
	},
	marginHorizontal_25: {
		marginHorizontal: 25
	},

	// Padding Space Vertical

	paddingVertical_0: {
		paddingVertical: 0
	},
	paddingVertical_5: {
		paddingVertical: 5
	},
	paddingVertical_10: {
		paddingVertical: 10
	},
	paddingVertical_15: {
		paddingVertical: 15
	},
	paddingVertical_20: {
		paddingVertical: 20
	},
	paddingVertical_25: {
		paddingVertical: 25
	},
	paddingVertical_45: {
		paddingVertical: 45
	},
	paddingTop_50: {
		paddingTop: 50
	},

	// Padding Space Horizontal

	paddingHorizontal_0: {
		paddingHorizontal: 0
	},
	paddingHorizontal_5: {
		paddingHorizontal: 5
	},
	paddingHorizontal_10: {
		paddingHorizontal: 10
	},
	paddingHorizontal_15: {
		paddingHorizontal: 15
	},
	paddingHorizontal_20: {
		paddingHorizontal: 20
	},
	paddingHorizontal_25: {
		paddingHorizontal: 25
	},
	paddingHorizontal_30: {
		paddingHorizontal: 30
	},
	paddingHorizontal_70: {
		paddingHorizontal: 70
	},

	// Style Border Radius

	Radius_0: {
		borderRadius: 0
	},
	Radius_5: {
		borderRadius: 5
	},
	Radius_10: {
		borderRadius: 10
	},
	Radius_15: {
		borderRadius: 15
	},
	Radius_20: {
		borderRadius: 20
	},
	Radius_30: {
		borderRadius: 30
	},
	Radius_40: {
		borderRadius: 40
	},
	Radius_50: {
		borderRadius: 50
	},
	Radius_60: {
		borderRadius: 60
	},
	Radius_70: {
		borderRadius: 70
	},
	Radius_80: {
		borderRadius: 80
	},
	Radius_90: {
		borderRadius: 90
	},
	Radius_100: {
		borderRadius: 100
	},
	RadiusTop_5: {
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5
	},

	// Background Color

	bg_orange: {
		backgroundColor: COLORS.orange
	},

	bg_pink: {
		backgroundColor: '#E873B1'
	},
	bg_overlay: {
		backgroundColor: "rgba(250, 218, 208, 0.9)"
	},
	overlay_white: {
		backgroundColor: "rgba(255, 255, 255, 0.7)"
	},
	overlay_black: {
		backgroundColor: "rgba(0, 0, 0, 0.5)"
	},
	bg_White: {
		backgroundColor: '#FFF'
	},
	bg_light_gray: {
		backgroundColor: '#F1F1F1'
	},


	// Style Search

	checkBox: {
		paddingLeft: 0,
		paddingBottom: 0,
		borderRadius: 5,
		paddingRight: 3
	},

	// Style Shadow

	boxShadow: {
		shadowColor: "#363636",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.22,
		shadowRadius: 2.22,
		elevation: 3,
	},

	// Style Loading

	loading: {
		position: 'absolute',
		top: 0,
		right: 0,
		width: '100%',
		height: '100%',
		zIndex: 99999,
		backgroundColor: "rgba(0,0,0,0.5)",
	},

	// Styles Flex Box
	keyboardAvoid: {
		width: '100%',
		height: null,
		flex: 1,
	},
	flexCenter: {
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
	},
	centerContext: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	centerColum: {
		alignSelf: 'center',
	},
	SelfCenter: {
		alignSelf: 'center',
		justifyContent: 'center',
	},
	SelfRight: {
		alignSelf: 'flex-end',
		justifyContent: 'center',
	},
	SelfLeft: {
		alignSelf: 'flex-start',
		justifyContent: 'center',
	},
	justifyCenter: {
		justifyContent: 'center',
	},
	justifyTop: {
		justifyContent: 'flex-end',
	},
	justifyStart: {
		justifyContent: 'flex-start',
	},
	alignStart: {
		alignSelf: 'flex-start',
	},
	rowGroup: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		flexWrap: 'wrap'
	},
	rowCenter: {
		flexDirection: "row",
		alignSelf: 'center',
		justifyContent: "center",
		alignItems: "center",
	},
	rowRight: {
		flexDirection: "row",
		alignSelf: 'flex-start',
		alignItems: "center",
		justifyContent: 'center',
		flexWrap: 'wrap'
	},
	rowLeft: {
		flexDirection: "row",
		alignSelf: 'flex-end',
		alignItems: "center",
		justifyContent: 'center',
		flexWrap: 'wrap'
	},
	bgFullWidth: {
		flexGrow: 1,
	},
	flex_10: {
		flexBasis: '10%'
	},
	flex_20: {
		flexBasis: '20%'
	},
	flex_25: {
		flexBasis: '25%'
	},
	flex_30: {
		flexBasis: '30%'
	},
	flex_40: {
		flexBasis: '40%'
	},
	flex_45: {
		flexBasis: '45%'
	},
	flex_50: {
		flexBasis: '50%'
	},
	flex_55: {
		flexBasis: '55%'
	},
	flex_60: {
		flexBasis: '60%'
	},
	flex_70: {
		flexBasis: '70%'
	},
	flex_80: {
		flexBasis: '80%'
	},
	flex_90: {
		flexBasis: '90%'
	},
	flex_100: {
		flexBasis: '100%'
	},


	//  Style For App

	windowWidth: {
		paddingVertical: 30,
		width: '100%',
		height: '100%',
	},
	bgContent: {
		width: null,
		height: null,
		flex: 1,
	},
	Width_50: {
		width: '50%'
	},
	Width_60: {
		width: '60%'
	},
	Width_70: {
		width: '70%'
	},
	Width_80: {
		width: '80%'
	},
	Width_85: {
		width: '82%'
	},
	Width_90: {
		width: '90%'
	},
	Width_95: {
		width: '95%'
	},
	Width_100: {
		width: '100%'
	},
	width_30: {
		width: 30
	},
	width_40: {
		width: 40
	},
	width_50: {
		width: 50
	},
	width_60: {
		width: 60
	},
	width_70: {
		width: 70
	},
	width_80: {
		width: 80
	},
	width_90: {
		width: 90
	},
	width_100: {
		width: 100
	},
	width_120: {
		width: 120
	},
	width_130: {
		width: 130
	},
	width_150: {
		width: 150
	},
	height_10: {
		height: 10
	},
	height_20: {
		height: 20
	},
	height_30: {
		height: 30
	},
	height_40: {
		height: 40
	},
	height_50: {
		height: 50
	},
	height_60: {
		height: 60
	},
	height_70: {
		height: 70
	},
	height_80: {
		height: 80
	},
	height_90: {
		height: 90
	},
	height_100: {
		height: 100
	},
	height_120: {
		height: 120
	},
	height_150: {
		height: 150
	},
	height_200: {
		height: 200
	},
	height_250: {
		height: 250
	},
	heightFull: {
		height: '100%'
	},
	minHeight: {
		minHeight: 150
	},
	overHidden: {
		overflow: 'hidden'
	},

	// Style Img Logo

	logo: {
		width: 150,
		height: 150,
		resizeMode: "contain"
	},
	iconImg: {
		width: 50,
		height: 50,
		resizeMode: "contain"
	},
	footerIcon: {
		width: 20,
		height: 20,
		resizeMode: "contain"
	},
	footerIconProfile: {
		width: 33,
		height: 33,
		resizeMode: "contain"
	},
	scrollImg: {
		width: 70,
		height: 70,
		marginBottom: 10,
		borderRadius: 10,
	},
	flatImg: {
		width: 100,
		height: 100,
		marginBottom: 10,
		borderRadius: 10,
	},
	scrollRatedImg: {
		width: 150,
		height: 190,
		borderRadius: 10,
	},
	icImg: {
		width: 80,
		height: 80,
		resizeMode: "cover"
	},
	sizeImage: {
		width: 150,
		height: 150,
		resizeMode: 'contain'
	},
	upImage: {
		width: 250,
		height: 250,
		resizeMode: 'contain'
	},
	minImage: {
		width: 130,
		height: 130,
		resizeMode: 'contain'
	},
	icoImage: {
		width: 200,
		height: 100,
		resizeMode: 'contain'
	},
	smImage: {
		width: 20,
		height: 20,
		resizeMode: 'contain'
	},
	favImage: {
		width: 15,
		height: 15,
		resizeMode: 'contain'
	},
	ionImage: {
		width: 20,
		height: 20,
		resizeMode: 'contain'
	},
	arrow: {
		width: 25,
		height: 25,
		resizeMode: 'contain'
	},
	iconBank: {
		width: 35,
		height: 35,
		resizeMode: 'contain'
	},
	mark: {
		width: 43,
		height: 43,
		resizeMode: 'contain'
	},
	flowersImg: {
		width: 370,
		height: 370,
		right: 0,
		top: -7
	},

	//  Style Header

	headerView: {
		backgroundColor: COLORS.blue,
		zIndex: 99,
		paddingTop: 20,
		paddingRight: 0,
		paddingLeft: 0,
		overflow: 'hidden',
		elevation: 0,
		borderBottomWidth: 0,
		alignItems: 'center',
		height: 100,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
	},
	whatsappContainer: {
		alignSelf: 'center',
		alignItems: 'center',
		flexDirection: 'row'
	},
	bodyText: {
		position: 'relative',
		alignItems: 'center',
		flex: 1,
		top: -1
	},
	leftIcon: {
		flex: 0,
		transform: I18nManager.isRTL ? [{ rotate: '0deg' }] : [{ rotate: '180deg' }],
		marginHorizontal: 15
	},
	rightIcon: {
		flex: 0
	},
	iconHeader: {
		width: 50,
		height: 40
	},
	rotatTouch: {
		transform: [{ rotate: '50deg' }],
	},
	rotatIcon: {
		transform: [{ rotate: '-50deg' }],
	},

	// Style position

	position_R: {
		position: 'relative',
		zIndex: 999
	},
	position_A: {
		position: 'absolute',
		zIndex: 9999
	},
	fixItem: {
		top: -20,
		right: -20
	},
	top_0: {
		top: 0
	},
	top_5: {
		top: 5
	},
	top_10: {
		top: 10
	},
	top_15: {
		top: 15
	},
	top_20: {
		top: 20
	},
	top_25: {
		top: 25
	},
	top_30: {
		top: 30
	},
	top_35: {
		top: 35
	},
	bottom_0: {
		bottom: 0
	},
	bottom_10: {
		bottom: 10
	},
	bottom_20: {
		bottom: 20
	},
	bottom_30: {
		bottom: 30
	},
	bottom_40: {
		bottom: 40
	},
	right_0: {
		right: 0
	},
	right_5: {
		right: 5
	},
	right_10: {
		right: 10
	},
	right_15: {
		right: 15
	},
	right_20: {
		right: 20
	},
	right_25: {
		right: 25
	},
	right_30: {
		right: 30
	},
	right_35: {
		right: 35
	},
	left_0: {
		left: 0
	},
	left_5: {
		left: 5
	},
	left_10: {
		left: 10
	},
	left_15: {
		left: 15
	},
	left_20: {
		left: 20
	},
	left_25: {
		left: 25
	},
	left_30: {
		left: 30
	},
	left_35: {
		left: 35
	},



	directionColumnSpace: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	directionColumnSpace2: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'space-between',
	},
	directionColumn: {
		flexDirection: 'column',
	},
	directionRowReverse: {
		flexDirection: 'row-reverse',
	},
	directionColumnC: {
		justifyContent: 'center',
		flexDirection: 'column'
	},
	directionColumnCenter: {
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column'
	},
	directionRowCenter: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	directionRow: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	directionRowSpace: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	transform: {
		transform: I18nManager.isRTL ? [{ rotateY: '0deg' }] : [{ rotateY: '-180deg' }]
	},
	transformReverse: {
		transform: I18nManager.isRTL ? [{ rotateY: '-180deg' }] : [{ rotateY: '0deg' }]
	},
	swiperImg: {
		height: '100%',
		width: '100%',
		zIndex: -1
	},
	swiperOverlay: {
		backgroundColor: "rgba(0, 0, 0, 0.6)",
		position: 'absolute',
		height: '100%',
		width: '100%',
		zIndex: 1,
	},
	swiperborder: {
		position: 'absolute',
		height: '88%',
		width: '90%',
		zIndex: 1,
		borderWidth: 2,
		borderColor: '#c7c7c7',
		alignSelf: 'center',
		top: '7%'
	},
	doteStyle: {
		backgroundColor: COLORS.gray,
		borderRadius: 5,
		left: 0,
		right: 0,
		bottom: 40,
		width: 15,
		height: 4,
	},
	activeDot: {
		borderRadius: 5,
		borderWidth: 2,
		borderColor: COLORS.orange,
		backgroundColor: COLORS.orange,
		width: 25,
		height: 4,
		left: 0,
		right: 0,
		bottom: 40
	},
	doteStyle2: {
		backgroundColor: COLORS.gray,
		borderRadius: 5,
		left: -125,
		bottom: '60%',
		width: 15,
		height: 4,
	},
	activeDot2: {
		borderRadius: 5,
		borderWidth: 2,
		borderColor: COLORS.blue,
		backgroundColor: COLORS.blue,
		width: 25,
		height: 4,
		left: -125,
		bottom: '60%',
	},
	blueBtn: {
		width: '100%',
		height: 45,
		backgroundColor: COLORS.blue,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20,
		borderRadius: 10,
	},
	payMethod: {
		paddingHorizontal: 20,
		height: 45,
		backgroundColor: COLORS.blue,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10,
	},
	grayBtn: {
		width: '100%',
		height: 45,
		backgroundColor: "#BBBBBB",
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 15,
		borderRadius: 10,
	},
	item: {
		borderBottomWidth: 0,
		top: -20,
		marginTop: 0,
		// position:'absolute',
		width: '100%',
		paddingHorizontal: 10,
		zIndex: -1,
	},
	label: {
		top: 3,
		left: 20,
		backgroundColor: '#ffffff',
		alignSelf: 'flex-start',
		fontFamily: 'sukar',
		fontSize: 15,
		borderBottomWidth: 2,
		borderBottomColor: '#fff',
		zIndex: 10
	},
	labelText: {
		left: 20,
		backgroundColor: '#ffffff',
		alignSelf: 'flex-start',
		fontSize: 15,
		zIndex: 10,
		position: 'absolute',
	},
	input: {
		borderColor: COLORS.black,
		borderWidth: 1,
		borderRadius: 10,
		color: COLORS.blue,
		paddingRight: 20,
		paddingLeft: 20,
		textAlign: I18nManager.isRTL ? 'right' : 'left',
		fontFamily: 'sukar',
		fontSize: 15,
	},
	searchInput: {
		borderRadius: 10,
		color: COLORS.gray,
		paddingRight: 20,
		paddingLeft: 60,
		textAlign: I18nManager.isRTL ? 'right' : 'left',
		fontFamily: 'sukar',
		fontSize: 15,
		width: '100%',
		height: 50
	},
	filter: {
		borderRadius: 10,
		backgroundColor: '#F1F1F1',
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 10
	},
	searchIcon: {
		position: 'absolute',
		zIndex: 1,
		left: 20
	},
	closeIcon: {
		position: 'absolute',
		zIndex: 1,
		right: 20
	},
	chooseLang: {
		borderColor: COLORS.gray,
		borderWidth: 1,
		borderRadius: 10,
		color: COLORS.blue,
		paddingRight: 20,
		paddingLeft: 20,
		textAlign: I18nManager.isRTL ? 'right' : 'left',
		fontFamily: 'sukar',
		fontSize: 15,
		width: '95%',
		height: 50
	},
	langFloat: {
		position: 'absolute',
		top: -10,
		left: 20,
		backgroundColor: '#ffffff',
		// alignSelf           : 'flex-start',
		fontFamily: 'sukar',
		fontSize: 15,
	},
	textArea: {
		borderColor: COLORS.gray,
		borderWidth: 1,
		borderRadius: 10,
		width: "100%",
		color: COLORS.blue,
		paddingRight: 20,
		paddingLeft: 20,
		textAlign: 'right',
		fontFamily: 'sukar',
		fontSize: 15,
		top: 0,
		marginTop: 25
	},
	Active: {
		borderWidth: 1,
		borderColor: COLORS.blue,
		zIndex: -1
	},
	noActive: {
		borderWidth: 1,
		borderColor: COLORS.gray,
	},
	scrollView: {
		flexDirection: 'row',
		alignSelf: 'flex-start',
	},
	carousalText: {
		position: 'absolute',
		left: 0,
		flexDirection: 'column',
		justifyContent: 'center',
		zIndex: 10,
		paddingHorizontal: 5,
		paddingVertical: 10,
		borderBottomRightRadius: 10,
		borderTopRightRadius: 10,
		marginTop: 20
	},
	carousalRatedText: {
		flexDirection: 'column',
		justifyContent: 'center',
		paddingHorizontal: 5,
		paddingVertical: 7,
		width: '100%',
		borderTopRightRadius: 10,
		borderTopLeftRadius: 10,
	},
	touchFav: {
		backgroundColor: '#fff',
		width: 35,
		height: 35,
		borderRadius: 50,
		alignSelf: 'flex-end',
		margin: 10
	},
	discountMark: {
		position: 'absolute',
		left: 20,
		top: 0,
		justifyContent: 'center',
		alignItems: 'center'
	},
	scrollContent: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		position: 'absolute',
		zIndex: 1,
		height: '100%'
	},
	starStyle: {
		marginHorizontal: 1,
	},
	footerStyle: {
		backgroundColor: '#fff',
		borderRadius: 10,
		width: '70%',
		height: IS_IPHONE_X ? 30 : 45,
		paddingTop: IS_IPHONE_X ? 30 : 0,
		position: 'absolute',
		bottom: 30,
		left: '15%',
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5
	},
	notiCard: {
		borderRadius: 10,
		marginTop: 10,
		height: 100,
		overflow: 'hidden',
	},
	cardView: {
		borderLeftWidth: 7,
		width: '100%',
		height: '100%',
		flexDirection: 'row',
		paddingVertical: 10
	},
	cardDate: {
		borderRightWidth: 1,
		borderRightColor: '#ddd',
		justifyContent: 'center'
	},
	bgModel: {
		width: "100%",
		flex: 1,
		alignSelf: 'center',
		justifyContent: 'flex-end',
		bottom: -18,
	},
	modalBorder: {
		width: '40%',
		height: 5,
		backgroundColor: COLORS.black,
		alignSelf: 'center',
		borderRadius: 5,
		marginBottom: 20
	},
	topNav: {
		height: 110,
		backgroundColor: '#fff',
		alignSelf: 'center',
		borderBottomLeftRadius: 50,
		overflow: 'hidden',
	},
	bottomLayCurve: {
		backgroundColor: "#888ca08c",
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		paddingVertical: 30,
		paddingHorizontal: 20,
		minHeight: 200
	},
	whiteDot: {
		backgroundColor: "#fff",
		borderRadius: 5,
		width: 3,
		height: 3,
		position: 'absolute',
		left: 0,
		top: 0
	},
	slider: {
		height: 35,
		borderColor: '#acabae',
		borderWidth: 0
	},
});

export default style;
