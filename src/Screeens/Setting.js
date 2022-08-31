import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';
import {userLogin} from '../redux/reducers/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Setting = ({navigation}) => {
  const dispatch = useDispatch();

  const logout = () => {
    auth()
      .signOut()
      .then(async() => {
        dispatch(
          userLogin({
            currentUser: {},
            data: [],
          }),
        );
        let keys = [];
        keys = await AsyncStorage.getAllKeys()
        await AsyncStorage.multiRemove(keys);
        navigation.navigate('RegisterOrLogin');
      })
      .catch(err => console.log('Logout err', err));
  };
  return (
    <View>
      <TouchableOpacity
        onPress={logout}
        style={{backgroundColor: '#ddd', height: 40, marginTop: 20}}>
        <Text style={{textAlign: 'center'}}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Setting;
