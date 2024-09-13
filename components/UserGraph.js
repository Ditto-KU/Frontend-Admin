import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = 750; // Dynamic screen width

export default function LineGraph() {
  // State to hold the fetched data
  const [walkerData, setWalkerData] = useState([]);
  const [requesterData, setRequesterData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    // Mock fetch API call (replace with your actual API URL)
    fetch('https://your-api-url.com/activity-data') // Replace with your actual API endpoint
      .then(response => response.json())
      .then(data => {
        // Assuming the API returns two arrays: `walkers` and `requesters`
        setWalkerData(data.walkers); // Walker activity data
        setRequesterData(data.requesters); // Requester activity data
        setLoading(false); // Stop loading when data is fetched
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  // Display loading indicator while fetching data
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Users Activity Throughout the Day
      </Text>
      <LineChart
        data={{
          labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'], // Assuming these are the time labels
          datasets: [
            {
              data: walkerData, // Dynamic walker data
              color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // Green for Walkers
              strokeWidth: 2, // Line thickness
            },
            {
              data: requesterData, // Dynamic requester data
              color: (opacity = 1) => `rgba(128, 128, 128, ${opacity})`, // Gray for Requesters
              strokeWidth: 2, // Line thickness
            },
          ],
          legend: ["Walker", "Requester"], // Labels for the lines
        }}
        width={screenWidth - 40} // Adjust according to your screen size, adding some padding
        height={280}
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1} // Interval on the y-axis
        chartConfig={{
          backgroundColor: '#000', // Black background
          backgroundGradientFrom: '#fffffe', // White gradient start
          backgroundGradientTo: '#ccc', // Light gray gradient end
          decimalPlaces: 0, // No decimal places
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black for labels and axes
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black label text
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#00ff00', // Green stroke for the dots
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafbfc', // Light gray background
    padding: 20,
    borderRadius: 10,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
