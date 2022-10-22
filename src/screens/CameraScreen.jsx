import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Camera, CameraType } from 'expo-camera';
import { Video } from 'expo-av';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import { ALBUM_NAME, CAMERA_IMG } from '../constants';
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
  const [gpsPosition, setGpsPosition] = useState({});
  const [selectedResolution, setSelectedResolution] = useState('480p');
  const [selectedCameraType, setSelectedCameraType] = useState('Back');
  const [selectedZoom, setSelectedZoom] = useState('0');
  const [selectedRecordingLength, setSelectedRecordingLength] = useState('1');
  const [selectedMaxVideoFileSize, setSelectedMaxVideoFileSize] = useState('0');
  const [selectedAutomaticRecording, setSelectedAutomaticRecording] = useState('false');
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
    if (selectedAutomaticRecording === 'true') {
      recordVideo();
    }
    setGpsPosition({});
  };
  let recordVideo = async () => {
    if (!cameraRef) return;
    console.log('Camera Granted');
    console.log(`Resolution ${selectedResolution}`)
    console.log(`cam type ${selectedCameraType}`)
    console.log(`zoom ${selectedZoom}`)
    console.log(`record length ${selectedRecordingLength}`)
    console.log(`max size ${selectedMaxVideoFileSize}`)
    console.log(`auto record ${selectedAutomaticRecording}`)
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
        setGpsPosition(location);
      }
    );
    //* Set the camera options and made sure exif data is set
    let cameraOptions = {
      quality: selectedResolution,
      maxDuration: parseInt(selectedRecordingLength) * 60,
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
    const tempResolution = await AsyncStorage.getItem('CameraResolution')
    if (tempResolution !== null || tempResolution !== '') {
      setSelectedResolution(tempResolution);
    }
    else {
      setSelectedResolution('480p');
    }
    const tempCameraType = await AsyncStorage.getItem('CameraType')
    if (tempCameraType !== null || tempCameraType !== '') {
      setSelectedCameraType(tempCameraType);
    }
    else {
      setSelectedCameraType('Back');
    }
    const tempZoom = await AsyncStorage.getItem('CameraZoom')
    if (tempZoom !== null || tempZoom !== '') {
      setSelectedZoom(tempZoom);
    }
    else {
      setSelectedZoom('0');
    }
    const tempRecordingLength = await AsyncStorage.getItem('RecordingLength')
    if (tempRecordingLength !== null || tempRecordingLength !== '') {
      setSelectedRecordingLength(tempRecordingLength);
    }
    else {
      setSelectedRecordingLength('1')
    }
    const tempMaxVideoFileSize = await AsyncStorage.getItem('MaxVideoFileSize')
    if (tempMaxVideoFileSize !== null || tempMaxVideoFileSize !== '') {
      setSelectedMaxVideoFileSize(tempMaxVideoFileSize);
    }
    else {
      setSelectedMaxVideoFileSize('4294967296');
    }
    const tempAutomaticRecording = await AsyncStorage.getItem('AutomaticRecording')
    if (tempAutomaticRecording !== null || tempAutomaticRecording !== '') {
      setSelectedAutomaticRecording(tempAutomaticRecording);
    }
    else {
      setSelectedAutomaticRecording('false');
    }
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
    setGpsPosition({});
  };

  const getGPSMessage = () => {
    if (gpsPosition && Object.keys(gpsPosition).length >= 1 && Object.getPrototypeOf(gpsPosition) === Object.prototype) {
      return (
        <View>
          <View style={[GlobalStyles.marginYsm]}>
            <Text variant='labelLarge' style={[GlobalStyles.whiteText]}>
              Speed and Location:
            </Text>
            <Text variant='labelLarge' style={[GlobalStyles.whiteText]}>
              {(gpsPosition.coords.speed).toFixed(2)} KM/H N{gpsPosition.coords.latitude} W{gpsPosition.coords.longitude}
            </Text>
          </View>
          <View style={[GlobalStyles.marginYsm]}>
            <Text variant='labelLarge' style={[GlobalStyles.whiteText]}>
              Date and Time:
            </Text>
            <Text variant='labelLarge' style={[GlobalStyles.whiteText]}>
              {(new Date()).toISOString().replace(/[^0-9]/g, "").slice(0, -3)}
            </Text>
          </View>
        </View>
      )
    }
    else {
      return (<View>
        <View style={[GlobalStyles.marginYsm]}>
          <Text variant='labelLarge' style={[GlobalStyles.whiteText]}>
            Speed and Location:
          </Text>
          <Text variant='labelLarge' style={[GlobalStyles.whiteText]}>
            N/A
          </Text>
        </View>
        <View style={[GlobalStyles.marginYsm]}>
          <Text variant='labelLarge' style={[GlobalStyles.whiteText]}>
            Date and Time:
          </Text>
          <Text variant='labelLarge' style={[GlobalStyles.whiteText]}>
            {(new Date()).toISOString().replace(/[^0-9]/g, "").slice(0, -3)}
          </Text>
        </View>
      </View>
      )
    }
  }
  return (
    <View style={GlobalStyles.container}>
      <View style={[GlobalStyles.rowSpaceEven, GlobalStyles.divBlack]}>
        <IconButton
          icon={'cog'}
          iconColor={MD3Colors.neutral100}
          size={22}
          onPress={() => navigation.goBack()}
        />
         <IconButton
          icon={'flash'}
          iconColor={MD3Colors.neutral100}
          size={22}
          onPress={() => navigation.goBack()}
        />
         <IconButton
          icon={'timer'}
          iconColor={MD3Colors.neutral100}
          size={22}
          onPress={() => navigation.goBack()}
        />
        <IconButton
          icon={'aspect-ratio'}
          iconColor={MD3Colors.neutral100}
          size={22}
          onPress={() => navigation.goBack()}
        />

        <IconButton
          icon={'grid'}
          iconColor={MD3Colors.neutral100}
          size={22}
          onPress={() => navigation.goBack()}
        />
        <IconButton
          icon={'help-circle-outline'}
          iconColor={MD3Colors.neutral100}
          size={22}
          onPress={() => navigation.goBack()}
        />
      </View>
      <Camera zoom={parseInt(selectedZoom)} style={[GlobalStyles.camera, GlobalStyles.flex6]} ref={cameraRef} onCameraReady={selectedAutomaticRecording === 'true' ? recordVideo : null} quality={selectedResolution} type={selectedCameraType === 'Back' ? CameraType.back : CameraType.front} >
        {getGPSMessage()}


        <View style={[GlobalStyles.borderRounded, GlobalStyles.rowSpaceEven, GlobalStyles.divBlackTrans]}>
          <Button style={GlobalStyles.button} labelStyle={{ color: "white" }} mode="outline" >
            1x
          </Button>
          <Button style={GlobalStyles.button} mode="elevated" >
            2x
          </Button>
          <Button style={GlobalStyles.button} labelStyle={{ color: "white" }} mode="outline" >
            3x
          </Button>
          <Button style={GlobalStyles.button} labelStyle={{ color: "white" }} mode="outline" >
            10x
          </Button>
        </View>
      </Camera>


      <View style={[GlobalStyles.rowSpaceEven, GlobalStyles.divBlack, GlobalStyles.flex1]}>
        <View style={[GlobalStyles.divCenter, GlobalStyles.container]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Avatar.Image size={45} source={{ uri: CAMERA_IMG }} />
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
            icon={selectedCameraType === 'Back' ? 'orbit-variant' : 'orbit-variant'}
            iconColor={MD3Colors.neutral100}
            size={40}
            onPress={() => { selectedCameraType === 'Back' ? setSelectedCameraType('Front') : setSelectedCameraType('Back') }}
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