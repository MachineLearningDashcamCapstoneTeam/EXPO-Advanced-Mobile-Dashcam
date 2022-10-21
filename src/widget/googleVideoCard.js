

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
        <Card key={file.id} mode="elevated" style={GlobalStyles.card}>
            <Card.Cover source={{ uri: file.thumbnailLink }} />
            <Card.Content>
                <Text style={[GlobalStyles.paddingYsm]} variant='titleMedium'>{file.id}</Text>

                <Text variant='labelSmall'>
                    Created: {file.createdTime}
                </Text>
                <Text variant='labelSmall'>
                    Owner: {file.owners[0].displayName}
                </Text>
                <Text variant='labelSmall'>
                    Size: {file.size}
                </Text>

                <Text style={[GlobalStyles.paddingYsm]} variant='labelLarge'>
                    Options:
                </Text>
                <View style={[GlobalStyles.divSpaceBetween, GlobalStyles.rowContainer]}>
                    <Button style={[GlobalStyles.button]} icon="eye" mode="contained" onPress={openBrowser} >View</Button>

                    <Button style={[GlobalStyles.buttonSecondary, GlobalStyles.button]} icon="share" mode="contained" onPress={() => console.log('Share Test')} >Share</Button>

                    <Button style={[GlobalStyles.buttonWarning, GlobalStyles.button]} icon="robot" mode="contained" onPress={() => console.log('AI Test')} >A.I</Button>
                </View>
                <Text style={[GlobalStyles.paddingYsm]} variant='labelLarge'>
                    Warning! Point of no return:
                </Text>
                <Button style={GlobalStyles.button} icon="delete" mode="outlined" onPress={() => deleteDriveFile(file)} > Delete</Button>

            </Card.Content>
        </Card>
    )
}

export default GoogleVideoCard;