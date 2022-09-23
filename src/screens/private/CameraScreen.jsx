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

  const [locationTracker, setLocationTracker] = useState(null);
  const [locations, setLocations] = useState([]);

  const newLocation = (location) => {
    console.log('update location!', location.coords.latitude, location.coords.longitude)
    setLocations(locations => [...locations, location]);
  };

  
  let recordVideo = async () => {

    const tracker = await Location.watchPositionAsync({
      accuracy: Location.Accuracy.High,
      timeInterval: 1000,
      distanceInterval: 0

    },
      (loc) => { newLocation(loc) }
    );
    setLocationTracker(tracker)

    
    let options = {
      quality: "1080p",
      mute: false
    };

    setIsRecording(true);
    await cameraRef.current.recordAsync(options).then((recordedVideo) => {
      setVideo(recordedVideo);
      setIsRecording(false);
      locationTracker.remove();
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

    // Call initial functions here
    recordVideo();
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

  if (hasCameraPermission === undefined || hasMicrophonePermission === undefined) {
    return <Text>Request permissions...</Text>
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted.</Text>
  }


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

    const saveCoordinates = async () => {
      const filename = FileSystem.documentDirectory + "coordinates.json";
      
      FileSystem.writeAsStringAsync(filename, JSON.stringify(locations), {
        encoding: FileSystem.EncodingType.UTF8
      }).then(() => {
        console.log(`Saved file to: ${filename}`);
       return filename;
      })
      return filename;
    }

    const saveVideo = async () => {

      const expoAlbumExists = await MediaLibrary.getAlbumAsync(ALBUM_NAME)
      const video_asset = await MediaLibrary.createAssetAsync(video.uri);
      const coord_asset = await saveCoordinates();

     
      if (expoAlbumExists) {
        await MediaLibrary.addAssetsToAlbumAsync(video_asset, expoAlbum.id).then(() => {
          setVideo(undefined);
        });

        await MediaLibrary.addAssetsToAlbumAsync(coord_asset, expoAlbum.id).then(() => {

        });
      } else {
        await MediaLibrary.createAlbumAsync(ALBUM_NAME, video_asset).then(() => {
          setVideo(undefined);
        });

        await MediaLibrary.addAssetsToAlbumAsync(ALBUM_NAME, coord_asset).then(() => {

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