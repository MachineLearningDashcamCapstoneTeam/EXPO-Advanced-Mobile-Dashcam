import { StyleSheet, View, SafeAreaView } from 'react-native';
import { useEffect, useState, useRef } from 'react'; import AsyncStorage from '@react-native-async-storage/async-storage'
import { Camera, CameraType } from 'expo-camera';
import { Video } from 'expo-av';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import { ALBUM_NAME } from '../constants';
import { gpsJsonToGeojson } from '../utils/geojson-utils';
import { Button, Text, Snackbar, SegmentedButtons, Divider } from 'react-native-paper';
import {useKeepAwake} from 'expo-keep-awake';
import {activateKeepAwake, deactivateKeepAwake} from 'expo-keep-awake';
import GlobalStyles from '../styles/global-styles';

const CameraScreen = () => {

  useKeepAwake();
  let cameraRef = useRef();

  const [snackBarVisible, setSnackBarVisible] = useState(false);

  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [hasLocationPermission, setHasLocationPermission] = useState();

  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState();

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
    console.log(`selectedAutomaticRecording ${selectedAutomaticRecording}`)
    if(selectedAutomaticRecording === 'true'){   
      recordVideo();
    } 
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



    if (cameraPermission && cameraRef !== undefined) {
     console.log('Camera Set')
    }
    else {
      console.log('Does not have Camera Granted');
    }

  }
  


  useEffect(() => {
    setPermissions();
  
    //todo Activate keep awake here (Delete comment when done)
    

    
      activateKeepAwake();
      alert('Activated')
    
    return () => {
      setHasCameraPermission(null);
      setHasMicrophonePermission(null);
      setHasMediaLibraryPermission(null);
      setHasLocationPermission(null);

      setIsRecording(false);
      setVideo(null);

      //todo deactivate keep awake here (delete comment when done)
    
        deactivateKeepAwake();
        alert('Deactivated');
      

    };
  }, []);



  if (hasCameraPermission === undefined || hasMicrophonePermission === undefined || hasLocationPermission === undefined) {
    return <Text>Request permissions...</Text>
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted.</Text>
  }


  let stopRecording = () => {
    setIsRecording(false);
    cameraRef.current.stopRecording();
  
  };

  return (
    <View style={GlobalStyles.camera}>

      <Camera style={GlobalStyles.camera} ref={cameraRef} onCameraReady={selectedAutomaticRecording === 'true' ? recordVideo : null} quality={selectedResolution} type={selectedCameraType === 'Back' ? CameraType.back : CameraType.front} >
        <View style={GlobalStyles.buttonContainer}>
          <Button style={GlobalStyles.button} icon="camera" mode="contained" onPress={isRecording ? stopRecording : recordVideo} >{isRecording ? "Stop Recording" : "Record Video"} </Button>
        </View>
      </Camera>

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