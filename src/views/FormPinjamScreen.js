import { View, Text, StatusBar, TouchableOpacity, ScrollView, TextInput, StyleSheet, Image, Alert } from 'react-native';
import React, { useState, useRef } from 'react';
import COLORS from '../const/color';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BASE_URL } from '../const/url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Signature from 'react-native-signature-canvas';
import { WebView } from 'react-native-webview';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import ImageResizer from 'react-native-image-resizer';
const FormPinjamScreen = ({ navigation, route }) => {

  const url = BASE_URL;
  const [isLoading, setIsLoading] = useState(false);


  const item = route.params?.item ?? null;
  const tab = route.params?.tab ?? null;

  console.log(item); // Menampilkan parameter item yang dilewatkan
  console.log(tab);

  const pbm = item.loadPbm.filter(item => item.tipe === 'PBM');;


  const [formData, setFormData] = useState({
    nama_kapal: item.vessel?.name,
    jetty: item.jetty?.desc,
    pbm: '',
    tab : tab.name,
    nama_peminjam : '',
    no_peminjam : '',
    files: {
      fotos: null,
    },
    signature: null,
  });
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const signatureRef = useRef(null);

  const handleSignature = signature => {
    setFormData({
      ...formData,
      signature: signature,
    });
  };

  const handleClear = () => {
    signatureRef.current.clearSignature();
  };

  const handleConfirm = () => {
    signatureRef.current.readSignature();
  };

  const handleSave = () => {
    console.log('Form Data:', formData);
    if (
      formData.nama_kapal &&
      formData.jetty &&
      formData.pbm &&
      formData.tab &&
      formData.nama_peminjam &&
      formData.no_peminjam &&
      formData.files.fotos &&
      formData.signature
    ) {
      kirimdata(); // Panggil fungsi untuk mengirim data ke backend jika semua data telah diisi
    } else {
      Alert.alert('Error', 'Silakan lengkapi semua kolom yang diperlukan.');
    }

  };

  const kirimdata = async () => {
    try {
        setIsLoading(true);
        let userInfo = await AsyncStorage.getItem('userInfo');
      userInfo = JSON.parse(userInfo);
      let token = userInfo.access_token.split('|')[1];

      const formDatas = new FormData();
      
      formDatas.append('nama_kapal', formData.nama_kapal);
      formDatas.append('nama_dermaga', formData.jetty);
      formDatas.append('pbm', formData.pbm);
      formDatas.append('nama_tab', formData.tab);
      formDatas.append('nama_peminjam', formData.nama_peminjam);
      formDatas.append('no_peminjam', formData.no_peminjam);
      formDatas.append('imei', tab.imei);
      if (formData.files.fotos) {
        formDatas.append('foto_peminjam', {
          uri: formData.files.fotos.uri,
          name: formData.files.fotos.fileName ,
          type: formData.files.fotos.type,
        });
      }
      if (formData.signature) {
        formDatas.append('signature', formData.signature);
      }
      console.log('formData', formDatas );
      
      const response = await axios.post(`${url}pinjam`, formDatas, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsLoading(false);

      console.log('response', response.data);
      if (response.data.status == "Success") {
        alert('Data Success Save');
        navigation.navigate('Home')
      } else {
        alert('Gagal Simpan');
      }
    } catch (error) {
      console.error(error);
    }
  };


  const handleInputChange = async (key, value) => {
    setFormData({ ...formData, [key]: value });
    

  };
  
const handleFilePick = async (fileType) => {
  Alert.alert(
    "Pilih Sumber Gambar",
    "Pilih Kamera Atau Galery",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      {
        text: "Camera",
        onPress: () => launchCamera({ mediaType: 'photo', quality: 1 }, async (response) => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.error('ImagePicker Error: ', response.error);
          } else {
            // Kompres gambar sebelum menyimpannya
            const resizedImage = await ImageResizer.createResizedImage(response.assets[0].uri, 800, 600, 'JPEG', 80);
            
            setFormData({
              ...formData,
              files: {
                ...formData.files,
                [fileType]: {
                  ...response.assets[0],
                  uri: resizedImage.uri, // Menggunakan URI dari gambar yang telah dikompres
                },
              },
            });
          }
        })
      },
      {
        text: "Gallery",
        onPress: () => launchImageLibrary({ mediaType: 'photo', quality: 1 }, async (response) => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.error('ImagePicker Error: ', response.error);
          } else {
            // Kompres gambar sebelum menyimpannya
            const resizedImage = await ImageResizer.createResizedImage(response.assets[0].uri, 800, 600, 'JPEG', 80);
            
            setFormData({
              ...formData,
              files: {
                ...formData.files,
                [fileType]: {
                  ...response.assets[0],
                  uri: resizedImage.uri, // Menggunakan URI dari gambar yang telah dikompres
                },
              },
            });
          }
        })
      }
    ],
    { cancelable: true }
  );
};


  const FeatureItem = ({ icon, text, file, onPress, users }) => (
    <View style={styles.featureItem}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.iconContainer}>
          {users ? (
            <Image source={{ uri: BASE_URL + users }} style={styles.imagePreview} />
          ) : file ? (
            <Image source={{ uri: file.uri }} style={styles.imagePreview} />
          ) : (
            <Icon name={icon} size={45} color={COLORS.primary} />
          )}
        </View>
      </TouchableOpacity>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 , backgroundColor:COLORS.white}}>
      <Spinner visible={isLoading} />
      <ScrollView scrollEnabled={scrollEnabled}>
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
              <Text style={{ color: COLORS.dark, fontSize: 22, fontWeight: 'bold' }}>Pinjam Tab</Text>
            </View>
          </View>
        </View>

        <View style={{ paddingTop: 40, paddingLeft: 20, paddingRight: 20, paddingBottom: 25 }}>
          <View style={{ borderRadius: 30, backgroundColor: COLORS.secondgrey }}>
            <View>
              <Text style={{ paddingLeft: 45, paddingTop: 20, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}> Nama Kapal</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  placeholder="Nama Kapal"
                  placeholderTextColor={COLORS.grey}
                  value={item.vessel?.name}
                  editable={false}
                  onValueChange={(value) => handleInputChange('nama_kapal', value)}
                />
              </View>

              <Text style={{ paddingLeft: 45, paddingTop: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}> Nama Dermaga</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  placeholder="Nama Dermaga"
                  placeholderTextColor={COLORS.grey}
                  value={item.jetty?.desc}
                  editable={false}
                  onValueChange={(value) => handleInputChange('jetty', value)}
                />
              </View>

              <Text style={{ paddingLeft: 45, paddingTop: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}> PBM</Text>
              <View style={styles.slide}>
              <View style={{ ...styles.input, flexDirection: 'row', alignItems: 'center' }}>
              <Picker
                   style={{
                    width: 280,
                    height: 60,color:COLORS.dark}}
                  selectedValue={formData.pbm}
                  onValueChange={(value) => handleInputChange('pbm', value)}
                >
                  {pbm.map((item) => (
                    <Picker.Item key={item.name} label={item.name} value={item.name} />
                  ))}
                </Picker>
                </View>
              </View>

              <Text style={{ paddingLeft: 45, paddingTop: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}> TAB Yang di Pinjam</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  placeholder="Isi TAB Yang di Pinjam"
                  placeholderTextColor={COLORS.grey}
                  value={tab.name}
                  editable={false}
                  onValueChange={(value) => handleInputChange('tab', value)}
                />
              </View>

              <Text style={{ paddingLeft: 45, paddingTop: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}> Nama Peminjam</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  placeholder="Nama Peminjam"
                  placeholderTextColor={COLORS.grey}
                  value={formData.nama_peminjam}
                  onChangeText={(value) => handleInputChange('nama_peminjam', value)}
                />
              </View>

              <Text style={{ paddingLeft: 45, paddingTop: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}> No Hp Peminjam</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  placeholder="No Hp Peminjam"
                  placeholderTextColor={COLORS.grey}
                  value={formData.no_peminjam}
                  onChangeText={(value) => handleInputChange('no_peminjam', value)}
                />
              </View>

              <Text style={{ paddingLeft: 45, paddingTop: 10, paddingBottom: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}>Foto Serah Terima Penerima</Text>
              <View style={{ alignItems: 'center' }}>
                <View style={styles.featureRow}>
                  <FeatureItem icon="add-a-photo" text="Foto Peminjam*"
                    file={formData.files.fotos}
                    onPress={() => handleFilePick('fotos')}
                  />
                </View>
              </View>

              <Text style={{ paddingLeft: 45, paddingTop: 10, paddingBottom: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}>Tanda Tangan</Text>
              <View style={{ alignItems: 'center' }}>
                <Signature
                  ref={signatureRef}
                  onOK={handleSignature}
                  onBegin={() => setScrollEnabled(false)}
                  onEnd={() => setScrollEnabled(true)}
                  descriptionText="Sign"
                  clearText="Clear"
                  confirmText="Save"
                  webStyle={`.m-signature-pad--footer {display: none; margin: 0px;}`}
                  backgroundColor={COLORS.white}
                  penColor={COLORS.dark}
                  style={styles.signature}
                />
                <View style={styles.signatureButtons}>
                  <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                    <Text style={styles.buttonText}>Hapus</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
                  <Text style={styles.buttonText}>Simpan TTD</Text>
                </TouchableOpacity>
                </View>
              </View>

              <View style={{ paddingTop: 20, alignItems: 'center', paddingBottom: 40 }}>
                <TouchableOpacity
                onPress={handleSave}
                  style={{ top: 10, backgroundColor: COLORS.primary, borderRadius: 10, width: 299, height: 60, justifyContent: 'center', alignItems: 'center' }}
                >
                  <Text style={{ color: COLORS.white, fontSize: 20, fontWeight: 'bold' }}>Simpan Data</Text>
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
backgroundColor:COLORS.white,
color: COLORS.dark,
},
featureRow: {
borderWidth: 1,
borderRadius: 10,
borderColor: COLORS.grey,
flexDirection: 'row',
paddingTop: 20,
paddingLeft: 20,
alignItems: 'center',
},
featureItem: {
paddingRight: 20,
alignItems: 'center',
},
iconContainer: {
width: 130,
height: 130,
borderRadius: 15,
backgroundColor: COLORS.white,
justifyContent: 'center',
alignItems: 'center',
},
imagePreview: {
width: 130,
height: 130,
borderRadius: 15,
},
signature: {
width: 300,
height: 200,
borderWidth: 1,
borderColor: COLORS.grey,
marginTop: 10,
},
signatureButtons: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginTop: 10,
},
clearButton: {
  backgroundColor: COLORS.grey,
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 10,
},
confirmButton: {
  backgroundColor: COLORS.primary,
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 10,
  marginLeft:20
},
buttonText: {
color: COLORS.white,
fontSize: 16,
fontWeight: 'bold',
},
});

export default FormPinjamScreen;