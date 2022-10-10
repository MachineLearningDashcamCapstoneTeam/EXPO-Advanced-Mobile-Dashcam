import { useEffect, useState, useRef, useContext  } from 'react';
import * as MediaLibrary from 'expo-media-library'
import { View, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { Card, Button, Title, Text } from 'react-native-paper';
import { Video } from 'expo-av';
import { timeStampToDate } from '../../utils/fetch-time';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

import { UserContext } from "./HomeScreen";

export default function VideoPlayerScreen({ route, navigation }) {
  const user = useContext(UserContext);
  const { assetInfo } = route.params;
  
  const video = useRef(null);
  const [status, setStatus] = useState({});

  useEffect(() => {
    console.log(assetInfo);
    console.log(user);
  }, []);

  let shareVideo = async () => {

    const filename = `${FileSystem.documentDirectory}${assetInfo.filename}.txt`;
    const result = await FileSystem.readAsStringAsync(filename, {
      encoding: FileSystem.EncodingType.UTF8
    });

    //! Somehow share video and coordinates together
    console.log(result);
    shareAsync(filename).then(() => {

    });

  };

  let deleteVideo = () => {
    MediaLibrary.deleteAssetsAsync([assetInfo.id])
      .then((success) => {
        if (success) {
          Alert.alert("Video successfully deleted");
          navigation.goBack();
        } else {
          Alert.alert("Failed to delete video");
        }
      })
  }

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Title style={{ color: 'white' }}>
          {assetInfo.id}
        </Title>
      </View>

      <Card key={assetInfo.id} mode="elevated" style={styles.card}>
        <Card.Content>

          <Video
            ref={video}
            style={styles.video}
            source={{ uri: (Platform.OS === "android") ? assetInfo.uri : assetInfo.localUri}}
            useNativeControls
            resizeMode='contain'
            isLooping
            onPlaybackStatusUpdate={status => setStatus(() => status)}
          />



          <Text variant='labelSmall'>
            Created: {timeStampToDate(assetInfo.creationTime)}
          </Text>

          <Text variant='labelSmall'>
            Modified: {timeStampToDate(assetInfo.modificationTime)}
          </Text>

          <Text variant='labelSmall'>
            Duration: {assetInfo.duration}s
          </Text>

          <Text variant='labelSmall'>
            Media Type: {assetInfo.mediaType}
          </Text>

          <Text variant='labelSmall'>
            Size: {assetInfo.height} x {assetInfo.width}
          </Text>

          <Text style={styles.bottomMargin} variant='labelSmall'>
            Path: {assetInfo.uri}
          </Text>


          <Button style={styles.button} mode="contained" onPress={() =>
            status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
          }

            icon={status.isPlaying ? 'pause' : 'play'}
          >{status.isPlaying ? 'Pause' : 'Play'}</Button>

          <Button style={styles.button} icon="share" mode="outlined" onPress={shareVideo} > Share</Button>
          <Button style={styles.button} icon="delete" mode="outlined" onPress={deleteVideo} > Delete</Button>
          <Button style={styles.button} icon="map" mode="outlined" onPress={() => navigation.navigate('Map', { assetInfo: assetInfo })} > Map</Button>

        </Card.Content>


      </Card>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: '#244c98'
  },
  video: {
    alignSelf: "stretch",
    width: window.full,
    height: 350,
    marginBottom: 10,
  },
  bottomMargin: {
    marginBottom: 10,
  },
  button: {
    marginBottom: 5,
  },
  card:{
    //flex: 1,
  },
  header: {
    padding: 10,
    backgroundColor: "#244c98",
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  }

});