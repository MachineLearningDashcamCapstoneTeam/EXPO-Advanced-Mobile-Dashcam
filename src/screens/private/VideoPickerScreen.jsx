import  {Card,Button, Title, Paragraph,Text, Divider } from 'react-native-paper';
import { StyleSheet, View, ScrollView} from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Video } from 'expo-av';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { ALBUM_NAME } from '../../constants';

export default function VideoPickerScreen({navigation}) {
  const [videos, setVideos] = useState([]);
  const [album, setAlbum] = useState();
  const [assetInfo, setAssetInfo] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();

  const setPermissions = async () => {
    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");

    if (mediaLibraryPermission.status ==='granted') {
      console.log('Media Granted');

      console.log("Album: " + ALBUM_NAME);
      // Get the album and then the videos inside the album
      await MediaLibrary.getAlbumAsync(ALBUM_NAME).then((selectedAlbum) => {
        setAlbum(selectedAlbum)
        console.log("Album Title: " + selectedAlbum.title);
        return selectedAlbum;
      }).then((selectedAlbum) => {
        MediaLibrary.getAssetsAsync({ album: selectedAlbum.id, mediaType: 'video' }).then((assets) => {
          setVideos(assets['assets']);
          console.log(assets);
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

    const refreshList = navigation.addListener('focus', () => {console.log("Getting new List..."); setPermissions()})

    return () => {
      setHasMediaLibraryPermission(null);
      setVideos([]);
    };
  }, []);



  // return (
  //   <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  //     {
  //       videos.map((videoAsset) =>
  //         <Video
  //           key={videoAsset.id}
  //           style={styles.video}
  //           source={{ uri: videoAsset.uri }}
  //           useNativeControls
  //           resizeMode='contain'
  //         />

  //       )
  //     }

  //   </View>
  // );
  return (
    <ScrollView style={styles.container}>
      {
        videos.map((videoAsset) =>
          <Card key={videoAsset.id}>

            <Card.Content>
              <Title>{videoAsset.id}</Title> 
              
              <Paragraph variant='labelLarge'
                
              >{videoAsset.filename} </Paragraph>
            <Button style={styles.button} mode="outlined" onPress={() => getInfo(videoAsset, (assetInfo) => navigation.navigate('VideoPlayer',{ assetInfo: assetInfo}))}>
                Preview
              </Button>
      

      
            </Card.Content>
          </Card>
        )
      }

    </ScrollView>
  );
}


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   buttonContainer: {
//     backgroundColor: "#fff",
//     alignSelf: "flex-end"
//   },
//   video: {
//     flex: 1,
//     alignSelf: "stretch",
//     margin: 10
//   }
// });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  button: {
    marginVertical: 10,
  }
});