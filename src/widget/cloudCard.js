import React from 'react';
import { View } from 'react-native';
import GlobalStyles from '../styles/global-styles';

const CloudCard = ({fetchGoogle}) => {
    return (
        <View style={[GlobalStyles.divDark, GlobalStyles.attention, GlobalStyles.flex3]}>
          <Text variant='titleLarge' style={GlobalStyles.whiteText}>
            Uploading to the Cloud
          </Text>
          <Text variant='labelLarge' style={[GlobalStyles.paddingYmd, GlobalStyles.whiteText]}>
            Want to upload your videos to the cloud? Use the share button in the preview screen or if you're signed in, use the upload to Google Drive button instead.
          </Text>

          <Button
            style={GlobalStyles.button} icon="google" mode="elevated"
            onPress={() => fetchGoogle()}>
            Login to Google Drive
          </Button>
        </View>
      );
}

export default CloudCard;