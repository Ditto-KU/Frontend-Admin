import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { PieChart } from "react-minimal-pie-chart"; // Use a web-based pie chart library like in ContactSupport_DB

export default function Order_DB() {
  const orderData = [
    { user: "user: yyyyy", time: "9:42" },
    { user: "user: yyyyy", time: "9:41" },
    { user: "user: yyyyy", time: "9:38" },
    { user: "user: yyyyy", time: "9:38" },
  ];

  const totalOrders = 1234;
  const ongoing = 230;
  const complete = 1000;
  const cancel = 4;

  return (
    <View style={styles.container}>
      {/* Order List */}
      <View style={styles.orderList}>
        <Text style={styles.header}>Order</Text>
        {orderData.map((order, index) => (
          <TouchableOpacity key={index} style={styles.orderContainer}>
            <Text style={styles.orderText}>{order.user}</Text>
            <Text style={styles.orderTime}>{order.time}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Pie Chart and Stats */}
      <View style={styles.chartContainer}>
        <PieChart
          data={[
            { title: "On going", value: ongoing, color: "#FFA500" },
            { title: "Complete", value: complete, color: "#008000" },
            { title: "Cancel", value: cancel, color: "#FF0000" },
          ]}
          radius={50} // Increase the radius to make the chart larger
          lineWidth={25} // Adjust the line width for better visibility
          label={({ dataEntry }) => Math.round(dataEntry.percentage) + "%"}
          labelStyle={{
            fontSize: "8px",
            fill: "#000",
          }}
          style={{ height: 200 }} // Increase chart height to fit better
        />
        <Text style={styles.totalText}>All orders: {totalOrders}</Text>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "#FFA500" }]} />
            <Text style={styles.legendText}>On going: {ongoing}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "#008000" }]} />
            <Text style={styles.legendText}>Complete: {complete}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "#FF0000" }]} />
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
    flexDirection: "row", // Side by side layout
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fafbfc",
    borderRadius: 10,
    width: "100%", // Ensure it takes full width of the parent
    height: "100%", // Ensure it takes full height of the parent
    flex: 1, // Use flex to allow container to fill available space

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  orderList: {
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 10,
    flexBasis: "50%", // Use flexBasis for width allocation
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
    backgroundColor: "#FFF",
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
  }
});
