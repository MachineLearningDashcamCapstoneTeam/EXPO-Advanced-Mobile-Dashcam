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
import LockButton from '../widget/lockButton';

export default function VideoPlayerScreen({ route, navigation }) {
  const { videoAsset } = route.params;
  const video = useRef(null);
  const [savedFavoriteVideosIds, setSavedFavoriteVideosIds] = useState([]);
  const [status, setStatus] = useState({});
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();

  //* Set the permissions for the screen
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
    const filename = `${FileSystem.documentDirectory}${videoAsset.filename}.txt`;
    const result = await FileSystem.readAsStringAsync(filename, {
      encoding: FileSystem.EncodingType.UTF8
    });
    //! Somehow share video and coordinates together
    console.log(result);
    shareAsync(filename).then(() => {
    });
  };
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
            Alert.alert("Video successfully deleted");
            navigation.goBack();
          } else {
            Alert.alert("Failed to delete video");
          }
        })
    }
    else {
      Alert.alert("Video is Locked");
    }
  }
  return (
    <ScrollView style={GlobalStyles.container}>
      <View style={[GlobalStyles.divDark, GlobalStyles.header]}>
        <Text variant='titleLarge' style={GlobalStyles.whiteText}>
          {videoAsset.id}
        </Text>
        <Text style={[GlobalStyles.paddingYsm, GlobalStyles.whiteText]} variant='labelMedium'>
          Path: {videoAsset.uri}
        </Text>
        <Button style={GlobalStyles.button} mode="contained" onPress={() =>
          status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
        }
          icon={status.isPlaying ? 'pause' : 'play'}
        >{status.isPlaying ? 'Pause' : 'Play'}</Button>
      </View>
      <View style={GlobalStyles.flex5}>

        <Card key={videoAsset.id} mode="elevated" style={[GlobalStyles.borderRounded, GlobalStyles.marginYsm]}>
          <Card.Content>
            <Video
              ref={video}
              style={GlobalStyles.video}
              source={{ uri: (Platform.OS === "android") ? videoAsset.uri : videoAsset.localUri }}
              useNativeControls
              resizeMode='cover'
              isLooping
              onPlaybackStatusUpdate={status => setStatus(() => status)}
            />

            <View style={[GlobalStyles.marginYsm]}>
              <Text variant='labelMedium'>
                Album Id: {videoAsset.albumId}
              </Text>

              <Text variant='labelMedium'>
                Created: {timeStampToDate(videoAsset.creationTime)}
              </Text>
              <Text variant='labelMedium'>
                Modified: {timeStampToDate(videoAsset.modificationTime)}
              </Text>
              <Text variant='labelMedium'>
                Duration: {videoAsset.duration}s
              </Text>

              <Text variant='labelMedium'>
                Media Type: {videoAsset.mediaType}
              </Text>
              <Text variant='labelMedium'>
                Size: {videoAsset.height} x {videoAsset.width}
              </Text>

            </View>

            <View style={[GlobalStyles.rowContainer, GlobalStyles.marginYsm]}>
              <View style={GlobalStyles.buttonContainer}>

                <LockButton savedFavoriteVideosIds={savedFavoriteVideosIds} videoAsset={videoAsset} deleteVideoFromFavoriteVideos={deleteVideoFromFavoriteVideos} saveVideoToSavedVideoIds={saveVideoToSavedVideoIds} />

              </View>
              <View style={GlobalStyles.buttonContainer}>
                <Button style={[GlobalStyles.buttonMain, GlobalStyles.button]} icon="share" mode="contained" onPress={shareVideo} >Share</Button>
              </View>
              <View style={GlobalStyles.buttonContainer}>
                <Button style={[GlobalStyles.buttonMain, GlobalStyles.button]} icon="map" mode="contained" onPress={() => navigation.navigate('Map', { videoAsset: videoAsset })} >Map</Button>
              </View>
            </View>

            <View style={[GlobalStyles.divLine, GlobalStyles.marginYsm]} />

            <View style={[GlobalStyles.marginYsm]}>
              <Button style={[GlobalStyles.button]} icon="delete" mode="elevated" onPress={() => deleteVideo(videoAsset)} >Delete </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}
