import { StyleSheet, Text, View, Button, SafeAreaView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useEffect, useState, useRef } from 'react';
import { Camera } from 'expo-camera';
export default function Settings({navigation}) {
    const [hasCameraPermission, setHasCameraPermission] = useState();
   
    const [isResolutionDropDownOpen, setIsResolutionDropDownOpen] = useState(false);
    const [selectedResolution, setSelectedResolution] = useState(null);
    const [resolutions, setResolutions] = useState([
      {label: '480p [Default]', value: 480},
      {label: '720p', value: 720},
      {label: '1080p', value: 1080},
      {label: '2160p', value: 2160}
    ]);

    const [isZoomDropDownOpen, setIsZoomDropDownOpen] = useState(false);
    const [selectedZoom, setSelectedZoom] = useState(null);
    const [zooms, setZooms] = useState([
      {label: 'No Zoom [Default]', value: 0},
      {label: 'Medium Zoom', value: 0.5},
      {label: 'Max Zoom', value: 1.0},
    ]);

    const fetchPermissions = async () =>{
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
    }

    useEffect(() => {
      fetchPermissions();
    
      return () => {
        setHasCameraPermission(null);
      }
    }, [])
    
  
    return (
      <SafeAreaView style={styles.container}>
          <DropDownPicker
          open={isResolutionDropDownOpen}
          value={selectedResolution}
          items={resolutions}
          setOpen={setIsResolutionDropDownOpen}
          setValue={setSelectedResolution}
          setItems={setResolutions}
        />


    <DropDownPicker
          open={isZoomDropDownOpen}
          value={selectedZoom}
          items={zooms}
          setOpen={setIsZoomDropDownOpen}
          setValue={setSelectedZoom}
          setItems={setZooms}
        />
        </SafeAreaView>
     
      
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