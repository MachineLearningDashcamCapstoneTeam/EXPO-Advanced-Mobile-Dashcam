import { Card, Button, Title, Paragraph, Text, Snackbar, Searchbar } from 'react-native-paper';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useEffect, useState, useRef , useContext} from 'react';
import * as MediaLibrary from 'expo-media-library';
import { ALBUM_NAME } from '../constants';
import { timeStampToDate } from '../utils/fetch-time';

import {sortByLengthShortToLong, sortByLengthLongToShort, sortByTimeRecentToOldest, ortByTimeOldestToRecent, sortByTimeOldestToRecent} from '../utils/sorting-video-assets';

import { UserContext } from "./HomeScreen";
export default function VideoPickerScreen({ navigation }) {
  const accessToken = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');
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
        setVideos(assets['assets']);
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
    console.log(accessToken);
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

  const onChangeSearch = query => setSearchQuery(query);

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
const sortByTimeASC =() => {
  const tempList = videos;
  const sortedArray = sortByTimeOldestToRecent(tempList)
  setVideos([...sortedArray])

}

  // Todo Add the sort by descending time here (sortByTimeRecentToOldest)
  const sortByTimeDSC=()=>{
    const tempList = videos;
    const sortedArray = sortByTimeRecentToOldest(tempList)
    setVideos([...sortedArray])

  }


  //! To reset the video list, use the sortByTimeRecentToOldest function
  const resetVideoList = () =>{
    const tempList = videos;
    const sortedArray = sortByTimeRecentToOldest(tempList)
    setVideos([...sortedArray])

  }

  return (
    <View style={styles.container}>
      

      <Button style={styles.button}  mode="outlined" onPress={() => sortByLengthASC()} > Sort by Duration : Short to Long</Button>
      <Button style={styles.button}  mode="outlined" onPress={() => sortByLengthDSC()} > Sort by Duration : Long to Short</Button>
      <Button style={styles.button}  mode="outlined" onPress={() => sortByTimeASC()} > Sort by Time : Oldest to Recent</Button>
      <Button style={styles.button}  mode="outlined" onPress={() => sortByTimeDSC()} > Sort by Time : Recent to Oldest</Button>
      <Button style={styles.button}  mode="outlined" onPress={() => resetVideoList()} > Reset </Button>
      
      <Searchbar
        placeholder="Search Videos"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.search}
      />

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
  search: {
    marginBottom: 10,
  },
  card: {
    marginBottom: 10,
  },
  button: {
    marginBottom: 5,
  },
  bottomMargin: {
    marginBottom: 10,
  }
});