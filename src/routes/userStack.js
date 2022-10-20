import React, { createContext, useState, useContext, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import RecordingsScreen from '../screens/RecordingsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';
import MapScreen from '../screens/MapScreen';
import HelpScreen from '../screens/HelpScreen';

import { AccessContext, AccessTokenContextProvider  } from '../context/accessTokenContext';

const Stack = createNativeStackNavigator();


//* The user stack contains all the screen that users can access
//* An authentication stack can be added if we need to setup a login and sign up system
export default function UserStack() {

  return (
    <AccessTokenContextProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Camera" component={CameraScreen} />
          <Stack.Screen name='Recordings' component={RecordingsScreen} />
          <Stack.Screen name='Settings' component={SettingsScreen} />
          <Stack.Screen name='Video Player' component={VideoPlayerScreen} />
          <Stack.Screen name='Map' component={MapScreen} />
          <Stack.Screen name='Help' component={HelpScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AccessTokenContextProvider>
  );
}