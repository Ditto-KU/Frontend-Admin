import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { PieChart } from 'react-minimal-pie-chart'; // Use a web-based pie chart library

export default function ContactSupport_DB() {
  const supportRequests = [
    { user: "user: yyyyy", time: "9:42" },
    { user: "user: yyyyy", time: "9:41" },
    { user: "user: yyyyy", time: "9:38" },
    { user: "user: yyyyy", time: "9:38" },
  ];

  const totalRequests = 1230;
  const onprocess = 230;
  const completed = 1000;

  return (
    <View style={styles.container}>
      {/* Support Requests List */}
      <View style={styles.requestList}>
        <Text style={styles.header}>Contact Support</Text>
        {supportRequests.map((request, index) => (
          <TouchableOpacity key={index} style={styles.requestContainer}>
            <Text style={styles.requestText}>{request.user}</Text>
            <Text style={styles.requestTime}>{request.time}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Pie Chart and Stats */}
      <View style={styles.chartContainer}>
        <PieChart
          data={[
            { title: 'On process', value: onprocess, color: '#FFA500' },
            { title: 'Complete', value: completed, color: '#008000' },
          ]}
          radius={50} // Increased the radius to make the chart larger
          lineWidth={25} // Adjusted line width for better visibility
          label={({ dataEntry }) => Math.round(dataEntry.percentage) + '%'}
          labelStyle={{
            fontSize: '10px',
            fill: '#000',
          }}
          style={{ height: 200 }} // Increased chart height to make it fit better
        />
        <Text style={styles.totalText}>All requests: {totalRequests}</Text>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FFA500' }]} />
            <Text style={styles.legendText}>On process: {onprocess}</Text>
            
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#008000' }]} />
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
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  requestList: {
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 10,
    flexBasis: "50%", // Use flexBasis for width allocation
    // backgroundColor: "#fff", // Optional: ensure the container is visually separated
    borderRadius: 10,
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
    // backgroundColor: "#fff", // Optional: ensure the container is visually separated
    borderRadius: 10,
    marginTop: 30,
  },
  totalText: {
    fontSize: 16,
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
