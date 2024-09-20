import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';


export default function LineGraph() {
  const [walkerData, setWalkerData] = useState([]);
  const [requesterData, setRequesterData] = useState([]);
  const [loading, setLoading] = useState(true);

  const graphWidth = Dimensions.get("screen").width*0.35
  const graphHeight = Dimensions.get("screen").height*0.30

  useEffect(() => {
    // Mock fetch API call (replace with your actual API URL)
    fetch('https://your-api-url.com/activity-data') // Replace with your actual API endpoint
      .then(response => response.json())
      .then(data => {
        setWalkerData(data.walkers); // Walker activity data
        setRequesterData(data.requesters); // Requester activity data
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

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
      <Text style={styles.title}>Users Activity Throughout the Day</Text>
      <LineChart
        data={{
          labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
          datasets: [
            {
              data: walkerData, // Dynamic walker data
              color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // Green for Walkers
              strokeWidth: 2,
            },
            {
              data: requesterData, // Dynamic requester data
              color: (opacity = 1) => `rgba(128, 128, 128, ${opacity})`, // Gray for Requesters
              strokeWidth: 2,
            },
          ],
          legend: ['Walker', 'Requester'],
        }}
        width={graphWidth} // Dynamic width minus padding
        height={graphHeight} // Fixed height for the chart
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: '#000',
          backgroundGradientFrom: '#fffffe',
          backgroundGradientTo: '#ccc',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#00ff00',
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
    backgroundColor: '#fafbfc',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: '100%', // Full width
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 10,
    color: '#333',
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
