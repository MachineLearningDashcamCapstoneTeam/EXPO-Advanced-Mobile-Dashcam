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
    primary: '#456de4',
    secondary: '#fe1615',
    tertiary: '#a1b2c3'
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <RootNavigation />
      </PaperProvider>
  );
}