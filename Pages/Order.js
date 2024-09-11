import React, { useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { PageStyle } from "../Style/PageStyle";
import Head from "../components/Header";

export default function Order() { 
  const navigation = useNavigation(); // Get navigation hook

  const [orderData, setOrderData] = useState([
    { id: 1, name: "Order #12345", time: "10:00 AM" },
    { id: 2, name: "Order #67890", time: "10:30 AM" },
    // Add more order data here
  ]);

  const handleOrderPress = (order) => {
    navigation.navigate('OrderDetails', { order }); // Navigate to OrderDetails
  };

  const renderItem = ({ item }) => {
    return (
        <View>
            <TouchableOpacity onPress={() => handleOrderPress(item)}>
                <View style={PageStyle.OR_listItem}>
                <Text>{item.name}</Text>
                <Text>{item.time}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
  };

  return (
    <View style={PageStyle.OR_container}>
      <Head />
      <View style={PageStyle.OR_header}>
        <Text style={PageStyle.OR_title}>Order List</Text>
        <View style={PageStyle.OR_searchContainer}>
          <TextInput style={PageStyle.OR_searchInput} placeholder="Search Orders" />
        </View>
      </View>
      <View style={PageStyle.OR_content}>
        <FlatList
          data={orderData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={PageStyle.OR_orderList}
        />
      </View>
    </View>
  );
}
