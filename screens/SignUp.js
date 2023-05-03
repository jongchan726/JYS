import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View, useColorScheme, TouchableOpacity, ScrollView } from "react-native";

import axiosInstance from "../api/API_Server";

export default function SignUpScreen({ navigation }) {
    const isDarkMode = useColorScheme() === 'dark'

    const [ email, setEmail ] = useState(null)
    const [ password, setPassword ] = useState(null)
    const [ confirmPassword, setConfirmPassword ] = useState(null)
    const [ phoneNumber, setPhoneNumber ] = useState('')
    const [ studentID, setStudentID ] = useState(null)
    const [ firstName, setFirstName ] = useState(null)
    const [ lastName, setLastName ] = useState(null)

    const handleSignUp = async() => {
        if (email === null) {
            Alert.alert('경고', '이메일을 입력해주세요.')
        } else if (password === null) {
            Alert.alert('경고', '비밀번호를 입력해주세요.')
        } else if (confirmPassword === null) {
            Alert.alert('경고', '확인 비밀번호를 입력해주세요.')
        } else if (phoneNumber === null) {
            Alert.alert('경고', '전화번호를 입력해주세요.')
        } else if (firstName === null) {
            Alert.alert('경고', '성을 입력해주세요.')
        } else if (lastName === null) {
            Alert.alert('경고', '이름을 입력해주세요.')
        } else if (studentID === null) {
            Alert.alert('경고', '학번을 입력해주세요.')
        } else if (password !== confirmPassword) {
            Alert.alert('경고', '비밀번호가 일치하지 않습니다.\n비밀번호를 확인해주세요.')
        } else if (studentID.length !== 5) {
            Alert.alert('경고', '학번을 확인해주세요. ex) 30101')
        }
         else {
            try {
                await axiosInstance.post('register', {
                    email: email,
                    password: password,
                    phoneNumber: phoneNumber,
                    studentID: studentID,
                    firstName: firstName,
                    lastName: lastName,
                }).then((res) => {
                    if (res.status === 200) {
                        Alert.alert('회원가입', res.data.message)
                        navigation.navigate('Login')
                    } else if (res.status === 202) {
                        Alert.alert('등록된 이메일', res.data.message)
                    } else if (res.status === 500) {
                        Alert.alert('에러', '서버 오류!')
                    } else {
                        Alert.alert('에러', '예외가 발생했습니다.')
                    }
                })
                .catch((error) => {
                    console.log(error)
                    Alert.alert('에러', error.message)
                })
            } catch (error) {
                console.log(error)
                Alert.alert('에러', error.message)
            }
        }
    }

    return (
        <View style={[styles.container, isDarkMode && styles.containerDark]}>
            <Text style={[SignUpStyles.Title, isDarkMode && SignUpStyles.TitleDark]}>회원가입</Text>

            <ScrollView contentContainerStyle={[styles.scrollContainer, isDarkMode && styles.scrollContainerDark]}>
                <View style={SignUpStyles.inputView}>
                    <TextInput
                        style={SignUpStyles.inputText}
                        placeholder="이메일"
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                    />
                </View>

                <View style={SignUpStyles.inputView}>
                    <TextInput
                        style={SignUpStyles.inputText}
                        placeholder="비밀번호"
                        secureTextEntry
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                    />
                </View>

                <View style={SignUpStyles.inputView}>
                    <TextInput
                        style={SignUpStyles.inputText}
                        placeholder="비밀번호 확인"
                        secureTextEntry
                        onChangeText={(text) => setConfirmPassword(text)}
                        value={confirmPassword}
                    />
                </View>

                <View style={SignUpStyles.inputView}>
                    <TextInput
                        style={SignUpStyles.inputText}
                        placeholder="전화번호"
                        keyboardType="number-pad"
                        onChangeText={(text) => setPhoneNumber(text)}
                        value={phoneNumber.replace(/[^0-9]/g, '').replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/(\-{1,2})$/g, "")}
                    />
                </View>

                <View style={SignUpStyles.inputView}>
                    <TextInput
                        style={SignUpStyles.inputText}
                        placeholder="학번"
                        keyboardType="number-pad"
                        onChangeText={(text) => setStudentID(text)}
                        value={studentID}
                    />
                </View>

                <View style={SignUpStyles.inputView}>
                    <TextInput
                        style={SignUpStyles.inputText}
                        placeholder="성"
                        onChangeText={(text) => setFirstName(text)}
                        value={firstName}
                    />
                </View>

                <View style={SignUpStyles.inputView}>
                    <TextInput
                        style={SignUpStyles.inputText}
                        placeholder="이름"
                        onChangeText={(text) => setLastName(text)}
                        value={lastName}
                    />
                </View>

                <TouchableOpacity style={SignUpStyles.sumitBtn} onPress={handleSignUp}>
                    <Text style={SignUpStyles.sumitBtnText}>가입하기</Text>
                </TouchableOpacity>

                <TouchableOpacity style={SignUpStyles.signInBtn} onPress={() => navigation.navigate('Login')}>
                    <Text style={SignUpStyles.signInBtnText}>이미 계정이 있으신가요? 로그인</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    containerDark: {
        flex: 1,
        backgroundColor: '#000000',
    },
    scrollContainer: {
        alignItems: 'center',
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
      scrollContainerDark: {
        alignItems: 'center',
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#000000',
    },
})

const SignUpStyles = StyleSheet.create({
    Title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        marginTop: 30,
        textAlign: 'center',
        color: '#000', // 다크모드에서의 글자색상
    },
    TitleDark: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        marginTop: 30,
        color: '#fff', // 다크모드에서의 글자색상
    },
    inputView: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 15,
        height: 50,
        marginBottom: 20,
        justifyContent: 'center',
        padding: 20,
        borderColor: '#fb5b5a',
        borderWidth: 2,
    },
    inputText: {
        height: 50,
        color: 'black',
    },
    sumitBtn: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 4,
        width: '80%',
        alignItems: 'center',
        marginTop: 20,
    },
    sumitBtnText: {
        color: '#fff',
        fontSize: 16,
    },
    signInBtn: {
        marginTop: 10,
    },
    signInBtnText: {
        color: 'red',
        fontSize: 16,
    }
})