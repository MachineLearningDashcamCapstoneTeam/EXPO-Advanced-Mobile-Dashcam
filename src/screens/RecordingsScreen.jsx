import { Card, Button, Title, Text, IconButton, MD3Colors } from 'react-native-paper';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { useEffect, useState, useContext } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { ALBUM_NAME } from '../constants';
import { timeStampToDate } from '../utils/fetch-time';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { sortByLengthShortToLong, sortByLengthLongToShort, sortByTimeRecentToOldest, sortByTimeOldestToRecent } from '../utils/sorting-video-assets';
import { getDashcamVideos, uploadDashcamVideos, deleteGoogleDriveFile } from '../services/googleDriveService';
import { AccessContext } from '../context/accessTokenContext';

import GoogleVideoCard from '../widget/googleVideoCard';
import GlobalStyles from '../styles/global-styles';

export default function RecordingsScreen({ navigation }) {

  const { accessTokenContextValue, setAccessTokenContextValue } = useContext(AccessContext);

  const [selectedMenu, setSelectedMenu] = useState(0);
  const [videos, setVideos] = useState([]);
  const [savedFavoriteVideosIds, setSavedFavoriteVideosIds] = useState([]);
  const [files, setFiles] = useState([]);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();

  //
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

    if (accessTokenContextValue) {
      getDriveFiles();
    }

  }



  const loadFavorites = async () => {
    //* Load Favorite videos
    const tempSavedFavoriteVideosIds = await AsyncStorage.getItem('FavoriteVideosIds');
    if (tempSavedFavoriteVideosIds && tempSavedFavoriteVideosIds !== null) {
      const tempSavedFavoriteVideosIdsArray = JSON.parse(tempSavedFavoriteVideosIds)
      setSavedFavoriteVideosIds([...tempSavedFavoriteVideosIdsArray]);
    }
  }


  const getInfo = async (asset) => {
    await MediaLibrary.getAssetInfoAsync(asset).then((info) => {
      navigation.navigate('Video Player', { assetInfo: info });
    });
  }

  useEffect(() => {

    setPermissions();
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });
    return () => {
      setHasMediaLibraryPermission(null);
      setVideos([]);
      unsubscribe;
    };
  }, [navigation]);

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


  //* Google drive conditions
  const getDriveFiles = async () => {
    const response = await getDashcamVideos(accessTokenContextValue);
    if (response.status === 200) {
      console.log("App.js | files", response.data.files);
      setFiles(response.data.files)
    }
  };


  const deleteDriveFile = async (file) => {
    const response = await deleteGoogleDriveFile(accessTokenContextValue, file.id);
    if (response.status === 204) {
      let tempList = files;
      tempList = tempList.filter(item => item.id !== file.id);
      setFiles([...tempList])
      Alert.alert("Deleted video from Google Drive");
    }
  }



  const getSaveOrDeleteFromFavoritesButton = (videoAsset) => {
    const result = savedFavoriteVideosIds.includes(videoAsset.id);

    if (result) {
      return (<Button style={[GlobalStyles.buttonDanger, GlobalStyles.button]} icon="lock-open-variant" mode="contained" onPress={() => deleteVideoFromFavoriteVideos(videoAsset)}>
        Unlock
      </Button>)
    }
    else {
      return (<Button style={[GlobalStyles.buttonSuccess, GlobalStyles.button]} icon="lock" mode="contained" onPress={() => saveVideoToSavedVideoIds(videoAsset)}>
        Lock
      </Button>)
    }

  }

  const videoWidgets = () => {
    if (selectedMenu === 0) {

      return (
        <View>
          {/* <Button style={GlobalStyles.button} icon="filter" mode="contained" onPress={() => resetVideoList()} > Reset </Button>
          <Button style={GlobalStyles.button} icon="filter" mode="outlined" onPress={() => sortByLengthASC()} >Short to Long</Button>
          <Button style={GlobalStyles.button} icon="filter" mode="outlined" onPress={() => sortByLengthDSC()} >Long to Short</Button>
          <Button style={GlobalStyles.button} icon="filter" mode="outlined" onPress={() => sortByTimeASC()} >Oldest to Recent</Button>
          <Button style={GlobalStyles.button} icon="filter" mode="outlined" onPress={() => sortByTimeDSC()} >Recent to Oldest</Button> */}


          <ScrollView style={GlobalStyles.bottomMargin}>
            {
              videos.map((videoAsset) =>

                <Card key={videoAsset.id} mode="elevated" style={GlobalStyles.card}>
                  <Card.Cover source={{ uri: videoAsset.uri }} />
                  <Card.Content>
                  <Text  style={[GlobalStyles.paddingYsm]} variant='titleMedium'>{videoAsset.id}</Text>


                    <Text variant='labelSmall'>
                      Created: {timeStampToDate(videoAsset.creationTime)}
                    </Text>


                    <Text variant='labelSmall'>
                      Duration: {videoAsset.duration}s
                    </Text>

                    <Text  variant='labelSmall'>
                      Video Id: {videoAsset.id}
                    </Text>

                    <Text style={[GlobalStyles.paddingYsm]} variant='labelLarge'>
                    Options:
                    </Text>
                    <View style={[GlobalStyles.divSpaceBetween, GlobalStyles.rowContainer]}>

                      <Button style={GlobalStyles.button} icon="eye" mode="contained" onPress={() => getInfo(videoAsset)}>
                        View
                      </Button>

                      {getSaveOrDeleteFromFavoritesButton(videoAsset)}

                      <Button style={[GlobalStyles.buttonWarning, GlobalStyles.button]} icon="map" mode="contained" onPress={() => navigation.navigate('Map', { assetInfo: videoAsset })} >Map</Button>
                    </View>

                    <Text style={[GlobalStyles.paddingYsm]} variant='labelLarge'>
                      Warning! Point of no return:
                    </Text>
                    <Button style={GlobalStyles.button} icon="delete" mode="outlined" onPress={() => deleteVideo(videoAsset)} > Delete</Button>

                  </Card.Content>
                </Card>
              )
            }

          </ScrollView>
        </View>
      )
    }
    else {
      return (

        <ScrollView>
          {files.map((file) =>
          ((file.fileExtension === "MP4" || file.fileExtension === "mp4" || file.fileExtension === 'jpg') &&
            <GoogleVideoCard key={file.id} file={file} deleteDriveFile={deleteDriveFile} />
          )
          )}
        </ScrollView>

      )
    }
  }

  return (
    <View style={GlobalStyles.container}>




      <View style={[GlobalStyles.divDark, GlobalStyles.header, GlobalStyles.flex2]}>
        <Title style={GlobalStyles.whiteText}>{selectedMenu === 0 ? 'Local Videos' : 'Cloud Videos'}</Title>

        <Text style={[GlobalStyles.paddingYsm, GlobalStyles.whiteText]} variant='labelLarge'>
        {selectedMenu === 0 ? 'Local Videos are recordings and GPS Data saved on the phone. Use filters to swift through the recordings.' : 'Cloud Videos are recordings and GPS Data saved on Google Drive.'}
        </Text>

        {accessTokenContextValue &&
          <Button style={GlobalStyles.button} icon="filter" mode="elevated" onPress={() => selectedMenu === 0 ? setSelectedMenu(1) : setSelectedMenu(0)} >{selectedMenu === 0 ? 'Cloud Videos' : 'Local Videos'}</Button>
        }
      </View>



      <View style={GlobalStyles.flex5}>

        {videoWidgets()}

      </View>


    </View>
  );
}
