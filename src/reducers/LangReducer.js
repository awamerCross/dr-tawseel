
const INITIAL_STATE = { lang: null, type: null, usertype: null };

export default (state = INITIAL_STATE, action) => {
	// console.log('actionLaaaang' , action.payload)
	switch (action.type) {
		case 'chooseLang':
			return { ...state, lang: action.payload };

		case 'SwiperBegines':
			return { ...state, type: action.data };

		case 'ChooseUserCaptain':
			return { ...state, usertype: action.data };


		default:
			return state;
	}
};
