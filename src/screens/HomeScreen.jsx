import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Image } from 'react-native';
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
      return (
        <View style={[GlobalStyles.divDark, GlobalStyles.attention, GlobalStyles.flex3]}>
          <Text variant='titleLarge' style={GlobalStyles.whiteText}>
            {user.name}
          </Text>
          <Text variant='labelLarge' style={GlobalStyles.whiteText}>
            {user.email}
          </Text>
          <Avatar.Image style={{ marginVertical: 10 }} size={64} source={{ uri: user.picture }} />
          <Text variant='labelLarge' style={{ color: 'white', marginVertical: 10 }}>
          Want to upload your videos to the cloud? Use the share button in the preview screen or if you're signed in, use the upload to Google Drive button instead.
          </Text>

        </View>
      );
    }
    else {
      return (
        <View style={[GlobalStyles.divDark, GlobalStyles.attention, GlobalStyles.flex3]}>
          <Text variant='titleLarge' style={GlobalStyles.whiteText}>
            Uploading to the Cloud
          </Text>
          <Text variant='labelLarge' style={[GlobalStyles.paddingYmd, GlobalStyles.whiteText]}>
            Want to upload your videos to the cloud? Use the share button in the preview screen or if you're signed in, use the upload to Google Drive button instead.
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



      <Image blurRadius={1} source={{ uri: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/45c07385-25d8-421a-88b0-b65922935bc7/depx2i2-46f9f9b4-adcf-49ef-a32b-46fa2dc63b41.jpg/v1/fill/w_600,h_600,q_75,strp/healing_path_by_chaohood_depx2i2-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjAwIiwicGF0aCI6IlwvZlwvNDVjMDczODUtMjVkOC00MjFhLTg4YjAtYjY1OTIyOTM1YmM3XC9kZXB4MmkyLTQ2ZjlmOWI0LWFkY2YtNDllZi1hMzJiLTQ2ZmEyZGM2M2I0MS5qcGciLCJ3aWR0aCI6Ijw9NjAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.UCyrmGCVQOYd7rgS2PJ6GowGrcIvrRE1YGff5iaP7to' }} style={[GlobalStyles.header, GlobalStyles.flex2]} />



      <View style={[GlobalStyles.divWhite, GlobalStyles.paddingYsm, GlobalStyles.divSpaceBetween, GlobalStyles.flex3]}>


        <Button style={GlobalStyles.button} icon="camera" mode="contained" onPress={() => navigation.navigate('Camera')}>
          Camera
        </Button>

        <Button style={GlobalStyles.button} icon="format-list-bulleted" mode="outlined" onPress={() => navigation.navigate('Recordings')}>
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