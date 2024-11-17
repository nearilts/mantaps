import { View, Text, StatusBar, TouchableOpacity, ScrollView, TextInput, StyleSheet, Image, Alert } from 'react-native';
import React, { useState, useRef } from 'react';
import COLORS from '../const/color';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BASE_URL } from '../const/url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Signature from 'react-native-signature-canvas';
import { WebView } from 'react-native-webview';

const PinjamScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    nama: '',
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
          onPress: () => launchCamera({ mediaType: 'photo', quality: 1 }, (response) => {
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.error('ImagePicker Error: ', response.error);
            } else {
              setFormData({
                ...formData,
                files: {
                  ...formData.files,
                  [fileType]: response.assets[0],
                },
              });
            }
          })
        },
        {
          text: "Gallery",
          onPress: () => launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.error('ImagePicker Error: ', response.error);
            } else {
              setFormData({
                ...formData,
                files: {
                  ...formData.files,
                  [fileType]: response.assets[0],
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
    <View style={{ flex: 1 }}>
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

        <View style={{ paddingTop: 30, paddingLeft: 20, paddingBottom: 25 }}>
          <View style={{ borderRadius: 30, backgroundColor: COLORS.white }}>
            <View>
              <Text style={{ paddingLeft: 30, paddingTop: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}> Nama Kapal</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  placeholder="Nama Kapal"
                  placeholderTextColor={COLORS.dark}
                />
              </View>

              <Text style={{ paddingLeft: 30, paddingTop: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}> Nama Dermaga</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  placeholder="Nama Dermaga"
                  placeholderTextColor={COLORS.dark}
                />
              </View>

              <Text style={{ paddingLeft: 30, paddingTop: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}> PBM</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  placeholder="Isi Nomor IMEI"
                  placeholderTextColor={COLORS.dark}
                />
              </View>

              <Text style={{ paddingLeft: 30, paddingTop: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}> PBM</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  placeholder="Isi Nomor IMEI"
                  placeholderTextColor={COLORS.dark}
                />
              </View>

              <Text style={{ paddingLeft: 30, paddingTop: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}> Nama Peminjam</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  placeholder="Nama Peminjam"
                  placeholderTextColor={COLORS.dark}
                />
              </View>

              <Text style={{ paddingLeft: 30, paddingTop: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}> No Hp Peminjam</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  placeholder="No Hp Peminjam"
                  placeholderTextColor={COLORS.dark}
                />
              </View>

              <Text style={{ paddingLeft: 30, paddingTop: 10, paddingBottom: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}>Upload File</Text>
              <View style={{ alignItems: 'center' }}>
                <View style={styles.featureRow}>
                  <FeatureItem icon="add-a-photo" text="Foto Peminjam*"
                    file={formData.files.fotos}
                    onPress={() => handleFilePick('fotos')}
                  />
                </View>
              </View>

              <Text style={{ paddingLeft: 30, paddingTop: 10, paddingBottom: 10, fontSize: 15, color: COLORS.dark, fontWeight: 'bold' }}>Tanda Tangan</Text>
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
                  autoClear={true}
                  style={styles.signature}
                />
                <View style={styles.signatureButtons}>
                  <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                    <Text style={styles.buttonText}>Clear</Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity> */}
                </View>
              </View>

              <View style={{ paddingTop: 20, alignItems: 'center', paddingBottom: 40 }}>
                <TouchableOpacity
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
},
buttonText: {
color: COLORS.white,
fontSize: 16,
fontWeight: 'bold',
},
});

export default PinjamScreen;