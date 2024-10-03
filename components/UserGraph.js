import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export default function LineGraph() {
  const [walkerData, setWalkerData] = useState([]);
  const [requesterData, setRequesterData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headersList = {
          Accept: "*/*",
        };

        const response = await fetch(
          "https://ku-man-api.vimforlanie.com/admin/order/today",
          {
            method: "GET",
            headers: headersList,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();

          // Time slots from 6 AM to 6 PM
          const timeLabels = [
            '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
            '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM'
          ];
          const walkerCounts = new Array(timeLabels.length).fill(0);  // Initialize counts for each slot
          const requesterCounts = new Array(timeLabels.length).fill(0);

          // Process each order and assign to the correct time slot
          data.forEach(order => {
            const orderTime = new Date(order.orderDate).getHours();  // Extract the hour from the order date

            if (orderTime >= 6 && orderTime <= 18) {  // Only consider orders between 6 AM and 6 PM
              const index = orderTime - 6;  // Get the correct index in the timeLabels array

              // Increment counts for walkers and requesters
              if (order.walkerId) walkerCounts[index]++;
              if (order.requesterId) requesterCounts[index]++;
            }
          });

          // Update the walker and requester data for the chart
          setWalkerData(walkerCounts);
          setRequesterData(requesterCounts);
        } else {
          throw new Error(`Unexpected content-type: ${contentType}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      <Text style={styles.title}>Walkers and Requesters Throughout the Day</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels: [
              '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
              '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM'
            ],
            datasets: [
              {
                data: walkerData,  // Dynamic walker data
                color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,  // Green for Walkers
                strokeWidth: 2,
              },
              {
                data: requesterData,  // Dynamic requester data
                color: (opacity = 1) => `rgba(128, 128, 128, ${opacity})`,  // Gray for Requesters
                strokeWidth: 2,
              },
            ],
            legend: ['Walker', 'Requester'],
          }}
          width={Dimensions.get('screen').width * 0.4}  // Adjust width to 40% of the screen
          height={250}  // Fixed height for the chart
          yAxisLabel=""
          yAxisSuffix=""
          yAxisInterval={1}
          withInnerLines={false}  // Disable inner grid lines (Optional)
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
    width: '100%',
    marginLeft: 10,
  },
  chartContainer: {
    overflow: 'hidden',  // Hide overflowing content
    width: Dimensions.get('screen').width * 0.4,  // Set container width to 40%
    justifyContent: 'center',
    alignItems: 'center',
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
    overflow: 'hidden',  // Ensure the chart stays inside its container
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
