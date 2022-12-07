import React from 'react';
import { View } from 'react-native';
import GlobalStyles from '../../styles/global-styles';
import { Text, Button } from 'react-native-paper';
const DefaultCard = ({ fetchGoogle }) => {
      return (
            <Button style={GlobalStyles.button} icon="google" mode="elevated" onPress={fetchGoogle} >Sign in with Google</Button>
      );
}
export default DefaultCard;