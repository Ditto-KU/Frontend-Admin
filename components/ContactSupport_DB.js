import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { PieChart } from "react-minimal-pie-chart";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ContactSupport_DB() {
  const route = useRoute();
  const [supportRequests, setSupportRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authAdmin, setAuthAdmin] = useState("");

  const navigation = useNavigation();
  useEffect(() => {
    const fetchAuthToken = async () => {
      const token = await AsyncStorage.getItem("authAdmin");
      setAuthAdmin(token);
      if (token) {
        fetchMessages(token); // Pass token to fetchMessages
      } else {
        Alert.alert("Error", "Authentication token not found.");
      }
    };

    fetchAuthToken();
  }, []);


  // Fetch data from API
  useEffect(() => {
    const fetchSupportRequests = async () => {
      if (!authAdmin) return; // ตรวจสอบว่ามี authAdmin ก่อน
    
      try {
        let headersList = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authAdmin}`, // ส่ง authAdmin
        };
  
        let response = await fetch("https://ku-man-api.vimforlanie.com/admin/chat", {
          method: "GET",
          headers: headersList,
        });
  
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.status}`);
        }
  
        let data = await response.json();
        const combinedRequests = [
          ...(Array.isArray(data.requester) ? data.requester.map((req) => ({
            ...req,
            targetRole: "requester",
            userId: req.requesterId,
          })) : []),
          ...(Array.isArray(data.walker) ? data.walker.map((req) => ({
            ...req,
            targetRole: "walker",
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
  
    // Call only if authAdmin is available
    if (authAdmin) {
      const intervalId = setInterval(fetchSupportRequests, 1000); // Fetch every second
      return () => clearInterval(intervalId); // Cleanup interval when unmounted or authAdmin changes
    }
  }, [authAdmin]); // เพิ่ม authAdmin ใน dependency array
  

  // Filter for only "on process" requests
  const onProcessRequests = supportRequests.filter(
    (req) => req.orderStatus === "inProgress" || req.orderStatus === "lookingForWalker"
  );

  // Calculate other statistics
  const totalRequests = supportRequests.length;
  const completedRequests = supportRequests.filter(
    (req) => req.orderStatus === "completed"
  ).length;
  const cancelledRequests = supportRequests.filter(
    (req) => req.orderStatus === "cancelled"
  ).length;
  const completedProcessRequests = completedRequests + cancelledRequests;

  // Navigate to ContactSupportDetail with the orderId, userId, and role
  const handleCSPress = (orderId, userId, targetRole) => {
    navigation.navigate("ContactSupportDetail", { orderId, userId, targetRole });
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
      {/* Support Requests List (only "on process" requests) */}
      <View style={styles.requestList}>
        <Text style={styles.header}>Contact Support ({onProcessRequests.length})</Text>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {onProcessRequests.map((request, index) => (
            <TouchableOpacity
              key={`${request.orderId}-${request.userId}-${index}`} // Ensure uniqueness
              style={styles.requestContainer}
              onPress={() => handleCSPress(request.orderId, request.userId, request.targetRole)}
            >
              <Text style={[styles.requestText, { fontWeight: 600 }]}>
                {request.targetRole && request.targetRole.charAt(0).toUpperCase() + request.targetRole.slice(1)}
                ID: {request.userId}, Order ID: {request.orderId}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Pie Chart and Stats */}
      <View style={styles.chartContainer}>
        <PieChart
          data={[
            { title: "On Process", value: onProcessRequests.length, color: "rgb(255, 240, 186)" },
            { title: "Completed", value: completedProcessRequests, color: "rgb(144, 238, 144)" },
          ]}
          radius={50}
          lineWidth={25}
          label={({ dataEntry }) => Math.round(dataEntry.percentage) + "%"}
          labelStyle={{ fontSize: "10px", fill: "#000" }}
          style={{ height: 200 }}
        />

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: "rgb(255, 240, 186)" }]}
            />
            <Text style={styles.legendText}>On Process: {onProcessRequests.length}</Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fafbfc",
    borderRadius: 10,
    width: "100%",
    height: "100%",
    flex: 1,
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
    maxHeight: 400,
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
    flexBasis: "50%",
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
