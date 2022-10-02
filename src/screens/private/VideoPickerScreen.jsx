import { Card, Button, Title, Paragraph, Text, Snackbar } from 'react-native-paper';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { ALBUM_NAME } from '../../constants';
import { timeStampToDate } from '../../utils/fetch-time';
import { Video, AVPlaybackStatus } from 'expo-av';

export default function VideoPickerScreen({ navigation }) {
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [videos, setVideos] = useState([]);
  const [album, setAlbum] = useState();
  const [assetInfo, setAssetInfo] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();

  const setPermissions = async () => {
    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");

    if (mediaLibraryPermission.status === 'granted') {
      console.log('Media Granted');

      await MediaLibrary.getAlbumAsync(ALBUM_NAME).then((selectedAlbum) => {
        setAlbum(selectedAlbum)
        console.log("Album Title: " + selectedAlbum.title);
        return selectedAlbum;
      }).then((selectedAlbum) => {
        MediaLibrary.getAssetsAsync({ album: selectedAlbum.id, mediaType: 'video' }).then((assets) => {
          setVideos(assets['assets']);
        }).catch((error) => {
          console.error("getAssetsAsync failed");
          console.error(error);
        });
      }).catch((error) => {
        console.error("getAlbumAsync failed");
        console.error(error);
      });

    }
    else {
      console.log('Does not have Media Granted');
    }

  }


  const getInfo = async (asset, callback) => {
    await MediaLibrary.getAssetInfoAsync(asset).then((info) => {
      setAssetInfo(info);
      callback(info);
    });
  }


  useEffect(() => {
    setPermissions();
    return () => {
      setHasMediaLibraryPermission(null);
      setVideos([]);
    };
  }, []);

  let deleteVideo = (videoAsset) => {
    MediaLibrary.deleteAssetsAsync([videoAsset])
          .then((success) => {
            if (success) {
              let tempList = videos;
              tempList= tempList.filter(item => item.id !==videoAsset.id)
              setVideos(tempList);
              setSnackBarVisible(true);
              
            } else {
              console.log("Failed to delete video");
            }
          })
  }


  return (
    <View style={styles.container}>


      <ScrollView>
        {
          videos.map((videoAsset) =>
            <Card key={videoAsset.id}>

              <Card.Content>
                <Title>{videoAsset.id}</Title>


                <Video
                  style={styles.video}
                  source={{ uri: videoAsset.uri }}
                  resizeMode="contain"
                  isLooping
                />

                <Text variant='labelLarge'>
                  {timeStampToDate(videoAsset.creationTime)}
                </Text>

                <Text variant='labelLarge'>
                  Duration: {videoAsset.duration}s
                </Text>

                <Button style={styles.button} mode="outlined" onPress={() => getInfo(videoAsset, (assetInfo) => navigation.navigate('VideoPlayer', { assetInfo: assetInfo }))}>
                  Preview
                </Button>
                <Button style={styles.button} icon="delete" mode="contained" onPress={() => deleteVideo(videoAsset)} > Delete</Button>

              </Card.Content>
            </Card>
          )
        }


        <Snackbar
          visible={snackBarVisible}
          onDismiss={() => setSnackBarVisible(false)}
          duration={3000}
          action={{
            label: 'Close',
          }}>
          Video Deleted
        </Snackbar>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
  button: {
    marginVertical: 10,
  }
});