import React, { useEffect, useState } from "react";
import { useColorScheme, Alert, ScrollView, StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CommonActions } from "@react-navigation/native";

import axiosInstance from "../../api/API_Server";

export default function RoomRental ({ navigation }) {
    const isDarkMode = useColorScheme() === 'dark'

    // https://taehoon95.tistory.com/116
    const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false)
    const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false)

    const [studentID, setStudentID] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [roomNumber, setRoomNumber] = useState('1')
    const [roomUsingStartTime, setRoomUsingStartTime] = useState('')
    const [roomUsingEndTime, setRoomUsingEndTime] = useState('')
    const [roomPurpose, setRoomPurpose] = useState('test')

    const RentalSumit = async() => {
        AsyncStorage.getItem('id')
            .then(async (ID) => {
                axiosInstance.post('/RoomRentalForm', {
                    id: ID,
                    roomNumber: roomNumber,
                    purpose: roomPurpose,
                    usingStartTime: roomUsingStartTime,
                    usingEndTime: roomUsingEndTime,
                }).then((res) => {
                    if (res.status === 200) {
                        Alert.alert('신청 성공', res.data.message)
                        return navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: 'S_Home'}]
                            })
                        )
                    }
                })
                .catch((error) => {
                    console.log(error)
                    Alert.alert('에러',  error.message)
                })
            }).catch((error) => {
                console.log('RoomRentalForm API |', error)
                return Alert.alert('에러', error.message)
            })
    }

    const handleProfile = async() => {
        try {
            const ID = await AsyncStorage.getItem('id')
            const JOB = await AsyncStorage.getItem('job')

            await axiosInstance.post('/profile', { id: ID, job: JOB })
                .then((res) => {
                    console.log(res.data)
                    setStudentID(res.data.studentID)
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

    const showStartTimePicker = () => {
        setStartTimePickerVisibility(true)
    }
    
    const hideStartTimePicker = () => {
        setStartTimePickerVisibility(false)
    }
    
    const showEndTimePicker = () => {
        setEndTimePickerVisibility(true)
    }
    
    const hideEndTimePicker = () => {
        setEndTimePickerVisibility(false)
    }

    const handleRoomUsingStartTime = (time) => {
        hideStartTimePicker()
        const dateObj = new Date(String(time))
        const year = dateObj.getFullYear()
        const month = dateObj.getMonth() + 1 // 0부터 시작하므로 +1 처리 필요
        const date = dateObj.getDate()
        const hours = dateObj.getHours()
        const minutes = dateObj.getMinutes()
        setRoomUsingStartTime(`${year}년${month}월${date}일 ${hours}시${minutes}분`)
    }

    const handleRoomUsingEndTime = (time) => {
        hideEndTimePicker()
        const dateObj = new Date(String(time))
        const year = dateObj.getFullYear()
        const month = dateObj.getMonth() + 1 // 0부터 시작하므로 +1 처리 필요
        const date = dateObj.getDate()
        const hours = dateObj.getHours()
        const minutes = dateObj.getMinutes()
        setRoomUsingEndTime(`${year}년${month}월${date}일 ${hours}시${minutes}분`)
    }

    useEffect(() => {
        handleProfile() // 스크린이 처음 시작될 때 한번 실행
    }, [])

    return (
        <View style={[styles.container, isDarkMode && styles.containerDark]}>
            {/* 로고 */}
            <Text style={styles.logo}>JYS</Text>

            <ScrollView contentContainerStyle={[styles.scrollContainer, isDarkMode && styles.scrollContainerDark]}>
                <View style={[rentalStyles.Info, isDarkMode && rentalStyles.InfoDark]}>
                    <Text style={[rentalStyles.Title, isDarkMode && rentalStyles.TitleDark]}>부스대여</Text>

                    <View style={rentalStyles.Item}>
                        <Text style={[rentalStyles.Label, isDarkMode && rentalStyles.LabelDark]}>학번</Text>
                        <View style={rentalStyles.inputView}>
                            <TextInput 
                                style={rentalStyles.inputText}
                                placeholder="학번 예) 30101"
                                keyboardType="numeric"
                                onChangeText={setStudentID}
                                value={studentID}
                            />
                        </View>
                    </View>

                    <View style={rentalStyles.Item}>
                        <Text style={[rentalStyles.Label, isDarkMode && rentalStyles.LabelDark]}>이름</Text>
                        <View style={rentalStyles.inputView}>
                            <TextInput 
                                style={rentalStyles.inputText}
                                placeholder="이름"
                                value={firstName+lastName}
                            />
                        </View>
                    </View>

                    <View style={rentalStyles.Item}>
                        <Text style={[rentalStyles.Label, isDarkMode && rentalStyles.LabelDark]}>시작 시간</Text>
                        <View style={rentalStyles.inputView}>
                            <TouchableOpacity onPress={showStartTimePicker}>
                                <TextInput 
                                    pointerEvents="none"
                                    style={rentalStyles.inputText}
                                    placeholder="시작시간 HH:MM"
                                    value={roomUsingStartTime}
                                    editable={false}
                                />
                                <DateTimePickerModal
                                    isVisible={isStartTimePickerVisible}
                                    mode="time"
                                    onConfirm={handleRoomUsingStartTime}
                                    onCancel={hideStartTimePicker}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={rentalStyles.Item}>
                        <Text style={[rentalStyles.Label, isDarkMode && rentalStyles.LabelDark]}>종료 시간</Text>
                        <View style={rentalStyles.inputView}>
                            <TouchableOpacity onPress={showEndTimePicker}>
                                <TextInput 
                                    pointerEvents="none"
                                    style={rentalStyles.inputText}
                                    placeholder="종료시간 HH:MM"
                                    value={roomUsingEndTime}
                                    editable={false}
                                />
                                <DateTimePickerModal
                                    isVisible={isEndTimePickerVisible}
                                    mode="time"
                                    onConfirm={handleRoomUsingEndTime}
                                    onCancel={hideEndTimePicker}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={rentalStyles.Item}>
                        <Text style={[rentalStyles.Label, isDarkMode && rentalStyles.LabelDark]}>사용 목적</Text>
                        <View style={rentalStyles.inputView}>
                            <TextInput 
                                style={rentalStyles.inputText}
                                placeholder="사용목적"
                                onChangeText={setRoomPurpose}
                                value={roomPurpose}
                            />
                        </View>
                    </View>

                    <View style={rentalStyles.Item}>
                        <Text style={[rentalStyles.Label, isDarkMode && rentalStyles.LabelDark]}>사용 목적</Text>
                        <View style={rentalStyles.inputView}>
                            <TextInput 
                                style={rentalStyles.inputText}
                                placeholder="희망 부스번호"
                                keyboardType="numeric"
                                onChangeText={setRoomNumber}
                                value={roomNumber}
                            />
                        </View>
                    </View> 
                </View>
                <TouchableOpacity style={rentalStyles.sumitBtn} onPress={RentalSumit}>
                    <Text>신청하기</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
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

const rentalStyles = StyleSheet.create({
    Info: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        width: '95%',
        maxWidth: 400,
        position: 'relative'
    },
    InfoDark: {
        backgroundColor: '#121212', // 다크모드에서의 배경색상
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        width: '95%',
        maxWidth: 400,
        position: 'relative',
        borderColor: '#FFFFFF', // 다크모드에서의 테두리 색상
        borderWidth: 1,
    },
    Title: {
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15,
        color: '#000000', // 다크모드에서의 글자색상
    },
    TitleDark: {
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15,
        color: '#FFFFFF', // 다크모드에서의 글자색상
    },
    Text: {
        backgroundColor: '#fff',
        padding: 30,
        paddingBottom: 65,
        textAlign: 'center'
    },
    Item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        marginLeft: 30,
    },
    Label: {
        fontSize: 15,
        fontWeight: 'bold',
        width: 70,
        marginRight: 10,
        color: '#000', // 다크모드에서의 글자색상
    },
    LabelDark: {
        fontSize: 15,
        fontWeight: 'bold',
        width: 70,
        marginRight: 10,
        color: '#fff', // 다크모드에서의 글자색상
    },
    inputView: {
        width: '60%',
        backgroundColor: '#fff',
        borderRadius: 5,
        height: 35,
        marginBottom: 10,
        marginTop: 10,
        marginRight: 30,
        justifyContent: 'center',
        padding: 10,
        borderColor: '#fb5b5a',
        borderWidth: 2,
        flex: 1,
    },
    inputText: {
        height: 50,
        color: 'black',
    },
    sumitBtn: {
        width: '80%',
        backgroundColor: '#fb5b5a',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
    }
})