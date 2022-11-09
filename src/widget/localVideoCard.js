

import React from 'react'
import { Card, Button, Text } from 'react-native-paper';
import { View } from 'react-native';
import GlobalStyles from '../styles/global-styles';
import LockButton from './lockButton';
import { timeStampToDate } from '../utils/fetch-time';

const LocalVideoCard = ({ videoAsset, savedFavoriteVideosIds, getInfo, deleteVideo, deleteVideoFromFavoriteVideos, saveVideoToSavedVideoIds }) => {

    let isLocked = savedFavoriteVideosIds.includes(videoAsset.id);
    return (
        <Card key={videoAsset.id} mode="elevated" onPress ={()=> getInfo(videoAsset)} style={[GlobalStyles.borderRounded, GlobalStyles.marginYsm]}>
            <Card.Cover source={{ uri: videoAsset.uri }} style={[GlobalStyles.borderRounded]} />
            
        </Card>
    )
}

export default LocalVideoCard;