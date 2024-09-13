import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Head from "../components/Header";  // Import your header component
import { useNavigation } from "@react-navigation/native"; // Import navigation hook

export default function ReportDetails({ route }) {
    const navigation = useNavigation(); // Get navigation hook

  const { report } = route.params;

  const handleShowOrder = () => {
    // Logic for showing order
    // console.log("Show order pressed");
    navigation.navigate("OrderDetail", { orderId: report.orderId });
  };

  const handleEmail = () => {
    // Logic for sending email
    // console.log("Email pressed");
  };

  return (
    <View style={styles.container}>
      <Head />
      <View style={styles.header}>
        <Text style={styles.title}>Report from User : {report.name}</Text>
      </View>
      <View style={styles.reportDetails}>
        <Text style={styles.label}>ชื่อ :</Text>
        <Text style={styles.text}>{report.name}</Text>

        <Text style={styles.label}>เบอร์โทรศัพท์ :</Text>
        <Text style={styles.text}>{report.phone}</Text>

        <Text style={styles.label}>รายละเอียด :</Text>
        <Text style={styles.text}>{report.details}</Text>
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
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    marginVertical: 4,
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
