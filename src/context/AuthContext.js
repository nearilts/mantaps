// AuthContext.js

import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../const/url';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false)


  const logins = (username, password) => {
    setIsLoading(true);
    console.log('login', `${BASE_URL}login`);

    axios
      .post(`${BASE_URL}login`, { username, password})
      .then((res) => {
        let userData = res.data;
        setUserInfo(userData);
        AsyncStorage.setItem('userInfo', JSON.stringify(userData))
          .then(() => {
            setIsLoading(false);
            console.log('userInfos', userData.access_token);
            // alert(userData.message)
          })
          .catch((err) => {
            alert('Error saving userInfo to AsyncStorage: '+ err)
            console.log('Error saving userInfo to AsyncStorage:', err);
            setIsLoading(false);
          });
      })
      .catch((err) => {
          alert('error login: '+err)
        console.log('error login', err);
        setIsLoading(false);
      });
  };

  const profils = async (token) => {
      axios
        .get(`${BASE_URL}user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          let userData = res.data;
          console.log('PROFILE', userData)
        })
        .catch((err) => {
          console.log('error login', err);
          setUserInfo({})
          AsyncStorage.removeItem('userInfo')
          setIsLoading(false);
        });
    };
    const logouts = async (navigation) => {
      setUserInfo({})
      AsyncStorage.removeItem('userInfo')

      navigation.navigate('LoginScreen');
    };

    const isLoggedIn = async () => {
      try {
        setSplashLoading(true);
    
        // Ambil data userInfo dari AsyncStorage
        let userInfo = await AsyncStorage.getItem('userInfo');
        console.log('USER', userInfo); // Debug: pastikan userInfo tidak null atau undefined
    
        // Cek apakah userInfo memiliki nilai
        if (userInfo) {
          // Parse string JSON menjadi objek JavaScript
          userInfo = JSON.parse(userInfo);
          console.log('USER (parsed)', userInfo); // Debug: pastikan userInfo sudah dalam bentuk objek
    
          // Akses access_token dari userInfo jika ada
          if (userInfo.access_token) {
            let token = userInfo.access_token.split('|')[1];
            console.log('CEKKKKK', token); // Debug: pastikan token dapat diakses dengan benar
    
            // Panggil fungsi profils dengan token sebagai parameter
            profils(token);
    
            // Set userInfo ke dalam state
            setUserInfo(userInfo);
          } else {
            // Jika access_token tidak ada, mungkin ada kesalahan dalam format data userInfo
            console.error('Access token tidak ditemukan di userInfo');
            setUserInfo({});
          }
        } else {
          // Jika userInfo kosong (biasanya berarti pengguna belum login)
          console.log('userInfo kosong atau tidak ditemukan');
          setUserInfo({});
        }
    
        // Hentikan loading splash screen
        setSplashLoading(false);
      } catch (error) {
        console.error('Error di isLoggedIn:', error);
        // Tangani error jika terjadi
        setSplashLoading(false);
      }
    };
    


  useEffect(() => {
    isLoggedIn();
  }, [])
  return (
    <AuthContext.Provider value={{ 
      isLoading,
      userInfo,
      splashLoading,
      logins,
      logouts

     }}>
      {children}
    </AuthContext.Provider>
  );
};
