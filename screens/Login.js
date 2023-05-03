import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, View, Text, useColorScheme, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import messaging from '@react-native-firebase/messaging';

import axiosInstance from "../api/API_Server";

export default function LoginScreen({ navigation }) {
    const isDarkMode = useColorScheme() === 'dark'

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ job, setJob ] = useState('student')

    const handleJob = async () => {
        if (job === 'student') {
            setJob('teacher')
        } else if (job === 'teacher') {
            setJob('student')
        }
    }

    const handleLogin = async () => {
        if (!email || !password) {
            return Alert.alert('경고', '아이디 또는 비밀번호를 입력해주세요')
        } else {
            try {
                const fcmToken = await messaging().getToken()
                await axiosInstance.post('/login', { email, password, job, fcmToken })
                    .then((res) => {
                        console.log(res.data)
                        if (res.status === 200) {
                            AsyncStorage.setItem('id', res.data.id)
                            AsyncStorage.setItem('job', res.data.job)
                            AsyncStorage.setItem('access_token', res.data.accessToken)
                            AsyncStorage.setItem('refresh_token', res.data.refreshToken)
                            AsyncStorage.setItem('fcm_token', fcmToken)
                            if (res.data.job === 'student') {
                                return navigation.dispatch(
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [{ name: 'S_Home' }]
                                    })
                                )
                            } else if (res.data.job === 'teacher') {
                                return navigation.dispatch(
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [{ name: 'T_Home' }]
                                    })
                                )
                            }
                        } else if (res.status === 202) {
                            Alert.alert('경고', res.data.message)
                        } else {
                            Alert.alert('오류', '예외가 발생했습니다.')
                        }
                    }).catch((error) => {
                        console.log('LoginAPI | ', error)
                        Alert.alert('에러', error.message)
                    })
            } catch (error) {
                console.log('LoginAPI | ', error)
                Alert.alert('에러', error.message)
            }
        }
    }

    return (
        <View style={[styles.container, isDarkMode && styles.containerDark]}>
            <Text style={styles.logo}>JYS</Text>

            <View style={[LoginStyles.inputView, isDarkMode && LoginStyles.inputViewDark]}>
                <TextInput
                    style={LoginStyles.inputText}
                    placeholder="이메일"
                    placeholderTextColor="#003f5c"
                    onChangeText={(text) => setEmail(text)}
                />
            </View>
            <View style={[LoginStyles.inputView, isDarkMode && LoginStyles.inputViewDark]}>
                <TextInput
                    style={LoginStyles.inputText}
                    placeholder="비밀번호"
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={(text) => setPassword(text)}
                />
            </View>
            <TouchableOpacity style={LoginStyles.jobBtn} onPress={handleJob}>
                <Text style={{ color: 'white' }}>
                    {job === 'student'? '학생':'교사'}
                </Text>
            </TouchableOpacity>
            <View>
                <TouchableOpacity onPress={() => { navigation.navigate('SignUp')}}>
                    <Text style={[LoginStyles.signUpText, isDarkMode && LoginStyles.signUpTextDark]}>회원가입</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={LoginStyles.loginBtn} onPress={handleLogin}>
                <Text style={LoginStyles.loginBtnText}>로그인</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerDark: {
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        fontWeight: 'bold',
        fontSize: 70,
        color: '#fb5b5a',
        marginBottom: 40,
    },
})

const LoginStyles = StyleSheet.create({
    inputView: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        justifyContent: 'center',
        padding: 20,
        borderColor: '#fb5b5a',
        borderWidth: 2,
    },
    inputViewDark: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        justifyContent: 'center',
        padding: 20,
        borderColor: '#fb5b5a',
        borderWidth: 2,
    },
    inputText: {
        height: 50,
        color: '#000',
    },
    loginBtn: {
        width: '40%',
        backgroundColor: '#fb5b5a',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 10,
        marginLeft: 100,
        marginRight: 100,
    },
    loginBtnText: {
        color: 'white',
    },
    signUpText: {
        color: '#000',
    },
    signUpTextDark: {
        color: '#fff',
    },
    jobBtn: {
        width: '20%',
        backgroundColor: '#fb5b5a',
        borderRadius: 25,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 1,
        marginBottom: 20,
    }
})