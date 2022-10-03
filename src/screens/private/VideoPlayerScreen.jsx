import { useEffect, useState, useRef } from 'react';
import * as MediaLibrary from 'expo-media-library'
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Button, Title, Paragraph, Text, Snackbar } from 'react-native-paper';
import { Video, AVPlaybackStatus } from 'expo-av';
import { timeStampToDate } from '../../utils/fetch-time';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
export default function VideoPlayerScreen({ route, navigation }) {
  const { assetInfo } = route.params;

  const video = useRef(null);
  const [status, setStatus] = useState({});

  useEffect(() => {
    console.log(assetInfo);
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
    <View style={styles.container}>
      <Card key={assetInfo.id} mode="elevated" style={styles.card}>
          
        <Card.Content>

          <Title>{assetInfo.id}</Title>

          <Text variant='labelLarge'>
            Created: {timeStampToDate(assetInfo.creationTime)}
          </Text>

          <Text variant='labelLarge'>
            Modified: {timeStampToDate(assetInfo.modificationTime)}
          </Text>

          <Text variant='labelLarge'>
            Duration: {assetInfo.duration}s
          </Text>

          <Text variant='labelLarge'>
            Media Type: {assetInfo.mediaType}
          </Text>

          <Text variant='labelLarge'>
            Size: {assetInfo.height} x {assetInfo.width}
          </Text>

          <Text variant='labelLarge'>
            Path: {assetInfo.uri}
          </Text>



          <Video
            ref={video}
            style={styles.video}
            source={{ uri: assetInfo.uri }}
            useNativeControls
            resizeMode='contain'
            isLooping
            onPlaybackStatusUpdate={status => setStatus(() => status)}
          />

          <Button style={styles.button} mode="contained" onPress={() =>
            status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
          }

            icon={status.isPlaying ? 'pause' : 'play'}
          >{status.isPlaying ? 'Pause' : 'Play'}</Button>

          <Button style={styles.button} icon="share" mode="contained" onPress={shareVideo} > Share</Button>
          <Button style={styles.button} icon="delete" mode="outlined" onPress={deleteVideo} > Delete</Button>

        </Card.Content>


      </Card>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  video: {
    alignSelf: "stretch",
    width: 320,
    height: 200,
    margin: 5,
  },
  button: {
    marginBottom: 5,
  },
});