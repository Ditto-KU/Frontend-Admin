import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function OpenRestaurant() {
  const [restaurants, setRestaurants] = useState([
    {
      id: 1,
      isOpen: true,
    },
    {
      id: 2,
      isOpen: false,
    },
    {
      id: 3,
      isOpen: true,
    },
    {
      id: 4,
      isOpen: true,
    },
    {
      id: 5,
      isOpen: true,
    }
    // Add more restaurants here
  ]);

  // Calculate the percentage of open restaurants
  const totalRestaurants = restaurants.length;
  const openRestaurants = restaurants.filter(restaurant => restaurant.isOpen).length;
  const openPercentage = ((openRestaurants / totalRestaurants) * 100).toFixed(2); // Calculate and fix to 2 decimal places

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Open Restaurants</Text>
      <Text style={styles.percentage}>{openPercentage}%</Text>
      <Text style={styles.subtext}>of all restaurants are open</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafbfc',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    justifyContent: 'center',
    width: '96%', // Adjust width to fit the container
    padding: 10,
    height: "30%",
    marginLeft: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  percentage: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#4caf50', // Green color for the percentage
  },
  subtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
});
