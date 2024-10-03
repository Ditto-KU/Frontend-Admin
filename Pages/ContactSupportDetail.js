import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PageStyle } from "../Style/PageStyle"; // Ensure this is correctly defined
import OrderDetail from "./OrderDetail"; // Assuming this is a valid component
import ChatBox from "../components/ChatBox"; // Assuming this is a valid component

export default function ContactSupportDetail({ route }) {
  // Extract the report details passed via navigation
  const { report } = route.params;

  return (
    <View style={styles.CSD_Container}>
      <Text style={styles.CSD_Title}>Support Details</Text>

      {/* Render the OrderDetail component and pass the report details */}
      <OrderDetail style={styles.CSD_OrderDetail} report={report} />

      {/* Render the ChatBox component to allow user interaction */}
      <ChatBox style={styles.CSD_ChatBox} report={report} />
    </View>
  );
}

// Styles for ContactSupportDetail
const styles = StyleSheet.create({
  CSD_Container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  CSD_Title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  CSD_OrderDetail: {
    flex: 1,
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  CSD_ChatBox: {
    flex: 2,
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
});
