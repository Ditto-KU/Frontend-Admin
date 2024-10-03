import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Head from "../components/Header"; // Import your header component
import { useNavigation } from "@react-navigation/native"; // Import navigation hook

export default function ReportDetails({ route }) {
  const navigation = useNavigation(); // Get navigation hook
  const { report } = route.params;

  const handleShowOrder = () => {
    // Navigate to OrderDetail screen and pass the orderId
    navigation.navigate("ReportOrderDetail", { orderId: report.orderId });
  };

  const handleEmail = () => {
    // Logic for sending email
    console.log("Email pressed");
  };

  return (
    <View style={styles.container}>
      <Head />
      <View style={styles.header}>
        <Text style={styles.title}>
          Report from {report.reportBy === "requester" ? "Requester" : "Walker"}
        </Text>
      </View>

      <View style={styles.reportDetails}>
        <Text style={styles.inlineText}>
          <Text style={styles.label}>Title: </Text>
          <Text style={styles.text}>{report.title}</Text>
        </Text>

        <Text style={styles.inlineText}>
          <Text style={styles.label}>Description: </Text>
          <Text style={styles.text}>{report.description}</Text>
        </Text>

        <Text style={styles.inlineText}>
          <Text style={styles.label}>Status: </Text>
          <Text style={styles.text}>{report.status}</Text>
        </Text>

        <Text style={styles.inlineText}>
          <Text style={styles.label}>Order ID: </Text>
          <Text style={styles.text}>{report.orderId}</Text>
        </Text>

        <Text style={styles.inlineText}>
          <Text style={styles.label}>Report ID: </Text>
          <Text style={styles.text}>{report.reportId}</Text>
        </Text>

        <Text style={styles.inlineText}>
          <Text style={styles.label}>
            {report.reportBy === "requester" ? "Requester ID: " : "Walker ID: "}
          </Text>
          <Text style={styles.text}>
            {report.reportBy === "requester"
              ? report.requesterId
              : report.walkerId}
          </Text>
        </Text>

        <Text style={styles.inlineText}>
          <Text style={styles.label}>Report Date: </Text>
          <Text style={styles.text}>
            {new Date(report.reportDate).toLocaleString()}
          </Text>
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleShowOrder}>
          <Text style={styles.buttonText}>Show Order</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleEmail}>
          <Text style={styles.buttonText}>Email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  reportDetails: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    marginLeft: 5,
  },
  inlineText: {
    flexDirection: "row",
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
