import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
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
    navigation.navigate("ReportOrderDetail", { orderId: report.orderId });
  };

  const handleEmail = async () => {
    setIsSendingEmail(true);
    let email = "";

    try {
      const headersList = {
        Accept: "*/*",
        Authorization: `Bearer ${authToken}`,
      };

      let endpoint = "";
      if (report.reportBy === "requester") {
        endpoint = `https://ku-man-api.vimforlanie.com/admin/requester?requesterId=${report.requesterId}`;
      } else {
        endpoint = `https://ku-man-api.vimforlanie.com/admin/walker?walkerId=${report.walkerId}`;
      }

      const response = await fetch(endpoint, { method: "GET", headers: headersList });
      if (!response.ok) throw new Error("Failed to fetch user email");

      const data = await response.json();
      email = data.email;

      // Dummy email sending logic
      const sendEmailResponse = await fetch("https://email-api.example.com/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          subject: `Report Notification - Report ID: ${report.reportId}`,
          body: `Dear User,\n\nWe have received your report:\n\nTitle: ${report.title}\nDescription: ${report.description}\n\nWe will review it shortly.\n\nBest Regards,\nSupport Team`,
        }),
      });

      if (!sendEmailResponse.ok) throw new Error("Failed to send email");
      Alert.alert("Success", `Email sent to ${email}`);
    } catch (error) {
      console.error("Error sending email:", error);
      Alert.alert("Error", "Failed to send the email. Please try again.");
    } finally {
      setIsSendingEmail(false);
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
          <Text style={styles.detail}><Text style={styles.label}>
            {report.reportBy === "requester" ? "Requester ID:" : "Walker ID:"}
          </Text> {report.reportBy === "requester" ? report.requesterId : report.walkerId}</Text>
          <Text style={styles.detail}><Text style={styles.label}>Date:</Text> {new Date(report.reportDate).toLocaleString()}</Text>

          <Text style={styles.detail}><Text style={styles.label}>Status:</Text>
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
        <TouchableOpacity style={styles.button} onPress={handleEmail} disabled={isSendingEmail}>
          {isSendingEmail ? <ActivityIndicator color="#fff" /> : <MaterialIcons name="email" size={20} color="#fff" />}
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
