// app/components/HeaderHome.js
// Button for navigating back to home from header

import React, { Component } from 'react';
import { Text, TouchableHighlight, View, StyleSheet } from 'react-native';
import { Icon, Button } from 'react-native-elements';

export default HeaderHome = ({ navigation }) => (
  <Icon name='home' size={30} onPress={() => navigation.navigate('UserHome')} />
);

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#d14f4f'
  },
  headerContainer: {
    backgroundColor: '#d14f4f',
    padding: 20
  }
});