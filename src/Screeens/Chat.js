import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import search from '../assets/images/search.png';

const Chat = ({navigation}) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    firestore()
      .collection('users')
      .where('userId', '!=', '2')
      .get()
      .then(res => {
        let data = res.docs.map(i => i.data());
        setUsers(data);
      })
      .catch(err => console.log(err));
  }, []);

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      style={styles.row}
      key={index}
      onPress={() => navigation.navigate('Message', {data: item})}>
      <View style={styles.avatar}>
        <Image
          source={{uri: item?.avatar}}
          resizeMode="cover"
          style={styles.avatrIcon}
        />
      </View>
      <View style={styles.name}>
        <Text style={styles.nameText}>{item?.name}</Text>
        <Text style={styles.slogan}>I'm Developer</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.Headrow}>
        <Text style={styles.headTxt}>Find & Chat</Text>
        <View style={styles.searchWrapp}>
          <Image source={search} style={styles.searchIcon} />
        </View>
      </View>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    padding: 10,
    borderRadius: 10,
  },
  avatar: {
    width: 65,
    height: 65,
    borderWidth: 2,
    borderRadius: 55,
    borderColor: '#0ba70b',
    padding: 1.5,
  },
  name: {
    paddingLeft: 12,
  },
  Headrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  headTxt: {
    fontSize: 18,
    fontFamily: 'TitilliumWeb-Bold',
    color: '#000',
  },
  searchWrapp: {
    width: 18,
    height: 18,
  },
  searchIcon: {
    width: '100%',
    height: '100%',
  },
  nameText: {
    fontSize: 20,
    textTransform: 'capitalize',
    color: '#4c4c4c',
    fontFamily: 'TitilliumWeb-SemiBold',
  },
  avatrIcon: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
  },
  slogan: {
    fontFamily: 'TitilliumWeb-Regular',
    fontSize: 12.5,
  },
});

export default Chat;
