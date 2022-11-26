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
import { uploadDashcamVideos, uploadGoogleDriveFile } from '../services/googleDriveService';
import { AccessContext } from '../context/accessTokenContext';
import { useContext } from 'react';
import NetInfo from "@react-native-community/netinfo";
import { DEFAULT_CAMERA_SETTINGS, ALBUM_NAME, AMD_SETTINGS, FAVORITE_VIDEOS_IDS } from '../constants';
import * as Sharing from "expo-sharing";
import {decode as atob, encode as btoa} from 'base-64'

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
    else {
      Alert.alert('Media Library Permission is not granted')
    }
  }

  const setInitialValues = async () => {

    try {
      let tempSettings = await AsyncStorage.getItem(AMD_SETTINGS)
      tempSettings = JSON.parse(tempSettings)
      if (tempSettings && Object.keys(tempSettings).length >= 1 && Object.getPrototypeOf(tempSettings) === Object.prototype) {
        setSettings(tempSettings);
      }
      else {
        setSettings(DEFAULT_CAMERA_SETTINGS);
      }

      setVideo(videoAsset);
    } catch (err) {
      Alert.alert('Unable to load Settings')
    }
  };


  useEffect(() => {
    setPermissions();
  }, []);


  const loadFavorites = async () => {
    //* Load Favorite videos
    const tempSavedFavoriteVideosIds = await AsyncStorage.getItem(FAVORITE_VIDEOS_IDS);
    if (tempSavedFavoriteVideosIds && tempSavedFavoriteVideosIds !== null) {
      const tempSavedFavoriteVideosIdsArray = JSON.parse(tempSavedFavoriteVideosIds)
      setSavedFavoriteVideosIds([...tempSavedFavoriteVideosIdsArray]);
    }
  }




  const saveToGoogleDrive = async () => {

    let connection = await NetInfo.fetch();
    if (connection.type === 'wifi' || settings.allowUploadWithMobileData) {

      //* Get the video
      let videoAssetData = await FileSystem.readAsStringAsync(videoAsset.uri , { encoding: FileSystem.EncodingType.Base64 });

      //* Get the text file 
      const filename = `${FileSystem.documentDirectory}${videoAsset.filename}.txt`;
      const GeoJSON = await FileSystem.readAsStringAsync(filename, {
        encoding: FileSystem.EncodingType.UTF8
      });


      //* Upload the video
      const response = await uploadDashcamVideos(accessTokenContextValue, videoAsset, videoAssetData, GeoJSON)
      if (response.status === 200) {
        Alert.alert("Successfully uploaded video to Google Drive");
      }
      else {
        console.log(response)
        Alert.alert('Unable to upload');
      }

    }
    else {
      Alert.alert(`You are currently on a ${connection.type}! Your settings only allow uploading on a WIFI network.`);
    }


  }

  const shareWithSimpleShare = async () => {
    try {

      let connection = await NetInfo.fetch();
      if (connection.type === 'wifi' || settings.allowUploadWithMobileData) {
        const UTI = 'public.item';
        await  Sharing.shareAsync(videoAsset.uri, {UTI});
      }
      else {
        Alert.alert(`You are currently on a ${connection.type}! Your settings only allow uploading on a WIFI network.`);
      }

    }
    catch (err) {
      Alert.alert(err);
    }
  }


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

        <Text style={[GlobalStyles.paddingYsm, GlobalStyles.whiteText]} variant='titleMedium'>
          Created on: {timeStampToDate(video.creationTime)}
        </Text>

      </View>
      <View style={GlobalStyles.flex5}>

        <Card key={video.id} mode="elevated" style={[GlobalStyles.borderRounded, GlobalStyles.marginYsm]}>
          <Card.Content>



            <View style={[GlobalStyles.rowContainerWrap, GlobalStyles.marginYsm]}>
              <View style={GlobalStyles.buttonContainer}>
                <LockButton savedFavoriteVideosIds={savedFavoriteVideosIds} videoAsset={video} deleteVideoFromFavoriteVideos={deleteVideoFromFavoriteVideos} saveVideoToSavedVideoIds={saveVideoToSavedVideoIds} />
              </View>
              <View style={GlobalStyles.buttonContainer}>
                <Button style={[GlobalStyles.buttonMain, GlobalStyles.button]} icon="share" mode="contained" onPress={shareWithSimpleShare}>Share Video</Button>
              </View>
            </View>

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
                Duration: {video.duration}s
              </Text>

              <Text variant='labelMedium'>
                Size: {video.height} x {video.width}
              </Text>

              <Text variant='labelMedium'>
                Created on: {timeStampToDate(video.creationTime)}
              </Text>


              <Text variant='labelMedium'>
                Last Modified: {timeStampToDate(video.modificationTime)}
              </Text>

            </View>

            <View style={[GlobalStyles.rowContainerWrap, GlobalStyles.marginYsm]}>
              {accessTokenContextValue && <View style={GlobalStyles.buttonContainer}>
                <Button style={[GlobalStyles.buttonMain, GlobalStyles.button]} icon="share" mode="contained" onPress={saveToGoogleDrive} >Save to Google Drive</Button>
              </View>}

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
