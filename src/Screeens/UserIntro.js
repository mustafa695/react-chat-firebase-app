import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import auths from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {useToast} from 'react-native-toast-notifications';
import {useSelector, useDispatch} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';

import FormInput from '../components/FormInput.js';
import fonts from '../constant/fonts.js';
import colors from '../constant/colors.js';
import {userLogin} from '../redux/reducers/authSlice.js';

const UserIntro = ({navigation}) => {
  const genderList = ['Male', 'Female', 'Others'];
  const [nickName, setnickName] = useState('');
  const [status, setStatus] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [loader, setLoader] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [image, setImage] = useState('');

  const toast = useToast();

  const dispatch = useDispatch();

  const selectGender = ind => {
    setGender(genderList[ind]);
  };

  const auth = useSelector(state => state.auth.auhtUSer);

  const onUpdate = url => {
    firestore()
      .collection('users')
      .doc(auth?.currentUser?.uid)
      .update({
        nickname: nickName,
        phoneNumber: phone,
        status: status,
        gender: gender,
        country: country,
        city: city,
        bio: bio,
        avatar: url,
      })
      .then(reSs => {
        firestore()
          .collection('users')
          .get()
          .then(result => {
            const _data = result.docs.map(i => i.data());

            let user = {
              currentUser: auths().currentUser,
              data: _data,
            };
            dispatch(userLogin(user));
            setLoader(false);
            console.log(navigation.navigate('myTabs'), '==========aaa');
            navigation.navigate('myTabs');
          })
          .catch(err => {
            setLoader(false);
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
        setLoader(false);
      });
  };

  const onSubmit = async () => {
    if (!nickName && !status && !gender && !phone && !country && !city) {
      return toast.show('Please check something is missing.', {
        duration: 3000,
      });
    } else if (!avatar) {
      return toast.show('Please upload your profile pic.', {
        duration: 3000,
      });
    }

    setLoader(true);

    const reference = await storage().ref(`images/${image.assets[0].fileName}`);
    // uploads file
    await reference
      .putFile(avatar)
      .then(res => {
        reference.getDownloadURL().then(url => {
          onUpdate(url);
        }); //
      })
      .catch(err => console.log(err));
  };

  const onUploadAvatar = async () => {
    let options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    };

    const result = await launchImageLibrary(options);
    setAvatar(result?.assets[0].uri);
    setImage(result);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topMargin}>
        <Text style={styles.intro}>Tell us about yourslef.</Text>
        <View style={styles.avatarWrap}>
          <TouchableOpacity style={styles.avatar} onPress={onUploadAvatar}>
            {avatar ? (
              <Image
                source={{uri: avatar}}
                resizeMode="cover"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 55,
                }}
              />
            ) : (
              <Text style={{fontFamily: fonts.semiBold, fontSize: 12}}>
                Upload Image
              </Text>
            )}
            <Feather name="camera" size={18} style={styles.camera} />
          </TouchableOpacity>
        </View>
        <FormInput
          label="Type Nick Name"
          value={nickName}
          placeHolder="Johni."
          onChangeText={text => setnickName(text)}
        />
        <FormInput
          label="Type Status"
          value={status}
          placeHolder="Single"
          onChangeText={text => setStatus(text)}
        />
        <FormInput
          label="Gender"
          value={gender}
          placeHolder="Pick any."
          caretHidden={true}
        />
        <View style={styles.row}>
          {genderList.map((i, ind) => (
            <TouchableOpacity
              key={ind}
              onPress={() => selectGender(ind)}
              style={styles.gendWrap}>
              <Text style={{color: '#fff', fontFamily: fonts.regular}}>
                {i}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <FormInput
          label="Phone Number"
          value={phone}
          placeHolder="92 33332239"
          keyboardType="phone-pad"
          onChangeText={text => setPhone(text)}
        />
        <FormInput
          label="Country"
          value={country}
          placeHolder="China"
          onChangeText={text => setCountry(text)}
        />
        <FormInput
          label="City"
          value={city}
          placeHolder="Beijing"
          onChangeText={text => setCity(text)}
        />
        <FormInput
          label="Bio (optional)"
          value={bio}
          placeHolder="Type about yourself."
          onChangeText={text => setBio(text)}
          numberOfLines={4}
        />
      </View>
      <TouchableOpacity style={styles.btn} onPress={onSubmit} disabled={loader}>
        <Text style={styles.btnTxt}>
          {loader ? (
            <ActivityIndicator size="small" color={'#fff'} />
          ) : (
            'Submit'
          )}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  intro: {
    marginBottom: 40,
    textAlign: 'center',
    fontFamily: fonts.bold,
    color: colors.ib,
    fontSize: 20,
  },
  camera: {
    position: 'absolute',
    bottom: 10,
    right: 0,
  },
  topMargin: {
    marginTop: 30,
  },
  avatarWrap: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  avatar: {
    backgroundColor: '#ddd',
    width: 90,
    height: 90,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    marginTop: -10,
    marginBottom: 10,
  },
  gendWrap: {
    marginRight: 10,
    backgroundColor: colors.chatColor,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  btn: {
    backgroundColor: '#3e3d3d',
    paddingVertical: 13,
    borderRadius: 8,
    marginBottom: 25,
  },
  btnTxt: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'TitilliumWeb-Regular',
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default UserIntro;
