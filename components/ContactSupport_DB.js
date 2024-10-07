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

export default function ContactSupport_DB() {
  const route = useRoute(); // Get route hook
  const { authAdmin } = route.params;
  const [supportRequests, setSupportRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiJhZG1pbjIiLCJpYXQiOjE3MjgxMjg1MDIsImV4cCI6MTczNjc2ODUwMn0.gqSAFiuUiAAnZHupDmJdlOqlKz2rqPxAbPVffcKt1Is";
  
  const totalRequests = 1230; // Static data for example purposes
  const onprocess = 230; // Static data for example purposes
  const completed = 1000; // Static data for example purposes
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
        console.log("API Response:", data);
  
        // Ensure the data is an array
        if (Array.isArray(data)) {
          setSupportRequests(data); // Set the data if it's an array
        } else {
          console.error("Data is not an array:", data);
          setSupportRequests([]); // Fallback to empty array
        }
  
        setLoading(false);
      } catch (err) {
        setError(err.message); 
        setLoading(false);
      }
    };
  
    fetchSupportRequests();
  }, []);
  

  // Navigate to ContactSupportDetail with the orderId
  const handleCSPress = (orderId) => {
    navigation.navigate("ContactSupportDetail", { orderId , authAdmin: authAdmin });
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
              onPress={() => handleCSPress(request.orderId)} // Navigate with orderId
            >
              <Text style={styles.requestText}>Order ID: {request.orderId}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Pie Chart and Stats */}
      <View style={styles.chartContainer}>
        <PieChart
          data={[
            {
              title: "On process",
              value: onprocess,
              color: "rgb(255, 240, 186)",
            },
            {
              title: "Complete",
              value: completed,
              color: "rgb(144, 238, 144)",
            },
          ]}
          radius={50} // Increased the radius to make the chart larger
          lineWidth={25} // Adjusted line width for better visibility
          label={({ dataEntry }) => Math.round(dataEntry.percentage) + "%"}
          labelStyle={{
            fontSize: "10px",
            fill: "#000",
          }}
          style={{ height: 200 }} // Increased chart height to make it fit better
        />
        <Text style={styles.totalText}>All requests: {totalRequests}</Text>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: "rgb(255, 240, 186)" },
              ]}
            />
            <Text style={styles.legendText}>On process: {onprocess}</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: "rgb(144, 238, 144)" },
              ]}
            />
            <Text style={styles.legendText}>Complete: {completed}</Text>
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
  requestTime: {
    fontSize: 14,
    color: "#000",
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
