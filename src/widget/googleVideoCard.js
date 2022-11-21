

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
        <Card key={file.id} mode="elevated" style={[GlobalStyles.borderRounded, GlobalStyles.marginYsm]}>
            <Card.Cover source={{ uri: file.thumbnailLink }} style={[GlobalStyles.borderRounded]} />
            <Card.Content>
                <View style={[GlobalStyles.marginYsm]}>
                    
                    <Text variant='labelMedium'>
                        Created: {file.createdTime}
                    </Text>
                 
                    <Text variant='labelMedium'>
                        Owner: {file.owners[0].displayName}
                    </Text>
                    <Text variant='labelMedium'>
                        Size: {calculateFileSizeString( file.size)}
                    </Text>
                </View>
                <View style={[GlobalStyles.rowContainerWrap, GlobalStyles.marginYsm]}>
                    <View style={GlobalStyles.buttonContainer}>
                        <Button style={[GlobalStyles.buttonMain, GlobalStyles.button]} icon="eye" mode="contained" onPress={openBrowser} >View</Button>
                    </View>
                    <View style={GlobalStyles.buttonContainer}>
                        <Button style={[GlobalStyles.buttonMain, GlobalStyles.button]} icon="share" mode="contained" onPress={() => console.log('Share Test')} >Share</Button>
                    </View>
                </View>
                <View style={[GlobalStyles.divLine, GlobalStyles.marginYsm]} />
                <View style={[GlobalStyles.marginYsm]}>
                    <Button style={[GlobalStyles.buttonDangerOutline]} icon="delete" mode="outlined" onPress={() => deleteDriveFile(file)} > Delete</Button>
                </View>
            </Card.Content>
        </Card>
    )
}

export default GoogleVideoCard;