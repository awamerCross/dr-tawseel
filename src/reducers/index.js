import { combineReducers } from 'redux';
import lang from './LangReducer';
import intro from './IntroReducer';
import categories from './CategoriesReducer';
import providers from './ProvidersReducer';
import banners from './BannersReducer';
import aboutApp from './AboutAppReducer';
import policy from './AboutAppReducer';
import Auth from './AuthReducer';
import Cities from './CitiesReducer'
import BasketDetailes from './BasketDetailesReducer'
import profile from './ProfileReducer';
import wallet from './WalleTReducer';
import orders from './OrdersReducer';
import delegate from './DelegateReducer';
import chat from './ChatReducer';
import notifications from './NotificationReducer';
import allOffers from './AllOffersReducer';
import appInfo from './AppInfoReducer';
import questions from './QuestionsReducer';
import places from './PlacesReducer';
import comments from './CommentsReducer';
import cancelReasons from './CancelOrderReasonsReducer';
import BasketLength from './BasketLength'



export default combineReducers({
	lang,
	intro,
	categories,
	providers,
	banners,
	aboutApp,
	policy,
	Auth,
	Cities,
	BasketDetailes,
	profile,
	wallet,
	orders,
	delegate,
	chat,
	notifications,
	allOffers,
	appInfo,
	questions,
	places,
	comments,
	cancelReasons,
	BasketLength
});
