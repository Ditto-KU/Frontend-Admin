import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export default function LineGraph() {
  const [orderData, setOrderData] = useState([]); // Store order counts
  const [loading, setLoading] = useState(true);
  const [orderNumber, setOrderNumber] = useState(); // Store the total number of orders
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiJhZG1pbjIiLCJpYXQiOjE3MjgxMjg1MDIsImV4cCI6MTczNjc2ODUwMn0.gqSAFiuUiAAnZHupDmJdlOqlKz2rqPxAbPVffcKt1Is";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headersList = {
          Accept: "*/*",
          Authorization: `Bearer ${authToken}`,
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

          setOrderNumber(data.length);

          // Time slots from 6 AM to 6 PM
          const timeLabels = [
            '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
            '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM'
          ];
          const orderCounts = new Array(timeLabels.length).fill(0); // Initialize counts for each slot

          // Process each order and assign to the correct time slot
          data.forEach(order => {
            const orderTime = new Date(order.orderDate).getHours(); // Extract the hour from the order date

            if (orderTime >= 6 && orderTime <= 18) { // Only consider orders between 6 AM and 6 PM
              const index = orderTime - 6; // Get the correct index in the timeLabels array
              orderCounts[index]++; // Increment the order count
            }
          });

          // Update the order data for the chart
          setOrderData(orderCounts);
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

    const intervalId = setInterval(fetchData, 1000); // Fetch data every second
    return () => clearInterval(intervalId); // Cleanup interval on unmount
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
      <Text style={styles.title}>Orders Throughout the Day ({orderNumber})</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels: [
              '6', '7', '8', '9', '10', '11',
              '12', '13', '14', '15', '16', '17', '18'
            ],
            datasets: [
              {
                data: orderData, // Dynamic order data
                color: (opacity = 1) => `rgba(34, 197, 34, ${opacity})`, // Blue color for orders
                strokeWidth: 2,
              },
            ],
            legend: ['Orders'],
          }}
          width={Dimensions.get('screen').width * 0.4} // Adjust width to 90% of the screen
          height={250} // Fixed height for the chart
          yAxisInterval={1} // Set y-axis interval to 1
          chartConfig={{
            backgroundColor: '#000',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#eeeeee',
            decimalPlaces: 0, // No decimal places
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
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
    overflow: 'hidden',
    width: Dimensions.get('screen').width * 0.4,
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
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
