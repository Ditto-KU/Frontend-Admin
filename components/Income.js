import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Income() {
  // State to store the total income
  const [totalIncome, setTotalIncome] = useState(0);

  // Example income data; this can be fetched from an API or calculated dynamically.
  const incomeData = [
    { id: 1, source: "Order #001", amount: 50 },
    { id: 2, source: "Order #002", amount: 75 },
    { id: 3, source: "Service #003", amount: 120 },
  ];

  // Calculate total income from incomeData
  useEffect(() => {
    const income = incomeData.reduce((acc, curr) => acc + curr.amount, 0);
    setTotalIncome(income);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Income</Text>
      <Text style={styles.total}>${totalIncome.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafbfc',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    justifyContent: 'center',
    width: '99%', // Adjust width to fit the container
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  total: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#4caf50', // Green color for positive income
  },
});
