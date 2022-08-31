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
import {useSelector} from 'react-redux';
import fonts from '../constant/fonts';

import search from '../assets/images/search.png';
import colors from '../constant/colors';

const Chat = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const auth = useSelector(state => state.auth.auhtUSer);
  const uid = auth?.currentUser?.uid || 3222;

  useEffect(() => {
    firestore()
      .collection('users')
      .where('userId', '!=', uid)
      .get()
      .then(res => {
        let data = res.docs.map(i => i.data());
        setUsers(data);
      })
      .catch(err => console.log(err));
  }, [users]);

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      style={styles.row}
      key={index}
      onPress={() => {
        navigation.navigate('Message', {data: item});
      }}>
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
        <View style={styles.line}></View>
      </View>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(_, ind) => ind}
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
    paddingVertical: 10,
    borderRadius: 10,
  },
  avatar: {
    width: 62,
    height: 62,
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
    position: 'relative',
  },
  line: {
    position: 'absolute',
    bottom: -20,
    borderWidth: 0.5,
    borderBottomColor: "#ddd",
    opacity: 0.7,
    width: '120%',
    marginHorizontal: -20,
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
    fontSize: 19,
    textTransform: 'capitalize',
    color: '#4c4c4c',
    fontFamily: fonts.regular,
  },
  avatrIcon: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
  },
  slogan: {
    fontFamily: fonts.regular,
    fontSize: 12.5,
  },
});

export default Chat;
