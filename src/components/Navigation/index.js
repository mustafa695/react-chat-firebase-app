import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Chat from '../../Screeens/Chat';
import Message from '../../Screeens/Message';
import RegisterOrLogin from '../../Screeens/RegisterOrLogin';

import Setting from '../../Screeens/Setting';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UserIntro from '../../Screeens/UserIntro';
import Feeds from '../../Screeens/Feeds';
import colors from '../../constant/colors';
import fonts from '../../constant/fonts';
import {useColorScheme} from 'react-native';
import EditProfile from '../../Screeens/EditProfile';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

function MyTabs() {
  const theme = useColorScheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 2,
          borderTopColor: theme === 'dark' ? colors.borderDark : '#ddd',
          height: 65,
          paddingTop: 10,
          backgroundColor: theme === 'dark' ? colors.dark : colors.light,
        },
      }}>
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarIcon: ({focused}) => (
            <Ionicons
              color={focused ? '#7986cb' : theme === 'dark' ? '#4c4c4c' : '#000'}
              name="chatbubbles"
              size={22}
            />
          ),
          tabBarLabelStyle: {
            fontFamily: 'TitilliumWeb-SemiBold',
            fontSize: 13,
            paddingBottom: 10,
          },
          tabBarActiveTintColor: '#7986cb',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="People"
        component={Feeds}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Ionicons
              color={focused ? '#7986cb' : theme === 'dark' ? '#4c4c4c' : '#000'}
              name="people"
              size={22}
            />
          ),
          tabBarLabelStyle: {
            fontFamily: 'TitilliumWeb-SemiBold',
            fontSize: 13,
            paddingBottom: 10,
          },
          tabBarActiveTintColor: '#7986cb',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Setting}
        options={{
          tabBarIcon: ({focused}) => (
            <Ionicons
              color={focused ? '#7986cb' : theme === 'dark' ? '#4c4c4c' : '#000'}
              name="ios-settings"
              size={22}
            />
          ),
          tabBarLabelStyle: {
            fontFamily: 'TitilliumWeb-SemiBold',
            fontSize: 13,
            paddingBottom: 10,
          },
          tabBarActiveTintColor: '#7986cb',
          headerStyle: {
            backgroundColor: colors.chatColor,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: fonts.regular,
            color: '#fff',
          },
        }}
      />
    </Tab.Navigator>
  );
}

const Navigation = () => {
  const [chatUserName, setchatUserName] = useState('');

  const authSelector = useSelector(state => state.auth.auhtUSer);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={`${
          Object.keys(authSelector).length
            ? authSelector?.data?.length
              ? 'myTabs'
              : 'UserIntro'
            : 'RegisterOrLogin'
        }`}>
        <Stack.Screen
          name="RegisterOrLogin"
          component={RegisterOrLogin}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="myTabs"
          component={MyTabs}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Message"
          component={Message}
          options={{
            title: chatUserName,
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: colors.chatColor,
            },
            headerTitleStyle: {
              fontFamily: fonts.semiBold,
            },
            headerTitleAlign: 'center',
          }}
          initialParams={{username: setchatUserName}}
        />
        <Stack.Screen
          name="UserIntro"
          component={UserIntro}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
