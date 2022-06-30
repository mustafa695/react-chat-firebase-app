import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import React, {useState} from 'react';
import firestore from '@react-native-firebase/firestore';

import googlePlus from '../assets/images/google-plus.png';
import fb from '../assets/images/fb.png';

const RegisterOrLogin = () => {
  const [haveAccount, setHaveAccount] = useState(false);
  const [fullName, setfullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const hittoUsers = () => {
    let input = {
      email: email,
      name: fullName,
      password: password,
      userId: Date.now() + Math.floor(Math.random() * 10000),
      createdAt: Date.now(),
      avatar:
        'https://store.playstation.com/store/api/chihiro/00_09_000/container/BG/en/99/EP2402-CUSA05624_00-AV00000000000237/0/image?_version=00_09_000&platform=chihiro&bg_color=000000&opacity=100&w=720&h=720',
    };

    firestore()
      .collection('users')
      .add(input)
      .then(res => {
        alert('Register Successfully');
      })
      .catch(err => console.log(err));
  };

  const register = () => {
    if (!email || !password || !fullName) {
      alert('Please filled first.');
    } else {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          hittoUsers();
          setHaveAccount(false);
        })
        .catch(err => console.log(err));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.loginText}>Login NOW</Text>
      <View style={styles.loginWrap}>
        <View style={styles.inputWrapp}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            placeholder="Enter Email..."
            style={styles.input}
            value={email}
            onChangeText={text => setEmail(text)}
          />
        </View>
        <View style={styles.inputWrapp}>
          <Text style={styles.label}>Password:</Text>
          <TextInput
            secureTextEntry={true}
            placeholder="Enter Password..."
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.input}
          />
        </View>
        {haveAccount && (
          <View style={styles.inputWrapp}>
            <Text style={styles.label}>Full Name:</Text>
            <TextInput
              placeholder="Enter Full Name..."
              style={styles.input}
              value={fullName}
              onChangeText={text => setfullName(text)}
            />
          </View>
        )}
        <View style={styles.socialLogin}>
          <TouchableOpacity
            style={[
              styles.googleWrap,
              {borderColor: '#dd4d3f', marginRight: 15},
            ]}>
            <Image
              source={googlePlus}
              style={{
                width: 35,
                height: 30,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.googleWrap, {borderColor: '#3A65C3'}]}>
            <Image
              source={fb}
              style={{
                width: 35,
                height: 30,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        {!haveAccount ? (
          <TouchableOpacity style={styles.btn} >
            <Text style={styles.btnTxt}>Login</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btn} onPress={register}>
            <Text style={styles.btnTxt}>Register</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => setHaveAccount(!haveAccount)}>
          <Text style={styles.dhac}>
            {!haveAccount
              ? 'Do you have an account? Register'
              : 'I have an account? Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 25,
  },
  loginText: {
    fontFamily: 'TitilliumWeb-Bold',
    fontSize: 34,
    textTransform: 'capitalize',
    textAlign: 'center',
    color: '#000',
    marginTop: 25,
  },
  loginWrap: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: '25%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#3e3d3d',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  inputWrapp: {
    marginBottom: 25,
  },
  label: {
    marginBottom: 5,
    fontFamily: 'TitilliumWeb-Regular',
    color: '#000',
    letterSpacing: 0.5,
  },
  btn: {
    backgroundColor: '#3e3d3d',
    paddingVertical: 13,
    borderRadius: 8,
  },
  btnTxt: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'TitilliumWeb-Regular',
    fontSize: 16,
  },
  socialLogin: {
    marginBottom: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleWrap: {
    borderWidth: 3,
    borderRadius: 55,
    paddingHorizontal: 3,
    paddingVertical: 4,
  },
  dhac: {
    textAlign: 'center',
    fontFamily: 'TitilliumWeb-SemiBold',
    marginTop: 6,
  },
});

export default RegisterOrLogin;
