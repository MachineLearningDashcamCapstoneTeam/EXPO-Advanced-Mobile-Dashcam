import { useEffect, useState, useRef } from 'react';
import * as MediaLibrary from 'expo-media-library'
import { View, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { Card, Button, Title, Text } from 'react-native-paper';
import { Video } from 'expo-av';
import { timeStampToDate } from '../utils/fetch-time';
import { shareAsync } from 'expo-sharing';
import { DEFAULT_CAMERA_SETTINGS } from '../constants';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyles from '../styles/global-styles';
import LockButton from '../widget/lockButton';
import { uploadDashcamVideos, uploadGoogleDriveFile } from '../services/googleDriveService';
import { AccessContext } from '../context/accessTokenContext';
import { useContext } from 'react';
import NetInfo from "@react-native-community/netinfo";

export default function VideoPlayerScreen({ route, navigation }) {
  const { accessTokenContextValue, setAccessTokenContextValue } = useContext(AccessContext);
  const { videoAsset } = route.params;

  const [video, setVideo] = useState({});
  const videoPlayer = useRef(null);
  const [savedFavoriteVideosIds, setSavedFavoriteVideosIds] = useState([]);
  const [status, setStatus] = useState({});
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [settings, setSettings] = useState(DEFAULT_CAMERA_SETTINGS)


  //* Set the permissions for the screen
  const setPermissions = async () => {
    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    if (mediaLibraryPermission.status === 'granted') {
      loadFavorites();
      setInitialValues();
    }
  }

  const setInitialValues = async () => {

    try {
      let tempSettings = await AsyncStorage.getItem('AMD_Settings')
      tempSettings = JSON.parse(tempSettings)
      if (tempSettings && Object.keys(tempSettings).length >= 1 && Object.getPrototypeOf(tempSettings) === Object.prototype) {
        setSettings(tempSettings);
      }
      else {
        setSettings(DEFAULT_CAMERA_SETTINGS);
      }

      setVideoSDetails();
    } catch (err) {
      Alert.alert('Unable to load Settings')
    }
  };

  const setVideoSDetails = () => {

    let tempVideo = videoAsset;
    tempVideo.duration = tempVideo.duration.toFixed(2);
    tempVideo.creationTime = timeStampToDate(tempVideo.creationTime)
    tempVideo.modificationTime = timeStampToDate(tempVideo.modificationTime)
    setVideo(tempVideo);

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


  const shareWithGoogleDrive = async () => {

    //! check internet stuff here

    //* Get the video
    const videoAssetData = await FileSystem.readAsStringAsync(videoAsset.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const videoAssetInfo = await FileSystem.getInfoAsync(videoAsset.uri);

    //* Get the text file 
    const filename = `${FileSystem.documentDirectory}${videoAsset.filename}.txt`;
    const GeoJSON = await FileSystem.readAsStringAsync(filename, {
      encoding: FileSystem.EncodingType.UTF8
    });


    shareAsync(videoAsset.uri);

    const response = uploadDashcamVideos(accessTokenContextValue, videoAsset, videoAssetData, videoAssetInfo.fileSize, GeoJSON)
    if (response.status === 200) {
      Alert.alert("Successfully uploaded video to Google Drive");
    }
    else {
      Alert.alert(response.message);
    }


  }

  const shareWithSimpleShare = async () => {
    try {

      //! Simple share stuff. Share video with email, etc.

      shareAsync([videoAsset.uri]);
    }
    catch (err) {
      Alert.alert(err);
    }
  }

  const shareVideo = async () => {


    let connection = await NetInfo.fetch();
    console.log("Connection type", connection.type);
    console.log("Is connected?", connection.isConnected);

    if (connection.type === 'wifi') {
      console.log('sharing');
      if (accessTokenContextValue) {
        shareWithGoogleDrive();
      }
      else {
        shareWithSimpleShare();
      }

    }

    if (connection.type === 'cellular') {
      if (settings.allowUploadWithMobileData) {
        console.log('Sharing with a cellular network');
        //shareWithGoogleDrive();
      }
      else {
        console.log('Settings does not permit sharing with a Cellular Network');
      }
    }
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
            //* Also delete the video from favorites
            deleteVideoFromFavoriteVideos(videoAsset);
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
      <View style={[GlobalStyles.divDark, GlobalStyles.header, GlobalStyles.flex2]}>
        <Text variant='titleLarge' style={GlobalStyles.whiteText}>
          {video.id}
        </Text>
        <Text style={[GlobalStyles.paddingYsm, GlobalStyles.whiteText]} variant='labelMedium'>
          Path: {video.uri}
        </Text>

      </View>
      <View style={GlobalStyles.flex5}>

        <Card key={video.id} mode="elevated" style={[GlobalStyles.borderRounded, GlobalStyles.marginYsm]}>
          <Card.Content>


            <Video
              ref={videoPlayer}
              style={GlobalStyles.video}
              source={{ uri: (Platform.OS === "android") ? video.uri : video.localUri }}
              useNativeControls
              resizeMode='cover'
              isLooping
              onPlaybackStatusUpdate={status => setStatus(() => status)}
            />

            <View style={[GlobalStyles.marginYsm]}>
              <Text variant='labelMedium'>
                Album Id: {video.albumId}
              </Text>

              <Text variant='labelMedium'>
                Created: {video.creationTime}
              </Text>
              <Text variant='labelMedium'>
                Modified: {video.modificationTime}
              </Text>
              <Text variant='labelMedium'>
                Duration: {video.duration}s
              </Text>

              <Text variant='labelMedium'>
                Media Type: {video.mediaType}
              </Text>
              <Text variant='labelMedium'>
                Size: {video.height} x {video.width}
              </Text>

            </View>

            <View style={[GlobalStyles.rowContainerWrap, GlobalStyles.marginYsm]}>
              <View style={GlobalStyles.buttonContainer}>

                <LockButton savedFavoriteVideosIds={savedFavoriteVideosIds} videoAsset={video} deleteVideoFromFavoriteVideos={deleteVideoFromFavoriteVideos} saveVideoToSavedVideoIds={saveVideoToSavedVideoIds} />

              </View>
              <View style={GlobalStyles.buttonContainer}>
                <Button style={[GlobalStyles.buttonMain, GlobalStyles.button]} icon="share" mode="contained" onPress={shareVideo} >Share</Button>
              </View>
              <View style={GlobalStyles.buttonContainer}>
                <Button style={[GlobalStyles.button]} icon="map" mode="outlined" onPress={() => navigation.navigate('Map', { videoAsset: video })} >Map</Button>
              </View>
            </View>

            <View style={[GlobalStyles.divLine, GlobalStyles.marginYsm]} />

            <View style={[GlobalStyles.marginYsm]}>
              <Button style={[GlobalStyles.buttonDangerOutline]} labelStyle={{ color: '#DF2935' }} icon="delete" mode="outlined" onPress={() => deleteVideo(video)} >Delete </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}
