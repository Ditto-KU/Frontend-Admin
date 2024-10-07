import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import the navigation hook
import Head from "../components/Header";
import { useRoute } from "@react-navigation/native";

export default function RestaurantInCafeteria() {
  const route = useRoute(); // Get the route hook
  const { canteenId, cafeteriaName } = route.params; // Retrieve canteenId and name from params
  const navigation = useNavigation(); // Access the navigation object
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiJhZG1pbjIiLCJpYXQiOjE3MjgxMjg1MDIsImV4cCI6MTczNjc2ODUwMn0.gqSAFiuUiAAnZHupDmJdlOqlKz2rqPxAbPVffcKt1Is";

  // Initialize state to hold restaurant data
  const [restaurantList, setRestaurantList] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  
  // Handle navigation to RestaurantDetails
  const handleRestaurantPress = (shopId) => {
    navigation.navigate('RestaurantDetail', { shopId });
  };
  // Fetch restaurant data based on canteenId
  useEffect(() => {
    const fetchRestaurants = async () => {
      console.log(`Fetching restaurants for canteenId: ${canteenId}`); // Debugging log

      try {
        let headersList = {
          Accept: "*/*",
          Authorization: `Bearer ${authToken}`,
        };
        let response = await fetch(`https://ku-man-api.vimforlanie.com/admin/canteen/shop?canteenId=${canteenId}`, { 
          method: "GET",
          headers: headersList,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse the response to JSON
        console.log('Fetched restaurant data:', data); // Debugging log
        setRestaurantList(data); // Update state with restaurant data
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message); // Handle error
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false); // Stop loading after fetching the data
      }
    };
    // Set an interval to fetch data every second
    const intervalId = setInterval(fetchRestaurants, 1000); // Fetch every 1000 ms (1 second)

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [canteenId]); // Fetch data when the canteenId changes


  const renderRestaurant = ({ item }) => (
    <TouchableOpacity onPress={() => handleRestaurantPress(item.shopId)}>
      <View style={styles.OR_listItem}>
        <Text style={styles.OR_listText}>{item.shopName}</Text>
        <Text style={styles.OR_listSubText}>Tel: {item.tel}</Text>
        <Text style={styles.OR_listSubText}>Shop Number: {item.shopNumber}</Text>
      </View>
    </TouchableOpacity>
  );

  // Render loading or error state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Restaurants...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  // If restaurantList is empty, display a message
  if (restaurantList.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No restaurants available for {cafeteriaName}.</Text>
      </View>
    );
  }

  return (
    <View style={styles.OR_container}>
      <Head />
      <View style={styles.OR_header}>
        <Text style={styles.OR_title}>{cafeteriaName}</Text> {/* Display canteen name */}
      </View>
      <View style={styles.OR_content}>
        <FlatList
          data={restaurantList}
          renderItem={renderRestaurant}
          keyExtractor={(item) => item.shopId.toString()}
        />
      </View>
    </View>
  );
}

// Styles for the RestaurantInCafeteria screen
const styles = StyleSheet.create({
  OR_container: {
    flex: 1,
    padding: 16,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: "#F5F5F5",
  },
  OR_header: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    width: "100%", // Make sure it stretches across the entire screen width
    alignSelf: "center",
  },
  OR_title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  OR_content: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  OR_listItem: {
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  OR_listText: {
    fontSize: 24,
    margin: 10,
  },
  OR_listSubText: {
    fontSize: 16,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
