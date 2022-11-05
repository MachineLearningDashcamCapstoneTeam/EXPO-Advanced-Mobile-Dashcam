import { Card, Button, Text, DataTable } from 'react-native-paper';
import { View, ScrollView, Alert } from 'react-native';
import { useEffect, useState, useContext } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { ALBUM_NAME } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { sortByLengthShortToLong, sortByLengthLongToShort, sortByTimeRecentToOldest, sortByTimeOldestToRecent } from '../utils/sorting-video-assets';
import { getDashcamVideos, deleteGoogleDriveFile } from '../services/googleDriveService';
import { AccessContext } from '../context/accessTokenContext';

import GoogleVideoCard from '../widget/googleVideoCard';
import GlobalStyles from '../styles/global-styles';
import LocalVideoCard from '../widget/localVideoCard';

export default function RecordingsScreen({ navigation }) {
  const { accessTokenContextValue, setAccessTokenContextValue } = useContext(AccessContext);
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();

  //* Local Videos, favorites, and Google Drive Files
  const [videos, setVideos] = useState([]);
  const [savedFavoriteVideosIds, setSavedFavoriteVideosIds] = useState([]);
  const [googleDriveFiles, setGoogleDriveFiles] = useState([]);

  //* Pagination details for videos
  const numberOfItemsPerPageList = [10, 20, 30];
  const [paginationPage, setPaginationPage] = useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);
  const [paginationFrom, setPaginationFrom] = useState(paginationPage * numberOfItemsPerPage);
  const [paginationTo, setPaginationTo] = useState(Math.min((paginationPage + 1) * numberOfItemsPerPage, videos.length));

  const setPermissions = async () => {
    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    //* If the user has permission, load the video data
    if (mediaLibraryPermission.status === 'granted') {
      getAlbumData();
      setPaginationPage(0);
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
        setPaginationTo(Math.min((paginationPage + 1) * numberOfItemsPerPage, sortedArray.length));
      }).catch((error) => {
        Alert.alert("Unable to load Videos from the Album");
      });
    }).catch((error) => {
      Alert.alert("Unable to load Album");
    });
    if (accessTokenContextValue && googleDriveFiles.length <= 0) {
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
      navigation.navigate('Video Player', { videoAsset: info });
    }).catch((error) => {
      Alert.alert("Unable to load Asset Information");
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
  }, [navigation, numberOfItemsPerPage]);
  const saveVideoToSavedVideoIds = async (videoAsset, isLocked = null) => {
    if (isLocked === null) {
      isLocked = savedFavoriteVideosIds.includes(videoAsset.id);
    }
    if (isLocked === false) {
      //* Video does not exist is saved videos list
      const tempSavedFavoriteVideosIds = savedFavoriteVideosIds;
      tempSavedFavoriteVideosIds.push(videoAsset.id);
      const tempSavedFavoriteVideosIdsString = JSON.stringify(tempSavedFavoriteVideosIds);
      await AsyncStorage.setItem('FavoriteVideosIds', tempSavedFavoriteVideosIdsString);
      setSavedFavoriteVideosIds([...tempSavedFavoriteVideosIds]);
      Alert.alert("Successfully Locked Video");
    }
  }
  const deleteVideoFromFavoriteVideos = async (videoAsset, isLocked = null) => {
    if (isLocked === null) {
      isLocked = savedFavoriteVideosIds.includes(videoAsset.id);
    }
    if (isLocked) {
      //* Video exists, delete from the favorites list
      let tempSavedFavoriteVideosIds = savedFavoriteVideosIds;
      tempSavedFavoriteVideosIds = tempSavedFavoriteVideosIds.filter(id => id !== videoAsset.id)
      const tempSavedFavoriteVideosIdsString = JSON.stringify(tempSavedFavoriteVideosIds);
      await AsyncStorage.setItem('FavoriteVideosIds', tempSavedFavoriteVideosIdsString);
      setSavedFavoriteVideosIds([...tempSavedFavoriteVideosIds]);
      Alert.alert("Successfully Unlocked Video");
    }
  }
  const deleteVideo = (videoAsset, isLocked = null) => {
    if (isLocked === null) {
      isLocked = savedFavoriteVideosIds.includes(videoAsset.id);
    }
    //* If the user has permission, load the video data
    if (hasMediaLibraryPermission && isLocked === false) {
      MediaLibrary.deleteAssetsAsync([videoAsset.id])
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
    else {
      Alert.alert("Video is Locked");
    }
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
      setGoogleDriveFiles(response.data.files)
    }
  };
  const deleteDriveFile = async (file) => {
    const response = await deleteGoogleDriveFile(accessTokenContextValue, file.id);
    if (response.status === 204) {
      let tempList = googleDriveFiles;
      tempList = tempList.filter(item => item.id !== file.id);
      setGoogleDriveFiles([...tempList])
      Alert.alert("Deleted video from Google Drive");
    }
  }
  const videoWidgets = () => {
    if (selectedMenu === 0) {
      return (
        <View>
          <Card mode="elevated" style={[GlobalStyles.borderRounded, GlobalStyles.marginYsm]}>
            <Card.Content>
              <Text variant='titleLarge' >
                Filters
              </Text>
              <View style={[GlobalStyles.marginYsm]}>
                <Button style={GlobalStyles.button} icon="filter" mode="contained" onPress={() => resetVideoList()} >Reset</Button>
              </View>
              <Text variant='labelMedium'>
                Duration Filter
              </Text>
              <View style={[GlobalStyles.rowContainer, GlobalStyles.marginYsm]}>
                <View style={GlobalStyles.buttonContainer}>
                  <Button style={[GlobalStyles.button]} icon="filter" mode="outlined" onPress={() => sortByLengthASC()} >Short to Long</Button>
                </View>
                <View style={GlobalStyles.buttonContainer}>
                  <Button style={[GlobalStyles.button]} icon="filter" mode="outlined" onPress={() => sortByLengthDSC()} >Long to Short</Button>
                </View>
              </View>

              <Text variant='labelMedium'>
                Created Filter
              </Text>
              <View style={[GlobalStyles.rowContainer, GlobalStyles.marginYsm]}>
                <View style={GlobalStyles.buttonContainer}>
                  <Button style={GlobalStyles.button} icon="filter" mode="outlined" onPress={() => sortByTimeASC()} >Old to New</Button>
                </View>
                <View style={GlobalStyles.buttonContainer}>
                  <Button style={GlobalStyles.button} icon="filter" mode="outlined" onPress={() => sortByTimeDSC()} >New to Old</Button>
                </View>
              </View>
            </Card.Content>
          </Card>

          {
            videos.map((videoAsset) => (
              <LocalVideoCard key={videoAsset.id} videoAsset={videoAsset} savedFavoriteVideosIds={savedFavoriteVideosIds} getInfo={getInfo} deleteVideo={deleteVideo} deleteVideoFromFavoriteVideos={deleteVideoFromFavoriteVideos} saveVideoToSavedVideoIds={saveVideoToSavedVideoIds} />
            ))

          }
          {/* <DataTable>
            {
              videos.slice(
                paginationPage * numberOfItemsPerPage,
                paginationPage * numberOfItemsPerPage + numberOfItemsPerPage,
              ).
                map((videoAsset) => (
                  <LocalVideoCard key={videoAsset.id} videoAsset={videoAsset} savedFavoriteVideosIds={savedFavoriteVideosIds} getInfo={getInfo} deleteVideo={deleteVideo} deleteVideoFromFavoriteVideos={deleteVideoFromFavoriteVideos} saveVideoToSavedVideoIds={saveVideoToSavedVideoIds} />
                ))
            }

            <Card mode="elevated" style={[GlobalStyles.borderRounded, GlobalStyles.marginYsm]}>
              <Card.Content>
                <DataTable.Pagination
                  style={[GlobalStyles.divCenter]}
                  page={paginationPage}
                  numberOfPages={Math.ceil(videos.length / numberOfItemsPerPage)}
                  onPageChange={page => setPaginationPage(page)}
                  label={`${paginationFrom + 1}-${paginationTo} of ${videos.length}`}
                  showFastPaginationControls
                  numberOfItemsPerPageList={numberOfItemsPerPageList}
                  numberOfItemsPerPage={numberOfItemsPerPage}
                  onItemsPerPageChange={onItemsPerPageChange}
                  selectPageDropdownLabel={'Videos per page'}
                />
              </Card.Content>
            </Card>
          </DataTable> */}
        </View>
      )
    }
    else {
      return (
        <View style={GlobalStyles.marginYsm}>
          {googleDriveFiles.map((file) =>
          ((file.fileExtension === "MP4" || file.fileExtension === "mp4" || file.fileExtension === 'jpg') &&
            <GoogleVideoCard key={file.id} file={file} deleteDriveFile={deleteDriveFile} />
          )
          )}
        </View>
      )
    }
  }
  return (
    <ScrollView style={GlobalStyles.container}>
      <View style={[GlobalStyles.divDark, GlobalStyles.header, GlobalStyles.flex2]}>
        <Text variant='titleLarge' style={GlobalStyles.whiteText}>{selectedMenu === 0 ? 'Local Videos' : 'Cloud Videos'}</Text>
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
    </ScrollView>
  );
}
