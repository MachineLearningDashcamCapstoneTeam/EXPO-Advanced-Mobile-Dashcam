import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import VideoPickerScreen from '../screens/VideoPickerScreen';
import SettingsScreen from '../screens/SettingsScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';
import MapScreen from '../screens/MapScreen';
import HelpScreen from '../screens/HelpScreen';
const Stack = createNativeStackNavigator();

export default function UserStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name='VideoPicker' component={VideoPickerScreen} />
        <Stack.Screen name='Settings' component={SettingsScreen}/>
        <Stack.Screen name='VideoPlayer' component={VideoPlayerScreen}/>
        <Stack.Screen name='Map' component={MapScreen}/>
        <Stack.Screen name='Help' component={HelpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}