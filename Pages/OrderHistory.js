import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header'; // Assuming you have a Header component

export default function OrderHistory() {
  const navigation = useNavigation();
  const route = useRoute();
  const { orders } = route.params; // Assume orders data is passed via route.params

  // Handle navigation to OrderHistoryDetail page
  const handleOrderPress = (orderItemId) => {
    navigation.navigate("OrderHistoryDetail", { orderItemId });
  };

  // Render each order in the list
  const renderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderText}>Order ID: {item.orderItemId}</Text>
      <Text style={styles.orderText}>Quantity: {item.quantity}</Text>
      <Text style={styles.orderText}>Total Price: ${item.totalPrice}</Text>
      <Text style={styles.orderText}>Status: {item.orderItemStatus}</Text>
      <Text style={styles.orderText}>Order Date: {new Date(item.orderItemDate).toLocaleDateString()}</Text>

      {/* Button to navigate to order history detail */}
      <TouchableOpacity
        style={styles.detailButton}
        onPress={() => handleOrderPress(item.orderItemId)}
      >
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Add custom header */}
      <Header />

      <Text style={styles.header}>Order History</Text>
      <FlatList
        data={orders} // Orders passed from previous screen
        renderItem={renderItem}
        keyExtractor={(item) => item.orderItemId.toString()}
        contentContainerStyle={styles.orderList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  orderList: {
    paddingVertical: 10,
  },
  orderItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#FFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  orderText: {
    fontSize: 16,
    color: "#333",
  },
  detailButton: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: "#2196F3",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
