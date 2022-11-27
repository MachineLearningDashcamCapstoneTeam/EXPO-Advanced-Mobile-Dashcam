import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import RecordingsScreen from '../screens/RecordingsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';
import MapScreen from '../screens/MapScreen';
import HelpScreen from '../screens/HelpScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AccessTokenContextProvider } from '../context/accessTokenContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function Home() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='Help' component={HelpScreen} />
    </Stack.Navigator>
  );
}

function Recordings() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Recordings' component={RecordingsScreen} />
      <Stack.Screen name="Video Player" component={VideoPlayerScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
    </Stack.Navigator>
  );
}

//* The user stack contains all the screen that users can access
//* An authentication stack can be added if we need to setup a login and sign up system
export default function UserStack() {
  return (
    <AccessTokenContextProvider>
      <NavigationContainer>
        <Tab.Navigator
         
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Main') {
                iconName = focused
                  ? 'ios-home'
                  : 'ios-home-outline';
              } else if (route.name === 'Camera') {
                iconName = focused ? 'ios-camera' : 'ios-camera-outline';
              } else if (route.name === 'Videos') {
                iconName = focused ? 'ios-list' : 'ios-list-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'ios-settings' : 'ios-settings-outline';
              }
              
              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'gray',
            tabBarShowLabel: false 
          })}
        >
          <Tab.Screen name="Main" component={Home} options={{ headerShown: false }} />
          <Tab.Screen name="Camera" component={CameraScreen}  options={{ headerShown: false }}/>
          <Tab.Screen name='Videos' component={Recordings} options={{ headerShown: false }} />
          <Tab.Screen name='Settings' component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </AccessTokenContextProvider>
  );
}