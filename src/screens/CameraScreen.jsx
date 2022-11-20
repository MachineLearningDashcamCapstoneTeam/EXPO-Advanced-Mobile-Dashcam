import { StyleSheet, View, TouchableOpacity, Settings } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Camera, CameraType } from 'expo-camera';
import { Video } from 'expo-av';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import { ALBUM_NAME, DEFAULT_CAMERA_SETTINGS } from '../constants';
import CAMERA_IMG from'../../assets/header-alt.jpg';
import { gpsJsonToGeojson } from '../utils/geojson-utils';
import { Button, Text, Snackbar, IconButton, MD3Colors, Avatar } from 'react-native-paper';
import { useKeepAwake, activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import GlobalStyles from '../styles/global-styles';
import ErrorCameraCard from '../widget/errorCameraCard';

const CameraScreen = ({ navigation }) => {

  useKeepAwake();
  let cameraRef = useRef();
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [hasLocationPermission, setHasLocationPermission] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState();
  const [settings, setSettings] = useState(DEFAULT_CAMERA_SETTINGS)


  const saveVideoData = async (recordedVideo, gpsLocations) => {
    const expoAlbum = await MediaLibrary.getAlbumAsync(ALBUM_NAME)
    const video_asset = await MediaLibrary.createAssetAsync(recordedVideo.uri);
    const filename = `${FileSystem.documentDirectory}${video_asset.filename}.txt`;
    const gpsData = gpsJsonToGeojson(gpsLocations)
    await FileSystem.writeAsStringAsync(filename, JSON.stringify(gpsData), {
      encoding: FileSystem.EncodingType.UTF8
    });
    if (expoAlbum) {
      await MediaLibrary.addAssetsToAlbumAsync([video_asset], expoAlbum.id).then((result) => {
        console.log(result)
      });
    } else {
      await MediaLibrary.createAlbumAsync(ALBUM_NAME, video_asset).then((result) => {
        console.log(result)
      });
    }
    setVideo(null);
    if (settings.automaticRecording === true) {
      recordVideo();
    }
  };

  let recordVideo = async () => {
    if (!cameraRef) return;

    //* Clear Locations and Video
    setVideo(null);
    //* Set Location subscription
    //* Get location every second (1000 milliseconds)
    const tempLocations = [];
    let locSub = await Location.watchPositionAsync({
      accuracy: Location.Accuracy.High,
      timeInterval: 1000,
      distanceInterval: 0
    },
      (location) => {
        tempLocations.push(location);
      }
    );
    //* Set the camera options and made sure exif data is set
    let cameraOptions = {
      quality: settings.resolution,
      maxDuration: parseInt(settings.recordingLength) * 60,
      mute: false,
      exif: true,
    };
    setIsRecording(true);
    await cameraRef.current.recordAsync(cameraOptions).then((recordedVideo) => {
      setVideo(recordedVideo);
      setIsRecording(false);
      locSub.remove();
      saveVideoData(recordedVideo, tempLocations)
    }).catch((error) => {
      console.error(error);
    });
  };
  const setPermissions = async () => {
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    const locationPermission = await Location.requestForegroundPermissionsAsync();
    setHasCameraPermission(cameraPermission.status === "granted");
    setHasMicrophonePermission(microphonePermission.status === "granted");
    setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    setHasLocationPermission(locationPermission.status === "granted");


    setInitialValues();
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
    } catch (err) {
      Alert.alert('Unable to load Settings')
    }
  };

  const updateSetting = (updatedValue) => {
    setSettings(settings => ({
      ...settings,
      ...updatedValue
    }));
  }

  useEffect(() => {
    setPermissions();

    const unsubscribe = navigation.addListener('focus', () => {
      activateKeepAwake();
    });
    //* Activate keep awake so the screen never turns off

    return () => {
      setHasCameraPermission(null);
      setHasMicrophonePermission(null);
      setHasMediaLibraryPermission(null);
      setHasLocationPermission(null);
      setIsRecording(false);
      setVideo(null);
      //* Deactivate keep awake so the system never keeps running
      deactivateKeepAwake();
      unsubscribe;
    };
  }, []);
  //* If the application does not have permission, show an error
  if (hasCameraPermission === undefined || hasMicrophonePermission === undefined || hasLocationPermission === undefined) {
    return <Text>Request permissions...</Text>
  } else if (!hasCameraPermission || !hasMicrophonePermission || !hasLocationPermission) {
    return <ErrorCameraCard />
  }
  //* Stop the camera from recording.
  let stopRecording = () => {
    setIsRecording(false);
    cameraRef.current.stopRecording();
  };

  return (
    <View style={GlobalStyles.container}>
      <View style={[GlobalStyles.rowSpaceEven, GlobalStyles.divBlack]}>
        
        
      </View>
      <Camera zoom={settings.zoomLevel} style={[GlobalStyles.camera, GlobalStyles.flex6]} ref={cameraRef} onCameraReady={settings.automaticRecording === true ? recordVideo : null} quality={settings.resolution} type={settings.cameraType === 'Back' ? CameraType.back : CameraType.front} >


        <View></View>
        <View style={[GlobalStyles.borderRounded, GlobalStyles.rowSpaceEven, GlobalStyles.divBlackTrans]}>
          <Button labelStyle={{ color: settings.zoomLevel != 0 ? "white" : 'black' }}
            mode={settings.zoomLevel === 0 ? "elevated" : 'outline'}
            onPress={() => updateSetting({ 'zoomLevel': 0 })}>
            1x
          </Button>
          <Button labelStyle={{ color: settings.zoomLevel != 0.5 ? "white" : 'black' }}
            mode={settings.zoomLevel === 0.5 ? "elevated" : 'outline'}
            onPress={() => updateSetting({ 'zoomLevel': 0.5 })}>
            3x
          </Button>
          <Button style={GlobalStyles.button}
            labelStyle={{ color: settings.zoomLevel != 1 ? "white" : 'black' }}
            mode={settings.zoomLevel === 1 ? "elevated" : 'outline'}
            onPress={() => updateSetting({ 'zoomLevel': 1 })}>
            10x
          </Button>

        </View>
      </Camera>


      <View style={[GlobalStyles.rowSpaceEven, GlobalStyles.divBlack, GlobalStyles.flex1]}>
        <View style={[GlobalStyles.divCenter, GlobalStyles.container]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Avatar.Image size={45} source={ CAMERA_IMG } />
          </TouchableOpacity>
        </View>
        <IconButton
          icon={isRecording ? 'record' : 'record'}
          iconColor={isRecording ? MD3Colors.error50 : MD3Colors.neutral100}
          size={isRecording ? 100 : 100}
          onPress={isRecording ? stopRecording : recordVideo}
        />
        <View style={[GlobalStyles.divCenter, GlobalStyles.container]}>
          <IconButton
            icon={settings.cameraType === 'Back' ? 'orbit-variant' : 'orbit-variant'}
            iconColor={MD3Colors.neutral100}
            size={40}
            onPress={() => { settings.cameraType === 'Back' ? updateSetting({ 'cameraType': 'Front' }) : updateSetting({ 'cameraType': 'Back' }) }}
          />
        </View>
      </View>
      <Snackbar
        visible={snackBarVisible}
        onDismiss={() => setSnackBarVisible(false)}
        duration={3000}
        action={{
          label: 'Close',
        }}>
        Recording Started
      </Snackbar>
    </View>
  );
}

export default CameraScreen;