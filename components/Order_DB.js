import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { PieChart } from "react-minimal-pie-chart"; // Use a web-based pie chart library
import { useNavigation } from "@react-navigation/native";

export default function Order_DB() {
  const navigation = useNavigation();

  // State variables
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch order data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headersList = {
          Accept: "*/*",
        };

        const response = await fetch("https://ku-man.runnakjeen.com/admin/order", {
          method: "GET",
          headers: headersList,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();

          const sortedData = data.sort((a, b) => {
            const statusOrder = { "waitingAdmin": 1, "inProgress": 2, "lookingForWalker": 3, "completed": 4, "cancelled": 5 };
            return statusOrder[a.orderStatus] - statusOrder[b.orderStatus];
          });
          setOrderData(sortedData); // Set order data
        } else {
          throw new Error(`Unexpected content-type: ${contentType}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Order stats calculation for Pie Chart
  const totalOrders = orderData.length;
  const lookingForWalker = orderData.filter(order => order.orderStatus === "lookingForWalker").length;
  const inProgress = orderData.filter(order => order.orderStatus === "inProgress").length;
  const completed = orderData.filter(order => order.orderStatus === "Delivered").length;
  const cancelled = orderData.filter(order => order.orderStatus === "Cancelled").length;
  const waitingAdmin = orderData.filter(order => order.orderStatus === "waitingAdmin").length;

  // Function to handle order detail navigation
  const gotoOrderDetail = (order) => {
    navigation.navigate("OrderDetail", { order: order });
  };  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Order List */}
      <View style={styles.orderList}>
        <Text style={styles.header}>Orders</Text>
        {orderData.map((order, index) => {
          let backgroundColor = "#FFF"; // Default background
          if (order.orderStatus === "inProgress") backgroundColor = "rgb(255, 240, 186)"; // Softer Green
          else if (order.orderStatus === "completed") backgroundColor = "rgb(144, 238, 144)"; // Softer Yellow
          else if (order.orderStatus === "cancelled") backgroundColor = "rgb(255, 182, 193)"; // Softer Pink
          else if (order.orderStatus === "lookingForWalker") backgroundColor = "rgb(211, 211, 211)"; // Softer Gray
          else if (order.orderStatus === "waitingAdmin") backgroundColor = "rgb(255, 222, 173)"; // Softer Peach

          return (
            <TouchableOpacity
              key={index}
              style={[styles.orderContainer, { backgroundColor }]}
              onPress={() => gotoOrderDetail(order)}
            >
              <Text style={styles.orderText}>Order ID: {order.orderId}</Text>
              <Text style={styles.orderText}>{order.orderStatus}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Pie Chart and Stats */}
      <View style={styles.chartContainer}>
        <PieChart
          data={[
            { title: "inProgress", value: inProgress, color: "rgb(255, 240, 186)" }, // Softer Yellow
            { title: "completed", value: completed, color: "rgb(144, 238, 144)" }, // Softer Green
            { title: "cancelled", value: cancelled, color: "rgb(255, 182, 193)" }, // Softer Pink
            { title: "lookingForWalker", value: lookingForWalker, color: "rgb(211, 211, 211)" }, // Softer Gray
            { title: "waitingAdmin", value: waitingAdmin, color: "rgb(255, 222, 173)" }, // Softer Peach
          ]}
          radius={50} // Size of the pie chart
          lineWidth={25} // Line thickness
          label={({ dataEntry }) => Math.round(dataEntry.percentage) + "%"}
          labelStyle={{
            fontSize: "8px",
            fill: "#000",
          }}
          style={{ height: 200 }} // Pie chart height
        />
        <Text style={styles.totalText}>All orders: {totalOrders}</Text>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "rgb(255, 222, 173)" }]} />
            <Text style={styles.legendText}>waitingAdmin: {waitingAdmin}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "rgb(255, 240, 186)" }]} />
            <Text style={styles.legendText}>inProgress: {inProgress}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "rgb(211, 211, 211)" }]} />
            <Text style={styles.legendText}>lookingForWalker: {lookingForWalker}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "rgb(144, 238, 144)" }]} />
            <Text style={styles.legendText}>completed: {completed}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "rgb(255, 182, 193)" }]} />
            <Text style={styles.legendText}>cancelled: {cancelled}</Text>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  orderList: {
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 10,
    flexBasis: "50%",
    borderRadius: 10,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  orderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  orderText: {
    fontSize: 16,
  },
  orderTime: {
    fontSize: 14,
    color: "#000",
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
});

