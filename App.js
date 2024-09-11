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

export default function App() {
  const Stack = createStackNavigator();

  return (
    // <ScrollView>
    <NavigationContainer>
      <Stack.Navigator  screenOptions={{ headerShown: false }}>
        {/* Define your screens here */}
        {/* <Stack.Screen name="KU-MAN" component={Title} /> */}
        {/* <Stack.Screen name="Login" component={Login} /> */}
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="ContactSupport" component={ContactSupport} />
        <Stack.Screen name="ContactSupportDetail" component={ContactSupportDetail} />
        <Stack.Screen name="Report" component={Report} />
        <Stack.Screen name="Order" component={Order} />
        <Stack.Screen name="Cafeteria" component={Cafeteria} />
        <Stack.Screen name="Verify" component={Verify} />
        <Stack.Screen name="User" component={User} />
      </Stack.Navigator>
    </NavigationContainer>
    // </ScrollView>
  );
}
