import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { PieChart } from "react-minimal-pie-chart"; // Use a web-based pie chart library
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ContactSupport_DB({ authAdmin }) {
  const route = useRoute(); // Get route hook
  // const authAdmin = AsyncStorage.getItem("authAdmin");
  const [supportRequests, setSupportRequests] = useState([]); // Store all support requests (combined)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiJhZG1pbjIiLCJpYXQiOjE3MjgxMjg1MDIsImV4cCI6MTczNjc2ODUwMn0.gqSAFiuUiAAnZHupDmJdlOqlKz2rqPxAbPVffcKt1Is";


  const navigation = useNavigation();

  // Fetch data from API
  useEffect(() => {
    const fetchSupportRequests = async () => {
      try {
        let headersList = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authAdmin}`,
        };

        let response = await fetch("https://ku-man-api.vimforlanie.com/admin/chat", {
          method: "GET",
          headers: headersList,
        });

        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.status}`);
        }

        let data = await response.json();
        // Combine requester and walker data into one array for easier mapping
        const combinedRequests = [
          ...(Array.isArray(data.requester) ? data.requester.map((req) => ({
            ...req,
            role: 'requester',
            userId: req.requesterId,
          })) : []),
          ...(Array.isArray(data.walker) ? data.walker.map((req) => ({
            ...req,
            role: 'walker',
            userId: req.walkerId,
          })) : []),
        ];

        setSupportRequests(combinedRequests);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const intervalId = setInterval(fetchSupportRequests, 1000); // Fetch every second
    return () => clearInterval(intervalId); // Cleanup
  }, []);

  // Calculate the number of completed, inProgress, and lookingForWalker requests
  const totalRequests = supportRequests.length;
  const completedRequests = supportRequests.filter(
    (req) => req.orderStatus === "completed"
  ).length;
  const cancelledRequests = supportRequests.filter(
    (req) => req.orderStatus === "cancelled"
  ).length;
  const inProgressRequests = supportRequests.filter(
    (req) => req.orderStatus === "inProgress"
  ).length;
  const lookingForWalkerRequests = supportRequests.filter(
    (req) => req.orderStatus === "lookingForWalker"
  ).length;

  const onProcessRequests = inProgressRequests + lookingForWalkerRequests;
  const completedProcessRequests = completedRequests + cancelledRequests;

  // Navigate to ContactSupportDetail with the orderId, userId, and role
  const handleCSPress = (orderId, userId, role) => {
    navigation.navigate("ContactSupportDetail", { orderId, userId, role, authAdmin });
  };

  // If data is still loading
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading support requests...</Text>
      </View>
    );
  }

  // If there is an error
  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Support Requests List */}
      <View style={styles.requestList}>
        <Text style={styles.header}>Contact Support</Text>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {supportRequests.map((request) => (
            <TouchableOpacity
              key={request.orderId}
              style={styles.requestContainer}
              onPress={() => handleCSPress(request.orderId, request.userId, request.role)} // Navigate with orderId, userId, and role
            >
              <Text style={styles.requestText}>
                {request.role.charAt(0).toUpperCase() + request.role.slice(1)} ID: {request.userId}, Order ID: {request.orderId}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Pie Chart and Stats */}
      <View style={styles.chartContainer}>
        <PieChart
          data={[
            {
              title: "On Process",
              value: onProcessRequests,
              color: "rgb(255, 240, 186)",
            },
            {
              title: "Completed",
              value: completedProcessRequests,
              color: "rgb(144, 238, 144)",
            },
          ]}
          radius={50} // Adjust the radius if necessary
          lineWidth={25} // Adjust line width for better visibility
          label={({ dataEntry }) => Math.round(dataEntry.percentage) + "%"}
          labelStyle={{
            fontSize: "10px",
            fill: "#000",
          }}
          style={{ height: 200 }} // Adjust chart height
        />
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: "rgb(255, 240, 186)" }]}
            />
            <Text style={styles.legendText}>On Process: {onProcessRequests}</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: "rgb(144, 238, 144)" }]}
            />
            <Text style={styles.legendText}>Completed: {completedProcessRequests}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Side by side layout
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fafbfc",
    borderRadius: 10,
    width: "100%", // Ensure it takes full width of the parent
    height: "100%", // Ensure it takes full height of the parent
    flex: 1, // Use flex to allow container to fill available space
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  requestList: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    maxHeight: 400, // Set max height for scrollable area
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  requestContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  requestText: {
    fontSize: 16,
  },
  chartContainer: {
    flexDirection: "column",
    alignItems: "center",
    flexBasis: "50%", // Use flexBasis for width allocation
    borderRadius: 10,
    marginTop: 30,
  },
  totalText: {
    fontSize: 24,
    marginTop: 10,
    fontWeight: "bold",
  },
  legend: {
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  legendColor: {
    width: 20,
    height: 20,
    marginRight: 8,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
});
