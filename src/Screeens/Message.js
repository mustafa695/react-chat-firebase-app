import React, {useCallback, useEffect, useState} from 'react';
import {Keyboard, Text, View} from 'react-native';
import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';

const Message = ({route}) => {
  const {data} = route.params;
  const {username} = route.params;
  const auth = useSelector(state => state.auth.auhtUSer);
  const currnetId = auth.currentUser.uid;

  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState(currnetId + '-' + data?.userId);
  const [onSendRoom, setOnSendRoom] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [isLoadingMsg, setIsLoadingMsg] = useState(false);
  const [showFooter, setShowFooter] = useState(false);

  const getAllMessageListner = roomId => {
    setIsLoadingMsg(true);
    firestore()
      .collection('messages')
      .doc(roomId)
      .collection('chat')
      .orderBy('createdAt', 'desc')
      .limit(15)
      .onSnapshot(res => {
        setLastVisible(res.docs[res.docs.length - 1]);
        let message = [];
        if (res.docs.length) {
          res.forEach(doc => {
            message.push({
              ...doc.data(),
              createdAt: Date.now(),
            });
          });
        }
        if (!res.docs.length) {
          setIsLoadingMsg(false);
          setShowFooter(true);
        }

        if (message.length < 1) {
          setRoom(data?.userId + '-' + currnetId);
          setOnSendRoom(data?.userId + '-' + currnetId);
        }

        setMessages(message);
      });
  };

  useEffect(() => {
    getAllMessageListner(room);
    username(data?.name);
  }, [room]);

  //load more messgaes

  const loadMoreMessgaes = () => {
    firestore()
      .collection('messages')
      .doc(room)
      .collection('chat')
      .orderBy('createdAt', 'desc')
      .startAfter(lastVisible || 111)
      .limit(15)
      .onSnapshot(res => {
        setLastVisible(res.docs[res.docs.length - 1]);
        let message = [...messages];
        if (res.docs.length) {
          res.forEach(doc => {
            message.push({
              ...doc.data(),
              createdAt: Date.now(),
            });
          });
        } else {
          setIsLoadingMsg(false);
        }
        setMessages(message);
      });
  };

  const onSend = (messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    let msg = messages[0];
    let roomId = onSendRoom === null ? room : onSendRoom;
    (msg.user.avatar = auth.data[0].avatar),
      firestore()
        .collection('messages')
        .doc(roomId)
        .collection('chat')
        .add(messages[0])
        .then(res => {
          console.log('send');
          setIsLoadingMsg(true);
          // Keyboard.dismiss();
        })
        .catch(err => {
          console.log(err);
        });
  };

  // const onSend = useCallback((messages = []) => {

  //   setMessages(previousMessages =>
  //     GiftedChat.append(previousMessages, messages),
  //   );
  //   let msg = messages[0];
  //   (msg.user.avatar = auth.data[0].avatar),
  //     firestore()
  //       .collection('messages')
  //       .doc(room)
  //       .collection('chat')
  //       .add(messages[0])
  //       .then(res => {
  //         console.log('send');
  //         Keyboard.dismiss();
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       });
  // }, []);

  const chatNowText = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          flex: 1,
          display: showFooter ? 'flex' : 'none',
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 15}}>{data?.name}</Text>
        <Text
          style={{
            textAlign: 'center',
            marginBottom: 20,
            fontSize: 14,
          }}>
          Be the first one to send a message..
        </Text>
      </View>
    );
  };

  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#7986cb',
            fontFamily: 'TitilliumWeb-Bold',
          },
          left: {
            backgroundColor: '#fafafa',
          },
        }}
      />
    );
  };

  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={true}
      loadEarlier={isLoadingMsg}
      onLoadEarlier={loadMoreMessgaes}
      renderFooter={chatNowText}
      infiniteScroll={true}
      renderBubble={renderBubble}
      onSend={messages => onSend(messages)}
      user={{
        _id: currnetId,
      }}
    />
  );
};

export default Message;
