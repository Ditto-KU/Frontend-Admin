import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Header from "../components/Header"; // Assuming you have a Header component

export default function RestaurantDetail() {
  // States for toggling restaurant and menu items
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);
  const [menuItems, setMenuItems] = useState([
    {
      name: "มัสมั่นแกงแก้วตา",
      isAvailable: true,
      price: "100 THB",
      image: "image-url-here",
    },
    {
      name: "ยำใหญ่ใส่สารพัด",
      isAvailable: true,
      price: "120 THB",
      image: "image-url-here",
    },
    {
      name: "ต้มหมก",
      isAvailable: true,
      price: "90 THB",
      image: "image-url-here",
    },
    {
      name: "ไส้หมู",
      isAvailable: false,
      price: "80 THB",
      image: "image-url-here",
    },
    {
      name: "กากหมู",
      isAvailable: false,
      price: "70 THB",
      image: "image-url-here",
    },
    {
      name: "ข้าวมันไก่",
      isAvailable: true,
      price: "50 THB",
      image: "image-url-here",
    },
    {
      name: "ข้าวผัด",
      isAvailable: true,
      price: "60 THB",
      image: "image-url-here",
    },
    {
      name: "ผัดไทย",
      isAvailable: true,
      price: "70 THB",
      image: "image-url-here",
    },
    {
      name: "ส้มตำ",
      isAvailable: true,
      price: "40 THB",
      image: "image-url-here",
    },
    {
      name: "ก๋วยเตี๋ยวเรือ",
      isAvailable: true,
      price: "55 THB",
      image: "image-url-here",
    },
  ]);

  // Function to toggle restaurant open/close
  const toggleRestaurantStatus = () => {
    setIsRestaurantOpen(!isRestaurantOpen);
  };

  // Function to toggle menu item availability
  const toggleMenuItem = (index) => {
    const newMenuItems = [...menuItems];
    newMenuItems[index].isAvailable = !newMenuItems[index].isAvailable;
    setMenuItems(newMenuItems);
  };

  return (
    <View style={styles.container}>
      {/* Including the custom Header component */}
      <Header />

      {/* Restaurant Name */}
      <Text style={styles.restaurantName}>ร้านที่ 1</Text>

      <View style={styles.mainContainer}>
        {/* Left Section: Restaurant Status */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>สถานะร้าน</Text>
          <View style={styles.statusToggleContainer}>
            <Text style={styles.statusLabel}>
              {isRestaurantOpen ? "ร้านเปิด" : "ร้านปิด"}
            </Text>
            <View style={styles.switchContainer}>
              <Switch
                value={isRestaurantOpen}
                onValueChange={toggleRestaurantStatus}
                thumbColor={isRestaurantOpen ? "#34C759" : "#f4f3f4"}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
              />
            </View>
          </View>
        </View>

        {/* Center Section: Menu List */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>เมนู</Text>
          <ScrollView style={{ flexGrow: 1 }}>
            {menuItems.map((item, index) => (
              <View key={index} style={styles.menuItem}>
                <Image source={{ uri: item.image }} style={styles.menuImage} />
                <View style={styles.menuDetails}>
                  <Text style={styles.menuName}>{item.name}</Text>
                  <Text style={styles.menuPrice}>{item.price}</Text>
                </View>
                <View style={styles.switchContainer}>
                  <Switch
                    value={item.isAvailable}
                    onValueChange={() => toggleMenuItem(index)}
                    thumbColor={item.isAvailable ? "#34C759" : "#f4f3f4"}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Right Section: Restaurant Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>รายละเอียด</Text>
          <View style={styles.detailsTextContainer}>
            <Text style={styles.detailsText}>Username: ร้านชื่อดัง</Text>
            <Text style={styles.detailsText}>ชื่อร้าน: ร้านอร่อยเด็ด</Text>
            <Text style={styles.detailsText}>เบอร์โทรศัพท์: 123456789</Text>
            <Text style={styles.detailsText}>โรงอาหาร: โรงอาหารกลาง</Text>
            <Text style={styles.detailsText}>หมายเลขร้าน: 10</Text>
          </View>
        </View>
      </View>

      {/* Button for history */}
      <TouchableOpacity style={styles.historyButton}>
        <Text style={styles.historyButtonText}>ประวัติการทำอาหาร</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 10,
    height: "100%",
  },
  restaurantName: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    marginBottom: 20,
  },
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: "65%",
  },
  statusContainer: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
    paddingRight: 16,
  },
  statusText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  statusToggleContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 24,
    marginBottom: 10,
    color: "#34C759",
  },
  switchContainer: {
    transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }], // Increase size of the Switch
  },
  menuContainer: {
    width: "50%",
    paddingHorizontal: 16,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
    paddingRight: 20,
  },
  menuImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  menuDetails: {
    flex: 1,
    marginLeft: 10,
  },
  menuName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  menuPrice: {
    fontSize: 16,
    color: "#777",
  },
  detailsContainer: {
    width: "30%",
    paddingLeft: 16,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailsTextContainer: {
    flexDirection: "column",
    marginLeft: 30,
  },
  detailsText: {
    fontSize: 20,
    marginBottom: 10,
  },
  historyButton: {
    backgroundColor: "#000000",
    padding: 15,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 40,
    marginHorizontal: 16,
  },
  historyButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
});
