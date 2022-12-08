

import React from 'react'
import { Card, Button, Text } from 'react-native-paper';
import { View } from 'react-native';
import GlobalStyles from '../styles/global-styles';
import * as WebBrowser from 'expo-web-browser';
import calculateFileSizeString from '../utils/file-size';

const GoogleVideoCard = ({ file, deleteDriveFile }) => {
    //* Redirect users to the preview screen
    const openBrowser = async () => {
        await WebBrowser.openBrowserAsync(file.webViewLink);
    };
    return (
        <Card key={file.id} mode="elevated" style={[GlobalStyles.borderRounded, GlobalStyles.marginYsm]} >
            <Card.Cover source={{ uri: file.thumbnailLink }} style={[GlobalStyles.borderRounded]}/>
            <Card.Content>
                <View style={[GlobalStyles.marginYsm]}>
                    
                    <Text variant='bodySmall'>
                        Created: {file.createdTime}
                    </Text>
                 
                    <Text variant='bodySmall'>
                        Owner: {file.owners[0].displayName}
                    </Text>
                    <Text variant='bodySmall'>
                        Size: {calculateFileSizeString( file.size)}
                    </Text>
                </View>
                <View style={[GlobalStyles.rowContainerWrap, GlobalStyles.marginYsm]}>
                    <View style={GlobalStyles.buttonContainer}>
                        <Button style={[GlobalStyles.buttonMain, GlobalStyles.button]} icon="eye" mode="contained" onPress={openBrowser} >View</Button>
                    </View>
                   
                </View>
   
            </Card.Content>
        </Card>
    )
}

export default GoogleVideoCard;