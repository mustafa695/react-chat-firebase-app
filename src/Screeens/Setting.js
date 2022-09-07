import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import React from 'react';
import {useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';
import {userLogin} from '../redux/reducers/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsItem from '../components/SettingsItem';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../constant/colors';

const Setting = ({navigation}) => {
  const dispatch = useDispatch();
  const theme = useColorScheme();
  const logout = () => {
    auth()
      .signOut()
      .then(async () => {
        dispatch(
          userLogin({
            currentUser: {},
            data: [],
          }),
        );
        let keys = [];
        keys = await AsyncStorage.getAllKeys();
        await AsyncStorage.multiRemove(keys);
        navigation.navigate('RegisterOrLogin');
      })
      .catch(err => console.log('Logout err', err));
  };

  const editProfile = () => {
    navigation.navigate('EditProfile');
  };

  return (
    <ScrollView
      style={[
        styles.container,
        {backgroundColor: theme === 'dark' ? colors.dark : colors.light},
      ]}>
      <SettingsItem
        settingText={'Edit Profile'}
        onTap={editProfile}
        icon={
          <FontAwesome5 name="user-edit" size={18} color={colors.chatColor} />
        }
      />
      <SettingsItem
        settingText={'Notification'}
        icon={
          <Ionicons name="notifications" size={22} color={colors.chatColor} />
        }
      />
      <SettingsItem
        settingText={'Theme Color'}
        icon={
          <Ionicons name="color-palette" size={22} color={colors.chatColor} />
        }
      />
      <SettingsItem
        settingText={'Privacy and Security'}
        icon={
          <MaterialIcons name="security" size={22} color={colors.chatColor} />
        }
      />
      <SettingsItem
        settingText={'Help and Support'}
        icon={
          <FontAwesome5
            name="headphones-alt"
            size={22}
            color={colors.chatColor}
          />
        }
      />
      <SettingsItem
        settingText={'About'}
        icon={
          <Ionicons name="ios-help-circle" size={25} color={colors.chatColor} />
        }
      />
      <SettingsItem
        settingText={'Logout'}
        onTap={logout}
        icon={<AntDesign name="logout" size={20} color={colors.chatColor} />}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Setting;
