import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Chat from './src/Screeens/Chat';
import Message from './src/Screeens/Message';
import RegisterOrLogin from './src/Screeens/RegisterOrLogin';

const Stack = createNativeStackNavigator();

const App = () => {
  const [chatUserName, setchatUserName] = useState('');
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="RegisterOrLogin"
          component={RegisterOrLogin}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Message"
          component={Message}
          options={{
            title: chatUserName,
          }}
          initialParams={{username: setchatUserName}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
