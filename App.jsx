import React from 'react';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import './src/services/firebaseService';
import RootNavigation from './src/routes/index';


const theme = {
  ...DefaultTheme,
  roundness: 2,
  version: 3,
  colors: {
    ...DefaultTheme.colors,
    primary: '#142D5E',
    secondary: '#fe1615',
    tertiary: '#a1b2c3',
    accent: '#f1c40f',
    error: '#f13a59',
    text: '#142D5E',
    background: '#ffffff',
    surface: '#ffffff',
    disabled: '#a1b2c3',
    placeholder: '#a1b2c3',
    backdrop: '#142D5E',
    notification: '#f13a59',
    

  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <RootNavigation />
      </PaperProvider>
  );
}