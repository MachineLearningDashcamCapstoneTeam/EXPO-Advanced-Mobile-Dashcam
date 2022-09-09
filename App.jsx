import React from 'react';
import { ThemeProvider } from 'react-native-elements';
import './src/services/firebaseService';
import RootNavigation from './src/routes/index';

export default function App() {
  return (
    <ThemeProvider>
      <RootNavigation />
    </ThemeProvider>
  );
}