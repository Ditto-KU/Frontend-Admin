import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import the navigation hook
import Head from "../components/Header";

export default function RestaurantInCafeteria({ route }) {
  const { cafeteriaName } = route.params;
  const navigation = useNavigation(); // Access the navigation object

  // Initialize state to hold restaurant data
  const [restaurantList, setRestaurantList] = useState([]);

  // Sample data for restaurants, with each cafeteria mapped to its list of restaurants
  const restaurantData = {
    "โรงอาหารกลาง1(บาร์ใหม่)": [
      { id: 1, name: "ร้านอาหาร A1" },
      { id: 2, name: "ร้านอาหาร B1" },
      { id: 3, name: "ร้านอาหาร C1" },
    ],
    "โรงอาหารกลาง2(บาร์ใหม่กว่า)": [
      { id: 1, name: "ร้านอาหาร A2" },
      { id: 2, name: "ร้านอาหาร B2" },
      { id: 3, name: "ร้านอาหาร C2" },
    ],
    "โรงอาหารคณะวิศวกรรมศาสตร์(บาร์วิศวะ)": [
      { id: 1, name: "ร้านอาหาร A3" },
      { id: 2, name: "ร้านอาหาร B3" },
      { id: 3, name: "ร้านอาหาร C3" },
    ],
    "โรงอาหารคณะวิทยาศาสตร์(บาร์วิทย์)": [
      { id: 1, name: "ร้านอาหาร A4" },
      { id: 2, name: "ร้านอาหาร B4" },
      { id: 3, name: "ร้านอาหาร C4" },
    ],
  };

  // Set restaurant list based on selected cafeteria
  useEffect(() => {
    const selectedRestaurantList = restaurantData[cafeteriaName] || [];
    setRestaurantList(selectedRestaurantList); // Update state with restaurant data
  }, [cafeteriaName]); // This effect will run whenever the cafeteriaName changes

  // Handle navigation to RestaurantDetails
  const handleRestaurantPress = (restaurantName) => {
    navigation.navigate('RestaurantDetail', { restaurantName });
  };

  const renderRestaurant = ({ item }) => (
    <TouchableOpacity onPress={() => handleRestaurantPress(item.name)}>
      <View style={styles.OR_listItem}>
        <Text style={styles.OR_listText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.OR_container}>
      <Head />
      <View style={styles.OR_header}>
        <Text style={styles.OR_title}>{cafeteriaName}</Text>
      </View>
      <View style={styles.OR_content}>
        <FlatList
          data={restaurantList}
          renderItem={renderRestaurant}
          keyExtractor={(item) => item.id.toString()}
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
  OR_listText: {
    fontSize: 24,
    margin: 10,
  },
});
