
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Card, Button, Title, Text, Snackbar, SegmentedButtons, Divider } from 'react-native-paper';
import GlobalStyles from '../styles/global-styles';
import { DEFAULT_CAMERA_SETTINGS } from '../constants';
import SettingOptionItem from '../widget/settingOptionItem';

export default function SettingsScreen({ navigation }) {


  const [settings, setSettings] = useState(DEFAULT_CAMERA_SETTINGS);
  const [loadCamera, setLoadCamera] = useState();
  const [selectedResolution, setSelectedResolution] = useState();
  const [selectedCameraType, setSelectedCameraType] = useState();
  const [selectedZoom, setSelectedZoom] = useState();
  const [selectedRecLength, setSelectedRecLength] = useState();
  const [selectedMaxSize, setSelectedMaxSize] = useState();
  const [selectedAutoRec, setSelectedAutoRec] = useState();
  const [selectedMobileData, setSelectedMobileData] = useState();

  const [loadCameraWhenApplicationStarts, setLoadCameraWhenApplicationStarts] = useState([
    { label: 'No', value: false },
    { label: 'Yes', value: true },
  ]);

  const [resolutions, setResolutions] = useState([
    { label: '480p', value: '480p' },
    { label: '720p', value: '720p' },
    { label: '1080p', value: '1080p' }
  ]);

  const [cameraTypes, setCameraTypes] = useState([
    { label: 'Front', value: 'Front' },
    { label: 'Back', value: 'Back' }
  ]);

  const [zooms, setZoom] = useState([
    { label: 'No Zoom', value: 0 },
    { label: 'Medium', value: 0.5 },
    { label: 'Max Zoom', value: 1 }
  ]);

  const [recordingLengths, setRecordingLengths] = useState([
    { label: '1min', value: 1 },
    { label: '3min', value: 3 },
    { label: '6min', value: 6 },
    { label: '10min', value: 10 },
  ]);

  const [maxVideoFileSizes, setMaxVideoFileSizes] = useState([
    { label: 'No Limit', value: 0 },
    { label: '1GB', value: 1073741824 },
    { label: '2GB', value: 2147483648 },
    { label: '4GB', value: 4294967296 },
  ]);

  const [automaticRecordings, setAutomaticRecordings] = useState([
    { label: 'No', value: false },
    { label: 'Yes', value: true },
  ]);

  const [allowUploadWithMobileData, setAllowUploadWithMobileData] = useState([
    { label: 'No', value: false },
    { label: 'Yes', value: true },
  ]);

  const saveSetting = async (tempSettings) => {
    try {
      await AsyncStorage.setItem('AMD_Settings', JSON.stringify(tempSettings))
    } catch (e) {
      Alert.alert("Unable to save Settings");
    }
  }

  const setInitialValues = async () => {
    try {
      let tempSettings = await AsyncStorage.getItem('AMD_Settings')
      tempSettings = JSON.parse(tempSettings)
      if (tempSettings && Object.keys(tempSettings).length >= 1 && Object.getPrototypeOf(tempSettings) === Object.prototype) {
        setSettings(tempSettings);
      }
      else {
        setSettings(DEFAULT_CAMERA_SETTINGS);
      }
    } catch (err) {
      Alert.alert('Unable to load Settings')
    }
  };

  useEffect(() => {
    setInitialValues();
    setLoadCamera(settings.loadCameraWhenApplicationStarts);
    setSelectedResolution(settings.resolution);
    setSelectedCameraType(settings.cameraType);
    setSelectedZoom(settings.zoomLevel);
    setSelectedRecLength(settings.recordingLength);
    setSelectedMaxSize(settings.maxVideoFileSize);
    setSelectedAutoRec(settings.automaticRecording);
    setSelectedMobileData(settings.allowUploadWithMobileData);
  }, [])

  const updateSetting = (key, updatedValue) => {
    console.log (key)
    console.log(updatedValue)
    // const tempSettings = {
    //   ...settings,
    //   ...{key: updatedValue}
    // }
    const tempSettings = settings;
    tempSettings[key] = updatedValue;
    console.log(tempSettings);
    setSettings(tempSettings);
    saveSetting(tempSettings);
  }

  const resetSettings = async () => {
    try {
      setSettings(DEFAULT_CAMERA_SETTINGS);
      await AsyncStorage.setItem('AMD_Settings', JSON.stringify(DEFAULT_CAMERA_SETTINGS))
      Alert.alert('Successfully Reset all Setting')
    } catch (e) {
      Alert.alert("Unable to reset Settings");
    }
  }

  const saveResetButtons = () => {
    return (
      <View style={[GlobalStyles.rowContainerWrap, GlobalStyles.marginYsm]}>
        <View style={GlobalStyles.buttonContainer}>
          <Button style={GlobalStyles.button} icon="restart" mode="outlined" onPress={resetSettings}>
            Reset
          </Button>
        </View>
      </View>
    )
  }

  return (
    <ScrollView style={GlobalStyles.container}>
      <View style={[GlobalStyles.divDark, GlobalStyles.header, GlobalStyles.flex1]}>
        <Title style={GlobalStyles.whiteText}>Camera and Recording Settings</Title>
        <Text style={GlobalStyles.whiteText} variant='labelLarge'>
          Change your settings and then click save to apply.
        </Text>
      </View>
      <View style={GlobalStyles.flex5}>
        <Card mode="elevated" style={[GlobalStyles.borderRounded, GlobalStyles.marginYsm]}>

          <Card.Content>
            <Text variant='titleLarge' >
              Camera Settings
            </Text>


            <SettingOptionItem key={settings} title={'load Camera When Application Starts'} settings={settings} settingValue={loadCameraWhenApplicationStarts} settingKey={'loadCameraWhenApplicationStarts'} buttonsArray={loadCameraWhenApplicationStarts} updateSetting={updateSetting}>

            </SettingOptionItem>

            <View style={[GlobalStyles.marginYsm]}>
              <Text style={[GlobalStyles.paddingBsm]} variant='labelMedium'>
                Resolution
              </Text>
              <SegmentedButtons
                value={selectedResolution}
                onValueChange={(resolution) => {updateSetting('resolution', resolution); setSelectedResolution(resolution)}}
                buttons={resolutions}
              />
            </View>
            <View style={[GlobalStyles.marginYsm]}>
              <Text style={[GlobalStyles.paddingBsm]} variant='labelMedium'>
                Camera Type
              </Text>
              <SegmentedButtons
                value={settings.cameraType}
                onValueChange={(cameraType) => {updateSetting( 'cameraType', cameraType ); setSelectedCameraType(cameraType)}}
                buttons={cameraTypes}
              />
            </View>
            <View style={[GlobalStyles.marginYsm]}>
              <Text style={[GlobalStyles.paddingBsm]} variant='labelMedium'>
                Camera Zoom
              </Text>
              <SegmentedButtons
                value={settings.zoomLevel}
                onValueChange={(zoomLevel) => updateSetting({ 'zoomLevel': zoomLevel })}
                buttons={zooms}
              />
            </View>


            <View style={[GlobalStyles.marginYsm]}>
              <Text style={[GlobalStyles.paddingBsm]} variant='labelMedium'>
                Start Automatic Recording
              </Text>
              <SegmentedButtons
                value={settings.automaticRecording}
                onValueChange={(automaticRecording) => updateSetting({ 'automaticRecording': automaticRecording })}
                buttons={automaticRecordings}

              />
            </View>
            <View style={[GlobalStyles.marginYsm]}>
              <Text style={[GlobalStyles.paddingBsm]} variant='labelMedium'>
                Max Video Duration
              </Text>
              <SegmentedButtons
                value={settings.recordingLength}
                onValueChange={(recordingLength) => updateSetting({ 'recordingLength': recordingLength })}
                buttons={recordingLengths}

              />
            </View>
            <View style={[GlobalStyles.marginYsm]}>
              <Text style={[GlobalStyles.paddingBsm]} variant='labelMedium'>
                Max Video File Size
              </Text>
              <SegmentedButtons
                value={settings.maxVideoFileSize}
                onValueChange={(maxVideoFileSize) => updateSetting({ 'maxVideoFileSize': maxVideoFileSize })}
                buttons={maxVideoFileSizes}
              />
            </View>



            <View style={[GlobalStyles.divLine, GlobalStyles.marginYsm]} />


            <Text variant='titleLarge' >
              Network Settings
            </Text>
            <View style={[GlobalStyles.marginYsm]}>
              <Text style={[GlobalStyles.paddingBsm]} variant='labelMedium'>
                Allow sharing and uploading with Mobile Data
              </Text>
              <SegmentedButtons
                value={settings.allowUploadWithMobileData}
                onValueChange={(allowUploadWithMobileData) => updateSetting({ 'allowUploadWithMobileData': allowUploadWithMobileData })}
                buttons={allowUploadWithMobileData}
              />
            </View>

            <View style={[GlobalStyles.divLine, GlobalStyles.marginYsm]} />

            {saveResetButtons()}
          </Card.Content>
        </Card>

      </View>
    </ScrollView>
  );
}
