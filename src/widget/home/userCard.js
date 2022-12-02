import React from 'react';
import { View } from 'react-native';
import GlobalStyles from '../../styles/global-styles';
import { Text, Avatar , Divider} from 'react-native-paper';

const UserCard = ({ user }) => {
  return (
    

      <View style={[GlobalStyles.rowContainerWrap, GlobalStyles.marginYsm]}>
        <View style={GlobalStyles.avatarImg}>
          <Avatar.Image style={[GlobalStyles.marginYsm]} size={64} source={{ uri: user.picture }} />
        </View>
        <View style={GlobalStyles.avatarText}>
          <Text variant='titleMedium' style={GlobalStyles.whiteText}>
            Hi, {user.name}
          </Text>

          <Text variant='bodySmall' style={GlobalStyles.whiteText}>
            {user.email}
          </Text>

          <Divider style={[ GlobalStyles.marginYsm]}  />
          <Text variant='bodySmall' style={GlobalStyles.whiteText}> <Text style={[GlobalStyles.smallGreenDot]} >{'\u2B24'}</Text> Permissions Granted</Text>
        </View>
      </View>
  
  );
}

export default UserCard;