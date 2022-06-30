import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  Button,
  ScrollView,
  Keyboard,
  FlatList,
  KeyboardAvoidingView,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import sent from '../assets/images/sent.png';

const Message = ({route}) => {
  const {data} = route.params;
  const {username} = route.params;
  console.log(data);
  const currnetId = '2';

  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loader, setLoader] = useState(false);
  const [room, setRoom] = useState(currnetId + '-' + data?.userId);

  const getAllMessages = roomId => {
    firestore()
      .collection('messages')
      .doc(roomId)
      .collection('chat')
      .orderBy('createdAt', 'asc')
      .onSnapshot(res => {
        let message = [];
        if (res.docs.length) {
          res.forEach(doc => {
            message.push(doc.data());
          });
        }
        if (message.length < 1) {
          setRoom(data?.userId + '-' + currnetId);
        }
        setMessages(message);
      });
  };

  useEffect(() => {
    getAllMessages(room);
    username(data?.name);
  }, [room]);

  const sendMessage = () => {
    if (!text) return;
    setLoader(true);
    const d = new Date();
    let createAt = d.toISOString();
    let input = {
      text: text,
      userId: currnetId,
      createdAt: Date.now(createAt),
    };
    firestore()
      .collection('messages')
      .doc(room)
      .collection('chat')
      .add(input)
      .then(res => {
        setLoader(false);
        getAllMessages(room);
        setText('');
        Keyboard.dismiss();
      })
      .catch(err => {
        console.log(err);
        alert(err);
        setLoader(false);
      });
  };

  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  const renderItem = ({item}) => (
    <>
      <View
        style={{
          alignSelf: item.userId == currnetId ? 'flex-end' : 'flex-start',
          marginBottom: 15,
        }}>
        <View
          style={{
            backgroundColor: item.userId == currnetId ? '#f6f6f6' : '#f7d8d7',
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 15,
            overflow: 'hidden',
            maxWidth: Dimensions.get('window').width * 0.6,
          }}>
          <Text
            style={{
              color: item.userId == currnetId ? '#000' : '#a29691',
              fontWeight: '600',
            }}>
            {item?.text}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 11,
            fontWeight: '500',
            color: '#bba6a3',
            textAlign: 'right',
            paddingRight: 5,
          }}>
          {formatAMPM(new Date(item?.createdAt))}
        </Text>
      </View>
    </>
  );

  return (
    <KeyboardAvoidingView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{flex: 1}}>
      <View style={styles.container}>
        <View style={{paddingHorizontal: 25, flex: 1, paddingBottom: 8}}>
          <FlatList
            data={messages}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 20,
            paddingHorizontal: 25,
            backgroundColor: '#f9f9f9',
          }}>
          <TextInput
            placeholder="Type Message.."
            onChangeText={text => setText(text)}
            value={text}
            style={{
              borderRadius: 8,
              width: '80%',
              paddingHorizontal: 15,
              marginRight: 20,
              backgroundColor: '#fff',
            }}
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={{
              width: 40,
              height: 40,
              borderRadius: 55,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
            }}>
            {loader ? (
              <Text>...</Text>
            ) : (
              <Image
                source={sent}
                style={{width: 20, height: 20, transform: [{rotate: '42deg'}]}}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#fff',
  },
});

export default Message;
