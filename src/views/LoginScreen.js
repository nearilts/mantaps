import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image, StatusBar } from 'react-native'
import React, { createContext,useContext, useState } from 'react'
import Spinner from 'react-native-loading-spinner-overlay'
import COLORS from '../const/color'
import { AuthContext } from '../context/AuthContext'
const LoginScreen = ({navigation}) => {

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)

    const {isLoading,logins} = useContext(AuthContext);

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1, }}>
      <StatusBar translucent backgroundColor={COLORS.primary} />

      <View style={{ ...style.header, marginTop: 20 }}>
        <View>
          <View style={{ marginTop: 30, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={ require('../assets/Username.png') }  resizeMode="contain"  style={{ width:212, height:40}}  />
          </View>
        </View>
      </View>
      <View style={{ backgroundColor:COLORS.primary, height:120}}>
        {/* View dengan border radius di bagian paling bawah */}
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View style={{ borderTopRightRadius: 25, borderTopLeftRadius: 25, backgroundColor: COLORS.white, height: 30 }}></View>
        </View>
      </View>
      <View style={{  backgroundColor:COLORS.white}}>

      <Spinner visible={isLoading} />
      <View style={style.wrapper}>
        <View style={{marginLeft:20, marginTop:20}}>
          <Text style={{color:COLORS.dark, fontSize:16, fontWeight:'bold'}}>Login To Your Account</Text>

          <View style={{marginTop:50}}>
            <Text style={{color:COLORS.dark, fontSize:16, marginBottom:10}}>Username</Text>
            <TextInput value={email} onChangeText={text => setEmail(text)} placeholder='Username' style={style.input} placeholderTextColor={COLORS.dark} />
            <Text style={{color:COLORS.dark, fontSize:16, marginBottom:10}}>Password</Text>
            <TextInput value={password} onChangeText={text => setPassword(text)} placeholder='Password' secureTextEntry style={style.input} placeholderTextColor={COLORS.dark} />
              
            <TouchableOpacity style={{backgroundColor: COLORS.primary, padding: 10, alignItems:'center', borderRadius: 10}} 
                onPress={() => {logins(email, password)}}
                  >
                  <Text style={{color: COLORS.white, fontSize: 18, fontWeight: 'bold'}}>LOGIN</Text>
              </TouchableOpacity>
          </View>
        </View>

      </View>
    </View>
    </SafeAreaView>
  )
}
const style = StyleSheet.create({
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
  },
    container:{
        alignItems: 'center',
        justifyContent: 'center'
    },
    wrapper:{
        width: '95%'
    }, 
    input:{
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.dark,
        borderRadius: 10,
        paddingHorizontal: 14,
        color: COLORS.dark
    }
})

export default LoginScreen
