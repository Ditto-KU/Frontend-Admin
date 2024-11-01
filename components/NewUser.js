import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function NewUser() {
  const [walkers, setWalkers] = useState([]);
  const [requesters, setRequesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiJhZG1pbjIiLCJpYXQiOjE3MjgxMjg1MDIsImV4cCI6MTczNjc2ODUwMn0.gqSAFiuUiAAnZHupDmJdlOqlKz2rqPxAbPVffcKt1Is";

  // Fetch data for walkers and requesters
  useEffect(() => {
    const fetchWalkersAndRequesters = async () => {
      try {
        let headersList = {
          Accept: "*/*",
          Authorization: `Bearer ${authToken}`,
        };

        // Fetch walkers
        let walkerResponse = await fetch("https://ku-man-api.vimforlanie.com/admin/walkerALL", {
          method: "GET",
          headers: headersList,
        });
        if (!walkerResponse.ok) {
          throw new Error(`Error fetching walkers: ${walkerResponse.status}`);
        }
        let walkersData = await walkerResponse.json();
        setWalkers(walkersData);

        // Fetch requesters
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

    fetchWalkersAndRequesters();
  }, []);

    // Loading state
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading NewUser...</Text>
        </View>
      );
    }

  // Function to check if the date matches today's date
  const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Filter the walkers and requesters verified today
  const newWalkersToday = walkers.filter((walker) => walker.registerAt && isToday(walker.registerAt));
  const newRequestersToday = requesters.filter((requester) => requester.createAt && isToday(requester.createAt));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Users Today</Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <Text style={styles.total}>New Requesters: {newRequestersToday.length}</Text>
          <Text style={styles.total}>New Walkers: {newWalkersToday.length}</Text>
        </>
      )}
    </View>
  );
}

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
    height: '32%',
    marginTop: 10,
    marginLeft: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  total: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
