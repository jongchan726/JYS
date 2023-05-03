import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://www.zena.co.kr/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

const setAccessToken = async (config) => {
    const accessToken = await AsyncStorage.getItem('access_token')
    if (accessToken) {
        config.headers['Authorization'] = `hi ${accessToken}`
    }
    return config
}

const refreshAccessToken = async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        const refreshToken = await AsyncStorage.getItem('refresh_token')
        if (refreshToken) {
            try {
                const refreshResponse = await axios.post(`${API_BASE_URL}/refresh_token`, {refreshToken})
                const { accessToken, refreshToken } = refreshResponse.data
                await AsyncStorage.setItem('access_token', accessToken)
                await AsyncStorage.setItem('refresh_token', refreshToken)
                originalRequest.headers['Authorization'] = `hi ${accessToken}`
                return axios(originalRequest)
            } catch (error) {
                console.error('Failed to refresh access token', error)
            }
        }
    }
    return Promise.reject(error)
}

axiosInstance.interceptors.request.use(setAccessToken)
axiosInstance.interceptors.response.use(response => response, refreshAccessToken)

export default axiosInstance