import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../Pages/Login";
import Title from "../Pages/Title";

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Title" component={Title} />
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
}
