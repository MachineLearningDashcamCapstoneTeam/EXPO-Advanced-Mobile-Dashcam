import React from 'react';
import { View } from 'react-native';
import GlobalStyles from '../styles/global-styles';

const UserCard = ({user}) => {
    return (
        <View style={[GlobalStyles.divDark, GlobalStyles.attention, GlobalStyles.flex3]}>
          <Text variant='titleLarge' style={GlobalStyles.whiteText}>
            {user.name}
          </Text>
          <Text variant='labelLarge' style={GlobalStyles.whiteText}>
            {user.email}
          </Text>
          <Avatar.Image style={{ marginVertical: 10 }} size={64} source={{ uri: user.picture }} />
          <Text variant='labelLarge' style={{ color: 'white', marginVertical: 10 }}>
          Want to upload your videos to the cloud? Use the share button in the preview screen or if you're signed in, use the upload to Google Drive button instead.
          </Text>
        </View>
      );
}

export default UserCard;