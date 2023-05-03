import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { useColorScheme, Alert, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { CommonActions } from "@react-navigation/native";

import axiosInstance from "../../api/API_Server";

export default function Profile({ navigation }) {
    const isDarkMode = useColorScheme() === 'dark'

    const [ email, setEmail ] = useState('')
    const [ phoneNumber, setPhoneNumber ] = useState('')
    const [ firstName, setFirstName ] = useState(null)
    const [ lastName, setLastName ] = useState(null)

    const handleProfile = async() => {
        try {
            const ID = await AsyncStorage.getItem('id')
            const JOB = await AsyncStorage.getItem('job')
            
            await axiosInstance.post('/profile', { id: ID, job: JOB })
                .then((res) => {
                    console.log(res.data)
                    setEmail(res.data.email)
                    setPhoneNumber(res.data.phoneNumber)
                    setFirstName(res.data.firstName)
                    setLastName(res.data.lastName)
                }).catch((error) => {
                    console.log('Profile API |', error)
                    return Alert.alert('에러', error.message)
                })
        } catch (error) {
            console.log('Profile API |', error)
            return Alert.alert('에러', error.message)
        }
    }

    const handleLogout = async() => {
        try {
            AsyncStorage.removeItem('id')
            AsyncStorage.removeItem('job')
            AsyncStorage.removeItem('access_token')
            AsyncStorage.removeItem('refresh_token')
            Alert.alert('로그아웃', '로그아웃되었습니다.')
            return navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login'}]
                })
            )
        } catch (error) {
            console.log(error)
            return Alert.alert('에러', error.message)
        }
    }

    useEffect(() => {
        handleProfile()
    }, [])

    return(
        <View style={[styles.container, isDarkMode && styles.containerDark]}>
            {/* 로고 */}
            <Text style={styles.logo}>JYS</Text>

            <View style={[styles.scrollContainer, isDarkMode && styles.scrollContainerDark]}>
                <View style={[profileStyles.Info, isDarkMode && profileStyles.InfoDark]}>
                    <View style={profileStyles.Item}>
                    </View>
                    <View style={profileStyles.Item}>
                        <Text style={[profileStyles.Label, isDarkMode && profileStyles.LabelDark]}>이름</Text>
                        <Text style={[profileStyles.Value, isDarkMode && profileStyles.ValueDark]}>{firstName}{lastName}</Text>
                    </View>
                    <View style={profileStyles.Item}>
                        <Text style={[profileStyles.Label, isDarkMode && profileStyles.LabelDark]}>이메일</Text>
                        <Text style={[profileStyles.Value, isDarkMode && profileStyles.ValueDark]}>{email}</Text>
                    </View>
                    <View style={profileStyles.Item}>
                        <Text style={[profileStyles.Label, isDarkMode && profileStyles.LabelDark]}>전화번호</Text>
                        <Text style={[profileStyles.Value, isDarkMode && profileStyles.ValueDark]}>{phoneNumber}</Text>
                    </View>
                </View>
            </View>
        <TouchableOpacity style={profileStyles.logoutBtn} onPress={handleLogout}>
            <Text style={profileStyles.logoutBtnText}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    );  
} 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0',
    },
      containerDark: {
        flex: 1,
        backgroundColor: '#000000',
    },
    scrollContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0F0F0',
    },
    scrollContainerDark: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
    },
    logo: {
        fontWeight: 'bold',
        fontSize: 50,
        color: '#fb5b5a',
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
})

const profileStyles = StyleSheet.create({
    Info: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        width: '95%',
        maxWidth: 400,
    },
    InfoDark: {
        backgroundColor: '#121212', // 다크모드에서의 배경색상
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        width: '95%',
        maxWidth: 400,
        borderColor: '#FFFFFF', // 다크모드에서의 테두리 색상
        borderWidth: 1,
    },
    Item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    Label: {
        fontWeight: 'bold',
        width: 80,
        marginRight: 3,
        color: '#000', // 다크모드에서의 글자색상
    },
    LabelDark: {
        fontWeight: 'bold',
        width: 80,
        marginRight: 3,
        color: '#fff', // 다크모드에서의 글자색상
    },
    Value: {
        flex: 1,
        color: '#000', // 다크모드에서의 글자색상
    },
    ValueDark: {
        flex: 1,
        color: '#fff', // 다크모드에서의 글자색상
    },
    logoutBtn: {
        backgroundColor: '#1E00D3',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignSelf: 'center',
        position: 'absolute',
        bottom: 0,
        marginBottom: 20,
    },
    logoutBtnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
})