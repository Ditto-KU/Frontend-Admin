import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NewUser() {
  const [requesterCount, setRequesterCount] = useState(0);
  const [walkerCount, setWalkerCount] = useState(0);
  const [oldOrders, setOldOrders] = useState([]); // Old orders

  // Fetch old orders data
  const fetchOldOrders = async () => {
    try {
      let headersList = {
        Accept: '*/*',
      };

      let response = await fetch('https://ku-man-api.vimforlanie.com/admin/order', {
        method: 'GET',
        headers: headersList,
      });

      let data = await response.json(); // Parse the response as JSON
      setOldOrders(data); // Set old orders in the state
    } catch (error) {
      console.error('Error fetching old orders:', error);
    }
  };

  // Fetch new orders data and calculate new requesters and walkers
  const fetchNewOrders = async () => {
    try {
      let headersList = {
        Accept: '*/*',
      };

      let response = await fetch('https://ku-man-api.vimforlanie.com/admin/order/today', {
        method: 'GET',
        headers: headersList,
      });

      let newOrdersData = await response.json();

      // Extract requesters and walkers from old orders
      const oldRequesters = oldOrders.map(order => order.requester?.username);
      const oldWalkers = oldOrders.map(order => order.walker?.username);

      // Filter new users (those not in the old orders)
      const newRequesters = newOrdersData
        .filter(order => order.requester && !oldRequesters.includes(order.requester.username))
        .map(order => order.requester.username);

      const newWalkers = newOrdersData
        .filter(order => order.walker && !oldWalkers.includes(order.walker.username))
        .map(order => order.walker.username);

      // Update counts
      setRequesterCount(newRequesters.length);
      setWalkerCount(newWalkers.length);
    } catch (error) {
      console.error('Error fetching new orders:', error);
    }
  };

  // Fetch old and new orders on component mount
  useEffect(() => {
    const fetchData = async () => {
      await fetchOldOrders(); // Fetch old orders
      fetchNewOrders(); // Fetch new orders after old orders are set
    };
    fetchData();
  }, [oldOrders]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Users Today</Text>

      {/* Display the counts of new Requesters and Walkers */}
      <Text style={styles.total}>New Requesters: {requesterCount}</Text>
      <Text style={styles.total}>New Walkers: {walkerCount}</Text>
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
    width: '96%',
    padding: 10,
    height: '32%',
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
