import React from 'react';
import { View, Image } from 'react-native';

import GlobalStyles from '../styles/global-styles';

function SplashScreen() {
  return (
    <View style={GlobalStyles.flex1}>
      <Image source={require('../../assets/AppLogoBlue.png')} />
    </View>
  );

}

export default SplashScreen;