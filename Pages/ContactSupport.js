import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Head from "../components/Header";
import FilterComponent from "../components/FilterComponent";

export default function ContactSupport() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const [requesterData, setRequesterData] = useState([
    {
      id: 1,
      name: "user: xxxxx (requester)",
      time: "9:41",
      description: "รายละเอียด",
    },
    {
      id: 2,
      name: "user: xxxxx (requester)",
      time: "9:41",
      description: "รายละเอียด",
    },
    // Add more requester data here
  ]);

  const [walkerData, setWalkerData] = useState([
    {
      id: 1,
      name: "user: yyyyy (walker)",
      time: "9:41",
      description: "lorem ipsum",
    },
    {
      id: 2,
      name: "user: yyyyy (walker)",
      time: "9:41",
      description: "lorem ipsum",
    },
    // Add more walker data here
  ]);

  // This function will navigate to the ContactSupportDetail page and pass the selected item's details.
  const handleReportPress = (report) => {
    navigation.navigate("ContactSupportDetail", { report });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleReportPress(item)}>
      <View style={styles.CS_listItem}>
        <View style={{ flexDirection: "column" }}>
          <Text>{item.name}</Text>
          <Text>{item.description}</Text>
        </View>
        <Text>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.CS_container}>
      <Head />
      <View style={styles.CS_header}>
        <Text style={styles.CS_title}>Contact Support</Text>
        <View style={styles.CS_searchContainer}>
          <TextInput style={styles.CS_searchInput} placeholder="Search" />
          <TouchableOpacity
            onPress={toggleModal}
            style={styles.CS_filterButton}
          >
            <Image
              source={require("../Image/FilterIcon.png")}
              style={styles.CS_filterIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.CS_content}>
        <View style={styles.CS_column}>
          <Text style={styles.CS_columnTitle}>Requester</Text>
          <FlatList
            data={requesterData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.CS_requesterList}
          />
        </View>
        <View style={styles.CS_column}>
          <Text style={styles.CS_columnTitle}>Walker</Text>
          <FlatList
            data={walkerData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.CS_walkerList}
          />
        </View>
      </View>

      <FilterComponent modalVisible={modalVisible} toggleModal={toggleModal} />
    </View>
  );
}

// Styles for ContactSupport
const styles = StyleSheet.create({
  CS_container: {
    flex: 1,
    padding: 16,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: "#F5F5F5",
  },
  CS_header: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    width: "30%",
    alignSelf: "center",
  },
  CS_title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  CS_searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    paddingHorizontal: 16,
  },
  CS_searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  CS_content: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  CS_column: {
    flex: 1,
    padding: 10,
  },
  CS_columnTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  CS_listItem: {
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
  CS_filterButton: {
    marginLeft: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#EFEFEF",
  },
  CS_filterIcon: {
    width: 30,
    height: 30,
    resizeMode: "cover",
  },
});