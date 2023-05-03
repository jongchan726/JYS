import React, { useState } from 'react';
import { Alert, Button, Image, StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { PERMISSIONS, request, check } from 'react-native-permissions';
import { CommonActions } from "@react-navigation/native";

import axios from 'axios';
import axiosInstance from '../../api/API_Server';

const CAMERA_PERMISSION = Platform.select({
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA,
})

const requestCameraPermission = async () => {
    try {
        const result = await request(CAMERA_PERMISSION);
        return result === 'granted'
    } catch (error) {
        console.log(error)
        return false
    }
}

const options = {
    title: 'Select an image',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
}

export default function RoomCancel({ navigation }) {
    const [imageURI, setImageURI] = useState(null)

    const handleTakePhoto = async () => {
        const hasPermission = await requestCameraPermission()
        if (hasPermission) {
            launchCamera(options, (res) => {
                if (res.didCancel) {
                    Alert.alert('에러', '사진찍기를 취소했습니다.')
                } else if (res.error) {
                    console.log(res.errorMessage)
                } else {
                    setImageURI(res.assets[0].uri)
                }
            })
        } else {
            Alert.alert('에러', '카메라 권한을 확인해주세요.')
        }
    }

    const handleChoosePhoto = async () => {
        try {
            launchImageLibrary(options, (res) => {
                if (res.didCancel) {
                    return Alert.alert('에러', '사진선택을 취소했습니다.')
                } else if (res.error) {
                    console.log(res.errorMessage)
                    return Alert.alert('에러', res.errorMessage)
                } else {
                    setImageURI(res.assets[0].uri)
                }
            })
        } catch (error) {
            return Alert.alert('에러', '저장공간 접근 권한이 없습니다.')
        }
    }

    const handleRoomCancel = async () => {

    }

    const handleUploadPhoto = async () => {
        if (imageURI === null) {
            Alert.alert('에러', '이미지가 선택되지 않았습니다.')
        }

        try {
            const formData = new FormData()
            formData.append('image', {
                uri: imageURI,
                type: 'image/jpeg',
                name: 'photo.jpg'
            })

            await axios.post('http://www.zena.co.kr/api/RoomRentalImageUpload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then((res) => {
                console.log(res.data)
                if (res.status === 200) {
                    if (res.data.type === 1) {
                        return Alert.alert('에러', res.data.message)
                    } else if (res.data.type === 2) {
                        Alert.alert('성공', res.data.message)
                        AsyncStorage.getItem('id')
                            .then(async (ID) => {
                                await axiosInstance.post('/RoomRentalStopCancel', { id: ID })
                                    .then((res) => {
                                        console.log(res.data)
                                        return navigation.dispatch(
                                            CommonActions.reset({
                                                index: 0,
                                                routes: [{ name: 'S_Home'}]
                                            })
                                        )
                                    }).catch((error) => {
                                        Alert.alert('에러', error.message)
                                    })
                            }).catch((error) => {
                                Alert.alert('에러', error.message)
                            })
                    }
                }
            }).catch((error) => {
                return Alert.alert('에러', error.message)
            })
        } catch (error) {
            console.log(error)
            Alert.alert('에러', error.message)
        }
    }

    return (
        <View style={styles.container}>
            {/* 로고 */}
            <Text style={styles.logo}>JYS</Text>

            <Text style={styles.title}>부스대여 종료</Text>
    
            {imageURI?
                <Image source={{ uri: imageURI }} style={styles.image} />
                :null
            }

            <View>
                <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
                    <Text style={styles.buttonText}>사진 찍기</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleChoosePhoto}>
                    <Text style={styles.buttonText}>사진 선택</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => {handleUploadPhoto()}}>
                    <Text style={styles.buttonText}>대여 종료하기</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        alignItems: 'center',
        padding: 20,
        justifyContent: 'center',
    },
    logo: {
        fontWeight: 'bold',
        fontSize: 50,
        color: '#fb5b5a',
        marginBottom: 30,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        minHeight: '100%'
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginTop: 20,
        marginBottom: 20
    },
    button: {
        backgroundColor: '#1E00D3',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginTop: 10,
        marginBottom: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
})