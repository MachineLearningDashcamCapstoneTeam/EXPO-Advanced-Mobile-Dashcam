import { View, TouchableOpacity} from 'react-native';
import { useEffect, useState, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import { ALBUM_NAME, DEFAULT_CAMERA_SETTINGS } from '../constants';
import CAMERA_IMG from '../../assets/header-alt.jpg';
import { gpsJsonToGeojson } from '../utils/geojson-utils';
import { Button, Text, Snackbar, IconButton, MD3Colors, Avatar } from 'react-native-paper';
import { useKeepAwake, activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import GlobalStyles from '../styles/global-styles';
import ErrorCameraCard from '../widget/errorCameraCard';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import * as Speech from 'expo-speech';

const CameraScreen = ({ navigation }) => {
  const isFocused = useIsFocused()
  useKeepAwake();
  let cameraRef = useRef();
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [hasLocationPermission, setHasLocationPermission] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState();
  const [settings, setSettings] = useState(DEFAULT_CAMERA_SETTINGS);
  const [wasButtonClicked, setWasButtonClicked] = useState(false);

  const [initialLocationTracker, setInitialLocationTracker] = useState();


  const saveVideoData = async (recordedVideo, gpsLocations, buttonClicked) => {

    try {
      //* Get The album and video asset
      const expoAlbum = await MediaLibrary.getAlbumAsync(ALBUM_NAME)
      const videoAsset = await MediaLibrary.createAssetAsync(recordedVideo.uri);


      //* Create the gps data file
      const gpsData = gpsJsonToGeojson(gpsLocations)
      const fileUri = `${FileSystem.documentDirectory}${videoAsset.filename}.txt`;
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(gpsData), { encoding: FileSystem.EncodingType.UTF8 });

      if (expoAlbum) {
        await MediaLibrary.addAssetsToAlbumAsync([videoAsset], expoAlbum.id).then((result) => {
          
        });


      } else {
        await MediaLibrary.createAlbumAsync(ALBUM_NAME, videoAsset).then((result) => {
          
        });


      }

      setVideo(null);

      let startAnotherRecording = false;
      if (buttonClicked) {
        startAnotherRecording = false;
      }
      else {
        startAnotherRecording = settings.automaticRecording;
      }

      if (startAnotherRecording) {
        recordVideo();
      }
      else{
        speak();
      }
    }
    catch (err) {
      Alert.alert(
        'Error',
        `${err}`,
        [
          { text: 'OK' },
        ]
      );
    }


  };

  let recordVideo = async () => {
    if (!cameraRef) return;
    try {

      if (initialLocationTracker) {
        initialLocationTracker.remove()
        setInitialLocationTracker(null)
      }

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
        saveVideoData(recordedVideo, tempLocations, wasButtonClicked)
      }).catch((error) => {
        console.error(error);
      });
    }
    catch (err) {
      
    };
  };

  const speak = () => {
    const thingToSay = 'Stopped Video Recording. No data corruption detected.';
    Speech.speak(thingToSay);
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

  }

  const setInitialValues = async () => {
    try {
      let tempSettings = await AsyncStorage.getItem('AMD_Settings')
      tempSettings = JSON.parse(tempSettings)
      if (tempSettings) {
        setSettings(tempSettings)
      }
      else {
        setSettings(DEFAULT_CAMERA_SETTINGS);
      }

      let location = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Highest, timeInterval: 1000, distanceInterval: 10 },
        (loc) => {
          if (loc.coords.speed >= 5) {
            recordVideo();
          }


        }
      );
      setInitialLocationTracker(location);



    } catch (err) {
      Alert.alert(
        'Unable to load settings',
        `${err}`,
        [
          { text: 'OK' },
        ]
      );
    }
  };

  const saveSetting = async (tempSettings) => {
    try {
      await AsyncStorage.setItem('AMD_Settings', JSON.stringify(tempSettings))
    } catch (e) {
      Alert.alert(
        'Error',
        `${err}`,
        [
          { text: 'OK' },
        ]
      );
    }
  }

  const updateSetting = (updatedAttribute) => {
    const key = Object.keys(updatedAttribute)[0];
    const updatedValue = updatedAttribute[key];
    const tempSettings = settings;
    tempSettings[key] = updatedValue;
    setSettings(settings => ({
      ...settings,
      ...updatedAttribute
    }));
    saveSetting(tempSettings);
  }

  useFocusEffect(
    useCallback(() => {
      if (isFocused) {
        setPermissions();
        setInitialValues();
      }

    }, [])
  );

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
      // setSettings(DEFAULT_CAMERA_SETTINGS);
      //* Deactivate keep awake so the system never keeps running
      deactivateKeepAwake();
      cameraRef = null;
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
    setWasButtonClicked(true)
    setIsRecording(false);
    cameraRef.current.stopRecording();
  };


  return (
    <View style={GlobalStyles.container}>
      {isFocused && <View style={GlobalStyles.container}>
        <View style={[GlobalStyles.rowSpaceEven, GlobalStyles.divBlack]}>


        </View>
        <Camera 
       
        zoom={settings.zoomLevel} style={[GlobalStyles.camera, GlobalStyles.flex6]} ref={cameraRef} onCameraReady={settings.automaticRecording === true ? recordVideo : null} quality={settings.resolution} type={settings.cameraType === 'Back' ? CameraType.back : CameraType.front} >


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
          <View style={[GlobalStyles.divCenter, GlobalStyles.alignCenter, GlobalStyles.container]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Avatar.Image size={45} source={CAMERA_IMG} />
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


      </View>}



    </View>
  );
};

export default CameraScreen;