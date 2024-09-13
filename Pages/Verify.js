import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Header from "../components/Header";

export default function Verify() {
  const navigation = useNavigation();

  // Sample user data
  const [userData] = useState([
    { id: 1, name: "Walker User 1", time: "11:00 AM"},
    { id: 2, name: "Walker User 2", time: "10:00 AM" },
  ]);

  const handleUserPress = (user) => {
    navigation.navigate('VerifyDetail', { user });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleUserPress(item)}>
      <View style={styles.VE_listItem}>
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.VE_textName}>{item.name}</Text>
        </View>
        <Text style={styles.VE_textTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.VE_container}>
      <Header />
      <View style={styles.VE_header}>
        <Text style={styles.VE_title}>User Verification</Text>
      </View>
      <FlatList
        data={userData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.VE_userList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  VE_container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  VE_header: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    width: "100%",
  },
  VE_title: {
    fontSize: 36,
    fontWeight: "bold",
    marginVertical: 15,
    textAlign: "center",
  },
  VE_listItem: {
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
  VE_textName: {
    fontSize: 24,
    fontWeight: "600",
    margin: 10,
  },
  VE_textTime: {
    fontSize: 16,
    color: "#555",
    marginTop: 10,
  },
});
