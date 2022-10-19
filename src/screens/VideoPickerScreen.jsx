import { Card, Button, Title, Text, Searchbar } from 'react-native-paper';
import { StyleSheet, View, ScrollView , Alert} from 'react-native';
import { useEffect, useState, useContext } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { ALBUM_NAME } from '../constants';
import { timeStampToDate } from '../utils/fetch-time';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { sortByLengthShortToLong, sortByLengthLongToShort, sortByTimeRecentToOldest, sortByTimeOldestToRecent } from '../utils/sorting-video-assets';

import { UserContext } from "./HomeScreen";
export default function VideoPickerScreen({ navigation }) {
  const [videos, setVideos] = useState([]);
  const [savedFavoriteVideosIds, setSavedFavoriteVideosIds] = useState([]);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();

  const setPermissions = async () => {
    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");

    //* If the user has permission, load the video data
    if (mediaLibraryPermission.status === 'granted') {
      getAlbumData();
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


    //* Load Favorite videos
    const tempSavedFavoriteVideosIds = await AsyncStorage.getItem('FavoriteVideosIds');
    if (tempSavedFavoriteVideosIds && tempSavedFavoriteVideosIds !== null) {
      const tempSavedFavoriteVideosIdsArray = JSON.parse(tempSavedFavoriteVideosIds)
      setSavedFavoriteVideosIds([...tempSavedFavoriteVideosIdsArray]);
    }

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

  const saveVideoToSavedVideoIds = async (videoAsset) => {
    const result = savedFavoriteVideosIds.includes(videoAsset.id);
    if (result === false) {

      //* Video does not exist is saved videos list
      const tempSavedFavoriteVideosIds = savedFavoriteVideosIds;
      tempSavedFavoriteVideosIds.push(videoAsset.id);
      const tempSavedFavoriteVideosIdsString = JSON.stringify(tempSavedFavoriteVideosIds);
      await AsyncStorage.setItem('FavoriteVideosIds', tempSavedFavoriteVideosIdsString);

      console.log(tempSavedFavoriteVideosIdsString)
      setSavedFavoriteVideosIds([...tempSavedFavoriteVideosIds]);

      Alert.alert("Added video to Favorites");
    }
  }

  const deleteVideoFromFavoriteVideos = async (videoAsset) => {
    const result = savedFavoriteVideosIds.includes(videoAsset.id);
    if (result) {

      //* Video exists, delete from the favorites list
      let tempSavedFavoriteVideosIds = savedFavoriteVideosIds;
      tempSavedFavoriteVideosIds = tempSavedFavoriteVideosIds.filter(id => id !== videoAsset.id)
      const tempSavedFavoriteVideosIdsString = JSON.stringify(tempSavedFavoriteVideosIds);
      await AsyncStorage.setItem('FavoriteVideosIds', tempSavedFavoriteVideosIdsString);

      console.log(tempSavedFavoriteVideosIdsString)
      setSavedFavoriteVideosIds([...tempSavedFavoriteVideosIds]);

      Alert.alert("Deleted video from Favorites");
    }
  }

  const deleteVideo = (videoAsset) => {
    MediaLibrary.deleteAssetsAsync([videoAsset])
      .then((success) => {
        if (success) {
          let tempList = videos;
          tempList = tempList.filter(item => item.id !== videoAsset.id)
          setVideos(tempList);

          //* Also delete the video from favorites
          deleteVideoFromFavoriteVideos(videoAsset);

          Alert.alert("Video successfully deleted");

        } else {
          Alert.alert("Failed to delete video");
        }
      })

   
  }

  //* Sort the videos and reset the initial video list
  const sortByLengthASC = () => {
    const tempList = videos;
    const sortedArray = sortByLengthShortToLong(tempList)
    setVideos([...sortedArray])
  }

  //* Sort the videos and reset the initial video list
  const sortByLengthDSC = () => {
    const tempList = videos;
    const sortedArray = sortByLengthLongToShort(tempList)
    setVideos([...sortedArray])
  }

  //* Sort the videos and reset the initial video list
  const sortByTimeASC = () => {
    const tempList = videos;
    const sortedArray = sortByTimeOldestToRecent(tempList)
    setVideos([...sortedArray])

  }

  //* Sort the videos and reset the initial video list
  const sortByTimeDSC = () => {
    const tempList = videos;
    const sortedArray = sortByTimeRecentToOldest(tempList)
    setVideos([...sortedArray])

  }


  //* To reset the video list, use the sortByTimeRecentToOldest function
  const resetVideoList = () => {
    const tempList = videos;
    const sortedArray = sortByTimeRecentToOldest(tempList)
    setVideos([...sortedArray])

  }

  const getSaveOrDeleteFromFavoritesButton = (videoAsset) => {
    const result = savedFavoriteVideosIds.includes(videoAsset.id);

    if (result) {
      return (<Button style={styles.button} icon="delete" mode="contained" onPress={() => deleteVideoFromFavoriteVideos(videoAsset)}>
        Delete from Favorites
      </Button>)
    }
    else {
      return (<Button style={styles.button} icon="content-save" mode="contained" onPress={() => saveVideoToSavedVideoIds(videoAsset)}>
        Add to Favorites
      </Button>)
    }

  }

  return (
    <View style={styles.container}>

      <Button style={styles.button} icon="filter" mode="contained" onPress={() => resetVideoList()} > Reset </Button>
      <Button style={styles.button} icon="filter" mode="outlined" onPress={() => sortByLengthASC()} >Short to Long</Button>
      <Button style={styles.button} icon="filter" mode="outlined" onPress={() => sortByLengthDSC()} >Long to Short</Button>
      <Button style={styles.button} icon="filter" mode="outlined" onPress={() => sortByTimeASC()} >Oldest to Recent</Button>
      <Button style={styles.button} icon="filter" mode="outlined" onPress={() => sortByTimeDSC()} >Recent to Oldest</Button>


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

                {getSaveOrDeleteFromFavoritesButton(videoAsset)}


                <Button style={styles.button} icon="delete" mode="outlined" onPress={() => deleteVideo(videoAsset)} > Delete</Button>

              </Card.Content>
            </Card>
          )
        }



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