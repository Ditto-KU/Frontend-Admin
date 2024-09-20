import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NewUser() {
  // State to store the frequency of new users for today
  const [requesterCount, setRequesterCount] = useState(0);
  const [walkerCount, setWalkerCount] = useState(0);

  // Example data for new users (replace this with actual fetched data)
  const newUsersToday = [
    { id: 1, name: 'User A', type: 'requester', time: '10:30 AM' },
    { id: 2, name: 'User B', type: 'walker', time: '11:00 AM' },
    { id: 3, name: 'User C', type: 'requester', time: '1:30 PM' },
    { id: 4, name: 'User D', type: 'walker', time: '2:00 PM' },
  ];

  // Use effect to calculate frequencies for today's date
  useEffect(() => {
    // Filter users by type and count them
    const todayRequesters = newUsersToday.filter(user => user.type === 'requester').length;
    const todayWalkers = newUsersToday.filter(user => user.type === 'walker').length;

    setRequesterCount(todayRequesters);
    setWalkerCount(todayWalkers);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Users Today</Text>

      {/* Display the counts of Requesters and Walkers */}
      <Text style={styles.total}>Requesters: {requesterCount}</Text>
      <Text style={styles.total}>Walkers: {walkerCount}</Text>
    </View>
  );
}

// Styles with the new styles you provided
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
    marginTop: 10,
    marginLeft: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  total: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4caf50', // Green color for positive information
  },
});
