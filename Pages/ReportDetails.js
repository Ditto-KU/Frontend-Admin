import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert ,Linking , ActivityIndicator } from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import * as MailComposer from "expo-mail-composer";
import Head from "../components/Header";
import { useNavigation, useRoute } from "@react-navigation/native";


export default function ReportDetails() {
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();
  const { report } = route.params;
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiJhZG1pbjIiLCJpYXQiOjE3MjgxMjg1MDIsImV4cCI6MTczNjc2ODUwMn0.gqSAFiuUiAAnZHupDmJdlOqlKz2rqPxAbPVffcKt1Is";

  const handleShowOrder = () => {
    navigation.navigate("OrderDetail", { orderID: report.orderId });
  };

  const handleEmail = async () => {
    try {
      console.log("Sending email...");
      // Authorization headers with admin token
      const headersList = {
        Accept: "*/*",
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      };
  
      let endpoint = "";
      let idField = "";
  
      // Determine which endpoint to fetch based on reportBy field
      if (report.reportBy === "requester") {
        endpoint = `https://ku-man-api.vimforlanie.com/admin/requester`;
        idField = "requesterId";
      } else if (report.reportBy === "walker") {
        endpoint = `https://ku-man-api.vimforlanie.com/admin/walkerALL`;
        idField = "walkerId";
      } else {
        throw new Error("Unknown report origin type.");
      }
  
      // Fetch user data based on report's requester or walker ID
      const response = await fetch(endpoint, { method: "GET", headers: headersList });
      if (!response.ok) throw new Error("Failed to fetch user data");
      const data = await response.json(); // Fetching data
      console.log("Fetched user data:", data);
      // const user = data.find((item) => item[idField] === report[idField]); // Locate user by ID
      // if (!user || !user.email) throw new Error("User or email address not found.");
  
      // const email = user.email;
      const email = "setthawut.a@ku.th";
      const subject = "Your Verification Status";
      const body = "Your verification has failed. Please try again.";
  
      // Generate the mailto URL with encoded content
      const emailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      console.log("Generated mailto URL:", emailUrl);
  
      // Check if the device can open the mailto URL
      const supported = await Linking.canOpenURL(emailUrl);
      if (!supported) throw new Error("No email client available to handle the request.");
  
      // Open the email client
      await Linking.openURL(emailUrl);
      Alert.alert("Success", "An email prompt has been opened.");
    } catch (error) {
      console.error("Failed to send email:", error);
      Alert.alert("Error", error.message || "Failed to open email client. Please check your email app.");
    }
  };
  

  return (
    <View style={styles.container}>
      <Head />
      <View style={styles.banner}>
        <Text style={styles.title}>Report Details</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.sectionTitle}>Report Information</Text>

          {/* Highlighted Title Section */}
          <View style={styles.highlightContainer}>
            <Text style={styles.highlightTitle}>Title:</Text>
            <Text style={styles.highlightText}>{report.title}</Text>
          </View>

          {/* Highlighted Description Section */}
          <View style={styles.highlightContainer}>
            <Text style={styles.highlightTitle}>Description:</Text>
            <Text style={styles.highlightText}>{report.description}</Text>
          </View>

          <Text style={styles.detail}><Text style={styles.label}>Order ID:</Text> {report.orderId}</Text>
          <Text style={styles.detail}><Text style={styles.label}>Report ID:</Text> {report.reportId}</Text>
          <Text style={styles.detail}><Text style={styles.label}>Report By:</Text> {report.reportBy}</Text>
          <Text style={styles.detail}><Text style={styles.label}>
            {report.reportBy === "requester" ? "Requester ID:" : "Walker ID:"}
          </Text> {report.reportBy === "requester" ? report.requesterId : report.walkerId}</Text>
          <Text style={styles.detail}><Text style={styles.label}>Date:</Text> {new Date(report.reportDate).toLocaleString()}</Text>

          <Text style={styles.detail}><Text style={styles.label}>Report Status:</Text>
            <Text style={[styles.status, report.status === "resolved" ? styles.statusResolved : styles.statusPending]}>
              {report.status}
            </Text>
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleShowOrder}>
          <FontAwesome name="list-alt" size={20} color="#fff" />
          <Text style={styles.buttonText}>Show Order</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleEmail}>
          <Text style={styles.buttonText}>Send Email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  banner: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 20,
  },
  cardContent: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },

  /* Highlighted Title and Description Styles */
  highlightContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  highlightTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  highlightText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginTop: 5,
  },

  detail: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
  },
  label: {
    fontWeight: "bold",
    color: "#555",
  },
  status: {
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    overflow: "hidden",
  },
  statusResolved: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    marginLeft: 10,
  },
  statusPending: {
    backgroundColor: "#FF5722",
    color: "#fff",
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: "green",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "bold",
  },
});
