import React, { useEffect, useState } from "react";
import { useColorScheme, Alert, ScrollView, StyleSheet, Text, View, TextInput, Button, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";

import axiosInstance from "../../api/API_Server";

export default function RoomSituation({ navigation }) {
    const isDarkMode = useColorScheme() === 'dark'

    const [RoomCondition_1, setRoomCondition_1] = useState(null);
    const [RoomName_1, setRoomName_1] = useState(null);
    const [UseStudentInfor_1, setUseStudentInfor_1] = useState(null);
    const [Time_1, setTime_1] = useState(null);

    const [RoomCondition_2, setRoomCondition_2] = useState(null);
    const [RoomName_2, setRoomName_2] = useState(null);
    const [UseStudentInfor_2, setUseStudentInfor_2] = useState(null);
    const [Time_2, setTime_2] = useState(null);

    const [RoomCondition_3, setRoomCondition_3] = useState(null);
    const [RoomName_3, setRoomName_3] = useState(null);
    const [UseStudentInfor_3, setUseStudentInfor_3] = useState(null);
    const [Time_3, setTime_3] = useState(null);

    const [RoomCondition_4, setRoomCondition_4] = useState(null);
    const [RoomName_4, setRoomName_4] = useState(null);
    const [UseStudentInfor_4, setUseStudentInfor_4] = useState(null);
    const [Time_4, setTime_4] = useState(null);

    const fetchRoomData = async () => {
        try {
            await axiosInstance.post('/RoomNowStatus')
                .then((res)=>{
                    //room1
                    setRoomCondition_1(res.data.room1.is_available)
                    setRoomName_1(res.data.room1.name)
                    setUseStudentInfor_1(`${res.data.room1.studentID} ${res.data.room1.first_name}${res.data.room1.last_name}`)
                    setTime_1(`${res.data.room1.start_time} ~ ${res.data.room1.end_time}`)

                    //room2
                    setRoomCondition_2(res.data.room2.is_available)
                    setRoomName_2(res.data.room2.name)
                    setUseStudentInfor_2(`${res.data.room2.studentID} ${res.data.room2.first_name}${res.data.room2.last_name}`)
                    setTime_2(`${res.data.room2.start_time} ~ ${res.data.room2.end_time}`)
                    //room3

                    setRoomCondition_3(res.data.room3.is_available)
                    setRoomName_3(res.data.room3.name)
                    setUseStudentInfor_3(`${res.data.room3.studentID} ${res.data.room3.first_name}${res.data.room3.last_name}`)
                    setTime_3(`${res.data.room3.start_time} ~ ${res.data.room3.end_time}`)
                    //room4
                    setRoomCondition_4(res.data.room4.is_available)
                    setRoomName_4(res.data.room4.name)
                    setUseStudentInfor_4(`${res.data.room4.studentID} ${res.data.room4.first_name}${res.data.room4.last_name}`)
                    setTime_4(`${res.data.room4.start_time} ~ ${res.data.room4.end_time}`)
                })
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchRoomData();
    }, []);

    return (
        <View style={[styles.container, isDarkMode && styles.containerDark]}>
            {/* 로고 */}
            <Text style={styles.logo}>JYS</Text>

            <TouchableOpacity style={RoomSituationStyles.refreshBtn} onPress={fetchRoomData}>
                <Text>새로고침</Text>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={[styles.scrollContainer, isDarkMode && styles.scrollContainerDark]}>
                {RoomCondition_1 === 1 ? 
                    <View style={[RoomSituationStyles.Info, isDarkMode && RoomSituationStyles.InfoDark]}>
                        <View style={RoomSituationStyles.Item}>
                            <Text style={[RoomSituationStyles.Label, isDarkMode && RoomSituationStyles.LabelDark]}>{RoomName_1}</Text>
                        </View>
                        <View style={RoomSituationStyles.Item}>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>사용 여부 : </Text>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>사용 중 </Text>
                            <View style={RoomSituationStyles.greenCircle} />
                        </View> 
                        <View style={RoomSituationStyles.Item}>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>학번 이름 : </Text>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>{UseStudentInfor_1}</Text>
                        </View>
                        <View style={RoomSituationStyles.Item}>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>사용 시간 : </Text>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>{Time_1}</Text>
                        </View>
                    </View>
                :
                    <View style={[RoomSituationStyles.Info, isDarkMode && RoomSituationStyles.InfoDark]}>
                        <View style={RoomSituationStyles.Item}>
                            <Text style={[RoomSituationStyles.Label, isDarkMode && RoomSituationStyles.LabelDark]}>{RoomName_1}</Text>
                        </View>
                        <View style={RoomSituationStyles.Item}>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>사용 여부 : </Text>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>사용 중이 아님</Text>
                            <View style={RoomSituationStyles.redCircle}/>
                        </View> 
                    </View>
                }

                {RoomCondition_2 === 1 ? 
                    <View style={[RoomSituationStyles.Info, isDarkMode && RoomSituationStyles.InfoDark]}>
                        <View style={RoomSituationStyles.Item}>
                            <Text style={[RoomSituationStyles.Label, isDarkMode && RoomSituationStyles.LabelDark]}>{RoomName_2}</Text>
                        </View>
                        <View style={RoomSituationStyles.Item}>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>사용 여부 : </Text>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>사용 중 </Text>
                            <View style={RoomSituationStyles.greenCircle} />
                        </View> 
                        <View style={RoomSituationStyles.Item}>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>학번 이름 : </Text>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>{UseStudentInfor_2}</Text>
                        </View>
                        <View style={RoomSituationStyles.Item}>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>사용 시간 : </Text>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>{Time_2}</Text>
                        </View>
                    </View>
                :
                    <View style={[RoomSituationStyles.Info, isDarkMode && RoomSituationStyles.InfoDark]}>
                        <View style={RoomSituationStyles.Item}>
                            <Text style={[RoomSituationStyles.Label, isDarkMode && RoomSituationStyles.LabelDark]}>{RoomName_2}</Text>
                        </View>
                        <View style={RoomSituationStyles.Item}>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>사용 여부 : </Text>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>사용 중이 아님</Text>
                            <View style={RoomSituationStyles.redCircle} />
                        </View> 
                    </View>
                }

                {RoomCondition_3 === 1 ? 
                    <View style={[RoomSituationStyles.Info, isDarkMode && RoomSituationStyles.InfoDark]}>
                        <View style={RoomSituationStyles.Item}>
                            <Text style={[RoomSituationStyles.Label, isDarkMode && RoomSituationStyles.LabelDark]}>{RoomName_3}</Text>
                        </View>
                        <View style={RoomSituationStyles.Item}>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>사용 여부 : </Text>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>사용 중 </Text>
                            <View style={RoomSituationStyles.greenCircle}/>
                        </View>
                        <View style={RoomSituationStyles.Item}>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>학번 이름 : </Text>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>{UseStudentInfor_3}</Text>
                        </View>
                        <View style={RoomSituationStyles.Item}>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>사용 시간 : </Text>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>{Time_3}</Text>
                        </View>
                    </View>
                :
                    <View style={[RoomSituationStyles.Info, isDarkMode && RoomSituationStyles.InfoDark]}>
                        <View style={RoomSituationStyles.Item}>
                            <Text style={[RoomSituationStyles.Label, isDarkMode && RoomSituationStyles.LabelDark]}>{RoomName_3}</Text>
                        </View>
                        <View style={RoomSituationStyles.Item}>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>사용 여부 : </Text>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>사용 중이 아님</Text>
                            <View style={RoomSituationStyles.redCircle} />
                        </View> 
                    </View>
                }

                {RoomCondition_4 === 1 ? 
                    <View style={[RoomSituationStyles.Info, isDarkMode && RoomSituationStyles.InfoDark]}>
                        <View style={RoomSituationStyles.Item}>
                            <Text style={[RoomSituationStyles.Label, isDarkMode && RoomSituationStyles.LabelDark]}>{RoomName_4}</Text>
                        </View>
                        <View style={RoomSituationStyles.Item}>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>사용 여부 : </Text>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>사용 중 </Text>
                            <View style={RoomSituationStyles.greenCircle} />
                        </View> 
                        <View style={RoomSituationStyles.Item}>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>학번 이름 : </Text>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>{UseStudentInfor_4}</Text>
                        </View>
                        <View style={RoomSituationStyles.Item}>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>사용 시간 : </Text>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>{Time_4}</Text>
                        </View>
                    </View>
                :
                    <View style={[RoomSituationStyles.Info, isDarkMode && RoomSituationStyles.InfoDark]}>
                        <View style={RoomSituationStyles.Item}>
                            <Text style={[RoomSituationStyles.Label, isDarkMode && RoomSituationStyles.LabelDark]}>{RoomName_4}</Text>
                        </View>
                        <View style={RoomSituationStyles.Item}>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>사용 여부 : </Text>
                            <Text style={[RoomSituationStyles.Value, isDarkMode && RoomSituationStyles.ValueDark]}>사용 중이 아님</Text>
                            <View style={RoomSituationStyles.redCircle} />
                        </View> 
                    </View>
                }
            </ScrollView>
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
});
   
const RoomSituationStyles = StyleSheet.create({
    Info: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        marginLeft: 10,
        marginRight: 10,
        width: '95%',
        maxWidth: 400,
    },
    InfoDark: {
        backgroundColor: '#121212', // 다크모드에서의 배경색상
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        marginLeft: 10,
        marginRight: 10,
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
        fontSize: 18,
        fontWeight: 'bold',
        width: 100,
        marginRight: 1,
        color: '#000', // 다크모드에서의 글자색상
    },
    LabelDark: {
        fontSize: 18,
        fontWeight: 'bold',
        width: 100,
        marginRight: 1,
        color: '#fff', // 다크모드에서의 글자색상
    },
    Value: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000', // 다크모드에서의 글자색상
    },
    ValueDark: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff', // 다크모드에서의 글자색상
    },
    refreshBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    redCircle: {
        width: 13,
        height: 13,
        borderRadius: 25,
        backgroundColor: 'red',
        position: 'absolute',
        top: -45,
        right: -5
    },
    greenCircle: {
        width: 13,
        height: 13,
        borderRadius: 25,
        backgroundColor: 'green',
        position: 'absolute',
        top: -45,
        right: -5
    },
});