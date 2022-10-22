
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Card, Button, Title, Text, Snackbar, SegmentedButtons, Divider } from 'react-native-paper';
import GlobalStyles from '../styles/global-styles';

export default function SettingsScreen({ navigation }) {
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
  const [selectedRecordingLength, setSelectedRecordingLength] = useState('1');
  const [recordingLengths, setRecordingLengths] = useState([
    { label: '1min', value: '1' },
    { label: '3min', value: '3' },
    { label: '6min', value: '6' },
    { label: '10min', value: '10' },
  ]);

  const [selectedMaxVideoFileSize, setSelectedMaxVideoFileSize] = useState('4294967296');
  const [maxVideoFileSizes, setMaxVideoFileSizes] = useState([
    { label: 'No Limit', value: '0' },
    { label: '1GB', value: '1073741824' },
    { label: '2GB', value: '2147483648' },
    { label: '4GB', value: '4294967296' },
  ]);
  const [selectedAutomaticRecording, setSelectedAutomaticRecording] = useState('false');
  const [automaticRecordings, setAutomaticRecordings] = useState([
    { label: 'No', value: 'false' },
    { label: 'Yes', value: 'true' },
  ]);

  const saveSetting = async () => {
    try {
      await AsyncStorage.setItem('CameraResolution', selectedResolution);
      await AsyncStorage.setItem('CameraType', selectedCameraType);
      await AsyncStorage.setItem('CameraZoom', selectedZoom);
      await AsyncStorage.setItem('RecordingLength', selectedRecordingLength);
      await AsyncStorage.setItem('MaxVideoFileSize', selectedMaxVideoFileSize);
      await AsyncStorage.setItem('AutomaticRecording', selectedAutomaticRecording);
      Alert.alert("Saved all Settings");
    } catch (e) {
      Alert.alert("Unable to save Settings");
    }
  }
  const setInitialValues = async () => {
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
      setSelectedRecordingLength('80')
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
    setInitialValues();
  }, [])

  return (
    <ScrollView  style={GlobalStyles.container}>

      <View style={[GlobalStyles.divDark, GlobalStyles.header, GlobalStyles.flex1]}>
        <Title style={GlobalStyles.whiteText}>Camera and Recording Settings</Title>
        <Text style={GlobalStyles.whiteText} variant='labelLarge'>
          Change your settings and then click save to apply.
        </Text>
      </View>
      <View style={GlobalStyles.flex5}>
        


          <Text variant='labelSmall'>
            Resolution
          </Text>
          <SegmentedButtons
            value={selectedResolution}
            onValueChange={setSelectedResolution}
            buttons={resolutions}
            style={GlobalStyles.bottomMargin}
          />

          <Text variant='labelSmall'>
            Camera Type
          </Text>
          <SegmentedButtons
            value={selectedCameraType}
            onValueChange={setSelectedCameraType}
            buttons={cameraTypes}
            style={GlobalStyles.bottomMargin}
          />
          <Text variant='labelSmall'>
            Camera Zoom
          </Text>
          <SegmentedButtons
            value={selectedZoom}
            onValueChange={setSelectedZoom}
            buttons={zooms}
            style={GlobalStyles.bottomMargin}
          />
          <Text variant='labelSmall'>
            Start Automatic Recording
          </Text>
          <SegmentedButtons
            value={selectedAutomaticRecording}
            onValueChange={setSelectedAutomaticRecording}
            buttons={automaticRecordings}
            style={GlobalStyles.bottomMargin}
          />
          <Text variant='labelSmall'>
            Max Video Duration
          </Text>
          <SegmentedButtons
            value={selectedRecordingLength}
            onValueChange={setSelectedRecordingLength}
            buttons={recordingLengths}
            style={GlobalStyles.bottomMargin}
          />
          <Text variant='labelSmall'>
            Max Video File Size
          </Text>
          <SegmentedButtons
            value={selectedMaxVideoFileSize}
            onValueChange={setSelectedMaxVideoFileSize}
            buttons={maxVideoFileSizes}
            style={GlobalStyles.bottomMargin}
          />


          <View style={[GlobalStyles.rowContainer, GlobalStyles.marginYsm]}>
            <View style={GlobalStyles.buttonContainer}>
              <Button style={GlobalStyles.button} icon="content-save" mode="contained" onPress={() => saveSetting()}>
                Save
              </Button>
            </View>
            <View style={GlobalStyles.buttonContainer}>
              <Button style={GlobalStyles.button} icon="restart" mode="outlined" >
                Reset to Default
              </Button>
            </View>
          </View>
        
      </View>
      </ScrollView>
  );
}

