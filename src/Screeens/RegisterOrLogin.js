import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import React, {useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useDispatch} from 'react-redux';
import {userLogin} from '../redux/reducers/authSlice';

import googlePlus from '../assets/images/google-plus.png';

const RegisterOrLogin = ({navigation}) => {
  const [haveAccount, setHaveAccount] = useState(false);
  const [fullName, setfullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirPassword, setConfirmPassword] = useState('');
  const [loader, setLoader] = useState(false);

  const dispatch = useDispatch();

  const hittoUsers = uid => {
    let input = {
      email: email,
      name: fullName,
      password: password,
      userId: uid,
      createdAt: Date.now(),
      location: null,
      phoneNumber: null,
      nickname: null,
      status: null,
      gender: null,
      country: null,
      city: null,
      bio: null,
      avatar: null,
    };

    firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .set(input)
      .then(res => {
        setLoader(false);
        setHaveAccount(false);
      })
      .catch(err => {
        console.log(err);
        setLoader(false);
      });
  };

  const register = () => {
    if (password !== confirPassword) {
      return alert('Password or Confirm Password did not match.');
    } else {
      if (!email || !password || !fullName) {
        alert('Please filled first.');
      } else {
        setLoader(true);
        auth()
          .createUserWithEmailAndPassword(email, password)
          .then(() => {
            let uid = auth().currentUser.uid;
            hittoUsers(uid);
          })
          .catch(err => {
            console.log(err);
            alert(err);
            setLoader(false);
          });
      }
    }
  };

  const login = () => {
    if (!email || !password) {
      return alert('Please filled first');
    }
    setLoader(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        firestore()
          .collection('users')
          .where('userId', '==', auth().currentUser.uid)
          .get()
          .then(res => {
            if (res.docs.length) {
              const _data = res.docs.map(i => i.data().nickname);
              if (_data[0] != null) {
                const datas = res.docs.map(i => i.data());
                let user = {
                  currentUser: auth().currentUser,
                  data: datas,
                };
                dispatch(userLogin(user));

                navigation.navigate('myTabs', {
                  screen: 'Chat',
                  initial: false,
                });
                setLoader(false);
              } else {
                let user = {
                  currentUser: auth().currentUser,
                  data: [],
                };
                dispatch(userLogin(user));
                setLoader(false);
                navigation.navigate('UserIntro');
              }
            }
          })
          .catch(err => {
            console.log(err);
            setLoader(false);
          });
      })
      .catch(err => {
        alert(err);
        setLoader(false);
        console.log(err);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{flex: 1}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Text style={styles.loginText}>
              {!haveAccount ? 'Login NOW' : 'Signup Now'}
            </Text>
            <View style={styles.loginWrap}>
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
              <View style={styles.inputWrapp}>
                <Text style={styles.label}>Email:</Text>
                <TextInput
                  placeholder="Enter Email..."
                  style={styles.input}
                  keyboardType="email-address"
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
                  <Text style={styles.label}>Confirm Password:</Text>
                  <TextInput
                    placeholder="Enter Full Name..."
                    secureTextEntry={true}
                    style={styles.input}
                    value={confirPassword}
                    onChangeText={text => setConfirmPassword(text)}
                  />
                </View>
              )}

              <View style={styles.socialLogin}>
                <TouchableOpacity
                  style={[styles.googleWrap, {borderColor: '#dd4d3f'}]}>
                  <View style={styles.socialRow}>
                    <Image
                      source={googlePlus}
                      style={{
                        width: 35,
                        height: 30,
                        backgroundColor: '#fff',
                      }}
                      resizeMode="contain"
                    />
                    <Text
                      style={{
                        fontFamily: 'TitilliumWeb-SemiBold',
                        fontSize: 16,
                        marginLeft: 8,
                      }}>
                      Sign up with Google
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.googleWrap,
                    {borderColor: '#3c5a98', marginTop: 13},
                  ]}>
                  <View style={styles.socialRow}>
                    <Image
                      source={require('../assets/images/fb.png')}
                      style={{
                        width: 43,
                        height: 43,
                        marginLeft: 4,
                        backgroundColor: '#fff',
                      }}
                      resizeMode="contain"
                    />
                    <Text
                      style={{
                        fontFamily: 'TitilliumWeb-SemiBold',
                        fontSize: 16,
                        marginLeft: 0,
                      }}>
                      Sign up with Facebook
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              {!haveAccount ? (
                <TouchableOpacity
                  style={styles.btn}
                  onPress={login}
                  disabled={loader ? true : false}>
                  <Text style={styles.btnTxt}>
                    {loader ? (
                      <ActivityIndicator size="small" color={'#fff'} />
                    ) : (
                      'Login'
                    )}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.btn} onPress={register}>
                  <Text style={styles.btnTxt}>
                    {loader ? (
                      <ActivityIndicator size="small" color={'#fff'} />
                    ) : (
                      'Register'
                    )}
                  </Text>
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
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 25,
    paddingBottom: 30,
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
    marginTop: '13%',
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialLogin: {
    marginBottom: 25,
  },
  googleWrap: {
    borderWidth: 1,
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingVertical: 6,
  },
  dhac: {
    textAlign: 'center',
    fontFamily: 'TitilliumWeb-SemiBold',
    marginTop: 6,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default RegisterOrLogin;
