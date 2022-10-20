import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Title, Button, Text, Avatar } from 'react-native-paper';

import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GOOGLE_CONFIG } from '../constants';
import { getGoogleUserInfo } from '../services/googleService';

import { AccessContext } from '../context/accessTokenContext';
import GlobalStyles from '../styles/global-styles';

WebBrowser.maybeCompleteAuthSession();


function HomeScreen({ navigation }) {
  const { accessTokenContextValue, setAccessTokenContextValue } = useContext(AccessContext);
  const [user, setUser] = useState();
  const [accessToken, setAccessToken] = useState();
  const [request, response, promptAsync] = Google.useAuthRequest(GOOGLE_CONFIG);


  useEffect(() => {
    checkIfUserLoggedIn();
  }, [response]);

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

  // Start google Sign In and then get the user data
  const fetchGoogle = async () => {
    await promptAsync({ useProxy: true, showInRecents: true })
  }

  // Fetch the user data from googles APIs and set the data
  const getUserData = async (accessTokenValue) => {
    const data = await getGoogleUserInfo(accessTokenValue);
    setUser(data)
  };


  //* Show the user details only if the user exists. If not, show the default menu
  const showUserInfo = () => {
    if (user) {
      return (
        <View style={[GlobalStyles.attention, GlobalStyles.flex3]}>
          <Text variant='titleLarge' style={GlobalStyles.whiteText}>
            {user.name}
          </Text>
          <Text variant='labelLarge' style={GlobalStyles.whiteText}>
            {user.email}
          </Text>
          <Avatar.Image style={{ marginVertical: 10 }} size={96} source={{ uri: user.picture }} />
          <Text variant='labelLarge' style={{ color: 'white', marginVertical: 10 }}>
            With Google, you'll be able to share your data to Google Drive with one click on the preview screen.
          </Text>

        </View>
      );
    }
    else {
      return (
        <View style={[GlobalStyles.attention, GlobalStyles.flex2]}>
          <Title style={GlobalStyles.whiteText}>
            Uploading to the Cloud
          </Title>
          <Text variant='labelLarge' style={[GlobalStyles.paddingYsm, GlobalStyles.whiteText]}>
            Want to upload your videos to the cloud? Use the share button in the preview screen or if you signed in, use the upload to Google Drive button instead.
          </Text>


          <Button
            style={GlobalStyles.button} icon="google" mode="elevated"
            onPress={() => fetchGoogle()}>
            Login to Google Drive
          </Button>
        </View>
      );
    }
  }



  return (

    <View style={GlobalStyles.container}>


      <View style={[GlobalStyles.header, GlobalStyles.flex1]}>
        <Title style={GlobalStyles.whiteText}>Attention Drivers!</Title>

        <Text style={GlobalStyles.whiteText} variant='labelLarge'>
          The application is currently in development. If something breaks, just contact the development team.
        </Text>
      </View>


      <View style={[GlobalStyles.divWhite, GlobalStyles.paddingYsm, GlobalStyles.divSpaceBetween, GlobalStyles.flex3]}>


        <Button style={GlobalStyles.button} icon="camera" mode="contained" onPress={() => navigation.navigate('Camera')}>
          Camera
        </Button>

        <Button style={GlobalStyles.button} icon="format-list-bulleted" mode="outlined" onPress={() => navigation.navigate('VideoPicker')}>
          Videos
        </Button>

        <Button style={GlobalStyles.button} icon="cog" mode="outlined" onPress={() => navigation.navigate('Settings')}>
          Settings
        </Button>

        <Button style={GlobalStyles.button} icon="help-circle-outline" mode="outlined" onPress={() => navigation.navigate('Help')}>
          App Help
        </Button>


      </View>


      {showUserInfo()}

    </View>

  );
}


export default HomeScreen;