

import React from 'react'
import { Card, Button, Text } from 'react-native-paper';
import { View } from 'react-native';
import GlobalStyles from '../styles/global-styles';
import LockButton from './lockButton';
import { timeStampToDate } from '../utils/fetch-time';

const LocalVideoCard = ({ videoAsset, savedFavoriteVideosIds, getInfo, deleteVideo, deleteVideoFromFavoriteVideos, saveVideoToSavedVideoIds }) => {

    let isLocked = savedFavoriteVideosIds.includes(videoAsset.id);
    return (
        <Card key={videoAsset.id} mode="elevated" style={[GlobalStyles.borderRounded, GlobalStyles.marginYsm]}>
            <Card.Cover source={{ uri: videoAsset.uri }} style={[GlobalStyles.borderRounded]} />
            <Card.Content>
                <View style={[GlobalStyles.marginYsm]}>
                    <Text variant='titleMedium'>{videoAsset.id}</Text>
                    <Text variant='labelMedium'>
                        Created: {timeStampToDate(videoAsset.creationTime)}
                    </Text>
                    <Text variant='labelMedium'>
                        Duration: {videoAsset.duration}s
                    </Text>
                    <Text variant='labelMedium'>
                        Video Id: {videoAsset.id}
                    </Text>
                </View>
                <View style={[GlobalStyles.rowContainer, GlobalStyles.marginYsm]}>
                    <View style={GlobalStyles.buttonContainer}>
                        <Button style={[GlobalStyles.buttonMain, GlobalStyles.button]} icon="eye" mode="contained" onPress={() => getInfo(videoAsset)}>
                            View
                        </Button>
                    </View>
                    <View style={GlobalStyles.buttonContainer}>

                        <LockButton isLocked={isLocked} savedFavoriteVideosIds={savedFavoriteVideosIds} videoAsset={videoAsset} deleteVideoFromFavoriteVideos={deleteVideoFromFavoriteVideos} saveVideoToSavedVideoIds={saveVideoToSavedVideoIds} />

                    </View>
                </View>
                <View style={[GlobalStyles.divLine, GlobalStyles.marginYsm]} />

                <View style={[GlobalStyles.marginYsm]}>
                    <Button style={GlobalStyles.button} icon="delete" mode="outlined" onPress={() => deleteVideo(videoAsset)} > Delete</Button>
                </View>
            </Card.Content>
        </Card>
    )
}

export default LocalVideoCard;