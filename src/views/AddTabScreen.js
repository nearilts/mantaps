import { View, Text, StatusBar, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import COLORS from '../const/color';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BASE_URL } from '../const/url';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddTabScreen = ({ navigation }) => {
  const url = BASE_URL;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    imei: '',
    code: '',
  });

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleNext = () => {
    console.log('Form Data:', formData);
    if (!formData.name || !formData.imei || !formData.code) {
      alert('Lengkapi Form Yang Tersedia.');
      return; // Hentikan fungsi jika ada kolom yang kosong
    }
    kirimdata();
  };

  const kirimdata = async () => {
    try {
      setIsLoading(true)
      let userInfo = await AsyncStorage.getItem('userInfo');
      userInfo = JSON.parse(userInfo);
      let token = userInfo.access_token.split('|')[1];
      console.log('formData', formData);

      const response = await axios.post(`${url}create-tab`, {
        name: formData.name,
        imei: formData.imei,
        code: formData.code,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsLoading(false)

      console.log('response', response.data);
      if (response.data.status == "Success") {
        alert('Data Success Save');
        navigation.navigate('ListTabScreen')
      } else {
        alert('Gagal Simpan');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Spinner visible={isLoading} />
      <ScrollView>
        <View style={{ paddingTop: 40 }}>
          <View>
            <View>
              <TouchableOpacity onPress={navigation.goBack} style={{ position: 'absolute', top: 10, left: 20, backgroundColor: COLORS.primary, borderRadius: 50, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
                <View style={{ left: 5 }}>
                  <Icon name="arrow-back-ios" size={28} color={COLORS.white} onPress={navigation.goBack} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', top: 20 }}>
              <Text style={{ color: COLORS.dark, fontSize: 22, fontWeight: 'bold' }}>Tambah Tab</Text>
            </View>
          </View>
        </View>

        <View style={{ paddingTop: 30, paddingLeft: 20, paddingBottom: 25 }}>
          <View style={{  borderRadius: 30, backgroundColor: COLORS.white }}>
            <View>
              <Text style={{ paddingLeft: 30, paddingTop: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}> Nama</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  placeholder="Isi Nama"
                  placeholderTextColor={COLORS.dark}
                />
              </View>

             
             
              <Text style={{ paddingLeft: 30, paddingTop: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}> No Imei</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  value={formData.imei}
                  onChangeText={(value) => handleInputChange('imei', value)}
                  placeholder="Isi Nomor IMEI"
                  placeholderTextColor={COLORS.dark}
                />
              </View>
              <Text style={{ paddingLeft: 30, paddingTop: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}> No code</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  value={formData.code}
                  onChangeText={(value) => handleInputChange('code', value)}
                  placeholder="Isi code"
                  placeholderTextColor={COLORS.dark}
                />
              </View>
              
              <View style={{ paddingTop: 20, alignItems: 'center', paddingBottom:40 }}>
                <TouchableOpacity
                  onPress={handleNext}
                  style={{ top: 10, backgroundColor: COLORS.primary, borderRadius: 10, width: 299, height: 60, justifyContent: 'center', alignItems: 'center' }}
                >
                  <Text style={{ color: COLORS.white, fontSize: 20, fontWeight: 'bold' }}>Simpan</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
  },
  input: {
    width: 299,
    height: 60,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: COLORS.white,
    color:COLORS.dark
  },
});

export default AddTabScreen;
