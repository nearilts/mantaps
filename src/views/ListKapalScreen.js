import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../const/color';
import { URL_KIPOS } from '../const/url';

const ListKapalScreen = ({ navigation, route }) => {
  const url = URL_KIPOS;
  const [originalDatas, setOriginalDatas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDatas = async (search = '') => {
      try {
        let userInfo = await AsyncStorage.getItem('userInfo');
        userInfo = JSON.parse(userInfo);
        let token = userInfo.access_token.split('|')[1];
        const response = await axios.get(`${url}non_user/schedule-cigading?vessel_name=${search}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOriginalDatas(response.data.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      fetchDatas(searchQuery);
    });
    fetchDatas(searchQuery);

    return unsubscribe;
  }, [navigation, searchQuery]);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("FormPinjamScreen", {item: item, tab:route.params})}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center' }}>
        <View style={{ flexDirection: 'column', padding: 5 }}>
          <Text style={{ color: COLORS.dark, fontSize: 18 }}>{item.vessel?.name}</Text>
          <Text style={{ color: COLORS.grey, fontSize: 13 }}>{item.jetty?.desc}</Text>
        </View>
        <View style={{ padding: 5, backgroundColor: COLORS.primary2, borderRadius: 10, width: 80, height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: COLORS.white, fontSize: 13 }}>Tambah</Text>
        </View>
      </View>
      <View style={{ backgroundColor: COLORS.grey, width: '100%', height: 1 }}></View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ top: 40 }}>
        <TouchableOpacity onPress={navigation.goBack} style={{ position: 'absolute', top: 10, left: 20, backgroundColor: COLORS.primary, borderRadius: 50, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
          <Icon name="arrow-back-ios" size={28} color={COLORS.white} onPress={navigation.goBack} />
        </TouchableOpacity>
        <View style={{ justifyContent: 'center', alignItems: 'center', top: 20, marginBottom: 20 }}>
          <Text style={{ color: COLORS.dark, fontSize: 22 }}>Daftar Kapal</Text>
        </View>
        <View style={styles.searchContainer}>
          <Icon name="search" size={28} color={COLORS.dark} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={COLORS.dark}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>
      <View style={{ paddingTop: 30, paddingLeft: 20, paddingBottom: 25 }}>
        <View style={{ borderRadius: 30, backgroundColor: COLORS.white }}>
          <FlatList
            data={originalDatas}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()} // Ensure key is a string
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: COLORS.light,
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginRight: 20,
    marginLeft: 20
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: COLORS.dark,
    marginLeft: 10
  }
});

export default ListKapalScreen;
