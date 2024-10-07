import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  View,
  Text,
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
import { useRoute } from "@react-navigation/native";

export default function App() {
  const route = useRoute();
  const { authToken, authAdmin } = route.params;
  return (
    <View style={PageStyle.M_main}>
      <Sidebar style={PageStyle.M_sidebar} authToken={authToken} authAdmin={authAdmin} />
      <View style={PageStyle.M_container_DB}>
        <View style={PageStyle.M_containerUp_DB}>
          <ContactSupport_DB style={PageStyle.M_CS_DB} authToken={authToken} authAdmin={authAdmin} />
          <Order_DB style={PageStyle.M_order_DB} authToken={authToken} />
        </View>
        <View style={PageStyle.M_containerDown_DB}>
          <View style={PageStyle.M_BLcontent_DB}>
            <View style={PageStyle.M_BLcontentL_DB}>
              <OpenRestaurant style={PageStyle.M_BLcontentL_Rest_DB} authToken={authToken} />
              <Income style={PageStyle.M_BLcontentL_Income_DB} authToken={authToken} />
              <NewUser style={PageStyle.M_BLcontentL_NewUser_DB} authToken={authToken} />
            </View>
            <Verify_DB style={PageStyle.M_Verify_DB} authToken={authToken} />
          </View>
          <UserGraph style={PageStyle.M_UserGraph_DB} authToken={authToken} />
        </View>
      </View>
    </View>
  );
}
