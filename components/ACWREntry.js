import { StyleSheet, TouchableOpacity, Text, View, Image, Modal } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Report from '../screens/Report';

const ACWREntry = ({navigation, route}) => {
  return (
    <>
    <TouchableOpacity style={styles.button}>
      <Image source={require('./assets/icon.png')} style={{width:60, height: 60, borderRadius: 100}}/>
    </TouchableOpacity>
    </>
  )
}

export default ACWREntry

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#000',
        height:60,
        width: 60,
        borderRadius: 100,
        position: 'absolute',
        top: 55,
        right: 10,
    }
})