import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/private/HomeScreen';
import CameraScreen from '../screens/private/CameraScreen';
import VideoPickerScreen from '../screens/private/VideoPickerScreen';

const Stack = createNativeStackNavigator();

export default function UserStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name='VideoPicker' component={VideoPickerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}