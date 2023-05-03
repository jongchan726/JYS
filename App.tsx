import React, { useEffect, useState } from 'react';
import { Alert, useColorScheme, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import GOOGLE_SERVICES_JSON from './android/app/google-services.json'; // env 파일에서 GOOGLE_SERVICES_JSON 값을 가져옵니다.

import StartScreen from './screens/Start';
import LoginScreen from './screens/Login';
import SignUpScreen from './screens/SignUp';

import S_HomeScreen from './screens/student/Home';
import S_Profile from './screens/student/Profile';
import S_RoomRental from './screens/student/RoomRental';
import S_RoomCancel from './screens/student/RoomCancel';

import T_HomeScreen from './screens/teacher/Home';
import T_Profile from './screens/teacher/Profile';
import T_RoomSituation from './screens/teacher/RoomSituation';

const config = {
  apiKey: GOOGLE_SERVICES_JSON.client[0].api_key[0].current_key,
  databaseURL: GOOGLE_SERVICES_JSON.databaseURL, // Firebase Console에서 확인한 데이터베이스 URL을 입력합니다.
  projectId: GOOGLE_SERVICES_JSON.project_info.project_id,
  storageBucket: GOOGLE_SERVICES_JSON.project_info.storage_bucket,
  messagingSenderId: GOOGLE_SERVICES_JSON.project_info.project_number,
  appId: GOOGLE_SERVICES_JSON.client[0].client_info.mobilesdk_app_id,
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function S_Tab() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <Tab.Navigator screenOptions={{
      tabBarActiveTintColor: isDarkMode? '#FFFFFF' : '#000',
      tabBarInactiveTintColor: isDarkMode? '#BEBEBE' : '#8e8e8e',
      tabBarStyle: {
        backgroundColor: isDarkMode ? '#222' : '#fff',
      },
      tabBarLabelStyle: {
        fontSize: 13,
        fontWeight: 'bold',
      },
    }}>
      <Tab.Screen
        name="S_Tab_Home"
        component={S_HomeScreen}
        options={{
          title: '홈',
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name='S_Tab_Profile'
        component={S_Profile}
        options={{
          title: '프로필',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  )
}

function T_Tab() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Tab.Navigator screenOptions={{
      tabBarActiveTintColor: isDarkMode? '#FFFFFF' : '#000',
      tabBarInactiveTintColor: isDarkMode? '#BEBEBE' : '#8e8e8e',
      tabBarStyle: {
        backgroundColor: isDarkMode ? '#222' : '#fff',
      },
      tabBarLabelStyle: {
        fontSize: 13,
        fontWeight: 'bold',
      },
    }}>
      <Tab.Screen
        name="T_Tab_Home"
        component={T_HomeScreen}
        options={{
          title: '홈',
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name='T_Tab_RoomSituation'
        component={T_RoomSituation}
        options={{
          title: '방음부스',
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name='T_Tab_Profile'
        component={T_Profile}
        options={{
          title: '프로필',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

const App = () => {
  //https://velog.io/@kwonh/ReactNative-%ED%91%B8%EC%89%AC%EC%95%8C%EB%A6%BC-%EA%B3%B5%EC%8B%9D%EB%AC%B8%EC%84%9C-%EB%94%B0%EB%9D%BC%ED%95%98%EA%B8%B0-Firebase-Cloud-Messaging-react-native-firebase-notification-%EC%95%88%EB%93%9C%EB%A1%9C%EC%9D%B4%EB%93%9C
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log(remoteMessage)
  })

  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('메세지', JSON.stringify(remoteMessage))
    })
    return unsubscribe
  })

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Start" component={StartScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }}/>

        <Stack.Screen name="S_Home" component={S_Tab} options={{ headerShown: false }}/>
        <Stack.Screen name="S_RoomRental" component={S_RoomRental} options={{ headerShown: false }}/>
        <Stack.Screen name="S_RoomCancel" component={S_RoomCancel} options={{ headerShown: false }}/>

        <Stack.Screen name="T_Home" component={T_Tab} options={{ headerShown: false }}/>
        <Stack.Screen name="T_Profile" component={T_Profile} options={{headerShown:false}}/>
        <Stack.Screen name="T_Tab_RoomSituation" component={T_RoomSituation} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;