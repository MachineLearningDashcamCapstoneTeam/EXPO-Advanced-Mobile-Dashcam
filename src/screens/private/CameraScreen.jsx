import { StyleSheet, View, SafeAreaView } from 'react-native';
import { useEffect, useState, useRef } from 'react'; import AsyncStorage from '@react-native-async-storage/async-storage'
import { Camera , CameraType} from 'expo-camera';
import { Video } from 'expo-av';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import { ALBUM_NAME } from '../../constants';
import { gpsJsonToGeojson } from '../../utils/geojson-utils';
import { Button, Text, Divider } from 'react-native-paper';

const CameraScreen = () => {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [hasLocationPermission, setHasLocationPermission] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState();
  const [locations, setLocations] = useState([]);


  const [selectedResolution, setSelectedResolution] = useState('480p');
  const [selectedCameraType, setSelectedCameraType] = useState('Back');
  const [selectedZoom, setSelectedZoom] = useState('0');
  const [selectedRecordingLength, setSelectedRecordingLength] = useState('80');
  const [selectedMaxVideoFileSize, setSelectedMaxVideoFileSize] = useState('0');
  const [selectedAutomaticRecording, setSelectedAutomaticRecording] = useState(false);

  let recordVideo = async () => {

    // Clear Locations and Video
    setLocations([]);
    setVideo(undefined);

    // Set Location subscription
    // Get location every second (1000 milliseconds)
    const tempLocations = [];
    let locSub = await Location.watchPositionAsync({
      accuracy: Location.Accuracy.High,
      timeInterval: 100,
      distanceInterval: 0
    },
      (location) => {
        tempLocations.push(location);
      }
    );

    // Set the camera options
    let cameraOptions = {
      quality: selectedResolution,
      zoom: parseFloat(selectedZoom),
      maxDuration: parseInt(selectedRecordingLength),
      mute: false,
      exif: true,
    };

    setIsRecording(true);
    await cameraRef.current.recordAsync(cameraOptions).then((recordedVideo) => {
      setVideo(recordedVideo);
      setIsRecording(false);
      locSub.remove();
      setLocations(tempLocations);
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

    const tempCameraType = await AsyncStorage.getItem('CameraType')
    if (tempCameraType !== null || tempCameraType !== '') {
      setSelectedCameraType(tempCameraType);
    }

    const tempZoom = await AsyncStorage.getItem('CameraZoom')
    if (tempZoom !== null || tempZoom !== '') {
      setSelectedZoom(tempZoom);
    }

    const tempRecordingLength = await AsyncStorage.getItem('RecordingLength')
    if (tempRecordingLength !== null || tempRecordingLength !== '') {
      setSelectedRecordingLength(tempRecordingLength);
    }

    const tempMaxVideoFileSize = await AsyncStorage.getItem('MaxVideoFileSize')
    if (tempMaxVideoFileSize !== null || tempMaxVideoFileSize !== '') {
      setSelectedMaxVideoFileSize(tempMaxVideoFileSize);
    }

    const tempAutomaticRecording = await AsyncStorage.getItem('AutomaticRecording')
    if (tempAutomaticRecording !== null || tempAutomaticRecording !== '') {
      setSelectedAutomaticRecording(tempAutomaticRecording);
    }


    if (cameraPermission && cameraRef !== undefined) {
      console.log('Camera Granted');
    }
    else {
      console.log('Does not have Camera Granted');
    }

  }



  useEffect(() => {
    setPermissions();
    return () => {
      setHasCameraPermission(null);
      setHasMicrophonePermission(null);
      setHasMediaLibraryPermission(null);
      setHasLocationPermission(null);

    };
  }, []);



  if (hasCameraPermission === undefined || hasMicrophonePermission === undefined || hasLocationPermission === undefined) {
    return <Text>Request permissions...</Text>
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted.</Text>
  }


  let stopRecording = () => {

    cameraRef.current.stopRecording();
    setIsRecording(false);
  };


  if (video) {
    let shareVideo = () => {
      shareAsync(video.uri).then(() => {
        setVideo(undefined);
      });

    };

    const saveData = async () => {

      const expoAlbum = await MediaLibrary.getAlbumAsync(ALBUM_NAME)
      const video_asset = await MediaLibrary.createAssetAsync(video.uri);
      // const filename = FileSystem.documentDirectory + "coordinates.json";
      // await FileSystem.writeAsStringAsync(filename, JSON.stringify(locations), {
      //   encoding: FileSystem.EncodingType.UTF8
      // });
      // console.log(filename);
      // const result = await FileSystem.readAsStringAsync(filename, {
      //   encoding: FileSystem.EncodingType.UTF8
      // });
      //console.log(result); 
      video_asset['exif'] = gpsJsonToGeojson(locations);
      console.log(video_asset);

      if (expoAlbum) {
        await MediaLibrary.addAssetsToAlbumAsync(video_asset, expoAlbum.id).then((result) => {
          console.log(result)
        });
      } else {
        await MediaLibrary.createAlbumAsync(ALBUM_NAME, video_asset).then((result) => {
          console.log(result)
        });
      }
    };

    return (
      <SafeAreaView style={styles.container}>
        <Video
          style={styles.video}
          source={{ uri: video.uri }}
          useNativeControls
          resizeMode='contain'
          isLooping
        />
        <Button style={styles.button} icon="share" mode="contained" onPress={shareVideo} > Share</Button>
        {hasMediaLibraryPermission ? 
        <Button style={styles.button} icon="content-save" mode="contained" onPress={saveData} >Save </Button> 
        : undefined}
        <Button style={styles.button} icon="camera" mode="outlined" onPress={() => setVideo(undefined)} >Discard </Button>
      </SafeAreaView>
    );
  }

  return (
    <Camera style={styles.container} ref={cameraRef} onCameraReady={selectedAutomaticRecording === 'true' ? recordVideo : null} quality={selectedResolution} type={selectedCameraType === 'Back'? CameraType.back : CameraType.front} >
      <View style={styles.buttonContainer}>
        <Text>Global: {selectedResolution}</Text>
        <Button style={styles.button} icon="camera" mode="contained" onPress={isRecording ? stopRecording : recordVideo} >{isRecording ? "Stop Recording" : "Record Video"} </Button>
      </View>
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  button: {
    marginVertical: 10,
  },
  video: {
    flex: 1,
    alignSelf: "stretch"
  }
});

export default CameraScreen;