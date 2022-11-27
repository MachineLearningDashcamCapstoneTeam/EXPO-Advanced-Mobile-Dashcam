import React from 'react';
import { View } from 'react-native';
import GlobalStyles from '../../styles/global-styles';
import { Text, Avatar } from 'react-native-paper';

const UserCard = ({ user }) => {
  return (
    

      <View style={[GlobalStyles.rowContainerWrap, GlobalStyles.marginYsm]}>
        <View style={GlobalStyles.avatarImg}>
          <Avatar.Image style={[GlobalStyles.marginYsm]} size={64} source={{ uri: user.picture }} />
        </View>
        <View style={GlobalStyles.avatarText}>
          <Text variant='labelLarge' style={GlobalStyles.whiteText}>
            Hi {user.name}
          </Text>
         
        </View>
      </View>
  
  );
}

export default UserCard;