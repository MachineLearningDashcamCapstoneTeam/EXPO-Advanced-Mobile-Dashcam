

import React from 'react'
import { Card, Button, Text } from 'react-native-paper';
import { View } from 'react-native';
import GlobalStyles from '../styles/global-styles';

const LockButton = ({savedFavoriteVideosIds, videoAsset, deleteVideoFromFavoriteVideos, saveVideoToSavedVideoIds}) => {
    const result = savedFavoriteVideosIds.includes(videoAsset.id);
    if (result) {
      return (<Button style={[GlobalStyles.button]} icon="lock-open-variant" mode="outlined" onPress={() => deleteVideoFromFavoriteVideos(videoAsset)}>
        Unlock
      </Button>)
    }
    else {
      return (<Button style={[GlobalStyles.buttonMain, GlobalStyles.button]} icon="lock" mode="contained" onPress={() => saveVideoToSavedVideoIds(videoAsset)}>
        Lock
      </Button>)
    }
  }

export default LockButton;