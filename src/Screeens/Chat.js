import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import fonts from '../constant/fonts';

import search from '../assets/images/search.png';
import colors from '../constant/colors';

const Chat = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const [loader, setLoader] = useState(false);
  const auth = useSelector(state => state.auth.auhtUSer);

  const uid = auth?.currentUser?.uid || 3222;
  const theme = useColorScheme();

  const getChats = async () => {
    setLoader(true)
    firestore()
      .collection('users')
      .where('userId', '!=', uid)
      .get()
      .then(res => {
        setLoader(false);
        let data = res.docs.map(i => i.data());
        setUsers(data);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
      });
  };

  useEffect(() => {
    getChats();
  }, []);

  console.log(loader);

  const renderItem = ({item, index}) => (
    <View style={{position: 'relative'}}>
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
          <Text
            style={[
              styles.nameText,
              {color: theme === 'dark' ? '#ddd' : '#4c4c4c'},
            ]}>
            {item?.name}
          </Text>
          <Text style={styles.slogan}>{item?.status}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: theme === 'dark' ? colors.dark : colors.light},
      ]}>
      <View style={styles.headBg}></View>
      <View style={styles.Headrow}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={{uri: auth.data[0].avatar || 'http://'}}
            style={{width: 35, height: 35, borderRadius: 55}}
          />
          <Text
            style={{
              paddingLeft: 10,
              fontFamily: fonts.regular,
              fontSize: 16,
              color: colors.light,
            }}>
            {auth.data[0].name}
          </Text>
        </View>
        <View style={styles.searchWrapp}>
          <Image
            source={search}
            style={[styles.searchIcon, {tintColor: colors.light}]}
          />
        </View>
      </View>
      {!loader ? (
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(_, ind) => ind}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ActivityIndicator size={'large'} color={theme === "dark" ? colors.light : colors.chatColor}/>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
  row: {
    flexDirection: 'row',
    // alignItems: 'center',
    marginBottom: 5,
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  avatar: {
    width: 55,
    height: 55,
    // borderWidth: 2,
    borderRadius: 55,
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
    paddingHorizontal: 20,
    zIndex: 99,
  },
  headBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: colors.chatColor,
    zIndex: -1,
    elevation: 10,
  },
  line: {
    position: 'absolute',
    bottom: 4,
    left: 0,
    right: 0,
    borderWidth: 0.5,
    opacity: 0.7,
    width: '100%',
  },
  headTxt: {
    fontSize: 18,
    fontFamily: 'TitilliumWeb-Bold',
    color: '#fff',
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
    fontSize: 16,
    textTransform: 'capitalize',
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
