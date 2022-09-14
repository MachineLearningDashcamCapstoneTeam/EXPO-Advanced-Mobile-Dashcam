import { StyleSheet, Text, View, Button, SafeAreaView } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';

const CameraScreen = () => {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [hasLocationPermission, setHasLocationPermission] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState();

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [location, setLocation] = useState(null);
  const [locations, setLocations] = useState([]);

  const newLocation = (location) => {
    
      console.log('update location!', location.coords.latitude, location.coords.longitude)
      setLocation(location)
      setLatitude(location.coords.latitude)
      setLongitude(location.coords.longitude);
      setLocations(locations => [...locations, location]);
    
    
  }

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      const locationPermission = await Location.requestForegroundPermissionsAsync();
    
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMicrophonePermission(microphonePermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
      setHasLocationPermission(locationPermission.status === "granted");


    })();

    return () => {
      setHasCameraPermission(null);
      setHasMicrophonePermission(null);
      setHasMediaLibraryPermission(null);
      setHasLocationPermission(null);
    };
  }, []);

  if (hasCameraPermission === undefined || hasMicrophonePermission === undefined) {
    return <Text>Requestion permissions...</Text>
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted.</Text>
  }

  let recordVideo = async () => {


    const locationTracker =  await Location.watchPositionAsync({
      accuracy: Location.Accuracy.High,
      timeInterval: 1000,
      distanceInterval: 0

    },
      (loc) => { newLocation(loc) }
    );

    setIsRecording(true);
    let options = {
      quality: "1080p",
      mute: false
    };

    await cameraRef.current.recordAsync(options).then((recordedVideo) => {
      setVideo(recordedVideo);
      setIsRecording(false);
    });

    locationTracker.remove();
  };

  let stopRecording = () => {
    setIsRecording(false);
    cameraRef.current.stopRecording();
  };


  if (video) {
    let shareVideo = () => {
      shareAsync(video.uri).then(() => {
        setVideo(undefined);
      });
    };

    const saveFile = async () => {
      let fileUri = FileSystem.documentDirectory + "text.txt";
      console.log(fileUri);
      await FileSystem.writeAsStringAsync(fileUri, locations.toString(), { encoding: FileSystem.EncodingType.UTF8 });
      const asset = await MediaLibrary.createAssetAsync(fileUri).catch((error) => {
        console.error(error);
      });
      await MediaLibrary.createAlbumAsync("Download", asset, false)
    }

    const saveVideo = async () => {
      const EXPO_ALBUM_NAME = 'Dashcams';
      const expoAlbum = await MediaLibrary.getAlbumAsync(EXPO_ALBUM_NAME)
      const asset = await MediaLibrary.createAssetAsync(video.uri);
      console.log(asset)
      saveFile();
      // if (expoAlbum) {
      //   await MediaLibrary.addAssetsToAlbumAsync(asset, expoAlbum.id).then(() => {
      //     setVideo(undefined);
      //   });
      // } else {
      //   await MediaLibrary.createAlbumAsync(EXPO_ALBUM_NAME, asset).then(() => {
      //     setVideo(undefined);
      //   });
      // }

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
        {hasMediaLibraryPermission ? <Button title="Save" onPress={saveVideo} /> : undefined}
        <Button title="Discard" onPress={() => setVideo(undefined)} />
      </SafeAreaView>
    );
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <Text>Test: {JSON.stringify(location)}</Text>
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