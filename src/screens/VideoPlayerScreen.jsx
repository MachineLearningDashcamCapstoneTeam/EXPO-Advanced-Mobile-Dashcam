import { useEffect, useState, useRef } from 'react';
import * as MediaLibrary from 'expo-media-library'
import { View, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { Card, Button, Title, Text, Divider, IconButton, MD3Colors } from 'react-native-paper';
import { Video } from 'expo-av';
import { timeStampToDate } from '../utils/fetch-time';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyles from '../styles/global-styles';
import LockButton from '../widget/lockButton';
import { uploadDashcamVideosAndGpsData, uploadGoogleDriveFile } from '../services/googleDriveService';
import { AccessContext } from '../context/accessTokenContext';
import { useContext } from 'react';
import NetInfo from "@react-native-community/netinfo";
import { DEFAULT_CAMERA_SETTINGS, ALBUM_NAME, AMD_SETTINGS, FAVORITE_VIDEOS_IDS } from '../constants';
import * as Sharing from "expo-sharing";
import { decode as atob, encode as btoa } from 'base-64'

export default function VideoPlayerScreen({ route, navigation }) {
  const { accessTokenContextValue, setAccessTokenContextValue } = useContext(AccessContext);
  const { videoAsset } = route.params;

  const [video, setVideo] = useState({});
  const [geojsonExists, setGeojsonExists] = useState(false);
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


      loadGPSData();

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




  let loadGPSData = async () => {
    try {
      //* Get the file from the documents directory
      const filename = `${FileSystem.documentDirectory}${videoAsset.filename}.txt`;
      const result = await FileSystem.readAsStringAsync(filename, {
        encoding: FileSystem.EncodingType.UTF8
      });
      if (result) {
        setGeojsonExists(true);
      }
      else {
        setGeojsonExists(false);
      }

    }
    catch (error) {
      setGeojsonExists(false);
    }
  };



  const saveToGoogleDrive = async () => {

    let connection = await NetInfo.fetch();
    if (connection.type === 'wifi' || settings.allowUploadWithMobileData) {

      //* Get the video
      let videoAssetData = await FileSystem.readAsStringAsync(videoAsset.uri, { encoding: FileSystem.EncodingType.Base64 });

      //* Get the text file 
      const filename = `${FileSystem.documentDirectory}${videoAsset.filename}.txt`;
      const GeoJSON = await FileSystem.readAsStringAsync(filename, {
        encoding: FileSystem.EncodingType.UTF8
      });


      //* Upload the video
      const response = await uploadDashcamVideosAndGpsData(accessTokenContextValue, videoAsset, videoAssetData, GeoJSON)
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
        await Sharing.shareAsync(videoAsset.uri, { UTI });
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



  const getDotIfGeojsonExists = () => {
    if (geojsonExists) {
      return (<Text variant='bodySmall' style={[GlobalStyles.smallGreenDot]} >{'\u2B24'} GPS Data Exists</Text>)
    }
    else {
      return (<Text variant='bodySmall' style={[GlobalStyles.smallRedDot]} >{'\u2B24'} GPS Data does not exist</Text>)
    }
  }

  return (
    <ScrollView style={[GlobalStyles.container]}>
      <View style={[GlobalStyles.divMain, GlobalStyles.paddingXmd, GlobalStyles.paddingYmd]}>

        <Text style={[GlobalStyles.paddingYsm, GlobalStyles.whiteText]} variant='titleLarge'>
          Created on: {timeStampToDate(video.creationTime)}
        </Text>

        <Text style={[GlobalStyles.paddingYsm, GlobalStyles.whiteText]} variant="bodySmall">
          Local Videos are stored in the App's Documents Directory alongside a GeoJSON file.
        </Text>

      </View>

      <View style={[GlobalStyles.rowSpaceEven, GlobalStyles.divBlack]}>


        <IconButton
          icon={'trash-can-outline'}
          iconColor={MD3Colors.neutral100}
          size={22}
          onPress={() => deleteVideo(video)}
        />
        <IconButton
          icon={'map'}
          iconColor={MD3Colors.neutral100}
          size={22}
          onPress={() => navigation.navigate('Map', { videoAsset: video })}
        />

        <LockButton savedFavoriteVideosIds={savedFavoriteVideosIds} videoAsset={video} deleteVideoFromFavoriteVideos={deleteVideoFromFavoriteVideos} saveVideoToSavedVideoIds={saveVideoToSavedVideoIds} />

        <IconButton
          icon={'share'}
          iconColor={MD3Colors.neutral100}
          size={22}
          onPress={shareWithSimpleShare}
        />

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


      <View style={[GlobalStyles.flex1, GlobalStyles.divWhite]}>

        <Card style={[GlobalStyles.divWhite, GlobalStyles.roundedTop, GlobalStyles.roundedBottom]}>
          <Card.Content>

            <Text variant='titleLarge'>
              Details
            </Text>

            <Divider style={[GlobalStyles.marginYsm]} />

            <Text variant='bodySmall'>
              Duration: {video.duration}s
            </Text>

            <Text variant='bodySmall'>
              Size: {video.height} x {video.width}
            </Text>

            <Text variant='bodySmall'>
              Created on: {timeStampToDate(video.creationTime)}
            </Text>



            <Text variant='bodySmall'>
              {getDotIfGeojsonExists()}
            </Text>




            <Divider style={[GlobalStyles.marginYsm]} />
            <View style={[GlobalStyles.rowContainerWrap, GlobalStyles.marginYsm]}>
              {accessTokenContextValue && <View style={GlobalStyles.buttonContainer}>
                <Button style={[GlobalStyles.button]} icon="share" mode="contained" onPress={saveToGoogleDrive} >Save to Google Drive</Button>
              </View>}
            </View>

          </Card.Content>
        </Card>


      </View>

    </ScrollView>
  );
}
