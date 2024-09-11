import React, { useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity } from "react-native";
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { PageStyle } from "../Style/PageStyle";
import Head from "../components/Header";

export default function Report() {
  const navigation = useNavigation(); // Get navigation hook

  const [requesterData, setRequesterData] = useState([
    { id: 1, name: "user: xxxxx (requester)", time: "9:41" },
    { id: 2, name: "user: xxxxx (requester)", time: "9:41" },
    // Add more requester data here
  ]);

  const [walkerData, setWalkerData] = useState([
    { id: 1, name: "user: yyyyy (walker)", time: "9:41" },
    { id: 2, name: "user: yyyyy (walker)", time: "9:41" },
    // Add more walker data here
  ]);

  const handleReportPress = (report) => {
    navigation.navigate('ReportDetails', { report }); // Navigate to ReportDetails
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleReportPress(item)}>
        <View style={PageStyle.RP_listItem}>
          <Text>{item.name}</Text>
          <Text>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={PageStyle.RP_container}>
      <Head />
      <View style={PageStyle.RP_header}>
        <Text style={PageStyle.RP_title}>Report</Text>
        <View style={PageStyle.RP_searchContainer}>
          <TextInput style={PageStyle.RP_searchInput} placeholder="Search" />
        </View>
      </View>
      <View style={PageStyle.RP_content}>
        <FlatList
          data={requesterData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={PageStyle.RP_requesterList}
        />
        <FlatList
          data={walkerData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={PageStyle.RP_walkerList}
        />
      </View>
    </View>
  );
}