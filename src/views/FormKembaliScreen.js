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

const FormKembaliScreen = ({ navigation, route }) => {
  console.log(route.params);
  const data = route.params;

  const url = BASE_URL;
  const [isLoading, setIsLoading] = useState(false);

  const pbm = [
    { id: '1', name: 'PBM 1', },
    { id: '2', name: 'PBM 2', },
    { id: '3', name: 'PBM 3',  },
];


  const [formData, setFormData] = useState({
    nama_pengembali: '',
    no_pengembali: '',
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
      formData.nama_pengembali &&
      formData.no_pengembali &&
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
      
      formDatas.append('nama_pengembali', formData.nama_pengembali);
      formDatas.append('no_pengembali', formData.no_pengembali);
      if (formData.files.fotos) {
        formDatas.append('foto_pengembali', {
          uri: formData.files.fotos.uri,
          name: formData.files.fotos.fileName ,
          type: formData.files.fotos.type,
        });
      }
      if (formData.signature) {
        formDatas.append('signature', formData.signature);
      }
      console.log('formData', formDatas );
      
      const response = await axios.post(`${url}kembali/${data.id}`, formDatas, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsLoading(false);

      console.log('response', response.data.status);
      if (response.data.status === "Success") {
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
              <Text style={{ color: COLORS.dark, fontSize: 22, fontWeight: 'bold' }}>Pengembalian Tab</Text>
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
                  placeholderTextColor={COLORS.dark}
                  value={data.nama_kapal}
                  editable={false}
                />
              </View>

              <Text style={{ paddingLeft: 45, paddingTop: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}> Nama Dermaga</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  placeholder="Nama Dermaga"
                  placeholderTextColor={COLORS.dark}
                  value={data.nama_dermaga}
                  editable={false}
                />
              </View>

              <Text style={{ paddingLeft: 45, paddingTop: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}> PBM</Text>
              <View style={styles.slide}>
              <TextInput
                  style={styles.input}
                  placeholder="Nama pbm"
                  placeholderTextColor={COLORS.dark}
                  value={data.pbm}
                  editable={false}
                />
              </View>

              <Text style={{ paddingLeft: 45, paddingTop: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}> TAB Yang di Pinjam</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  placeholder="Isi TAB Yang di Pinjam"
                  placeholderTextColor={COLORS.dark}
                  value={data.nama_tab}
                  editable={false}
                />
              </View>

              <Text style={{ paddingLeft: 45, paddingTop: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}> Nama Peminjam</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  placeholder="Nama Peminjam"
                  placeholderTextColor={COLORS.dark}
                  value={data.nama_peminjam}
                  editable={false}
                />
              </View>

              <Text style={{ paddingLeft: 45, paddingTop: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}> No Hp Peminjam</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  placeholder="No Hp Peminjam"
                  placeholderTextColor={COLORS.dark}
                  value={data.no_peminjam}
                  editable={false}
                />
              </View>

              <Text style={{paddingLeft: 45, paddingTop: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}>Foto Serah Terima Peminjam</Text>
              <View style={styles.imageContainer}>
                <Image source={{ uri: data.foto_peminjam }} style={styles.image} />
              </View>

              <Text style={{paddingLeft: 45, paddingTop: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}>Tanda Tangan Peminjam</Text>
              <View style={styles.imageContainer}>
                <Image source={{ uri: data.ttd_peminjam }} style={styles.image} />
                
              </View>

              <View style={{ paddingTop: 20, alignItems: 'center', paddingBottom: 40 }}>
               
              </View>
            </View>
          </View>
        </View>


        <View style={{ paddingTop: 20, paddingLeft: 20, paddingRight: 20, paddingBottom: 25 }}>
          <View style={{ borderRadius: 30, backgroundColor: COLORS.secondgrey }}>
            <View>
              <Text style={{ paddingLeft: 45, paddingTop: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}> Nama Pengembali</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  placeholder="Nama Pengembali"
                  placeholderTextColor={COLORS.dark}
                  value={formData.nama_pengembali}
                  onChangeText={(value) => handleInputChange('nama_pengembali', value)}
                />
              </View>

              <Text style={{ paddingLeft: 45, paddingTop: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}> No Hp Pengembali</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  placeholder="No Hp Pengembali"
                  placeholderTextColor={COLORS.dark}
                  value={formData.no_pengembali}
                  onChangeText={(value) => handleInputChange('no_pengembali', value)}
                />
              </View>

              <Text style={{ paddingLeft: 45, paddingTop: 10, paddingBottom: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}>Foto Serah Terima Pengembali</Text>
              <View style={{ alignItems: 'center' }}>
                <View style={styles.featureRow}>
                  <FeatureItem icon="add-a-photo" text="Foto Pengembali*"
                    file={formData.files.fotos}
                    onPress={() => handleFilePick('fotos')}
                  />
                </View>
              </View>

              <Text style={{ paddingLeft: 45, paddingTop: 10, paddingBottom: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}>Tanda Tangan Pengembali</Text>
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
                    <Text style={styles.buttonText}>Clear</Text>
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


imageContainer: {
  alignItems: 'center',
  marginTop: 10,
},
image: {
  width: 200,
  height: 200,
  resizeMode: 'contain',
},
});

export default FormKembaliScreen;