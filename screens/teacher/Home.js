import React, { useState, useEffect } from 'react';
import { Alert, Text, View, TouchableOpacity, useColorScheme, StyleSheet,ScrollView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from "@react-navigation/native";

import axiosInstance from '../../api/API_Server';

export default function HomeScreen ({ navigation }) {
  const isDarkMode = useColorScheme() === 'dark'

  const [mealStateType, setMealStateType] = useState(null)
  const [mealNowScreen, setMealNowScreen] = useState(null)
  const [mealTitle, setMealTitle] = useState('급식')
  const [mealMessage, setMealMessage] = useState(null)
  const [mealBreakfast, setMealBreakfast] = useState(null)
  const [mealLunch, setMealLunch] = useState(null)
  const [mealDinner, setMealDinner] = useState(null)
  

  const [saveRentalStateType, setSaveRentalStateType] = useState(null)
  const [saveRentalInfo, setSaveRentalInfo] = useState(null)

  const mealRefresh = async() => {
    setMealStateType(null) // 'Type'을 'null'로 설정하여 '로딩중...'을 표시
    setMealTitle('급식') // 'Title'을 '급식'으로 초기화
    axiosInstance.post('/meal') // '/meal'에 API요청 
      .then((res) => {
        if (res.status === 200) { // 'status'가 200이면
          if (res.data.type === 1) { // 'Type'이 '1'이면 급식 데이터를 순차적으로 저장
            if (mealNowScreen === 0) setMealTitle('조식')
            if (mealNowScreen === 1) setMealTitle('중식')
            if (mealNowScreen === 2) setMealTitle('석식')
            setMealStateType(res.data.type) // 'Type'을 'data.type'에서 받아온 값으로 설정
            setMealBreakfast(res.data.breakfast || null) // 'data.breakfast'에 값이 없을 경우 'null'로 설정
            setMealLunch(res.data.lunch || null) // 'data.lunch'에 값이 없을 경우 'null'로 설정
            setMealDinner(res.data.dinner || null) // 'data.dinner'에 값이 없을 경우 'null'로 설정
          } else if (res.data.type === 2 || res.data.type === 3) { // 'Type'이 '2' 또는 '3'이면
            setMealStateType(res.data.type) // 'Type'을 'data.type'에서 받아온 값으로 설정
            setMealTitle('급식')
            setMealMessage(res.data.message) // 'Message'를 'error.message'로 설정
          }
        } else {
          setMealStateType(0) // 'Type'을 '0'으로 설정
          setMealTitle('급식')
          setMealMessage('예외가 발생했습니다.')
        }
      }).catch((error) => {
        setMealStateType(0) // 'Type'을 '0'으로 설정
        setMealTitle('급식')
        setMealMessage(error.message) // 'Message'를 'error.message'로 설정
      })
  }

  const beforeMeal = async() => { // 이전 버튼을 눌렀을 때
    if (mealNowScreen === 2 && mealLunch !== null) { // 만약 'NowScreen'이 '2'이고 'Lunch'가 'null'이 아니라면
      setMealNowScreen(1) // 'NowScreen'을 '1'로 설정
      setMealTitle('중식') // 'Title'을 '중식'으로 설정
    } else if (mealNowScreen === 1 && mealBreakfast !== null) { // 만약 'NowScreen'이 '1'이고 'Breakfast'가 'null'이 아니라면
      setMealNowScreen(0) // 'NowScreen'을 '0'로 설정
      setMealTitle('조식') // 'Title'을 '조식'으로 설정
    }
  }

  const nextMeal = async() => { // 다음 버튼을 눌렀을 때
    if (mealNowScreen === 0 && mealLunch !== null) { // 만약 'NowScreen'이 '0'이고 'Lunch'가 'null'이 아니라면
      setMealNowScreen(1) // 'NowScreen'을 '1'로 설정
      setMealTitle('중식') // 'Title'을 '중식'으로 설정
    } else if (mealNowScreen === 1 && mealDinner !== null) { // 만약 'NowScreen'이 '1'이고 'Dinner'가 'null'이 아니라면
      setMealNowScreen(2) // 'NowScreen'을 '2'로 설정
      setMealTitle('석식') // 'Title'을 '석식'으로 설정
    }
  }

  const mealNowScreenTime = async() => { // 현재 시간 기준으로 급식 스크린 변경
    const nowData = new Date() // 현재 시간값을 가져옴
    let nowHour = nowData.getHours() // 시간값만 받아옴

    if (nowHour < 9) { // 현재 시간이 '9'시 이전일 경우
      setMealNowScreen(0) // 조식을 표시
      setMealTitle('조식')
    }
    else if (nowHour < 13) { // 현재 시간이 '13'시 이전일 경우
      setMealNowScreen(1) // 중식을 표시
      setMealTitle('중식')
    }
    else if (nowHour < 19) { // 현재 시간이 '19'시 이전일 경우
      setMealNowScreen(2) // 석식을 표시
      setMealTitle('석식')
    } else { // 이도저도 아닐경우
      setMealNowScreen(1) // 중식을 표시
      setMealTitle('급식')
    }
  }
  
  const rentalInfo = async() => {
    axiosInstance.post('/RoomRentalInformation') // '/meal'에 API요청
      .then((res) => {
        if (res.status === 200) {
          setSaveRentalInfo(res.data.res)
          setSaveRentalStateType(1)
        }
      }).catch((error) => {
        console.log(error)
      })
      
  }
  useEffect(() => {
    rentalInfo() // 스크린이 처음 시작될 때 한번 실행
    mealRefresh() // 스크린이 처음 시작될 때 한번 실행
    mealNowScreenTime() // 스크린이 처음 시작될 때 한번 실행
  }, [])

  useEffect(()=> {
    {saveRentalInfo != null ?
      console.log(saveRentalInfo): null}
  },[saveRentalInfo])

  
  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      {/* 로고 */}
      <Text style={styles.logo}>JYS</Text>

      {saveRentalStateType === null ?
        <View>
          <Text>로딩중...</Text>
        </View>
        :null
      }

      {saveRentalStateType === 1 ?
        <View>
        {saveRentalInfo.map((Info) =>

          <View key={Info.id} style={[mealStyles.Info, isDarkMode && RoomRentalStyles.InfoDark]}>
            <View style={RoomRentalStyles.Item}>
                            <Text style={[RoomRentalStyles.Label, isDarkMode && RoomRentalStyles.LabelDark]}>대여 요청</Text>
                        </View>
            <View style={RoomRentalStyles.Item}>
                <Text style={[RoomRentalStyles.Value, isDarkMode && RoomRentalStyles.ValueDark]}>방 번호 : </Text>
                <Text style={[RoomRentalStyles.Value, isDarkMode && RoomRentalStyles.ValueDark]}>{`${Info.room_number}번 방`}</Text>
            </View>
            <View style={RoomRentalStyles.Item}>
                            <Text style={[RoomRentalStyles.Value, isDarkMode && RoomRentalStyles.ValueDark]}>학번 이름 : </Text>
                            <Text style={[RoomRentalStyles.Value, isDarkMode && RoomRentalStyles.ValueDark]}>{`${Info.studentID} ${Info.first_name}${Info.last_name}`}</Text>
                        </View>
            <View style={RoomRentalStyles.Item}>
                <Text style={[RoomRentalStyles.Value, isDarkMode && RoomRentalStyles.ValueDark]}>사용 시간 : </Text>
                <Text style={[RoomRentalStyles.Value, isDarkMode && RoomRentalStyles.ValueDark]}>{`${Info.start_time} ~ ${Info.end_time}`}</Text>
            </View>
            <View style={RoomRentalStyles.Item}>
                <Text style={[RoomRentalStyles.Value, isDarkMode && RoomRentalStyles.Value]}>대여 목적 : </Text>
                <Text style={[RoomRentalStyles.Value, isDarkMode && RoomRentalStyles.Value]} >{`${Info.purpose}`}</Text>
            </View>
            {/* 수락 버튼 */}
              <TouchableOpacity style={RoomRentalStyles.acceptBtn} onPress={() => {console.log(Info.id)}}>
                <Text style={RoomRentalStyles.acceptBtnText}>수락</Text>
              </TouchableOpacity>
              <TouchableOpacity style={RoomRentalStyles.declineBtn} onPress={() => {console.log(Info.id)}}>
                <Text style={RoomRentalStyles.declineBtnText}>거절</Text>
              </TouchableOpacity>
          </View>
        )}
      </View>
        :null
      }
      
      <ScrollView contentContainerStyle={[styles.scrollContairner, isDarkMode && styles.scrollContainerDark]}>
        {/* 급식 */}
        <View style={[mealStyles.Info, isDarkMode && mealStyles.InfoDark]}>
          {mealStateType === null ? 
            <View>
              <Text style={[mealStyles.Title, isDarkMode && mealStyles.TitleDark]}>급식</Text>
              <Text style={[mealStyles.Text, isDarkMode && mealStyles.TextDark]}>로딩 중...</Text>
            </View>
            :null
          }
          {mealStateType === 2 || mealStateType === 3 ?
            <View>
              <Text style={[mealStyles.Title, isDarkMode && mealStyles.TitleDark]}>{mealTitle}</Text>
              <Text style={[mealStyles.Text, isDarkMode && mealStyles.TextDark]}>{mealMessage}</Text>
            </View>
            :null
          }
          {mealStateType === 1 && mealNowScreen === 0 ?
            <View>
              <Text style={[mealStyles.Title, isDarkMode && mealStyles.TitleDark]}>{mealTitle}</Text>
              <Text style={[mealStyles.Text, isDarkMode && mealStyles.TextDark]}>{mealBreakfast}</Text>

              <TouchableOpacity style={mealStyles.leftBtn} onPress={beforeMeal}>
                <Text style={{ textAlign: 'center' }}>{'<'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={mealStyles.rightBtn} onPress={nextMeal}>
                <Text style={{ textAlign: 'center' }}>{'>'}</Text>
              </TouchableOpacity>
            </View>
            :null
          }
          {mealStateType === 1 && mealNowScreen === 1 ?
            <View>
              <Text style={[mealStyles.Title, isDarkMode && mealStyles.TitleDark]}>{mealTitle}</Text>
              <Text style={[mealStyles.Text, isDarkMode && mealStyles.TextDark]}>{mealLunch}</Text>

              <TouchableOpacity style={mealStyles.leftBtn} onPress={beforeMeal}>
                <Text style={{ textAlign: 'center' }}>{'<'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={mealStyles.rightBtn} onPress={nextMeal}>
                <Text style={{ textAlign: 'center' }}>{'>'}</Text>
              </TouchableOpacity>
            </View>
            :null
          }
          {mealStateType === 1 && mealNowScreen === 2 ?
            <View>
              <Text style={[mealStyles.Title, isDarkMode && mealStyles.TitleDark]}>{mealTitle}</Text>
              <Text style={[mealStyles.Text, isDarkMode && mealStyles.TextDark]}>{mealDinner}</Text>

              <TouchableOpacity style={mealStyles.leftBtn} onPress={beforeMeal}>
                <Text style={{ textAlign: 'center' }}>{'<'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={mealStyles.rightBtn} onPress={nextMeal}>
                <Text style={{ textAlign: 'center' }}>{'>'}</Text>
              </TouchableOpacity>
            </View>
            :null
          }

          <TouchableOpacity style={mealStyles.refreshBtn} onPress={mealRefresh}>
            <Text>새로고침</Text>
          </TouchableOpacity>
        </View>
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
  
})

const mealStyles = StyleSheet.create({
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
  Title: {
    // marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#000000',
  },
  TitleDark: {
    // marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#FFFFFF', // 다크모드에서의 글자색상
  },
  Text: {
    borderRadius: 20,
    padding: 30,
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 15,
    paddingBottom: 5,
    textAlign: 'center',
    color: "#000", // 다크모드에서의 글자색상
  },
  TextDark: {
    borderRadius: 20,
    padding: 30,
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 15,
    paddingBottom: 5,
    textAlign: 'center',
    color: "#fff", // 다크모드에서의 글자색상
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
  leftBtn: {
    position: 'absolute',
    top: 60,
    left: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rightBtn: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
})
const RoomRentalStyles = StyleSheet.create({
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
  // acceptBtn: {
  //   backgroundColor: 'green',
  //   padding: 10,
  //   borderRadius: 5,
  //   alignSelf: 'flex-start',
  //   marginRight: 10,
  // },
  // declineBtn: {
  //   backgroundColor: 'red',
  //   padding: 10,
  //   alignSelf: 'flex-end',
  //   borderRadius: 5,
  // },
  acceptBtn: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'green',
    borderRadius: 5,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    left: 280,
  },
  declineBtn: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  declineBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});