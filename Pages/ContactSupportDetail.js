import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import ViewOrderDetail from "./ViewOrderDetail"; // Assuming this is a valid component
import ChatBox from "../components/ChatBox"; // Assuming this is a valid component
import { useRoute } from "@react-navigation/native";

export default function ContactSupportDetail({ authAdmin }) {
  const route = useRoute();
  const { orderId, userId, targetRole } = route.params; // Retrieve the orderId and authAdmin passed via route params
  const orderID = orderId; // Assign orderId to orderID for consistency
  const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiJhZG1pbjIiLCJpYXQiOjE3MjgxMjg1MDIsImV4cCI6MTczNjc2ODUwMn0.gqSAFiuUiAAnZHupDmJdlOqlKz2rqPxAbPVffcKt1Is";


  return (
    <View style={styles.CSD_Container}>
      {/* Order Details Section */}
      <View style={styles.CSD_OrderDetailContainer}>
        <ViewOrderDetail style={styles.CSD_OrderDetail} orderID={orderID} />
        
      </View>

      {/* Chat Section */}
      <View style={styles.CSD_ChatContainer}>
        <Text style={styles.CSD_Title}>Contact Support</Text>
        <Text style={styles.CSD_Title}>With: {targetRole} {userId}</Text>
        <ChatBox style={styles.CSD_ChatBox} orderId={orderId} userId={userId} targetRole={targetRole} />
      </View>
    </View>
  );
}

// Styles for ContactSupportDetail
const styles = StyleSheet.create({
  CSD_Container: {
    flex: 1,
    flexDirection: "row", // Align OrderDetail and ChatBox side by side
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  CSD_OrderDetailContainer: {
    flex: 3, // Takes up 3/4 of the width for the order details
    marginRight: 10, // Add some space between order details and chat
    backgroundColor: "#FFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    padding: 10,
  },
  CSD_ChatContainer: {
    flex: 1, // Takes up 1/4 of the width for the chat section
    justifyContent: "flex-start", // Start the chat section from the top
    backgroundColor: "#FFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    padding: 10,
  },
  CSD_Title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  CSD_ChatBox: {
    flex: 1,
    marginTop: 10, // Adds space between title and chatbox
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
});

