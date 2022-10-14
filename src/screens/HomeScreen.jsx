import React from 'react';
import { useEffect, useState, createContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Title, Button, Text, Avatar } from 'react-native-paper';

import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GOOGLE_CONFIG } from '../constants';
import { getGoogleUserInfo } from '../services/googleService';
import { getDashcamVideos, uploadDashcamVideos } from '../services/googleDriveService';

WebBrowser.maybeCompleteAuthSession();
export const UserContext = createContext();

function HomeScreen({ navigation }) {
  const [user, setUser] = useState();
  const [accessToken, setAccessToken] = useState();
  const [request, response, promptAsync] = Google.useAuthRequest(GOOGLE_CONFIG);

  useEffect(() => {
    checkIfUserLoggedIn();
  }, [response]);

  // Check if the user already logged in with google
  const checkIfUserLoggedIn = () => {
    if (response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
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

  const getDriveFiles = async () => {

    const response = await getDashcamVideos(accessToken);
    if (response.status === 200) {
      const files = response.data.files;
      console.log("App.js | files", response.data.files);
    }

  };



  const showUserInfo = () => {
    if (user) {
      return (
        <View style={styles.attention}>
          <Title style={styles.whiteText}>
            {user.name}
          </Title>
          <Text variant='labelSmall' style={styles.whiteText}>
            {user.email}
          </Text>
          <Avatar.Image style={{ marginVertical: 10 }} size={64} source={{ uri: user.picture }} />
          <Text variant='labelSmall' style={{ color: 'white', marginVertical: 10 }}>
            With Google, you'll be able to share your data to Google Drive with one click on the preview screen.
          </Text>
        </View>
      );
    }
    else {
      return (
        <View style={styles.attention}>
          <Title style={styles.whiteText}>
            Uploading to the Cloud
          </Title>
          <Text variant='labelSmall' style={styles.whiteText}>
            Want to upload your videos to the cloud? Use the share button in the preview screen or if you signed in, use the upload to Google Drive button instead.
          </Text>
          <Text variant='labelSmall' style={{ color: 'white', marginVertical: 10 }}>
            - Advanced Mobile Dashcam
          </Text>
        </View>
      );
    }
  }


  return (
    <UserContext.Provider value={accessToken}>
      <View style={styles.container}>
        <Card mode="elevated" style={styles.card}>
          <Card.Cover source={{ uri: 'https://www.vancouverplanner.com/wp-content/uploads/2019/07/sea-to-sky-highway.jpeg' }} />
          <Card.Content>
            <Title>Attention Drivers!</Title>
            <Text style={styles.bottomMargin} variant='labelSmall'>
              The application is currently in development. If something breaks, just contact the development team.
            </Text>

            <Button style={styles.button} icon="camera" mode="contained" onPress={() => navigation.navigate('Camera')}>
              Camera
            </Button>

            <Button style={styles.button} icon="format-list-bulleted" mode="contained" onPress={() => navigation.navigate('VideoPicker')}>
              Videos
            </Button>

            <Button style={styles.button} icon="cog" mode="outlined" onPress={() => navigation.navigate('Settings')}>
              Settings
            </Button>

            <Button style={styles.button} icon="help-circle-outline" mode="outlined" onPress={() => navigation.navigate('Help')}>
              App Help
            </Button>

            {user === undefined &&
              <Button
                style={styles.button} icon="google" mode="outlined"
                onPress={() => fetchGoogle()}>
                Login to Google Drive
              </Button>
            }

          

          </Card.Content>
        </Card>

        {showUserInfo()}

      </View>
    </UserContext.Provider >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#244c98'
  },
  mainContainer: {
    //flex: 1,
  },
  button: {
    marginBottom: 5,
  },
  bottomMargin: {
    marginBottom: 10,
  },
  card: {

    //flex: 2,
  },
  attention: {
    //flex: 1, 
    margin: 10,
    backgroundColor: "#244c98",
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',

  },
  whiteText: {
    color: 'white'
  }
});

export default HomeScreen;