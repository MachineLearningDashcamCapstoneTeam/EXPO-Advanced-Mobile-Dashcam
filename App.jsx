import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import './src/services/firebaseService';
import RootNavigation from './src/routes/index';

export default function App() {
  return (
    <PaperProvider>
      <RootNavigation />
      </PaperProvider>
  );
}