import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Button,
  Linking,
  View,
  Text,
  Image,
  ScrollView,
  Alert,
  FlatList,
} from "react-native";
import { myStyle } from "./Style/PageStyle";
import { useState } from "react";
import Sidebar from "./components/SideBar";
import Dashboard from "./components/Dashboard";
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

export default function App() {
  const Stack = createStackNavigator();

  return (
    // <ScrollView>
    <NavigationContainer>
      <Stack.Navigator  screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="KU-MAN" component={Title} /> */}
        {/* <Stack.Screen name="Login" component={Login} /> */}
        <Stack.Screen name="Main" component={Main} />
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
    </NavigationContainer>
    // </ScrollView>
  );
}
