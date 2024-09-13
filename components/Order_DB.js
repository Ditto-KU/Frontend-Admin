import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { PieChart } from "react-minimal-pie-chart"; // Use a web-based pie chart library
import { useNavigation } from "@react-navigation/native";

export default function Order_DB() {
  const navigation = useNavigation();

  // Sample order data
  const orderData = [
    { orderid: 1, user: "user: yyyyy", time: "9:42", status: "ongoing" },
    { orderid: 2, user: "user: yyyyy", time: "9:41", status: "complete" },
    { orderid: 3, user: "user: yyyyy", time: "9:38", status: "cancel" },
    { orderid: 4, user: "user: yyyyy", time: "9:38", status: "ongoing" },
  ];
  
  const totalOrders = 1234;
  const ongoing = 230;
  const complete = 1000;
  const cancel = 4;

  // Function to handle order detail navigation
  const gotoOrderDetail = (order) => {
    navigation.navigate("OrderDetail", { orderid: order.orderid });
  };

  return (
    <View style={styles.container}>
      {/* Order List */}
      <View style={styles.orderList}>
        <Text style={styles.header}>Order</Text>
        {orderData.map((order, index) => {
          let backgroundColor = "#FFF"; // Default background
          if (order.status === "complete") backgroundColor = "rgb(144, 238, 144)"; // Softer Green
          else if (order.status === "ongoing") backgroundColor = "rgb(255, 240, 186)"; // Softer Yellow
          else if (order.status === "cancel") backgroundColor = "rgb(255, 182, 193)"; // Softer Pink

          return (
            <TouchableOpacity
              key={index}
              style={[styles.orderContainer, { backgroundColor }]}
              onPress={() => gotoOrderDetail(order)}
            >
              <Text style={styles.orderText}>{order.user}</Text>
              <Text style={styles.orderTime}>{order.time}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Pie Chart and Stats */}
      <View style={styles.chartContainer}>
        <PieChart
          data={[
            { title: "On going", value: ongoing, color: "rgb(255, 240, 186)" }, // Softer Yellow
            { title: "Complete", value: complete, color: "rgb(144, 238, 144)" }, // Softer Green
            { title: "Cancel", value: cancel, color: "rgb(255, 182, 193)" }, // Softer Red/Pink
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
            <View style={[styles.legendColor, { backgroundColor: "rgb(255, 240, 186)" }]} />
            <Text style={styles.legendText}>Ongoing: {ongoing}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "rgb(144, 238, 144)" }]} />
            <Text style={styles.legendText}>Complete: {complete}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "rgb(255, 182, 193)" }]} />
            <Text style={styles.legendText}>Cancel: {cancel}</Text>
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
  },
  legendText: {
    fontSize: 20,
  },
});
