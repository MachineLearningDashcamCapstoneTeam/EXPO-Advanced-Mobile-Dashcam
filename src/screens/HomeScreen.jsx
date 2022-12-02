import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { Button, Text, Card, Divider, Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { DEFAULT_CAMERA_SETTINGS, GOOGLE_CONFIG } from '../constants';
import { getGoogleUserInfo } from '../services/googleService';

import { AccessContext } from '../context/accessTokenContext';
import HEADER_IMG from '../../assets/header.jpg';
import GlobalStyles from '../styles/global-styles';
import UserCard from '../widget/home/userCard';
import DefaultCard from '../widget/home/defaultCard';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

WebBrowser.maybeCompleteAuthSession();

function HomeScreen({ navigation }) {

  const { accessTokenContextValue, setAccessTokenContextValue } = useContext(AccessContext);
  const [user, setUser] = useState();
  const [accessToken, setAccessToken] = useState();
  const [request, response, promptAsync] = Google.useAuthRequest(GOOGLE_CONFIG);
  const [settings, setSettings] = useState(DEFAULT_CAMERA_SETTINGS)

  const [searchQuery, setSearchQuery] = useState('');
  const onChangeSearch = query => setSearchQuery(query);

  useEffect(() => {
    checkIfUserLoggedIn();
    setInitialValues();
  }, [response]);

  const setInitialValues = async () => {

    try {
      let tempSettings = await AsyncStorage.getItem('AMD_Settings')
      tempSettings = JSON.parse(tempSettings)
      if (tempSettings && Object.keys(tempSettings).length >= 1 && Object.getPrototypeOf(tempSettings) === Object.prototype) {
        if (tempSettings.loadCameraWhenApplicationStarts) {
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
      return <DefaultCard fetchGoogle={fetchGoogle} />
    }
  }

  return (
    <SafeAreaView  style={[GlobalStyles.container, GlobalStyles.divWhite]}>
 

      <Image source={HEADER_IMG} style={[GlobalStyles.headerImage, GlobalStyles.flex1]} />






      <View style={[GlobalStyles.flex4, GlobalStyles.roundedTop, GlobalStyles.divWhite]}>

      <Text variant='headlineMedium' style={[GlobalStyles.fontBold]} >
          AM Dashcam
        </Text>



        <Card style={[GlobalStyles.divWhite, GlobalStyles.roundedTop, GlobalStyles.roundedBottom, GlobalStyles.marginYlg]} elevation={5}>

          <Card.Content>
            <View style={[GlobalStyles.divCenter]}>
              <Button style={GlobalStyles.buttonLg} icon="camera" mode="contained" onPress={() => navigation.navigate('Camera')}>
                Camera
              </Button>
              <Button style={[GlobalStyles.buttonLg, GlobalStyles.divWhite]} icon="format-list-bulleted" mode="outlined" onPress={() => navigation.navigate('Videos')}>
                Videos
              </Button>
              <Button style={[GlobalStyles.buttonLg, GlobalStyles.divWhite]} icon="cog" mode="outlined" onPress={() => navigation.navigate('Settings')}>
                Settings
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Card style={[GlobalStyles.divWhite, GlobalStyles.roundedTop, GlobalStyles.roundedBottom]} elevation={5}>

          <Card.Content>
            <Text  variant='titleMedium'>Uploading to the Cloud</Text>
            <Divider style={[ GlobalStyles.marginYsm]}  />
            <Text variant="bodySmall">Use the Upload to Google Drive Option to save your videos on the Cloud.</Text>
          </Card.Content>

        </Card>

      </View>


      <View style={[GlobalStyles.divMain, GlobalStyles.flex1, GlobalStyles.shadowLg, GlobalStyles.divCenter, GlobalStyles.roundedTop]} elevation={5}>
        {showUserInfo()}
      </View>

    
    </SafeAreaView>
  );
}

export default HomeScreen;