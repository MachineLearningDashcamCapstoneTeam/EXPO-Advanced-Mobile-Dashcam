import { useEffect, useState, useRef } from 'react';
import * as MediaLibrary from 'expo-media-library'
import { View, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { Card, Button, Title, Text } from 'react-native-paper';
import { Video } from 'expo-av';
import { timeStampToDate } from '../utils/fetch-time';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyles from '../styles/global-styles';

export default function VideoPlayerScreen({ route, navigation }) {
  const { assetInfo } = route.params;
  const video = useRef(null);
  const [savedFavoriteVideosIds, setSavedFavoriteVideosIds] = useState([]);
  const [status, setStatus] = useState({});
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();

  const setPermissions = async () => {
    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    if (mediaLibraryPermission.status === 'granted') {
      loadFavorites();
    }
  }
  useEffect(() => {
    setPermissions();
  }, []);

  const loadFavorites = async () => {
    //* Load Favorite videos
    const tempSavedFavoriteVideosIds = await AsyncStorage.getItem('FavoriteVideosIds');
    if (tempSavedFavoriteVideosIds && tempSavedFavoriteVideosIds !== null) {
      const tempSavedFavoriteVideosIdsArray = JSON.parse(tempSavedFavoriteVideosIds)
      setSavedFavoriteVideosIds([...tempSavedFavoriteVideosIdsArray]);
    }
  }
  const shareVideo = async () => {
    const filename = `${FileSystem.documentDirectory}${assetInfo.filename}.txt`;
    const result = await FileSystem.readAsStringAsync(filename, {
      encoding: FileSystem.EncodingType.UTF8
    });
    //! Somehow share video and coordinates together
    console.log(result);
    shareAsync(filename).then(() => {
    });
  };

  const saveVideoToSavedVideoIds = async (videoAsset) => {
    const result = savedFavoriteVideosIds.includes(videoAsset.id);
    if (result === false) {
      //* Video does not exist is saved videos list
      let tempSavedFavoriteVideosIds = savedFavoriteVideosIds;
      tempSavedFavoriteVideosIds.push(videoAsset.id);
      const tempSavedFavoriteVideosIdsString = JSON.stringify(tempSavedFavoriteVideosIds);
      await AsyncStorage.setItem('FavoriteVideosIds', tempSavedFavoriteVideosIdsString);
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
      setSavedFavoriteVideosIds([...tempSavedFavoriteVideosIds]);
      Alert.alert("Deleted video from Favorites");
    }
  }

  const deleteVideo = () => {
    //* If the user has permission, load the video data
    if (hasMediaLibraryPermission) {
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
  }

  //* Create the favorites button
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

  return (
    <ScrollView style={GlobalStyles.container}>
      <View style={[GlobalStyles.divDark, GlobalStyles.header]}>
        <Text variant='titleLarge' style={GlobalStyles.whiteText}>
          {assetInfo.id}
        </Text>
        <Text style={[GlobalStyles.paddingYsm, GlobalStyles.whiteText]} variant='labelSmall'>
          Path: {assetInfo.uri}
        </Text>
        <Button style={GlobalStyles.button} mode="contained" onPress={() =>
          status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
        }
          icon={status.isPlaying ? 'pause' : 'play'}
        >{status.isPlaying ? 'Pause' : 'Play'}</Button>

      </View>
      <View style={[GlobalStyles.flex3]}>
        <Video
          ref={video}
          style={GlobalStyles.video}
          source={{ uri: (Platform.OS === "android") ? assetInfo.uri : assetInfo.localUri }}
          useNativeControls
          resizeMode='contain'
          isLooping
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
        <Text variant='labelSmall'>
          Created: {timeStampToDate(assetInfo.creationTime)}
        </Text>
        <Text variant='labelSmall'>
          Duration: {assetInfo.duration}s
        </Text>
        <Text variant='labelSmall'>
          Size: {assetInfo.height} x {assetInfo.width}
        </Text>
      </View>

      <View style={[GlobalStyles.divDark, GlobalStyles.attention, GlobalStyles.flex3]}>
        <Text style={[GlobalStyles.paddingYsm, GlobalStyles.whiteText]} variant='labelLarge'>
           Options:
          </Text>

        <View style={[GlobalStyles.divSpaceBetween, GlobalStyles.rowContainer]}>
          {getSaveOrDeleteFromFavoritesButton(assetInfo)}
          <Button style={[GlobalStyles.buttonSecondary, GlobalStyles.button]} icon="share" mode="contained" onPress={shareVideo} >Share</Button>

          <Button style={[GlobalStyles.buttonWarning, GlobalStyles.button]} icon="map" mode="contained" onPress={() => navigation.navigate('Map', { assetInfo: assetInfo })} >Map</Button>
        </View>

        <Text style={[GlobalStyles.paddingYsm, GlobalStyles.whiteText]} variant='labelLarge'>
          Warning! Point of no return:
        </Text>
        <Button style={[GlobalStyles.buttonDanger, GlobalStyles.button]} icon="delete" mode="contained" onPress={deleteVideo} >Delete </Button>

      </View>

    </ScrollView>
  );
}
