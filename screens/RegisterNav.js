import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import RegisterScreen from './RegisterScreen';
import RegisterScreenCoach from './CoachScreens/RegisterCoach';

const Tab = createMaterialTopTabNavigator();

function RegisterNav() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Athlete" component={RegisterScreen} />
      <Tab.Screen name="Coach" component={RegisterScreenCoach} />
    </Tab.Navigator>
  );
}

export default RegisterNav