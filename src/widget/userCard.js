import React from 'react';
import { View } from 'react-native';
import GlobalStyles from '../styles/global-styles';
import { Text, Avatar } from 'react-native-paper';

const UserCard = ({ user }) => {
  return (
    <View style={[GlobalStyles.divDark, GlobalStyles.attention, GlobalStyles.flex3]}>

      <View style={[GlobalStyles.rowContainerWrap, GlobalStyles.marginYsm]}>
        <View style={GlobalStyles.avatarImg}>
          <Avatar.Image style={[GlobalStyles.marginYsm]} size={64} source={{ uri: user.picture }} />
        </View>
        <View style={GlobalStyles.avatarText}>
          <Text variant='titleLarge' style={GlobalStyles.whiteText}>
            {user.name}
          </Text>
          <Text variant='labelLarge' style={GlobalStyles.whiteText}>
            {user.email}
          </Text>
        </View>
      </View>
      <View style={[GlobalStyles.marginYsm]}>

        <Text variant='labelLarge' style={[GlobalStyles.whiteText]}>
          Want to upload your videos to the cloud? Use the share button in the preview screen or if you're signed in, use the upload to Google Drive button instead.
        </Text>
      </View>
    </View>
  );
}

export default UserCard;