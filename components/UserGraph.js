import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = 750;

export default function LineGraph() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Users Activity Throughout the Day
      </Text>
      <LineChart
        data={{
          labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
          datasets: [
            {
              data: [30, 50, 20, 80, 100, 60], // Walker data
              color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // Green for Walkers
              strokeWidth: 2 // Line thickness
            },
            {
              data: [20, 40, 70, 95, 85, 30], // Requester data
              color: (opacity = 1) => `rgba(128, 128, 128, ${opacity})`, // Gray for Requesters
              strokeWidth: 2 // Line thickness
            }
          ],
          legend: ["Walker", "Requester"] // Labels for the lines
        }}
        width={screenWidth} // Adjust according to your screen size
        height={280}
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1} // Interval on the y-axis
        chartConfig={{
          backgroundColor: '#000', // Black background
          backgroundGradientFrom: '#fff', // White gradient start
          backgroundGradientTo: '#ccc', // Light gray gradient end
          decimalPlaces: 0, // No decimal places
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black for labels and axes
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black label text
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#00ff00' // Green stroke for the dots
          }
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafbfc', // Light gray background
    padding: 20,
    borderRadius: 10,
    marginLeft: 10,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 10,
    color: '#333', // Dark gray title color
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
