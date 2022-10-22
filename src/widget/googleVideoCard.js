

import React from 'react'
import { Card, Button, Text } from 'react-native-paper';
import { View } from 'react-native';
import GlobalStyles from '../styles/global-styles';
import * as WebBrowser from 'expo-web-browser';

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
                    <Text variant='titleMedium'>{file.id}</Text>
                    <Text variant='labelSmall'>
                        Created: {file.createdTime}
                    </Text>
                    <Text variant='labelSmall'>
                        Owner: {file.owners[0].displayName}
                    </Text>
                    <Text variant='labelSmall'>
                        Size: {file.size}
                    </Text>
                </View>
                <View style={[GlobalStyles.rowContainer, GlobalStyles.marginYsm]}>
                    <View style={GlobalStyles.buttonContainer}>
                        <Button style={[GlobalStyles.buttonMain, GlobalStyles.button]} icon="eye" mode="contained" onPress={openBrowser} >View</Button>
                    </View>
                    <View style={GlobalStyles.buttonContainer}>
                        <Button style={[GlobalStyles.buttonMain, GlobalStyles.button]} icon="share" mode="contained" onPress={() => console.log('Share Test')} >Share</Button>
                    </View>
                </View>
                <View style={[GlobalStyles.marginYsm]}>
                    <Text variant='labelLarge'>
                        Warning! Point of no return:
                    </Text>
                    <Button style={GlobalStyles.button} icon="delete" mode="outlined" onPress={() => deleteDriveFile(file)} > Delete</Button>
                </View>
            </Card.Content>
        </Card>
    )
}

export default GoogleVideoCard;