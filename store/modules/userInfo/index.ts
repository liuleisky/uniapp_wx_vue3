import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { IuserInfo } from './user'
import httpApi from '@/servers/api.js'

// 使用setup模式定义
const userModule = defineStore('user', () => {
  const data = reactive({
    token: uni.getStorageSync('token') || '',
    userInfo: uni.getStorageSync('userInfo') || {}
  })

  const getUserInfo = () => {
    return data.userInfo
  }

  const setUserInfo = (obj: IuserInfo) => {
    data.userInfo = obj
  }
  
  const Login = (userInfo:object) => {
	  return new Promise((resolve, reject) => {
		  httpApi.login(userInfo).then(res => {
			  if (res.statusCode === 200) {
				  const result = res.data
				  uni.setStorageSync('token', result.token);
				  data.token =result.token
				  uni.setStorageSync('userInfo', result);
				  data.userInfo = result
				  resolve(res.data)
			  }
		  }).catch(error => {
			  reject(error)
		  })
	  })
  }

  return {
    ...toRefs(data),
    getUserInfo,
    setUserInfo,
	Login
  }
})

export default userModule
