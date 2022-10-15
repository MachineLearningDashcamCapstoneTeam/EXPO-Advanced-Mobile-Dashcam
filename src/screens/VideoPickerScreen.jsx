import { Card, Button, Title, Text, Snackbar, Searchbar } from 'react-native-paper';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useEffect, useState, useContext } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { ALBUM_NAME } from '../constants';
import { timeStampToDate } from '../utils/fetch-time';

import { sortByLengthShortToLong, sortByLengthLongToShort, sortByTimeRecentToOldest, sortByTimeOldestToRecent } from '../utils/sorting-video-assets';

import { UserContext } from "./HomeScreen";
export default function VideoPickerScreen({ navigation }) {
  const accessToken = useContext(UserContext);
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [videos, setVideos] = useState([]);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();

  const setPermissions = async () => {
    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");

    if (mediaLibraryPermission.status === 'granted') {
      getAlbumData();
    }
    else {
      console.log('Does not have Media Granted');
    }
  }

  const getAlbumData = async () => {
    await MediaLibrary.getAlbumAsync(ALBUM_NAME).then((selectedAlbum) => {
      return selectedAlbum;
    }).then((selectedAlbum) => {
      MediaLibrary.getAssetsAsync({ album: selectedAlbum.id, mediaType: 'video' }).then((assets) => {

        const tempList = assets['assets'];
        const sortedArray = sortByTimeRecentToOldest(tempList)
        setVideos([...sortedArray])
      }).catch((error) => {
        console.error(error);
      });
    }).catch((error) => {
      console.error(error);
    });
  }


  const getInfo = async (asset, callback) => {
    await MediaLibrary.getAssetInfoAsync(asset).then((info) => {
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

  const deleteVideo = (videoAsset) => {
    MediaLibrary.deleteAssetsAsync([videoAsset])
      .then((success) => {
        if (success) {
          let tempList = videos;
          tempList = tempList.filter(item => item.id !== videoAsset.id)
          setVideos(tempList);
          setSnackBarVisible(true);

        } else {
          console.log("Failed to delete video");
        }
      })
  }

  const sortByLengthASC = () => {
    const tempList = videos;
    const sortedArray = sortByLengthShortToLong(tempList)
    setVideos([...sortedArray])
  }

  const sortByLengthDSC = () => {
    const tempList = videos;
    const sortedArray = sortByLengthLongToShort(tempList)
    setVideos([...sortedArray])
  }

  // Todo Add the sort by ascending time here (sortByTimeOldestToRecent)
  const sortByTimeASC = () => {
    const tempList = videos;
    const sortedArray = sortByTimeOldestToRecent(tempList)
    setVideos([...sortedArray])

  }

  // Todo Add the sort by descending time here (sortByTimeRecentToOldest)
  const sortByTimeDSC = () => {
    const tempList = videos;
    const sortedArray = sortByTimeRecentToOldest(tempList)
    setVideos([...sortedArray])

  }


  //! To reset the video list, use the sortByTimeRecentToOldest function
  const resetVideoList = () => {
    const tempList = videos;
    const sortedArray = sortByTimeRecentToOldest(tempList)
    setVideos([...sortedArray])

  }

  return (
    <View style={styles.container}>

      <Button style={styles.button} icon="filter" mode="contained" onPress={() => resetVideoList()} > Reset </Button>
      <View style={styles.buttonGroup}>
        <View style={styles.buttonContainer}>
          <Button style={styles.button} icon="filter" mode="outlined" onPress={() => sortByLengthASC()} >Short to Long</Button>
        </View>
        <View style={styles.buttonContainer}>
          <Button style={styles.button} icon="filter" mode="outlined" onPress={() => sortByLengthDSC()} >Long to Short</Button>
        </View>
      </View>

      <View style={styles.buttonGroup}>
        <View style={styles.buttonContainer}>
         
      <Button style={styles.button} icon="filter" mode="outlined" onPress={() => sortByTimeASC()} >Oldest to Recent</Button>
      
        </View>
        <View style={styles.buttonContainer}>
        <Button style={styles.button} icon="filter" mode="outlined" onPress={() => sortByTimeDSC()} >Recent to Oldest</Button>

        </View>
      </View>



      <ScrollView >
        {
          videos.map((videoAsset) =>
            <Card key={videoAsset.id} mode="elevated" style={styles.card}>
              <Card.Cover source={{ uri: videoAsset.uri }} />
              <Card.Content>
                <Title>{videoAsset.id}</Title>


                <Text variant='labelSmall'>
                  Created: {timeStampToDate(videoAsset.creationTime)}
                </Text>


                <Text variant='labelSmall'>
                  Duration: {videoAsset.duration}s
                </Text>

                <Text variant='labelSmall'>
                  Media Type: {videoAsset.mediaType}
                </Text>

                <Text style={styles.bottomMargin} variant='labelSmall'>
                  Size: {videoAsset.height} x {videoAsset.width}
                </Text>

                <Button style={styles.button} icon="eye" mode="contained" onPress={() => getInfo(videoAsset, (assetInfo) => navigation.navigate('VideoPlayer', { assetInfo: assetInfo }))}>
                  Preview
                </Button>
                <Button style={styles.button} icon="delete" mode="outlined" onPress={() => deleteVideo(videoAsset)} > Delete</Button>

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
  card: {
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonContainer: {
    flex: 1,
    
  },
  button: {
    marginBottom: 5,
  },
  bottomMargin: {
    marginBottom: 10,
  }
});