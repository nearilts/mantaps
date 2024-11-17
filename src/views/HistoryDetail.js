import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../const/color';
import { SvgXml } from 'react-native-svg'; // Import SvgXml from react-native-svg

const HistoryDetail = ({ navigation, route }) => {
  const [svgPeminjam, setSvgPeminjam] = useState(null);
  const [svgPengembali, setSvgPengembali] = useState(null);
  const data = route.params;

  // useEffect(() => {
  //   if (data.ttd_peminjam) {
  //     fetchSvg(data.ttd_peminjam, setSvgPeminjam);
  //   }
  //   if (data.ttd_pengembali) {
  //     fetchSvg(data.ttd_pengembali, setSvgPengembali);
  //   }
  // }, []);

  // const fetchSvg = async (url, setSvgFunction) => {
  //   try {
  //     const response = await fetch(url);
  //     const svgText = await response.text();
  //     setSvgFunction(svgText);
  //   } catch (error) {
  //     console.error('Failed to fetch SVG:', error);
  //     // Handle error fetching SVG
  //   }
  // };
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView>
        <View style={{ paddingTop: 40 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              position: 'absolute',
              top: 50,
              left: 20,
              backgroundColor: COLORS.primary,
              borderRadius: 50,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
            }}
          >
            <Icon name="arrow-back-ios" size={28} color={COLORS.white} />
          </TouchableOpacity>
          <View style={{ justifyContent: 'center', alignItems: 'center', top: 20 }}>
            <Text style={{ color: COLORS.dark, fontSize: 22, fontWeight: 'bold' }}>History</Text>
          </View>
        </View>

        <View style={{ paddingTop: 40, paddingLeft: 20, paddingRight: 20, paddingBottom: 25 }}>
          <View style={{ borderRadius: 30, backgroundColor: COLORS.secondgrey }}>
            <View>
              <Text style={styles.label}>Nama Kapal</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  placeholder="Nama Kapal"
                  placeholderTextColor={COLORS.dark}
                  value={data.nama_kapal}
                  editable={false}
                />
              </View>

              <Text style={styles.label}>Nama Dermaga</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  placeholder="Nama Dermaga"
                  placeholderTextColor={COLORS.dark}
                  value={data.nama_dermaga}
                  editable={false}
                />
              </View>

              <Text style={styles.label}>PBM</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  placeholder="PBM"
                  placeholderTextColor={COLORS.dark}
                  value={data.pbm}
                  editable={false}
                />
              </View>

              <Text style={styles.label}>TAB Yang di Pinjam</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  placeholder="Tab Yang di Pinjam"
                  placeholderTextColor={COLORS.dark}
                  value={data.nama_tab}
                  editable={false}
                />
              </View>

              <Text style={styles.label}>Nama Peminjam</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  placeholder="Nama Peminjam"
                  placeholderTextColor={COLORS.dark}
                  value={data.nama_peminjam}
                  editable={false}
                />
              </View>

              <Text style={styles.label}>No Hp Peminjam</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  placeholder="No Hp Peminjam"
                  placeholderTextColor={COLORS.dark}
                  value={data.no_peminjam}
                  editable={false}
                />
              </View>

              <Text style={styles.label}>Foto Serah Terima Peminjam</Text>
              <View style={styles.imageContainer}>
                <Image source={{ uri: data.foto_peminjam }} style={styles.image} />
              </View>

              <Text style={styles.label}>Tanda Tangan Peminjam</Text>
              <View style={styles.imageContainer}>
                <Image source={{ uri: data.ttd_peminjam }} style={styles.image} />
                {/* <SvgXml
                  width="100%"
                  height={200}
                  xml={svgPeminjam}
                /> */}
              </View>

              <Text style={styles.label}>Nama Pengembali</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  placeholder="Nama Pengembali"
                  placeholderTextColor={COLORS.dark}
                  value={data.nama_pengembali}
                  editable={false}
                />
              </View>

              <Text style={styles.label}>No Hp Pengembali</Text>
              <View style={styles.slide}>
                <TextInput
                  style={styles.input}
                  placeholder="No Hp Pengembali"
                  placeholderTextColor={COLORS.dark}
                  value={data.no_pengembali}
                  editable={false}
                />
              </View>

              {data.foto_pengembali && typeof data.foto_pengembali !== 'object' && (
                    <>
                      <Text style={styles.label}>Foto Serah Terima Pengembali</Text>
                      <View style={styles.imageContainer}>
                        <Image source={{ uri: data.foto_pengembali }} style={styles.image} />
                      </View>
                    </>
                  )}

              {data.ttd_pengembali && typeof data.ttd_pengembali !== 'object' && (
                  <>
                    <Text style={styles.label}>Tanda Tangan Pengembali</Text>
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: data.ttd_pengembali }} style={styles.image} />
                    </View>
                  </>
                )}
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
  label: {
    paddingLeft: 45,
    paddingTop: 10,
    fontSize: 15,
    color: COLORS.dark,
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

export default HistoryDetail;
