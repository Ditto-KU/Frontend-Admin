import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from '../components/Header'; // Import Header component

export default function UserDetail() {
  const route = useRoute();
  const { user, userType } = route.params; // Extract user data and userType from route params

  return (
    <View style={styles.container}>
      {/* Include Header */}
      <Header />

      {/* User General Information */}
      <View style={styles.userInfoContainer}>
        <Text style={styles.userId}>UserID: {user.id}</Text>
        <Text style={styles.userName}>Name: {user.name}</Text>
        <Text style={styles.userPhone}>Phone: {user.tel || 'N/A'}</Text>
      </View>

      {/* Conditional rendering based on userType */}
      {userType === 'walker' ? (
        <View style={styles.walkerContainer}>
          {/* Display face photo for walkers */}
          <View style={styles.facePhotoContainer}>
            <Text style={styles.sectionTitle}>Face Photo</Text>
            <Image
              source={{ uri: user.facePhoto }} // Assuming user.facePhoto is a valid URL
              style={styles.facePhoto}
            />
          </View>
          
          {/* Display bank account for walkers */}
          <View style={styles.bankInfoContainer}>
            <Text style={styles.userInfo}>Bank Account:</Text>
            <Text style={styles.userInfoValue}>{user.bankAccount || 'Not provided'}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.requesterContainer}>
          {/* Display address for requesters */}
          <Text style={styles.sectionTitle}>Address</Text>
          <Text style={styles.userInfo}>{user.address || 'N/A'}</Text>

          {/* Display frequency of order for requesters */}
          <Text style={styles.sectionTitle}>Order Frequency</Text>
          <Text style={styles.userInfo}>{user.orderFrequency || 0} orders</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '1%',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  userInfoContainer: {
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: 1200,
  },
  userId: {
    fontSize: '1.5vw',
    fontWeight: 'bold',
    color: '#555',
  },
  userName: {
    fontSize: '2vw',
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
  },
  userPhone: {
    fontSize: '1.5vw',
    color: '#666',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: '1.8vw',
    fontWeight: 'bold',
    marginBottom: 10,
    // marginTop: 20,
    color: '#000',
    textAlign: 'center',
  },
  facePhotoContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  facePhoto: {
    width: '15vw',
    height: '15vw',
    borderRadius: '50%',
    borderWidth: 2,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  bankInfoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  userInfo: {
    fontSize: '1.5vw',
    color: '#333',
    textAlign: "center",
    marginBottom: 5,
  },
  userInfoValue: {
    fontSize: '1.5vw',
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  walkerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 1200,
    marginTop: 20,
  },
  requesterContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    maxWidth: 1200,
    marginTop: 30,
  },
});
