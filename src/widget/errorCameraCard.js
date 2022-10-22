import React from 'react';
import { View } from 'react-native';
import { Title, Text } from 'react-native-paper';

import GlobalStyles from '../styles/global-styles';
const ErrorCameraCard = ({}) => {
    return (
        <View style={GlobalStyles.container}>

            <View style={[GlobalStyles.divDark, GlobalStyles.header, GlobalStyles.flex1]}>
                <Title style={GlobalStyles.whiteText}>Error!</Title>

                <Text style={GlobalStyles.whiteText} variant='labelLarge'>
                   There are permission errors with the application. Camera, Microphone, and Location permission might be disabled. 
                </Text>
            </View>

            <View style={[GlobalStyles.flex5, GlobalStyles.marginYsm]}>
                <Text variant='labelLarge'>
                You can allow some apps to use various features on your phone, such as your camera or contacts list. An app will send a notification to ask for permission to use features on your phone, which you can Allow or Deny. You can also change permissions for a single app or by permission type in your phone's Settings.
                </Text>
            </View>


            <View style={[GlobalStyles.divDark, GlobalStyles.attention, GlobalStyles.flex1]}>
                <Title style={GlobalStyles.whiteText}>
                    Need more Help?
                </Title>
                <Text variant='labelLarge' style={[GlobalStyles.marginYsm, GlobalStyles.whiteText]}>
                    Contact us at: XYZ
                </Text>

            </View>
        </View>
    )
}


export default ErrorCameraCard;