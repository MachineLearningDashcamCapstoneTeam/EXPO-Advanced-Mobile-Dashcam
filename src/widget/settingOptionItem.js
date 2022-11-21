
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Card, Button, Title, Text, Snackbar, SegmentedButtons, Divider } from 'react-native-paper';
import GlobalStyles from '../styles/global-styles';
import { DEFAULT_CAMERA_SETTINGS } from '../constants';

const SettingOptionItem = ({title, settings, settingValue, settingKey, buttonsArray}) =>  {

return ( 

    <View style={[GlobalStyles.marginYsm]}>
              <Text style={[GlobalStyles.paddingBsm]} variant='labelMedium'>
              {title}
              </Text>
              <SegmentedButtons
                value={settings[settingKey]}
                onValueChange={(settingValue) => updateSetting({ settingKey: settingValue })}
                buttons={buttonsArray}
              />
            </View>
)

}

export default SettingOptionItem;