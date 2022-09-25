import DropDownPicker from 'react-native-dropdown-picker';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Button, Text, Snackbar, SegmentedButtons, Divider } from 'react-native-paper';

export default function SettingsScreen({ navigation }) {

  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const onDismissSnackBar = () => setSnackBarVisible(false);

  const [selectedResolution, setSelectedResolution] = useState('480p');
  const [resolutions, setResolutions] = useState([
    { label: '480p', value: '480p' },
    { label: '720p', value: '720p' },
    { label: '1080p', value: '1080p' }
  ]);


  const [selectedCameraType, setSelectedCameraType] = useState('Back');
  const [cameraTypes, setCameraTypes] = useState([
    { label: 'Front', value: 'Front' },
    { label: 'Back', value: 'Back' }

  ]);


  const [selectedZoom, setSelectedZoom] = useState('0');
  const [zooms, setZoom] = useState([
    { label: 'No Zoom', value: '0' },
    { label: 'Medium Zoom', value: '0.5' },
    { label: 'Max Zoom', value: '1' }

  ]);

  const [selectedRecordingLength, setSelectedRecordingLength] = useState('80');
  const [recordingLengths, setRecordingLengths] = useState([
    { label: '20min', value: '20' },
    { label: '40min', value: '40' },
    { label: '60min', value: '60' },
    { label: '80min', value: '80' },
  ]);


  const [selectedMaxVideoFileSize, setSelectedMaxVideoFileSize] = useState('0');
  const [maxVideoFileSizes, setMaxVideoFileSizes] = useState([
    { label: 'No Limit', value: '0' },
    { label: '1GB', value: '1073741824' },
    { label: '2GB', value: '2147483648' },
    { label: '4GB', value: '4294967296' },
  ]);

  const [selectedAutomaticRecording, setSelectedAutomaticRecording] = useState('false');
  const [automaticRecordings, setAutomaticRecordings] = useState([
    { label: 'No', value: 'false' },
    { label: 'Yes', value: 'true'},
  ]);


  const saveSetting = async () => {
    try {
      await AsyncStorage.setItem('CameraResolution', selectedResolution);
      await AsyncStorage.setItem('CameraType', selectedCameraType);
      await AsyncStorage.setItem('CameraZoom', selectedZoom);
      await AsyncStorage.setItem('RecordingLength', selectedRecordingLength);
      await AsyncStorage.setItem('MaxVideoFileSize', selectedMaxVideoFileSize);
      await AsyncStorage.setItem('AutomaticRecording', selectedAutomaticRecording);
      setSnackBarVisible(true);

    } catch (e) {

    }
  }

  const setInitialValues = async () => {

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


  }

  useEffect(() => {
    setInitialValues();
  }, [])


  return (
    <View style={styles.container}>

      <Text variant='headlineSmall'>
        Camera
      </Text>

      <Text variant='labelLarge'>
        Resolution
      </Text>
      <SegmentedButtons
        value={selectedResolution}
        onValueChange={setSelectedResolution}
        buttons={resolutions}
        style={styles.group}
      />


      <Text variant='labelLarge'>
        Camera Type
      </Text>
      <SegmentedButtons
        value={selectedCameraType}
        onValueChange={setSelectedCameraType}
        buttons={cameraTypes}
        style={styles.group}
      />

      <Text variant='labelLarge'>
        Camera Zoom
      </Text>
      <SegmentedButtons
        value={selectedZoom}
        onValueChange={setSelectedZoom}
        buttons={zooms}
        style={styles.group}
      />

      <Divider />

      <Text variant='headlineSmall'>
        Recordings
      </Text>

      <Text variant='labelLarge'>
        Start Automatic Recording
      </Text>
      <SegmentedButtons
        value={selectedAutomaticRecording}
        onValueChange={setSelectedAutomaticRecording}
        buttons={automaticRecordings}
        style={styles.group}
      />

      <Text variant='labelLarge'>
        Max Video Duration
      </Text>
      <SegmentedButtons
        value={selectedRecordingLength}
        onValueChange={setSelectedRecordingLength}
        buttons={recordingLengths}
        style={styles.group}
      />

      <Text variant='labelLarge'>
        Max Video File Size
      </Text>
      <SegmentedButtons
        value={selectedMaxVideoFileSize}
        onValueChange={setSelectedMaxVideoFileSize}
        buttons={maxVideoFileSizes}
        style={styles.group}
      />

      <Divider />
      <Button style={styles.button} icon="content-save" mode="contained" onPress={() => saveSetting()}>
        Save
      </Button>

      <Snackbar
        visible={snackBarVisible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Close',
        }}>
        Saved Settings to Local Storage
      </Snackbar>

    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  button: {
    marginVertical: 10,
  }

});