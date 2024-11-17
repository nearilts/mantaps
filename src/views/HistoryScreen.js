import { View, Text, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, FlatList, ScrollView, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import COLORS from '../const/color';
import styles from '../const/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FONTS } from '../const/fonts';
import { BASE_URL } from '../const/url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const HistoryScreen = ({ navigation }) => {

    const url = BASE_URL;
    const [originalDatas, setOriginalDatas] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [datas, setDatas] = useState([]);

    const fetchdatas = async (search = '') => {
        try {
            let userInfo = await AsyncStorage.getItem('userInfo');
            userInfo = JSON.parse(userInfo);
            let token = userInfo.access_token.split('|')[1];
            const response = await axios.get(`${url}get-all?name=${search}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('response', response.data);
            setDatas(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };
    
    useEffect(() => {
         const unsubscribe = navigation.addListener('focus', () => {
            fetchdatas();
        });
        fetchdatas();
        
        return unsubscribe;
    }, [navigation]);

    const handleSearch = (text) => {
        setSearchQuery(text);
        fetchdatas(text);
    };


    
  const renderItem = ({ item }) => (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center' }}>
       <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
       <View style={{alignItems:'center', justifyContent:'center', padding: 5, backgroundColor: COLORS.secondgrey, borderRadius: 10, width:50, height:50 }}>
            <Text style={{ color: COLORS.white, fontSize: 13, fontWeight: 'bold' }}>
            {item.nama_tab}
            </Text>
        </View>
        
        <View style={{ flexDirection: 'column', paddingLeft: 10, paddingTop:5, flex: 1 }}>
          <Text style={{ color: COLORS.dark, fontSize: 16, fontWeight: 'bold', flexWrap: 'wrap' }}>
            {item.nama_kapal} / {item.pbm}
          </Text>
          <Text style={{ color: COLORS.grey, fontSize: 13 }}>
            {item.created_at}
          </Text>
        </View>
        </View> 
        
        <TouchableOpacity onPress={() => navigation.navigate("HistoryDetail", item)}>
        <View style={{ alignItems:'center', justifyContent: 'center', backgroundColor: COLORS.blue, borderRadius: 10, width:55, height:35 }}>
          <Text style={{ color: COLORS.white, fontSize: 13, fontWeight: 'bold' }}>
           LIHAT
          </Text>
        </View>
        </TouchableOpacity>
      </View>
      <View style={{ backgroundColor: COLORS.dark, width: '100%', height: 2 }}></View>
    </View>
  );

    return (
        <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
            <View style={{ top: 60 }}>
                <View style={{ padding: 20 }}>
                    <Text style={{ color: COLORS.dark, fontSize: 25 }}>History</Text>
                    <View style={{
                        height: 50,
                        borderRadius: 10,
                        flexDirection: 'row',
                        backgroundColor: COLORS.light,
                        alignItems: 'center',
                        paddingHorizontal: 20,
                        marginTop: 20
                    }}>
                        <Icon name="search" size={28} color={COLORS.dark} />
                        <TextInput
                            style={{ fontSize: 18, color: COLORS.dark }}
                            placeholder="Search " placeholderTextColor={COLORS.dark}
                        value={searchQuery}
                        onChangeText={text => handleSearch(text)}
                        />
                    </View>
                </View>

               

                <View style={{
                    backgroundColor: COLORS.white,
                    width: '100%',
                    borderRadius: 15,
                    padding: 20
                }}>
                    <View style={{ backgroundColor: COLORS.dark, width: '100%', height: 1 }}></View>
                    <FlatList
                        data={datas}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const style = StyleSheet.create({
    btn: {
        alignItems: 'center', justifyContent: 'center', borderRadius: 10, width: 150, height: 150
    }
})

export default HistoryScreen;
