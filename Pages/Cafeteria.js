import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PageStyle } from "../Style/PageStyle";
import Head from "../components/Header";

export default function Cafeteria() {
  return (
    <View style={PageStyle.CA_container}>
      <Head />
      {/* Buttons Grid */}
      <View style={PageStyle.CA_grid}>
        <TouchableOpacity style={PageStyle.CA_button}>
          <Text style={PageStyle.CA_buttonText}>โรงอาหารกลาง1(บาร์ใหม่)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={PageStyle.CA_button}>
          <Text style={PageStyle.CA_buttonText}>โรงอาหารกลาง2(บาร์ใหม่กว่า)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={PageStyle.CA_button}>
          <Text style={PageStyle.CA_buttonText}>โรงอาหารคณะวิศวกรรมศาสตร์(บาร์วิศวะ)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={PageStyle.CA_button}>
          <Text style={PageStyle.CA_buttonText}>โรงอาหารคณะวิทยาศาสตร์(บาร์วิทย์)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
