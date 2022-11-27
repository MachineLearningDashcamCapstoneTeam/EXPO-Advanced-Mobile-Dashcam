

import React from 'react'
import { Card, IconButton, Text , MD3Colors} from 'react-native-paper';
import { View } from 'react-native';
import GlobalStyles from '../styles/global-styles';

const LockButton = ({savedFavoriteVideosIds, videoAsset, deleteVideoFromFavoriteVideos, saveVideoToSavedVideoIds}) => {
    const result = savedFavoriteVideosIds.includes(videoAsset.id);
    if (result) {
      return (<IconButton size={22} icon="heart-outline" iconColor={MD3Colors.neutral100} onPress={() => deleteVideoFromFavoriteVideos(videoAsset)}>
        Unfavorite
      </IconButton>)
    }
    else {
      return (<IconButton size={22} icon="heart"  iconColor={MD3Colors.neutral100} onPress={() => saveVideoToSavedVideoIds(videoAsset)}>
        Favorite
      </IconButton>)
    }
  }

export default LockButton;