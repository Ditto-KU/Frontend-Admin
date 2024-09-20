import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import Head from "../components/Header";
import { PageStyle } from "../Style/PageStyle";

export default function User() {
  const navigation = useNavigation(); // Initialize navigation

  // State for walkers and requesters data, loading state, and error handling
  const [walkers, setWalkers] = useState([]);
  const [requesters, setRequesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data for walkers and requesters
  useEffect(() => {
    const fetchWalkersAndRequesters = async () => {
      try {
        let headersList = {
          Accept: "*/*",
        };

        // Walker API request
        let walkerResponse = await fetch("https://ku-man-api.vimforlanie.com/admin/walker", {
          method: "GET",
          headers: headersList,
        });
        if (!walkerResponse.ok) {
          throw new Error(`Error fetching walkers: ${walkerResponse.status}`);
        }
        let walkersData = await walkerResponse.json();
        setWalkers(walkersData);

        // Requester API request
        let requesterResponse = await fetch("https://ku-man-api.vimforlanie.com/admin/requester", {
          method: "GET",
          headers: headersList,
        });
        if (!requesterResponse.ok) {
          throw new Error(`Error fetching requesters: ${requesterResponse.status}`);
        }
        let requestersData = await requesterResponse.json();
        setRequesters(requestersData);

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Set an interval to fetch data every second
    const intervalId = setInterval(fetchWalkersAndRequesters, 1000); // Fetch every 1000 ms (1 second)

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <View style={PageStyle.US_loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={PageStyle.US_loadingContainer}>
        <Text style={PageStyle.errorText}>Error: {error}</Text>
      </View>
    );
  }

  // Navigate to UserList page with walker data
  const handleWalkerPress = () => {
    navigation.navigate("UserList", {
      users: walkers.map((walker) => ({
        id: walker.walkerId,
        username: walker.username,
        email: walker.email,
        phoneNumber: walker.phoneNumber,
        profilePicture: walker.profilePicture,
        bankAccountName: walker.bankAccountName,
        bankAccountNo: walker.bankAccountNo,
        status: walker.status,
        registerAt: walker.registerAt,
        verifyAt: walker.verifyAt,
      })), // Passing walker data in the format expected by UserList
      userType: "walker", // Pass user type as 'Walker'
    });
  };

  // Navigate to UserList page with requester data
  const handleRequesterPress = () => {
    navigation.navigate("UserList", {
      users: requesters.map((requester) => ({
        id: requester.requesterId,
        username: requester.username,
        email: requester.email,
        phoneNumber: requester.phoneNumber,
        profilePicture: requester.profilePicture,
        firstName: requester.firstName,
        lastName: requester.lastName,
        address: requester.address,
      })), // Passing requester data in the format expected by UserList
      userType: "requester", // Pass user type as 'Requester'
    });
  };

  return (
    <View style={PageStyle.US_container}>
      <Head />
      {/* Buttons */}
      <View style={PageStyle.US_innerContainer}>
        <Text style={PageStyle.US_title}>KU-MAN User</Text>
        <View style={PageStyle.US_buttonContainer}>
          <TouchableOpacity style={PageStyle.US_button} onPress={handleWalkerPress}>
            <Text style={PageStyle.US_buttonText}>Walker</Text>
          </TouchableOpacity>
          <TouchableOpacity style={PageStyle.US_button} onPress={handleRequesterPress}>
            <Text style={PageStyle.US_buttonText}>Requester</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
