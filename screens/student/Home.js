import React, { useState, useEffect } from 'react';
import { Alert, Text, View, TouchableOpacity, useColorScheme, StyleSheet, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axiosInstance from '../../api/API_Server';

export default function HomeScreen ({ navigation }) {
  const isDarkMode = useColorScheme() === 'dark'

  const [roomStateType, setRoomStateType] = useState(null)
  const [roomStateMessage, setRoomStateMessage] = useState(null)

  const [roomNumber, setRoomNumber] = useState(null)
  const [roomAcceptor, setRoomAcceptor] = useState(null)
  const [roomStartTime, setRoomStartTime] = useState(null)
  const [roomEndTime, setRoomEndTime] = useState(null)

  const [mealStateType, setMealStateType] = useState(null)
  const [mealNowScreen, setMealNowScreen] = useState(null)
  const [mealTitle, setMealTitle] = useState('급식')
  const [mealMessage, setMealMessage] = useState(null)
  const [mealBreakfast, setMealBreakfast] = useState(null)
  const [mealLunch, setMealLunch] = useState(null)
  const [mealDinner, setMealDinner] = useState(null)

  const rentalRefresh = async() => {
    setRoomStateType(null) // 'Type'을 'null'로 설정하여 '로딩중...'을 표시
    AsyncStorage.getItem('id') // 'ID' 가져오기
      .then(async (ID) => {
        axiosInstance.post('/RoomRentalUsers', { id: ID }) // '/RoomRentalUsers'에 'ID'값을 넣어 API요청
          .then((res) => {
            console.log(res.data)
            if (res.status === 200) { // 'status'가 '200'이면
              if (res.data.type === 3) { // 'Type'이 '3'이면 데이터를 순차적으로 저장
                setRoomStateType(res.data.type) // 'Type'을 '3'으로 설정
                setRoomNumber(res.data.room_number)
                setRoomStartTime(res.data.start_time)
                setRoomEndTime(res.data.end_time)
                setRoomAcceptor(res.data.acceptor)
              } else if (res.data.type === 4 || res.data.type === 2 || res.data.type === 1) { // 'Type'이 '1' 또는 '2'이면
                setRoomStateType(res.data.type) // 'Type'을 'data.type'에서 받아온 값으로 설정
                setRoomStateMessage(res.data.message) // 'Message'를 'data.message'에서 받아온 값으로 설정
              }
            } else { // 예외가 발생하면
              setRoomStateType(0) // 'Type'을 '0'으로 설정
              setRoomStateMessage('예외가 발생했습니다.')
            }
          }).catch((error) => {
            console.log('RoomRentalUsers API | ', error)
            setRoomStateType(0) // 'Type'을 '0'으로 설정
            setRoomStateMessage(error.message) // 'Message'를 'error.message'로 설정
          })
      }).catch((error) => {
        setRoomStateType(0) // 'Type'을 '0'으로 설정
        setRoomStateMessage(error.message) // 'Message'를 'error.message'로 설정
        return Alert.alert('에러', error.message) // 에러 메세지 표출
      })
  }

  const rentalCancel = async () => {
    AsyncStorage.getItem('id') // 'ID' 가져오기
      .then(async (ID) => {
          axiosInstance.post('/RoomRentalCancel', { id: ID }) // '/RoomRentalCancel'에 'ID'값을 넣어 API요청
            .then((res) => {
              if (res.status === 200) { // 'status'가 '200'이면
                Alert.alert('Rental', res.data.message) // 'data.message' 메세지 표시
                rentalRefresh() // 정보를 새로고침
              } else {
                setRoomStateType(0) // 'Type'을 '0'으로 설정
                setRoomStateMessage('예외가 발생했습니다.')
              }
            }).catch((error) => { // 에러가 발생하면
              console.log(error)
              return Alert.alert('에러',  error.message) // 'error.message' 메세지 표시
            })
      }).catch((error) => { // 에러가 발생하면
          console.log('RoomRentalCancel API |', error)
          return Alert.alert('에러', error.message) // 'error.message' 메세지 표시
      })
  }

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

  useEffect(() => {
    rentalRefresh() // 스크린이 처음 시작될 때 한번 실행
    mealRefresh() // 스크린이 처음 시작될 때 한번 실행
    mealNowScreenTime() // 스크린이 처음 시작될 때 한번 실행
  }, [])

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      {/* 로고 */}
      <Text style={styles.logo}>JYS</Text>

      <ScrollView contentContainerStyle={[styles.scrollContainer, isDarkMode && styles.scrollContainerDark]}>
        {/* 방음부스 */}
        <View style={[rentalStyles.Info, isDarkMode && rentalStyles.InfoDark]}>
          <Text style={[rentalStyles.Title, isDarkMode && rentalStyles.TitleDark]}>방음부스</Text>
          {roomStateType === null ?
            <View>
              <Text style={[rentalStyles.Text, isDarkMode && rentalStyles.TextDark]}>로딩 중...</Text>
            </View>
            : null
          }
          {roomStateType === 0 ?
            <View>
              <Text style={[rentalStyles.Text, isDarkMode && rentalStyles.TextDark]}>오류가 발생했습니다.</Text>
            </View>
            : null
          }
          {roomStateType === 1 ?
            <View>
              <Text style={[rentalStyles.Text, isDarkMode && rentalStyles.TextDark]}>{roomStateMessage}</Text>
              <TouchableOpacity style={rentalStyles.rentalBtn} onPress={() => navigation.navigate('S_RoomRental')}>
                <Text style={rentalStyles.rentalBtnText}>대여하기</Text>
              </TouchableOpacity>
            </View>
            : null
          }
          {roomStateType === 2 ?
            <View>
              <Text style={[rentalStyles.Text, isDarkMode && rentalStyles.TextDark]}>{roomStateMessage}</Text>
              <TouchableOpacity style={rentalStyles.rentalBtn} onPress={rentalCancel}>
                <Text style={rentalStyles.rentalBtnText}>취소하기</Text>
              </TouchableOpacity>
            </View>
            : null
          }
          {roomStateType === 4 ?
            <View>
              <Text style={[rentalStyles.Text, isDarkMode && rentalStyles.TextDark]}>{roomStateMessage}</Text>
            </View>
            : null
          }
          {roomStateType === 3 ?
            <View>
              <View style={{marginTop: 10, marginBottom: 50, marginLeft: 20}}>
                <View style={rentalStyles.Item}>
                  <Text style={[rentalStyles.Label, isDarkMode && rentalStyles.LabelDark]}>방번호</Text>
                  <Text style={[rentalStyles.Value, isDarkMode && rentalStyles.ValueDark]}>{roomNumber}</Text>
                </View>

                <View style={rentalStyles.Item}>
                  <Text style={[rentalStyles.Label, isDarkMode && rentalStyles.LabelDark]}>시작 시간</Text>
                  <Text style={[rentalStyles.Value, isDarkMode && rentalStyles.ValueDark]}>{roomStartTime}</Text>
                </View>

                <View style={rentalStyles.Item}>
                  <Text style={[rentalStyles.Label, isDarkMode && rentalStyles.LabelDark]}>종료 시간</Text>
                  <Text style={[rentalStyles.Value, isDarkMode && rentalStyles.ValueDark]}>{roomEndTime}</Text>
                </View>

                <View style={rentalStyles.Item}>
                  <Text style={[rentalStyles.Label, isDarkMode && rentalStyles.LabelDark]}>승인자</Text>
                  <Text style={[rentalStyles.Value, isDarkMode && rentalStyles.ValueDark]}>{roomAcceptor}</Text>
                </View>
              </View>
              
              <TouchableOpacity style={rentalStyles.rentalBtn} onPress={() => navigation.navigate('S_RoomCancel')}>
                <Text style={rentalStyles.rentalBtnText}>사용 종료하기</Text>
              </TouchableOpacity>
            </View>
            : null
          }
          <TouchableOpacity style={rentalStyles.refreshBtn} onPress={rentalRefresh}>
            <Text>새로고침</Text>
          </TouchableOpacity>
        </View>

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

        {/* 장비대여 */}
        <View style={[equipmentStyles.Info, isDarkMode && equipmentStyles.InfoDark]}>
          <Text style={[equipmentStyles.Title, isDarkMode && equipmentStyles.TitleDark]}>장비대여</Text>
        </View>

        {/* 시간표 */}
        <View style={[timetableStyles.Info, isDarkMode && timetableStyles.InfoDark]}>
          <Text style={[timetableStyles.Title, isDarkMode && timetableStyles.TitleDark]}>시간표</Text>
        </View>
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
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#000000', // 다크모드에서의 글자색상
  },
  TitleDark: {
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#FFFFFF', // 다크모드에서의 글자색상
  },
  Text: {
    padding: 30,
    paddingBottom: 65,
    textAlign: 'center',
    color: "#000", // 다크모드에서의 글자색상
  },
  TextDark: {
    padding: 30,
    paddingBottom: 65,
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
  rentalBtn: {
    backgroundColor: '#1E00D3',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    marginTop: 50,
    marginBottom: 5,
  },
  rentalBtnText: {
    color: '#fff',
    fontWeight: 'bold',
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
  }
})

const equipmentStyles = StyleSheet.create({
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
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#000000',
  },
  TitleDark: {
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#FFFFFF', // 다크모드에서의 글자색상
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

const timetableStyles = StyleSheet.create({
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
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#000000',
  },
  TitleDark: {
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#FFFFFF', // 다크모드에서의 글자색상
  },
})