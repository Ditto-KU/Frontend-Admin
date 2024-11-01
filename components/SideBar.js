import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ComponentStyle } from "../Style/ComponentStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SideBar({ setAuthAdmin }) {
  const navigation = useNavigation(); // Access the navigation object
  const [pressedButton, setPressedButton] = useState(null);

  const handlePressIn = (buttonName) => setPressedButton(buttonName);
  const handlePressOut = () => setPressedButton(null);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authAdmin");
  
      console.log("กำลังรีเซ็ตไปที่หน้า Login...");
  
      // ตรวจสอบว่ามีคอนเท็กซ์การนำทางที่ถูกต้อง และ reset การนำทาง
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }], // ชื่อ 'Login' ต้องตรงกับใน Stack.Navigator
      });
      setAuthAdmin(null);
  
      console.log("รีเซ็ตสำเร็จ ไปยังหน้า Login");
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Error", "เกิดข้อผิดพลาดระหว่างออกจากระบบ กรุณาลองใหม่อีกครั้ง.");
    }
  };
  
  
  
  

  return (
    <View style={ComponentStyle.sidebar}>
      <View style={ComponentStyle.sidebarContent}>
        <View>
          <Text style={ComponentStyle.sidebarHeader}>KU-MAN Dashboard</Text>
        </View>

        <TouchableOpacity
          style={[
            ComponentStyle.sidebarButton,
            pressedButton === "ContactSupport" &&
              ComponentStyle.sidebarButtonPressed,
          ]}
          onPressIn={() => handlePressIn("ContactSupport")}
          onPressOut={handlePressOut}
          onPress={() =>
            navigation.navigate("ContactSupport")
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
            <Text style={{ textDecorationLine: "underline" }}>Logout</Text>
          </View>
      </TouchableOpacity>
    </View>
  );
}
