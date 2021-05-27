import 'react-native-gesture-handler';
import * as React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';




import WayToAuth from '../components/Begining/WayToAuth';
import Login from '../components/Authentication/Login';
import PasswordRecovery from '../components/Authentication/PasswordRecovery';
import PassVerfication from '../components/Authentication/PassVerfication';
import Register from '../components/Authentication/Register';
import RepresentativeRegister from '../components/Authentication/RepresentativeRegister';
import AccountActivation from '../components/Authentication/AccountActivation';
import ClientRegister from '../components/Authentication/ClientRegister';
import HomeScreen from '../components/HomePage/HomeScreen';
import CustomDrawerMenue from '../components/HomePage/CustomDrawerMenue';
import Basket from '../components/HomePage/Basket';
import ChangePassword from '../components/myProfile/ChangePassword';
import Wallet from '../components/AboutApp/Wallet';
import AboutApp from '../components/AboutApp/AboutApp';
import ComplaintsList from '../components/AboutApp/ComplaintsList';
import Politics from '../components/AboutApp/Politicis';
import ContactUs from '../components/AboutApp/ContactUs';
import CompSugget from '../components/AboutApp/CompSugget';
import MyAddress from '../components/AboutApp/MyAddress';
import AddAddress from '../components/AboutApp/AddAddress';
import EditAddress from '../components/AboutApp/EditAddress';
import Chatting from '../components/AboutApp/Chatting';
import Department from '../components/HomePage/Departments';
import AllDebartments from '../components/HomePage/AllDebartments';
import DepartmentsDetailes from '../components/HomePage/DepartmentsDetailes';
import OrderYourStore from '../components/HomePage/OrderYourStore';
import YourOrder from '../components/HomePage/YourOrder';
import SendYourOrderSuccess from '../components/HomePage/SendYourOrderSuccess';
import MyOrders from '../components/MyOrders/MyOrders';
import OrderDetailes from '../components/MyOrders/OrderDetailes';
import DeliveryReceiptLoaction from '../components/HomePage/DeliveryReceiptLoaction';
import SpecialOrder from '../components/HomePage/SpecialOrder';
import SaveLocation from '../components/HomePage/SaveLocation';
import ShareApp from '../components/AboutApp/ShareApp';
import Followrepresentative from '../components/MyOrders/Followrepresentative';
import OrderChatting from '../components/MyOrders/OrderChatting';
import SuccessEvaluation from '../components/MyOrders/SuccessEvaluation';
import SendComplaiment from '../components/MyOrders/SendComplaiment';
import FollowOrder from '../components/MyOrders/FollowOrder';
import ChattingWithBill from '../components/MyOrders/ChattingwithBill';
import BasketDetailes from '../components/HomePage/BasketDetailes'
import RestaurantDepartment from '../components/HomePage/RestaurantDepartment';
import ProductDetailes from '../components/HomePage/ProductDetailes';
import PaymentDetailes from '../components/HomePage/PaymentDetailes';
import BasketSuccessOrder from '../components/HomePage/BasketSuccessOrder';
import Settings from '../components/AboutApp/Settings';
import Language from '../components/AboutApp/Language';
import MobileStatues from '../components/AboutApp/MobileStatues';
import MyProfile from '../components/myProfile/MyProfile';
import ReshargeWallet from '../components/AboutApp/ReshargeWallet';
import VisaBank from '../components/AboutApp/VisaBank';
import ReCallBalance from '../components/AboutApp/ReCallBalance';
import NotificationsList from '../components/notifications/NotificationsList';
import AllOffers from '../components/notifications/AllOffers';
import GetLocation from '../components/HomePage/GetLocation';
import SetOffer from '../components/HomePage/SetOffer';
import ChooseLang from '../components/Begining/ChooseLang';


import { useSelector } from "react-redux";

//Rebresentative
import DrawerMenueRepresent from '../Representative/Home/DrawerMenueRepresent';
import HomePage from '../Representative/Home/HomePage';
import Profile from '../Representative/profile/Profile';
import ChatOrderDetailes from '../Representative/Home/ChatOrderDetailes';
import DeliveryDetailes from '../Representative/Home/DeliveryDetailes';
import chooseSavedPlaces from '../components/HomePage/chooseSavedPlaces';
import BankDataTransfer from '../components/AboutApp/BankDataTransfer';
import CompleteDelegate from '../components/HomePage/CompleteDelegate';
import RegisterDelegate from "../components/Authentication/RegisterDelegate";

const Stack = createStackNavigator();

function MainStackNav() {

    const lang = useSelector(state => state.lang.lang);

    return (

        // <NavigationContainer>
        <Stack.Navigator initialRouteName="ChooseLang" headerMode='none'>
            <Stack.Screen name="ChooseLang" component={ChooseLang} />
            <Stack.Screen name="Home" component={WayToAuth} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="PassRecover" component={PasswordRecovery} />
            <Stack.Screen name="PassVerify" component={PassVerfication} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="RebRegister" component={RepresentativeRegister} />
            <Stack.Screen name="ClientReg" component={ClientRegister} />
            <Stack.Screen name="AccountActivation" component={AccountActivation} />
            <Stack.Screen name="registerDelegate" component={RegisterDelegate} />
            <Stack.Screen name="politics" component={Politics} />


            <Stack.Screen name="GoHome" component={DrawerNav} />

        </Stack.Navigator>
        // </NavigationContainer>

    )
}
export default MainStackNav

const Drawer = createDrawerNavigator();
const StackThree = createStackNavigator()

function chatStack() {


        return (
            <Stack.Navigator initialRouteName="Chatting" headerMode='none'>


            </Stack.Navigator>

        )
}
export function DrawerNav() {
    return (
        // <NavigationContainer  >
        <Drawer.Navigator drawerContent={(props) => <CustomDrawerMenue {...props} initialRouteName='GoHome' />}>
            <Drawer.Screen name="GoHome" component={HomeScreen} />
                <Drawer.Screen name="Profile" component={MyProfile} />
                <Drawer.Screen name="Basket" component={Basket} />
                <Drawer.Screen name="ProfilePassword" component={ChangePassword} />
                <Drawer.Screen name="Wallet" component={Wallet} />
                <Drawer.Screen name="About" component={AboutApp} />
                <Drawer.Screen name="complaintsList" component={ComplaintsList} />
                <Drawer.Screen name="politics" component={Politics} />
                <Drawer.Screen name="chooseSavedPlaces" component={chooseSavedPlaces} />

                <Drawer.Screen name="Contact" component={ContactUs} />
                <Drawer.Screen name="CompSuggest" component={CompSugget} />
                <Drawer.Screen name="Settings" component={Settings} />
                <Drawer.Screen name="Address" component={MyAddress} />
                <Drawer.Screen name="AddAddress" component={AddAddress} />
                <Drawer.Screen name="editAddress" component={EditAddress} />
                <Drawer.Screen name="Chatting" component={Chatting} />
                <Drawer.Screen name="OrderChatting" component={OrderChatting} />
                <Drawer.Screen name="AllDepartments" component={AllDebartments} />
                <Drawer.Screen name="DepartmentsDetailes" component={DepartmentsDetailes} />
                <Drawer.Screen name="OrderFromYourStore" component={OrderYourStore} />
                <Drawer.Screen name="YourOrder" component={YourOrder} />
                <Drawer.Screen name="SendYourOrderSuccess" component={SendYourOrderSuccess} />
                <Drawer.Screen name="MyOrders" component={MyOrders} />
                <Drawer.Screen name="OrderDetailes" component={OrderDetailes} />
                <Drawer.Screen name="DeliveryReceiptLoaction" component={DeliveryReceiptLoaction} />
                <Drawer.Screen name="SpecialOrder" component={SpecialOrder} />
                <Drawer.Screen name="SaveLocation" component={SaveLocation} />
                <Drawer.Screen name="ShareApp" component={ShareApp} />
                <Drawer.Screen name="Followrepresentative" component={Followrepresentative} />
                <Drawer.Screen name="SuccessEvaluation" component={SuccessEvaluation} />
                <Drawer.Screen name="SendComplaiment" component={SendComplaiment} />
                <Drawer.Screen name="FollowOrder" component={FollowOrder} />
                <Drawer.Screen name="ChattingBill" component={ChattingWithBill} />
                <Drawer.Screen name="BasketDetailes" component={BasketDetailes} />
                <Drawer.Screen name="RestaurantDepartment" component={RestaurantDepartment} />
                <Drawer.Screen name="ProductDetailes" component={ProductDetailes} />
                <Drawer.Screen name="PaymentDetailes" component={PaymentDetailes} />
                <Drawer.Screen name="BasketSuccessOrder" component={BasketSuccessOrder} />
                <Drawer.Screen name="Lang" component={Language} />
                <Drawer.Screen name="MobileStatues" component={MobileStatues} />
                <Drawer.Screen name="ReCallBalance" component={ReCallBalance} />
                <Drawer.Screen name="NotificationsList" component={NotificationsList} />
                <Drawer.Screen name="AllOffers" component={AllOffers} />
                <Drawer.Screen name="getLocation" component={GetLocation} />
                <Drawer.Screen name="BankDataTransfer" component={BankDataTransfer} />
                <Drawer.Screen name="Rescharge" component={ReshargeWallet} />
                <Drawer.Screen name="completeDelegate" component={CompleteDelegate} />
                <Drawer.Screen name="VisaBank" component={VisaBank} />
        </Drawer.Navigator>
        // </NavigationContainer>
    );
}

const DrawerTwo = createDrawerNavigator();
const StackTwo = createStackNavigator()

export function DrawerNavRebresentative() {
    return (
        // <NavigationContainer>
        <DrawerTwo.Navigator drawerContent={(props) => <DrawerMenueRepresent {...props} />}>
            <StackTwo.Screen name="RebHome" component={HomePage} />
            <StackTwo.Screen name="OrderDetailes" component={OrderDetailes} />
            <StackTwo.Screen name="MyOrders" component={MyOrders} />
            <StackTwo.Screen name="OrderChatting" component={OrderChatting} />
            <StackTwo.Screen name="Chatting" component={Chatting} />
            <StackTwo.Screen name="RebProfile" component={Profile} />
            <StackTwo.Screen name="RebChatOrderDetailes" component={ChatOrderDetailes} />
            <StackTwo.Screen name="DeliveryDetailes" component={DeliveryDetailes} />
            <StackTwo.Screen name="SetOffer" component={SetOffer} />
            <StackTwo.Screen name="Contact" component={ContactUs} />
            <StackTwo.Screen name="Profile" component={MyProfile} />
            <StackTwo.Screen name="activationCode" component={AccountActivation} />
            <StackTwo.Screen name="politics" component={Politics} />
            <StackTwo.Screen name="CompSuggest" component={CompSugget} />
            <StackTwo.Screen name="ShareApp" component={ShareApp} />
            <StackTwo.Screen name="Wallet" component={Wallet} />
            <StackTwo.Screen name="About" component={AboutApp} />
            <Drawer.Screen name="ReCallBalance" component={ReCallBalance} />

            <StackTwo.Screen name="NotificationsList" component={NotificationsList} />
            <StackTwo.Screen name="Rescharge" component={ReshargeWallet} />
            <StackTwo.Screen name="VisaBank" component={VisaBank} />
            <StackTwo.Screen name="getLocation" component={GetLocation} />
            <StackTwo.Screen name="BankDataTransfer" component={BankDataTransfer} />
            <StackTwo.Screen name="Settings" component={Settings} />
            <Drawer.Screen name="MobileStatues" component={MobileStatues} />
            <Drawer.Screen name="Lang" component={Language} />
            <Drawer.Screen name="complaintsList" component={ComplaintsList} />
            <Drawer.Screen name="FollowOrder" component={FollowOrder} />
            <Drawer.Screen name="SuccessEvaluation" component={SuccessEvaluation} />

        </DrawerTwo.Navigator>
        // </NavigationContainer>
    )
}