
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Card, Button, Title, Text, Snackbar, SegmentedButtons, Divider } from 'react-native-paper';
import GlobalStyles from '../styles/global-styles';
import { DEFAULT_CAMERA_SETTINGS } from '../constants';
import SettingOptionItem from '../widget/settingOptionItem';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function SettingsScreen({ navigation }) {


  const [settings, setSettings] = useState(DEFAULT_CAMERA_SETTINGS);

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

  const [zoomLevels, setZoomLevels] = useState([
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

  const [allowUploadWithMobileDataButtons, setAllowUploadWithMobileDataButtons] = useState([
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

  useFocusEffect(
    useCallback(() => {
      setInitialValues();
    }, [])
  );

  useEffect(() => {
    setInitialValues();
  }, [])

  const updateSetting = (key, updatedValue) => {

    const tempSystem = {}
    tempSystem[key] = updatedValue
 
    const tempSettings = {
      ...settings,
      ...tempSystem
    }
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
      
      <View style={GlobalStyles.flex5}>
        <Card mode="elevated" style={[GlobalStyles.borderRounded, GlobalStyles.marginYsm]}>

          <Card.Content>
            <Text variant='titleLarge' >
              Camera Settings
            </Text>

            <SettingOptionItem
           
              title={'Load Camera When Application Starts'}
              settings={settings}
              settingKey={'loadCameraWhenApplicationStarts'}
              buttonsArray={loadCameraWhenApplicationStarts}
              updateSetting={updateSetting}>
 
            </SettingOptionItem>

                 <SettingOptionItem
             
              title={'Resolution'}
              settings={settings}
              settingKey={'resolution'}
              buttonsArray={resolutions}
              updateSetting={updateSetting}>
 
            </SettingOptionItem>

            <SettingOptionItem
             
              title={'Camera Type'}
              settings={settings}
              settingKey={'cameraType'}
              buttonsArray={cameraTypes}
              updateSetting={updateSetting}>
 
            </SettingOptionItem>


            <SettingOptionItem
           
              title={'Camera Zoom'}
              settings={settings}
              settingKey={'zoomLevel'}
              buttonsArray={zoomLevels}
              updateSetting={updateSetting}>
 
            </SettingOptionItem>


            <SettingOptionItem
             
              title={'Start Automatic Recording'}
              settings={settings}
              settingKey={'automaticRecording'}
              buttonsArray={automaticRecordings}
              updateSetting={updateSetting}>
 
            </SettingOptionItem>


            <SettingOptionItem
              
              title={'Max Video Duration'}
              settings={settings}
              settingKey={'recordingLength'}
              buttonsArray={recordingLengths}
              updateSetting={updateSetting}>
 
            </SettingOptionItem>


            <SettingOptionItem
         
              title={'Max Video File Size'}
              settings={settings}
              settingKey={'maxVideoFileSize'}
              buttonsArray={maxVideoFileSizes}
              updateSetting={updateSetting}>
 
            </SettingOptionItem>

            <View style={[GlobalStyles.divLine, GlobalStyles.marginYsm]} />


            <Text variant='titleLarge' >
              Network Settings
            </Text>

            <SettingOptionItem
            
              title={'Allow sharing and uploading with Mobile Data'}
              settings={settings}
              settingKey={'allowUploadWithMobileData'}
              buttonsArray={allowUploadWithMobileDataButtons}
              updateSetting={updateSetting}>
 
            </SettingOptionItem>

       
            <View style={[GlobalStyles.divLine, GlobalStyles.marginYsm]} />

            {saveResetButtons()}
          </Card.Content>
        </Card>

      </View>
    </ScrollView>
  );
}
