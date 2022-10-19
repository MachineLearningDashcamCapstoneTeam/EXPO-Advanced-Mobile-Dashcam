
import { StyleSheet, View, ScrollView , Alert} from 'react-native';
import { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Card, Button, Title, Text, Snackbar, SegmentedButtons, Divider } from 'react-native-paper';

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

  const [selectedRecordingLength, setSelectedRecordingLength] = useState('80');
  const [recordingLengths, setRecordingLengths] = useState([
    { label: '20min', value: '20' },
    { label: '40min', value: '40' },
    { label: '60min', value: '60' },
    { label: '80min', value: '80' },
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
    <View style={styles.container}>
      <ScrollView >
        <Card mode="elevated" style={styles.card}>
        <Card.Cover source={{ uri: 'https://cdn.hswstatic.com/gif/car-engine-new1.jpg' }} />
          <Card.Content>
            <Title>Camera</Title>


            <Text variant='labelSmall'>
              Resolution
            </Text>
            <SegmentedButtons
              value={selectedResolution}
              onValueChange={setSelectedResolution}
              buttons={resolutions}
              style={styles.group}
            />


            <Text variant='labelSmall'>
              Camera Type
            </Text>
            <SegmentedButtons
              value={selectedCameraType}
              onValueChange={setSelectedCameraType}
              buttons={cameraTypes}
              style={styles.group}
            />

            <Text variant='labelSmall'>
              Camera Zoom
            </Text>
            <SegmentedButtons
              value={selectedZoom}
              onValueChange={setSelectedZoom}
              buttons={zooms}
              style={styles.group}
            />

            <Text variant='labelSmall'>
              Start Automatic Recording
            </Text>
            <SegmentedButtons
              value={selectedAutomaticRecording}
              onValueChange={setSelectedAutomaticRecording}
              buttons={automaticRecordings}
              style={styles.group}
            />

            <Text variant='labelSmall'>
              Max Video Duration
            </Text>
            <SegmentedButtons
              value={selectedRecordingLength}
              onValueChange={setSelectedRecordingLength}
              buttons={recordingLengths}
              style={styles.group}
            />

            <Text variant='labelSmall'>
              Max Video File Size
            </Text>
            <SegmentedButtons
              value={selectedMaxVideoFileSize}
              onValueChange={setSelectedMaxVideoFileSize}
              buttons={maxVideoFileSizes}
              style={styles.group}
            />

            <Button style={styles.button} icon="content-save" mode="contained" onPress={() => saveSetting()}>
              Save
            </Button>


            <Button style={styles.button} icon="restart" mode="outlined" >
              Reset to Default
            </Button>
          </Card.Content>

        </Card>


      </ScrollView>
      
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#244c98'
  },
  card: {
    marginBottom: 0,
  },
  button: {
    marginVertical: 5,
  },
  group: {
    marginBottom: 5,
  },
  attention: { 
    flex: 1, 
    margin: 10,
    backgroundColor: "#244c98", 
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  }

});