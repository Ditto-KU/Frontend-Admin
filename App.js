import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, Alert } from "react-native";
import { createNavigationContainerRef } from "@react-navigation/native";

// Import all your screens
import Title from "./Pages/Title";
import Login from "./Pages/Login";
import Main from "./Pages/Main";
import ContactSupport from "./Pages/ContactSupport";
import Report from "./Pages/Report";
import Order from "./Pages/Order";
import Cafeteria from "./Pages/Cafeteria";
import Verify from "./Pages/Verify";
import User from "./Pages/User";
import ContactSupportDetail from "./Pages/ContactSupportDetail";
import RestaurantInCafeteria from "./Pages/RestaurantInCaceteria";
import ReportDetails from "./Pages/ReportDetails";
import OrderDetail from "./Pages/OrderDetail";
import UserList from "./components/UserList";
import VerifyDetail from "./Pages/VerifyDetail";
import UserDetail from "./Pages/UserDetail";
import RestaurantDetail from "./Pages/RestaurantDetail";
import OrderHistory from "./Pages/OrderHistory";
import OrderHistoryDetail from "./Pages/OrderHistoryDetail";
import ReportOrderDetail from "./Pages/ReportOrderDetail";


const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

function AuthNavigator({ setAuthAdmin }) {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Title" component={Title} />
      <AuthStack.Screen name="Login">
        {(props) => <Login {...props} setAuthAdmin={setAuthAdmin} />}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  );
}

function MainNavigator({ setAuthAdmin }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard">
        {(props) => <Main {...props} setAuthAdmin={setAuthAdmin} />}
      </Stack.Screen>
      <Stack.Screen name="ContactSupport" component={ContactSupport} />
      <Stack.Screen name="Report" component={Report} />
      <Stack.Screen name="Order" component={Order} />
      <Stack.Screen name="Cafeteria" component={Cafeteria} />
      <Stack.Screen name="Verify" component={Verify} />
      <Stack.Screen name="User" component={User} />
      <Stack.Screen name="ContactSupportDetail" component={ContactSupportDetail} />
      <Stack.Screen name="RestaurantInCafeteria" component={RestaurantInCafeteria} />
      <Stack.Screen name="ReportDetails" component={ReportDetails} />
      <Stack.Screen name="OrderDetail" component={OrderDetail} />
      <Stack.Screen name="UserList" component={UserList} />
      <Stack.Screen name="VerifyDetail" component={VerifyDetail} />
      <Stack.Screen name="UserDetail" component={UserDetail} />
      <Stack.Screen name="RestaurantDetail" component={RestaurantDetail} />
      <Stack.Screen name="OrderHistory" component={OrderHistory} />
      <Stack.Screen name="OrderHistoryDetail" component={OrderHistoryDetail} />
      <Stack.Screen name="ReportOrderDetail" component={ReportOrderDetail} />
    </Stack.Navigator>
  );
}



export default function App() {

  //export default function App() {
  const [authAdmin, setAuthAdmin] = useState(null); // Token for authentication
  const [isLoading, setIsLoading] = useState(true); // Loading state to wait for token check
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const inactivityTimeout = 10 * 60 * 1000; // 10 minutes

  // Check for token on app start
  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("authAdmin");
        setAuthAdmin(storedToken || null);
      } catch (error) {
        console.error("Error retrieving token:", error);
      } finally {
        setIsLoading(false); // Stop loading after checking token
      }
    };
    checkToken();
  }, []);

  // Auto logout due to inactivity
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (Date.now() - lastActivityTime > inactivityTimeout) {
        Alert.alert("Session Expired", "You have been logged out due to inactivity.");
        handleLogout();
      }
    }, 1000); // Check every second
    return () => clearInterval(intervalId);
  }, [lastActivityTime]);

  // Reset activity timer
  const resetActivityTimer = () => setLastActivityTime(Date.now());

  // Logout handler
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authAdmin");
      setAuthAdmin(null); // Clear token from state
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Handle login success
  const handleLoginSuccess = async (token) => {
    try {
      await AsyncStorage.setItem("authAdmin", token);
      setAuthAdmin(token); // Update state with the new token
      setLastActivityTime(Date.now()); // Reset timer on login
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Set up activity listeners
  useEffect(() => {
    const events = ["keypress", "click", "touchstart"];
    const resetTimer = () => resetActivityTimer();
    events.forEach((event) => window.addEventListener(event, resetTimer));
    return () => events.forEach((event) => window.removeEventListener(event, resetTimer));
  }, []);

 

  if (isLoading) return <Text>Loading...</Text>; // Display while checking token


  console.log("authAdminauthAdmin", authAdmin);
  const isNUll = AsyncStorage.getItem("authAdmin");
  console.log("isNUll", isNUll);

  

  return (
    <NavigationContainer>
      {authAdmin ? (
        <MainNavigator setAuthAdmin={setAuthAdmin}/>
      ) : (
        <AuthNavigator setAuthAdmin={setAuthAdmin} />
      )}
    </NavigationContainer>
  );
}
