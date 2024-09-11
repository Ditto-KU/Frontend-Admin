import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

export default function OrderDetail() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} horizontal={false}>
      <View style={styles.leftColumn}>
        {/* User Info */}
        <Text style={styles.userTitle}>user: xxxxx (requester)</Text>
        
        {/* Personal Verification */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>หลักฐานการยืนยันตัวตน</Text>
          <Image source={{ uri: 'https://via.placeholder.com/80' }} style={styles.profilePic} />
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ตำแหน่งจัดส่ง</Text>
          <Text>ที่อยู่จัดส่ง</Text>
          <Text>ผู้รับส่ง</Text>
        </View>

        {/* Food Pickup Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>หลักฐานการรับอาหาร</Text>
          <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.foodImage} />
        </View>

        {/* Requester and Walker Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requester</Text>
          <Text>user: xxxxx</Text>
          <TouchableOpacity style={styles.telButton}>
            <Text style={styles.telButtonText}>Tel</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Walker</Text>
          <Text>user: xxxxx</Text>
          <Text>เงินที่ต้องชำระ: xx บาท</Text>
          <TouchableOpacity style={styles.telButton}>
            <Text style={styles.telButtonText}>Tel</Text>
          </TouchableOpacity>
        </View>

        {/* Cancel Button */}
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel Order</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rightColumn}>
        {/* Order Info */}
        <Text style={styles.orderTitle}>Order: #1234</Text>
        
        {/* Ordered Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>รายการที่สั่ง</Text>
          <Text>ร้านค้า1</Text>
          <Text>เมนูที่1 - ราคา</Text>
          <Text>เมนูที่2 - ราคา</Text>
          <Text>ร้านค้า2</Text>
          <Text>ราคาทั้งหมด - xx บาท</Text>
          <Text>ค่าส่ง - xx บาท</Text>
          <Text>ค่าบริการ - xx บาท</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'row', // Ensures content is laid out in a row
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  leftColumn: {
    flex: 1,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  rightColumn: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  userTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  foodImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  telButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#333',
    borderRadius: 5,
  },
  telButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: '#f44336',
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
