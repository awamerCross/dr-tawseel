const INITIAL_STATE = { providers: [], loader: false };

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'latestProviders':
			return {
				...state,
				providers: action.payload.data,
				loader: action.payload.success
			};
		default:
			return state;
	}
};
