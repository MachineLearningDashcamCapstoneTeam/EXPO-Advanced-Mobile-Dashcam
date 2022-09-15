import { StyleSheet, Text, View, Button, SafeAreaView } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Video } from 'expo-av';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';


export default function VideoPickerScreen() {
  const [videos, setVideos] = useState([]);
  const [album, setAlbum] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();

  useEffect(() => {
    (async () => {
      const EXPO_ALBUM_NAME = 'Dashcams';
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");

      // Get the album and then the videos inside the album
      await MediaLibrary.getAlbumAsync(EXPO_ALBUM_NAME).then((selectedAlbum) => {
        setAlbum(selectedAlbum)
        return selectedAlbum;
      }).then((selectedAlbum) => {
         MediaLibrary.getAssetsAsync({album:selectedAlbum.id, mediaType:'video'}).then((assets) => {
          setVideos(assets['assets']);
        }).catch((error) => {
          console.error(error);
        });
      });

      

    })();

    return () => {
      setHasMediaLibraryPermission(null);
      setVideos([]);
    };
  }, []);


  
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {
          videos.map((videoAsset) => 
              <Video
              key={videoAsset.id}
              style={styles.video}
              source={{uri: videoAsset.uri}}
              useNativeControls
              resizeMode='contain'
            />
            
          )
        }

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "flex-end"
  },
  video: {
    flex: 1,
    alignSelf: "stretch",
    margin: 10
  }
});