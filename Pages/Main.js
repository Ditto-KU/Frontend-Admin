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
import Sidebar from "../components/SideBar";
import ContactSupport_DB from "../components/ContactSupport_DB";
import Verify_DB from "../components/Verify_DB";
import Order_DB from "../components/Order_DB";
import UserGraph from "../components/UserGraph";
import OpenRestaurant from "../components/OpenRest";
import Income from "../components/Income";
import NewUser from "../components/NewUser";
import Dashboard from "../components/Dashboard";
import ChatBox from "../components/ChatBox";
import Title from "./Title";
import Login from "./Login";
import Report from "./Report";

export default function App() {

  return (
    <ScrollView>
      <View style={PageStyle.M_main}>
        <Sidebar style={PageStyle.M_sidebar} />
        <View style={PageStyle.M_container_DB}>
          <View style={PageStyle.M_containerUp_DB}>
            <ContactSupport_DB style={PageStyle.M_CS_DB} />
            <Order_DB style={PageStyle.M_order_DB} />
          </View>
          <View style={PageStyle.M_containerDown_DB}>
            <View style={PageStyle.M_BLcontent_DB}>
              <View style={PageStyle.M_BLcontentL_DB}>
                <OpenRestaurant style={PageStyle.M_BLcontentL_Rest_DB}/>
                <Income style={PageStyle.M_BLcontentL_Income_DB} />
                <NewUser style={PageStyle.M_BLcontentL_NewUser_DB} />
              </View>
              <Verify_DB style={PageStyle.M_Verify_DB} />
            </View>
            <UserGraph style={PageStyle.M_UserGraph_DB} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
