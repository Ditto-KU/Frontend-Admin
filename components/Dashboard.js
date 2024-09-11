import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
// Import chart library here
import { LineChart, BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { ComponentStyle } from "../Style/ComponentStyle";
import ContactSupport_DB from "../components/ContactSupport_DB";
import Verify_DB from "../components/Verify_DB";
import Order_DB from "../components/Order_DB";

export default function Dashboard() {
    return(
        <View style={ComponentStyle.DB_container}>
          <ContactSupport_DB/>
          <Verify_DB/>
          <Order_DB/>
        </View>
    )
}
