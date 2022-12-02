
import {  View, ScrollView, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Card, Button,Text, Divider } from 'react-native-paper';
import GlobalStyles from '../styles/global-styles';
import { DEFAULT_CAMERA_SETTINGS } from '../constants';
import SettingOptionItem from '../widget/settingOptionItem';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView style={[GlobalStyles.container]}>
      <ScrollView >
        <View style={[GlobalStyles.divMain, GlobalStyles.paddingXmd, GlobalStyles.paddingYmd]}>
          <Text variant='titleLarge' style={GlobalStyles.whiteText}>Settings</Text>
          <Text style={[GlobalStyles.paddingYsm, GlobalStyles.whiteText]} variant="bodySmall">
            The following settings will be used when you start a recording. You can change these settings at any time.
          </Text>
        </View>

        <View style={[GlobalStyles.flex1]}>


          <Card style={[GlobalStyles.roundedTop, GlobalStyles.roundedBottom, GlobalStyles.divWhite, GlobalStyles.marginYsm]}>

            <Card.Content>

              <Text variant='titleLarge' >
                Camera Settings
              </Text>

              <Divider style={[GlobalStyles.marginYsm]} />

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

            </Card.Content>

          </Card>



          <Card style={[GlobalStyles.roundedTop, GlobalStyles.roundedBottom, GlobalStyles.divWhite, GlobalStyles.marginYsm]}>

            <Card.Content>

              <Text variant='titleLarge' >
                Network Settings
              </Text>

              <Divider style={[GlobalStyles.marginYsm]} />

              <SettingOptionItem

                title={'Allow sharing and uploading with Mobile Data'}
                settings={settings}
                settingKey={'allowUploadWithMobileData'}
                buttonsArray={allowUploadWithMobileDataButtons}
                updateSetting={updateSetting}>

              </SettingOptionItem>

            </Card.Content>
          </Card>


          <View style={[GlobalStyles.divLine, GlobalStyles.marginYsm]} />


          <Card style={[GlobalStyles.divWhite, GlobalStyles.roundedTop, GlobalStyles.roundedBottom]}>
            <Card.Content>

              <Text variant='titleLarge'>
                Details
              </Text>

              <Divider style={[GlobalStyles.marginYsm]} />

              <Text variant='bodySmall'>
                Load Camera When Application Starts: {settings.loadCameraWhenApplicationStarts ? 'Yes' : 'No'}
              </Text>

              <Text variant='bodySmall'>
                Resolution: {settings.resolution}
              </Text>

              <Text variant='bodySmall'>
                Camera Type: {settings.cameraType}
              </Text>

              <Text variant='bodySmall'>
                Camera Zoom: {settings.zoomLevel}
              </Text>

              <Text variant='bodySmall'>
                Start Automatic Recording: {settings.automaticRecording ? 'Yes' : 'No'}
              </Text>

              <Text variant='bodySmall'>
                Max Video Duration: {settings.recordingLength}
              </Text>

              <Text variant='bodySmall'>
                Max Video File Size: {settings.maxVideoFileSize}
              </Text>

              <Text variant='bodySmall'>
                Allow sharing and uploading with Mobile Data: {settings.allowUploadWithMobileData ? 'Yes' : 'No'}
              </Text>






              <Divider style={[GlobalStyles.marginYsm]} />

              {saveResetButtons()}


            </Card.Content>
          </Card>

        </View>





      </ScrollView>
    </SafeAreaView>
  );
}
