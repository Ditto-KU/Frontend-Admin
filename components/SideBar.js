import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";  // Import Alert
import { useNavigation } from "@react-navigation/native";
import { ComponentStyle } from "../Style/ComponentStyle"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import Login from "./../Pages/Login";


export default function SideBar({ authAdmin }) {
  const navigation = useNavigation();  // Get navigation from context
  const [pressedButton, setPressedButton] = useState(null);

  const handlePressIn = (buttonName) => {
    setPressedButton(buttonName);
  };

  const handlePressOut = () => {
    setPressedButton(null);
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      // Clear the token from AsyncStorage
      await AsyncStorage.removeItem("authAdmin");

      // Show a logout confirmation alert
      Alert.alert("Logged out", "You have successfully logged out.");

      // Replace with the Login screen
      navigation.replace("Login");
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Error", "An error occurred during logout. Please try again.");
    }
  };
  

  return (
    <View style={ComponentStyle.sidebar}>
      <View style={ComponentStyle.sidebarContent}>
        <View>
          <Text style={ComponentStyle.sidebarHeader}>KU-MAN Dashboard</Text>
        </View>
        {/* <TouchableOpacity
          style={[
            ComponentStyle.sidebarButton,
            pressedButton === "Dashboard" &&
              ComponentStyle.sidebarButtonPressed,
          ]}
          onPressIn={() => handlePressIn("Dashboard")}
          onPressOut={handlePressOut}
          onPress={() => navigation.navigate("Main")}
        >
          <View style={ComponentStyle.sidebarIconAndText}>
            <Image
              source={require("../Image/DashboardIcon.png")}
              style={ComponentStyle.sidebarIcon}
              resizeMode="cover"
            />
            <Text style={ComponentStyle.sidebarButtonText}>Dashboard</Text>
          </View>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={[
            ComponentStyle.sidebarButton,
            pressedButton === "ContactSupport" &&
              ComponentStyle.sidebarButtonPressed,
          ]}
          onPressIn={() => handlePressIn("ContactSupport")}
          onPressOut={handlePressOut}
          onPress={() =>
            navigation.navigate("ContactSupport", { authAdmin: authAdmin })
          }
        >
          <View style={ComponentStyle.sidebarIconAndText}>
            <Image
              source={require("../Image/ContactSupportIcon.png")}
              style={ComponentStyle.sidebarIcon}
              resizeMode="cover"
            />
            <Text style={ComponentStyle.sidebarButtonText}>
              Contact Support
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            ComponentStyle.sidebarButton,
            pressedButton === "Report" && ComponentStyle.sidebarButtonPressed,
          ]}
          onPressIn={() => handlePressIn("Report")}
          onPressOut={handlePressOut}
          onPress={() => navigation.navigate("Report")}
        >
          <View style={ComponentStyle.sidebarIconAndText}>
            <Image
              source={require("../Image/ReportIcon.png")}
              style={ComponentStyle.sidebarIcon}
              resizeMode="cover"
            />
            <Text style={ComponentStyle.sidebarButtonText}>Report</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            ComponentStyle.sidebarButton,
            pressedButton === "Order" && ComponentStyle.sidebarButtonPressed,
          ]}
          onPressIn={() => handlePressIn("Order")}
          onPressOut={handlePressOut}
          onPress={() => navigation.navigate("Order")}
        >
          <View style={ComponentStyle.sidebarIconAndText}>
            <Image
              source={require("../Image/OrderIcon.png")}
              style={ComponentStyle.sidebarIcon}
              resizeMode="cover"
            />
            <Text style={ComponentStyle.sidebarButtonText}>Order</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            ComponentStyle.sidebarButton,
            pressedButton === "Cafeteria" &&
              ComponentStyle.sidebarButtonPressed,
          ]}
          onPressIn={() => handlePressIn("Cafeteria")}
          onPressOut={handlePressOut}
          onPress={() => navigation.navigate("Cafeteria")}
        >
          <View style={ComponentStyle.sidebarIconAndText}>
            <Image
              source={require("../Image/CafeteriaIcon.png")}
              style={ComponentStyle.sidebarIcon}
              resizeMode="cover"
            />
            <Text style={ComponentStyle.sidebarButtonText}>Cafeteria</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            ComponentStyle.sidebarButton,
            pressedButton === "Verify" && ComponentStyle.sidebarButtonPressed,
          ]}
          onPressIn={() => handlePressIn("Verify")}
          onPressOut={handlePressOut}
          onPress={() => navigation.navigate("Verify")}
        >
          <View style={ComponentStyle.sidebarIconAndText}>
            <Image
              source={require("../Image/VerifyIcon.png")}
              style={ComponentStyle.sidebarIcon}
              resizeMode="cover"
            />
            <Text style={ComponentStyle.sidebarButtonText}>Verify</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            ComponentStyle.sidebarButton,
            pressedButton === "User" && ComponentStyle.sidebarButtonPressed,
          ]}
          onPressIn={() => handlePressIn("User")}
          onPressOut={handlePressOut}
          onPress={() => navigation.navigate("User")}
        >
          <View style={ComponentStyle.sidebarIconAndText}>
            <Image
              source={require("../Image/UserIcon.png")}
              style={ComponentStyle.sidebarIcon}
              resizeMode="cover"
            />
            <Text style={ComponentStyle.sidebarButtonText}>User</Text>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleLogout}>
        <View style={ComponentStyle.sidebarSignOut}>
          <Text style={{ textDecoration: "underline" }}>Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
