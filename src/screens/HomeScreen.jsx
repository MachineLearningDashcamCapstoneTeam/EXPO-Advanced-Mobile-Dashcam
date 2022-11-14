import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { View, Image } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { DEFAULT_CAMERA_SETTINGS, GOOGLE_CONFIG } from '../constants';
import { getGoogleUserInfo } from '../services/googleService';

import { AccessContext } from '../context/accessTokenContext';
import { HEADER_IMG } from '../constants/index';
import GlobalStyles from '../styles/global-styles';
import UserCard from '../widget/userCard';
import CloudCard from '../widget/cloudCard';
import { Alert } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

function HomeScreen({ navigation }) {
  const { accessTokenContextValue, setAccessTokenContextValue } = useContext(AccessContext);
  const [user, setUser] = useState();
  const [accessToken, setAccessToken] = useState();
  const [request, response, promptAsync] = Google.useAuthRequest(GOOGLE_CONFIG);
  const [settings, setSettings] = useState(DEFAULT_CAMERA_SETTINGS)


  useEffect(() => {
    checkIfUserLoggedIn();
    setInitialValues();
  }, [response]);

  const setInitialValues = async () => {

    try {
      let tempSettings = await AsyncStorage.getItem('AMD_Settings')
      tempSettings = JSON.parse(tempSettings)
      if (tempSettings && Object.keys(tempSettings).length >= 1 && Object.getPrototypeOf(tempSettings) === Object.prototype) {
        if(tempSettings.loadCameraWhenApplicationStarts){
          navigation.navigate('Camera')
        }
      }
      else {
        setSettings(DEFAULT_CAMERA_SETTINGS);
      }
    } catch (err) {
      Alert.alert('Unable to load Settings')
    }
  };

  //* Check if the user already logged in with google
  const checkIfUserLoggedIn = () => {
    if (response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
      setAccessTokenContextValue(response.authentication.accessToken);
      if (user === undefined) {
        getUserData(response.authentication.accessToken);
      }
    }
  }
  //* Start google Sign In and then get the user data
  const fetchGoogle = async () => {
    await promptAsync({ useProxy: true, showInRecents: true })
  }
  //* Fetch the user data from googles APIs and set the data
  const getUserData = async (accessTokenValue) => {
    const data = await getGoogleUserInfo(accessTokenValue);
    setUser(data)
  };

  //* Show the user details only if the user exists. If not, show the default menu
  const showUserInfo = () => {
    if (user) {
      return <UserCard user={user} />
    }
    else {
      return <CloudCard fetchGoogle={fetchGoogle} /> 
    }
  }

  return (
    <View style={GlobalStyles.container}>

      <Image blurRadius={1} source={{ uri: HEADER_IMG }} style={[GlobalStyles.header, GlobalStyles.flex2]} />

      <View style={[GlobalStyles.divWhite, GlobalStyles.marginYsm, GlobalStyles.divSpaceBetween, GlobalStyles.flex3]}>

        <Button style={GlobalStyles.buttonLg} icon="camera" mode="contained" onPress={() => navigation.navigate('Camera')}>
          Camera
        </Button>
        <Button style={GlobalStyles.buttonLg} icon="format-list-bulleted" mode="outlined" onPress={() => navigation.navigate('Recordings')}>
          Videos
        </Button>
        <Button style={GlobalStyles.buttonLg} icon="cog" mode="outlined" onPress={() => navigation.navigate('Settings')}>
          Settings
        </Button>
        <Button style={GlobalStyles.buttonLg} icon="help-circle-outline" mode="outlined" onPress={() => navigation.navigate('Help')}>
          App Help
        </Button>

      </View>

      

      {showUserInfo()}
    </View>
  );
}

export default HomeScreen;