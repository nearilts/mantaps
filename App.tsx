import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Navigation from './src/navigation/Navigation';
import { AuthProvider } from './src/context/AuthContext';
const Stack = createNativeStackNavigator();

const App = () => {


  return (
    <AuthProvider>
    <Navigation />
    </AuthProvider>
  );
};

export default App;