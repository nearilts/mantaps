import { ImageBackground, StatusBar, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import COLORS from '../const/color';

const OnBoardScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor:COLORS.secondary }}>
      <StatusBar translucent backgroundColor="rgba(0,0,0,0)" />

        <View style={{justifyContent:'center', alignItems:'center', top:230}}> 
            <ImageBackground style={{ width:300, height:300}} source={require('../assets/onboard.png')}>
            </ImageBackground>
        </View>
        <View style={styles.details}>
        <Image source={ require('../assets/MANTAPPS.png') }  resizeMode="contain"  style={{ width:212, height:40}}  />

          <Text style={{ color: COLORS.dark, lineHeight: 25, marginTop: 10 }}>
            Aplikasi Monitoring Peminjaman TAB oleh PBM 
          </Text>
          <TouchableOpacity style={styles.btn} activeOpacity={0.8} onPress={() => navigation.navigate("LoginScreen")}>
          <Text style={{ color: COLORS.white, fontWeight: 'bold', fontSize:20 }}>Get Started</Text>
        </TouchableOpacity>
        </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  details: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 40,
    padding: 10,
    top:-50
  },
  btn: {
    marginTop:30,
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30, 
    alignSelf: 'flex-start',  // Aligns the button to the start (left) of its container
  }
});

export default OnBoardScreen;
