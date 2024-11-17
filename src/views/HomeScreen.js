import { View, Text, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import COLORS from '../const/color';
import styles from '../const/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BASE_URL } from '../const/url';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
  const url = BASE_URL;
    const [datas, setdatas] = useState({})
    const {isLoading,logouts} = useContext(AuthContext);


    const fetchdatas = async () => {
        try {
            let userInfo = await AsyncStorage.getItem('userInfo');
            userInfo = JSON.parse(userInfo);
            console.log('userInfo HOME', userInfo)
            let token = userInfo.access_token.split('|')[1]
            const response = await axios.get(`${url}home`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('response', response.data)
            setdatas(response.data.data)

        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
      const timer = setTimeout(() => {
          const unsubscribe = navigation.addListener('focus', () => {
              fetchdatas();
          });
          fetchdatas();
          
          return unsubscribe;
      }, 2000); // Delay 3 detik (3000 milidetik)
  
      return () => clearTimeout(timer);
  }, [navigation]);

    console.log('datas', datas)
    const HandledLogout = () => {
        logouts(navigation)
        
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
      <StatusBar translucent backgroundColor={COLORS.primary} />
      <View style={{ ...style.header, marginTop: 20 }}>
        <View>
          <View style={{ marginTop: 30, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={ require('../assets/Username.png') }  resizeMode="contain"  style={{ width:212, height:40}}  />
          </View>
        </View>
      </View>
      <View style={{ backgroundColor:COLORS.primary, height:150}}>
        <View style={{ marginLeft: 30, marginRight: 30, marginBottom: 20 ,marginTop:15}}>
          <View style={{flexDirection:'row' , justifyContent:'space-between'}}>
            <Text style={{ fontSize: 24, color: COLORS.white, fontWeight: 'bold' }}>
              Hello, {datas?.user?.name}
            </Text>
            <TouchableOpacity  onPress={HandledLogout}>
              <Icon name='send-to-mobile' size={32} color={COLORS.white} />

            </TouchableOpacity>
          </View>
        </View>
      </View>


      <View style={{ top:-20, borderTopRightRadius:25, borderTopLeftRadius:25, backgroundColor:COLORS.white}}>
      <View style={{ alignItems: 'center' }}>
        <View style={{ ...style.card, flexDirection: 'row', padding: 30, justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => navigation.navigate("ListTabScreen")}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: COLORS.white, fontSize: 16 }}>Jumlah TAB</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name='phone-iphone' size={32} color={COLORS.white} />
                <Text style={{ color: COLORS.white, fontSize: 32, fontWeight: 'bold' }}>  {datas?.tab} </Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={{ backgroundColor: COLORS.white, width: 2, height: 40 }}></View>
          <TouchableOpacity onPress={() => navigation.navigate("ListTabScreen")}>
            <Text style={{ color: COLORS.white, fontSize: 16 }}>TAB Di pinjam</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name='install-mobile' size={32} color={COLORS.white} />
              <Text style={{ color: COLORS.white, fontSize: 32, fontWeight: 'bold' }}> {datas?.tab_dipinjam} </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 25, top:-45 }}>
        <View style={{  }}>
          <TouchableOpacity style={{ ...style.btn, backgroundColor: COLORS.green, borderTopLeftRadius:15, borderBottomLeftRadius:15 }} onPress={() => navigation.navigate("ListTabTersedia")}>
            <View style={{flexDirection:'row',alignItems:'center'}}>
              <Icon name='app-registration' size={35} color={COLORS.white} />
              <Text style={{ color: COLORS.white, fontSize: 18, fontWeight: 'bold', }}>Pinjam</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={{ ...style.btn, backgroundColor: COLORS.red, borderTopRightRadius:15, borderBottomRightRadius:15 }} onPress={() => navigation.navigate("ListTabTerpakai")}>
          
            <View style={{flexDirection:'row',alignItems:'center'}}>
              <Text style={{ color: COLORS.white, fontSize: 18, fontWeight: 'bold' }}>Kembali</Text>
              <Icon name='add-to-home-screen' size={35} color={COLORS.white} />
              </View>
        </TouchableOpacity>
      </View>
      </View>


      
      <View style={{ flex: 1, alignItems: 'center',top:-50}}>
        <View style={{ ...styles.card, padding: 20, }}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Icon name='history-edu' size={25} color={COLORS.primary} />
                <Text style={{ color: COLORS.dark, fontSize: 18, fontWeight: 'bold' }}> History</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("HistoryScreen")}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Text style={{ color: COLORS.grey, fontSize: 18 }}>  Semua</Text>
              </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ backgroundColor: COLORS.dark, width: '100%', height: 2 }}></View>
          <FlatList
            data={datas?.history}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
  },
  card: {
    backgroundColor: COLORS.primary2,
    width: '85%',
    borderRadius: 15,
    marginBottom:10,
    top:-55
  },
  btn: {
    alignItems: 'center', justifyContent: 'center', width: 170, height: 69
  }
})

export default HomeScreen;
