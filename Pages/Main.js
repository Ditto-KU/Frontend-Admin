import React from "react";
import { View } from "react-native";
import Sidebar from "../components/SideBar";
import ContactSupport_DB from "../components/ContactSupport_DB";
import Verify_DB from "../components/Verify_DB";
import Order_DB from "../components/Order_DB";
import UserGraph from "../components/UserGraph";
import OpenRestaurant from "../components/OpenRest";
import Income from "../components/Income";
import NewUser from "../components/NewUser";
import { PageStyle } from "../Style/PageStyle";

export default function Main({ authAdmin }) {
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiJhZG1pbjIiLCJpYXQiOjE3MjgxMjg1MDIsImV4cCI6MTczNjc2ODUwMn0.gqSAFiuUiAAnZHupDmJdlOqlKz2rqPxAbPVffcKt1Is";

  return (
    <View style={PageStyle.M_main}>
      <Sidebar style={PageStyle.M_sidebar} authAdmin={authAdmin}/>
      <View style={PageStyle.M_container_DB}>
        <View style={PageStyle.M_containerUp_DB}>
          <ContactSupport_DB style={PageStyle.M_CS_DB} authAdmin={authAdmin} />
          <Order_DB style={PageStyle.M_order_DB} />
        </View>
        <View style={PageStyle.M_containerDown_DB}>
          <View style={PageStyle.M_BLcontent_DB}>
            <View style={PageStyle.M_BLcontentL_DB}>
              <OpenRestaurant style={PageStyle.M_BLcontentL_Rest_DB} />
              <Income style={PageStyle.M_BLcontentL_Income_DB} />
              <NewUser style={PageStyle.M_BLcontentL_NewUser_DB} />
            </View>
            <Verify_DB style={PageStyle.M_Verify_DB} />
          </View>
          <UserGraph style={PageStyle.M_UserGraph_DB} />
        </View>
      </View>
    </View>
  );
}
