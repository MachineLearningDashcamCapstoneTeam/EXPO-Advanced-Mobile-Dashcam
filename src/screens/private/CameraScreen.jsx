import { StyleSheet, Text, View, Button, SafeAreaView } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import { ALBUM_NAME } from '../../constants';

const CameraScreen = () => {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [hasLocationPermission, setHasLocationPermission] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState();
  const [locations, setLocations] = useState([]);

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
      quality: "1080p",
      mute: false
    };
   
    setIsRecording(true);
    await cameraRef.current.recordAsync(cameraOptions).then((recordedVideo) => {      
      setVideo(recordedVideo);
      setIsRecording(false);
      locSub.remove();
   
      console.log(tempLocations);
      setLocations(tempLocations);
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

  
    if(cameraPermission){
      console.log('Camera Granted');
      console.log(cameraRef)
    }
    else{
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

      const expoAlbumExists = await MediaLibrary.getAlbumAsync(ALBUM_NAME)
      const video_asset = await MediaLibrary.createAssetAsync(video.uri);
      const filename = FileSystem.documentDirectory + "coordinates.json";
      const fileResult = FileSystem.writeAsStringAsync(filename, JSON.stringify(locations), {
        encoding: FileSystem.EncodingType.UTF8
      });
      console.log(`Saved file to: ${fileResult}`);


      if (expoAlbumExists) {
        await MediaLibrary.addAssetsToAlbumAsync(video_asset, expoAlbum.id).then(() => {
          setVideo(undefined);
        });
      } else {
        await MediaLibrary.createAlbumAsync(ALBUM_NAME, video_asset).then(() => {
          setVideo(undefined);
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
        <Button title="Share" onPress={shareVideo} />
        {hasMediaLibraryPermission ? <Button title="Save" onPress={saveData} /> : undefined}
        <Button title="Discard" onPress={() => setVideo(undefined)} />
      </SafeAreaView>
    );
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <Button title={isRecording ? "Stop Recording" : "Record Video"} onPress={isRecording ? stopRecording : recordVideo} />
      </View>
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "flex-end"
  },
  video: {
    flex: 1,
    alignSelf: "stretch"
  }
});

export default CameraScreen;