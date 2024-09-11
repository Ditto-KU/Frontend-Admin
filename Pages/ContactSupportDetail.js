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
import { PageStyle } from "../Style/PageStyle";
import { useState } from "react";
import OrderDetail from "../components/OrderDetail";
import Header from "../components/Header";
import ChatBox from "../components/ChatBox";

export default function ContactSupportDetail() {
  return (
    <ScrollView style={PageStyle.CSD_Container}>
      <Header />
      <View style={PageStyle.CSD_Main}>
        <OrderDetail style={PageStyle.CSD_OrderDetail} />
        <ChatBox style={PageStyle.CSD_ChatBox} />
      </View>
    </ScrollView>
  );
}