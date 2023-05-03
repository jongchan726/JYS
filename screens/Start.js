import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, Platform, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { check, PERMISSIONS, RESULTS, request, requestNotifications } from 'react-native-permissions';

export default function StartScreen({ navigation }) {
  const isDarkMode = useColorScheme() === 'dark';
  
  useEffect(() => { // 이 스크린이 실행되면 한번 실행
    AsyncStorage.getItem('access_token') // 토큰값을 가져옴
      .then((token) => {
        // 임시로 토큰값만 있으면 홈으로 넘어가도록 설정
        // API통신을 통해 토큰이 유효한지 확인할 예정
        if (token) {
          AsyncStorage.getItem('job') // 'job' 키를 가져옴
            .then((job) => {
              if (job === 'student') { // 'job'이 'student'라면
                return navigation.dispatch( // 기존에 있던 모든 스크린을 없애고 'S_Home'스크린으로 이동
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'S_Home'}]
                  })
                )
              } else if (job === 'teacher') { // 'job'이 'teacher'라면
                return navigation.dispatch(  // 기존에 있던 모든 스크린을 없애고 'T_Home'스크린으로 이동
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'T_Home'}]
                  })
                )
              } else { // 'job'이 없다면 모든 데이터 삭제
                AsyncStorage.removeItem('id')
                AsyncStorage.removeItem('job')
                AsyncStorage.removeItem('access_token')
                AsyncStorage.removeItem('refresh_token')
                AsyncStorage.removeItem('fcm_token')
              }
            })
        } else { // 'job'이 없다면 모든 데이터 삭제
          AsyncStorage.removeItem('id')
          AsyncStorage.removeItem('job')
          AsyncStorage.removeItem('access_token')
          AsyncStorage.removeItem('refresh_token')
          AsyncStorage.removeItem('fcm_token')
          return navigation.dispatch( // 'Login' 스크린으로 이동하고 기존에 있던 모든 스크린을 삭제
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Login'}]
            })
          )
        }
      })
  }, [])

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <Text style={styles.logo}>JYS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    },
  containerDark: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 100,
    color: '#fb5b5a',
    marginBottom: 40,
  },
})