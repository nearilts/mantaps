import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/MaterialIcons'
import COLORS from '../const/color'
import HomeScreen from '../views/HomeScreen'
import ListTabScreen from '../views/ListTabScreen'
import AddTabScreen from '../views/AddTabScreen'
const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        // Tentukan ikon berdasarkan nama rute
        let iconName;
        if (route.name === "HomeScreen") {
          iconName = "home";
        }  else if (route.name === "ListTabScreen") {
          iconName = "format-list-numbered";
        }  else if (route.name === "AddTabScreen") {
          iconName = "format-list-bulleted-add";
        } 

        // Kembalikan komponen Ionicons dengan nama ikon yang sesuai
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: 'gray'
    })}
  >
    <Tab.Screen name="HomeScreen" options={{title:'Home'}}  component={HomeScreen} />
    <Tab.Screen name="ListTabScreen" options={{title:'List Tab'}}  component={ListTabScreen} />
    <Tab.Screen name="AddTabScreen" options={{title:'Add Tab'}}  component={AddTabScreen} />
  </Tab.Navigator>
  )
}

export default BottomNavigation