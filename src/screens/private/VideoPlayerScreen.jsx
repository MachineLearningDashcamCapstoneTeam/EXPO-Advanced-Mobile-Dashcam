import * as React from 'react';
import * as MediaLibrary from 'expo-media-library'
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Video, AVPlaybackStatus } from 'expo-av';
import { shareAsync } from 'expo-sharing';

export default function VideoPlayerScreen({route, navigation}) {
  const { assetInfo } = route.params;

  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});

  // React.useEffect(() => {
  //   console.log("Player: ");
  //   console.log(assetInfo);
  // }, []);

  let shareVideo = () => {
    shareAsync(assetInfo.localUri).then(() => {
      setVideo(undefined);
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
      <Video
        ref={video}
        style={styles.video}
        source={{uri: assetInfo.localUri}}
        useNativeControls
        resizeMode="contain"
        isLooping
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
      <View style={styles.buttons}>
        <Button
          onPress={() =>
            status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
          }
        >{status.isPlaying ? 'Pause' : 'Play'}</Button>
      </View>
        <Button style={styles.button} icon="share" mode="contained" onPress={shareVideo} > Share</Button>
        <Button style={styles.button} icon="delete" mode="contained" onPress={deleteVideo} > Delete</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});