import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import BottomNavigation from './BottomNavigation';
import OnBoardScreen from '../views/OnBoardScreen';
import COLORS from '../const/color';
import LoginScreen from '../views/LoginScreen';
import ListTabScreen from '../views/ListTabScreen';
import AddTabScreen from '../views/AddTabScreen';
import ListKapalScreen from '../views/ListKapalScreen';
import FormPinjamScreen from '../views/FormPinjamScreen';
import PinjamScreen from '../views/PinjamScreen';
import ListTabTersedia from '../views/ListTabTersedia';
import ListTabTerpakai from '../views/ListTabTerpakai';
import FormKembaliScreen from '../views/FormKembaliScreen';
import HistoryScreen from '../views/HistoryScreen';
import HistoryDetail from '../views/HistoryDetail';
import { AuthContext } from '../context/AuthContext';
const Stack = createNativeStackNavigator();

const Navigation = () => {

    const {userInfo} = useContext(AuthContext);
  // console.log('userInfo APP', userInfo)

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="BoardScreen" component={OnBoardScreen} />
        <Stack.Screen name="Home" component={BottomNavigation} />
        {/* <Stack.Screen name="BottomNavigation" component={BottomNavigation} /> */}
        {/* <Stack.Screen name="LoginScreen" component={LoginScreen} /> */}
        <Stack.Screen name="ListTabScreen" component={ListTabScreen} />
        <Stack.Screen name="AddTabScreen" component={AddTabScreen} />
        <Stack.Screen name="ListKapalScreen" component={ListKapalScreen} />
        <Stack.Screen name="FormPinjamScreen" component={FormPinjamScreen} />
        <Stack.Screen name="PinjamScreen" component={PinjamScreen} />
        <Stack.Screen name="ListTabTersedia" component={ListTabTersedia} />
        <Stack.Screen name="ListTabTerpakai" component={ListTabTerpakai} />
        <Stack.Screen name="FormKembaliScreen" component={FormKembaliScreen} />
        <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
        <Stack.Screen name="HistoryDetail" component={HistoryDetail} />
        

        {userInfo.access_token  ? (
          <Stack.Screen name="LoginScreen" component={BottomNavigation}/>
        ) :
        (
          <Stack.Screen name="LoginScreen" component={LoginScreen}/>
        )
      }

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation