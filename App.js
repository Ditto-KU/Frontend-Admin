import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, Alert } from "react-native";

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

export default function App() {
  const [authAdmin, setAuthAdmin] = useState(null); // Changed authToken to authAdmin
  const [isLoading, setIsLoading] = useState(true);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const inactivityTimeout = 10 * 60 * 1000; // 10 minutes

  // Check for the token when the app starts
  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("authAdmin");
        if (storedToken) {
          setAuthAdmin(storedToken);
        }
      } catch (error) {
        console.error("Error retrieving token:", error);
      } finally {
        setIsLoading(false);
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
    }, 1000); // Check inactivity every second
  
    return () => clearInterval(intervalId);
  }, [lastActivityTime]);
  

  const resetActivityTimer = () => {
    setLastActivityTime(Date.now());
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authAdmin");
      setAuthAdmin(null); // Clear authAdmin token
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Set up event listeners to detect user activity
  useEffect(() => {
    const events = ["keypress", "click", "touchstart"];
    const resetTimer = () => resetActivityTimer();
    events.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, []);

  // Show loading screen while checking token
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {authAdmin ? ( // Use authAdmin here instead of authToken
          <>
            <Stack.Screen name="Dashboard">
              {(props) => <Main {...props} authAdmin={authAdmin} />}
            </Stack.Screen>
            <Stack.Screen name="ContactSupport">
              {(props) => <ContactSupport {...props} authAdmin={authAdmin} />}
            </Stack.Screen>
            <Stack.Screen name="Report" component={Report} />
            <Stack.Screen name="Order" component={Order} />
            <Stack.Screen name="Cafeteria" component={Cafeteria} />
            <Stack.Screen name="Verify" component={Verify} />
            <Stack.Screen name="User" component={User} />
            <Stack.Screen name="ContactSupportDetail">
              {(props) => (
                <ContactSupportDetail {...props} authAdmin={authAdmin} />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="RestaurantInCafeteria"
              component={RestaurantInCafeteria}
            />
            <Stack.Screen name="ReportDetails" component={ReportDetails} />
            <Stack.Screen name="OrderDetail" component={OrderDetail} />
            <Stack.Screen name="UserList" component={UserList} />
            <Stack.Screen name="VerifyDetail" component={VerifyDetail} />
            <Stack.Screen name="UserDetail" component={UserDetail} />
            <Stack.Screen
              name="RestaurantDetail"
              component={RestaurantDetail}
            />
            <Stack.Screen name="OrderHistory" component={OrderHistory} />
            <Stack.Screen
              name="OrderHistoryDetail"
              component={OrderHistoryDetail}
            />
            <Stack.Screen
              name="ReportOrderDetail"
              component={ReportOrderDetail}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Title" component={Title} />
            <Stack.Screen name="Login">
              {(props) => <Login {...props} setAuthAdmin={setAuthAdmin} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
