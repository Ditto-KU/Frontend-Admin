import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import Head from "../components/Header";

export default function Cafeteria() {
  const navigation = useNavigation(); // Hook to access navigation
  const [canteens, setCanteens] = useState([]); // State to hold fetched canteen data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  // Function to handle button press and navigate to RestaurantInCafeteria screen
  const handleCafeteriaPress = (canteenId, cafeteriaName) => {
    navigation.navigate("RestaurantInCafeteria", { canteenId, cafeteriaName }); // Navigate and pass canteenId and name
  };

  // Fetch canteen data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        let headersList = {
          "Accept": "*/*"
        };

        let response = await fetch(`https://ku-man-api.vimforlanie.com/admin/canteen`, { 
          method: "GET",
          headers: headersList
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse the response to JSON
        setCanteens(data); // Set the canteen data to the state
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false); // Stop loading after fetching the data
      }
    };

    // Set an interval to fetch data every second
    const intervalId = setInterval(fetchData, 1000); // Fetch every 1000 ms (1 second)

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run the effect only once on component mount

  // Render loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Cafeterias...</Text>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.CA_container}>
      <Head />
      <View style={styles.CA_header}>
        <Text style={styles.CA_title}>Cafeteria List</Text>
      </View>
      {/* Cafeteria Buttons in Column, dynamically rendered from fetched data */}
      <View style={styles.CA_column}>
        {canteens.map((canteen) => (
          <TouchableOpacity
            key={canteen.canteenId} // Unique key for each button
            style={styles.CA_button}
            onPress={() => handleCafeteriaPress(canteen.canteenId, canteen.name)} // Pass canteenId and name
          >
            <Text style={styles.CA_buttonText}>{canteen.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// Styles for Cafeteria with column layout (no grid)
const styles = StyleSheet.create({
  CA_container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F0F0F0", // Softer background for better contrast
  },
  CA_header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    width: "100%", // Full width for balance
  },
  CA_title: {
    fontSize: 36,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  CA_column: {
    flex: 1,
    justifyContent: "flex-start", // Align buttons to the top
    alignItems: "center", // Center buttons horizontally
    paddingVertical: 10,
  },
  CA_button: {
    width: "70%", // Occupies most of the width of the screen
    paddingVertical: 36, // Increase padding for better touchable area
    marginVertical: 16,
    backgroundColor: "#FFF",
    borderRadius: 12, // Keep slightly rounded corners
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4, // Light elevation for depth
  },
  CA_buttonText: {
    fontSize: 24, // Increased font size for better readability
    color: "#444", // Soft color for the text
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
