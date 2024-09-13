import React, { useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Head from "../components/Header";
import FilterComponent from "../components/FilterComponent";  // Import the FilterComponent

export default function Report() {
  const navigation = useNavigation(); // Get navigation hook
  const [modalVisible, setModalVisible] = useState(false); // State for controlling filter modal visibility

  const [requesterData, setRequesterData] = useState([
    { id: 1, name: "user: xxxxx", time: "9:41" },
    { id: 2, name: "user: xxxxx", time: "9:41" },
    // Add more requester data here
  ]);

  const [walkerData, setWalkerData] = useState([
    { id: 1, name: "user: yyyyy", time: "9:41" },
    { id: 2, name: "user: yyyyy", time: "9:41" },
    // Add more walker data here
  ]);

  // Function to navigate to report details
  const handleReportPress = (report) => {
    navigation.navigate("ReportDetails", { report });
  };

  // Function to toggle modal visibility
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleReportPress(item)}>
      <View style={styles.RP_listItem}>
        <View style={{ flexDirection: "column" }}>
          <Text style={[styles.RP_listText,{fontWeight: "600"}]}>{item.name}</Text>
        </View>
        <Text style={styles.RP_listTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.RP_container}>
      <Head />
      <View style={styles.RP_header}>
        <Text style={styles.RP_title}>Report</Text>
        <View style={styles.RP_searchContainer}>
          <TextInput style={styles.RP_searchInput} placeholder="Search" />
          <TouchableOpacity
            onPress={toggleModal}
            style={styles.RP_filterButton}
          >
            <Image
              source={require("../Image/FilterIcon.png")} // Adjust the path as necessary
              style={styles.RP_filterIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.RP_content}>
        <View style={styles.RP_column}>
          <Text style={styles.RP_columnTitle}>Requester</Text>
          <FlatList
            data={requesterData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.RP_requesterList}
          />
        </View>
        <View style={styles.RP_column}>
          <Text style={styles.RP_columnTitle}>Walker</Text>
          <FlatList
            data={walkerData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.RP_walkerList}
          />
        </View>
      </View>

      {/* Include the FilterComponent and pass props */}
      <FilterComponent modalVisible={modalVisible} toggleModal={toggleModal} />
    </View>
  );
}

// Updated styles with RP_ prefix

const styles = StyleSheet.create({
  RP_container: {
    flex: 1,
    padding: 16,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: "#F5F5F5",
  },
  RP_header: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    width: "30%",
    alignSelf: "center",
  },
  RP_title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  RP_searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    paddingHorizontal: 16,
  },
  RP_searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  RP_filterButton: {
    marginLeft: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#EFEFEF",
  },
  RP_filterIcon: {
    width: 30,
    height: 30,
    resizeMode: "cover",
  },
  RP_content: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  RP_column: {
    flex: 1,
    padding: 10,
  },
  RP_columnTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  RP_listItem: {
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
  RP_listText: {
    fontSize: 22,
    marginVertical: 10,
  },
  RP_listTime: {
    fontSize: 16,
    color: "#777",
    alignSelf: "center",
  },
});
