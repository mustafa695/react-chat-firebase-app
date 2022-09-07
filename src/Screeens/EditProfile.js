import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import {useDispatch} from 'react-redux';
import {useToast} from 'react-native-toast-notifications';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../constant/colors';
import fonts from '../constant/fonts';
import FormInput from '../components/FormInput.js';
import {useSelector} from 'react-redux';
import {updateUser} from '../redux/reducers/authSlice';

const EditProfile = ({navigation}) => {
  const authSelector = useSelector(state => state.auth.auhtUSer);
  const toast = useToast();
  const theme = useColorScheme();

  const dispatch = useDispatch();
  const [fullName, setFullName] = useState('');
  const [nickName, setnickName] = useState('');
  const [status, setStatus] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [loader, setLoader] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    authSelector.data.map(
      i => (
        setFullName(i.name),
        setnickName(i.nickname),
        setStatus(i.status),
        setPhone(i.phoneNumber),
        setCity(i.city),
        setAvatar(i.avatar),
        setCountry(i.country),
        setBio(i.bio)
      ),
    );
  }, [authSelector]);

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

  const onSubmit = async () => {
    setLoader(true);

    firestore()
      .collection('users')
      .doc(authSelector.data[0]?.userId)
      .update({
        name: fullName,
        nickname: nickName,
        phoneNumber: phone,
        status: status,
        country: country,
        city: city,
        bio: bio,
        avatar: avatar,
      })
      .then(async res => {
        toast.show('Profile updated successfully.', {
          type: 'success',
        });
        const currentUser = authSelector.currentUser;

        if (image) {
          const reference = await storage().ref(
            `images/${image.assets[0].fileName}`,
          );
          // uploads file
          await reference
            .putFile(avatar)
            .then(res => {
              reference.getDownloadURL().then(url => {
                // setAvatar(url);
                setAvatar(url);
                dispatch(
                  updateUser({
                    fullName,
                    nickName,
                    phone,
                    status,
                    country,
                    city,
                    bio,
                    currentUser,
                    avatar,
                  }),
                );
              }); //
            })
            .catch(err => console.log(err));
        } else {
          dispatch(
            updateUser({
              fullName,
              nickName,
              phone,
              status,
              country,
              city,
              bio,
              currentUser,
              avatar,
            }),
          );
        }
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
      });
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-sharp" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headTxt}>Edit Profile</Text>
      </View>

      <ScrollView
        style={[
          styles.container,
          {backgroundColor: theme === 'dark' ? colors.dark : colors.light},
        ]}>
        <View style={styles.avatarWrap}>
          <TouchableOpacity style={styles.avatar} onPress={onUploadAvatar}>
            <Image
              source={{uri: avatar || 'https://'}}
              resizeMode="cover"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 55,
              }}
            />

            <Feather name="edit" size={18} style={styles.camera} />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: fonts.semiBold,
              color: theme === "dark" ? colors.light : colors.themeColor,
              fontSize: 18,
              marginTop: 5,
            }}>
            {authSelector.data[0].name} {`(${authSelector.data[0].nickname})`}
          </Text>
          <Text
            style={{
              fontFamily: fonts.regular,
              color: theme === "dark" ? colors.light : colors.themeColor,
              fontSize: 12,
            }}>
            {authSelector.data[0].status}
          </Text>
        </View>
        <FormInput
          label="Full Name"
          value={fullName}
          onChangeText={text => setFullName(text)}
        />

        <FormInput
          label="Nick Name"
          value={nickName}
          onChangeText={text => setnickName(text)}
        />

        <FormInput
          label="Type Status"
          value={status}
          placeHolder="Single"
          onChangeText={text => setStatus(text)}
        />
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
          label="Bio"
          value={bio}
          placeHolder="Type about yourself."
          onChangeText={text => setBio(text)}
          numberOfLines={4}
        />
        <TouchableOpacity
          style={styles.btn}
          onPress={onSubmit}
          disabled={loader}>
          <Text style={styles.btnTxt}>
            {loader ? (
              <ActivityIndicator size="small" color={'#fff'} />
            ) : (
              'Update'
            )}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.chatColor,
    paddingHorizontal: 20,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headTxt: {
    color: '#fff',
    fontFamily: fonts.semiBold,
    fontSize: 17,
    paddingLeft: 12,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
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
  camera: {
    position: 'absolute',
    bottom: 10,
    right: 0,
  },
  btn: {
    backgroundColor: colors.themeColor,
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

export default EditProfile;
