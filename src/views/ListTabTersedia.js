import { View, Text, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, FlatList, ScrollView, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import COLORS from '../const/color';
import styles from '../const/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FONTS } from '../const/fonts';
import { BASE_URL } from '../const/url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ListTabTersedia = ({ navigation }) => {
    
    const url = BASE_URL;
    const [originalDatas, setOriginalDatas] = useState([]);
    const [datas, setDatas] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
            fetchdatas();
        });
        fetchdatas();

        return unsubscribe;
    }, [navigation]);

    const fetchdatas = async (search = '') => {
        try {
            let userInfo = await AsyncStorage.getItem('userInfo');
            userInfo = JSON.parse(userInfo);
            let token = userInfo.access_token.split('|')[1];
            const response = await axios.get(`${url}list-tab?name=${search}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('response', response.data);
            setOriginalDatas(response.data.data);

            const tersedia = response.data.data.filter(item => item.status === 'Tersedia');
            setDatas(tersedia);
        } catch (error) {
            console.error(error);
        }
    };


    const handleSearch = (text) => {
        setSearchQuery(text);
        fetchdatas(text);
    };

    const renderItem = ({ item }) => (
        <View>
            <TouchableOpacity 
                onPress={() => navigation.navigate("ListKapalScreen", item)}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center' }}>
                    <View style={{ flexDirection: 'column', padding: 5 }}>
                        <Text style={{ color: COLORS.dark, fontSize: 18 }}>
                            {item.name}
                        </Text>
                        <Text style={{ color: COLORS.grey, fontSize: 13 }}>
                            {item.imei}
                        </Text>
                    </View>
                    <View style={{ padding: 5, backgroundColor: COLORS.green, borderRadius: 10, width: 80, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: COLORS.white, fontSize: 13 }}>
                            {item.status}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
            <View style={{ backgroundColor: COLORS.grey, width: '100%', height: 1 }}></View>
        </View>
    );

    return (
        <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
            <View style={{ top: 60 }}>
                <View style={{ padding: 20 }}>
                    <Text style={{ color: COLORS.dark, fontSize: 25 }}>Daftar Tab</Text>
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

                <View style={{ paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 20, marginRight: 20 }}>
                    
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

export default ListTabTersedia;
