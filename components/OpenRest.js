import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";

export default function CanteenAndShops() {
  const [canteens, setCanteens] = useState([]);
  const [totalShops, setTotalShops] = useState(0);
  const [openShops, setOpenShops] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiJhZG1pbjIiLCJpYXQiOjE3MjgxMjg1MDIsImV4cCI6MTczNjc2ODUwMn0.gqSAFiuUiAAnZHupDmJdlOqlKz2rqPxAbPVffcKt1Is";

  // Fetch all canteens from the API once on component mount
  useEffect(() => {
    const fetchCanteens = async () => {
      setLoading(true);
      setError(null);

      try {
        const headers = {
          Accept: "*/*",
          Authorization: `Bearer ${authToken}`,
        };
        const response = await fetch("https://ku-man-api.vimforlanie.com/admin/canteen", {
          method: "GET",
          headers,
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        setCanteens(data); // Store canteen data
      } catch (err) {
        setError("Failed to fetch canteens.");
        console.error("Error fetching canteens:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCanteens();
  }, []);

  // Fetch shops for all canteens whenever canteens are updated
  useEffect(() => {
    const fetchShopsForCanteens = async () => {
      if (canteens.length === 0) return;

      setLoading(true);
      setError(null);
      let totalShopCount = 0;
      let openShopCount = 0;

      try {
        const shopsDataPromises = canteens.map(async (canteen) => {
          const headers = {
            Accept: "*/*",
            Authorization: `Bearer ${authToken}`,
          };

          const response = await fetch(
            `https://ku-man-api.vimforlanie.com/admin/canteen/shop?canteenId=${canteen.canteenId}`,
            { method: "GET", headers }
          );

          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

          const shops = await response.json();
          totalShopCount += shops.length;
          openShopCount += shops.filter((shop) => shop.status === true).length;
        });

        await Promise.all(shopsDataPromises);

        setTotalShops(totalShopCount);
        setOpenShops(openShopCount);
      } catch (err) {
        setError("Failed to fetch shops data.");
        console.error("Error fetching shops:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShopsForCanteens();
  }, [canteens]);

  const openPercentage = totalShops > 0 ? ((openShops / totalShops) * 100).toFixed(2) : 0;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Canteens and Shops...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Open Shops</Text>
      <Text style={styles.percentage}>{openPercentage}%</Text>
      <Text style={styles.subtext}>of all shops are open</Text>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafbfc',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    justifyContent: 'center',
    width: '96%',
    padding: 10,
    height: "32%",
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  percentage: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#4caf50",
  },
  subtext: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
});
