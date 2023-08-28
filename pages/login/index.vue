<template>
  <view class="login_box">
	<image src="@/static/images/login_bg.png" class="bgIMG" mode=""></image>
    <view class="ipt_box">
		<view class="logo_title">
			HELLO，欢迎登录雪亮小安
		</view>
		<view class="login_input_box">
			<u-input v-model="loginInfo.account" height="88" placeholder="请输入手机号码" type="text" :border="none" />
		</view>
		<view class="login_input_box">
			<u-input v-model="loginInfo.password" height="88" placeholder="请输入密码" type="password" :border="none" :password-icon="passwordIcon" />
		</view>
		<view class="login_btn_box">
			<u-button type="primary" hover-class="none" shape="circle" @click="loginFunc">登录</u-button>
		</view>
		<view class="forgetPwBox margin-top12 text-r">
			<text @click="forgetPswBtn">忘记密码?</text>
		</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { Toast } from '@/utils/toast';
import { validateMobile } from '@/utils/index'
import { reactive, onMounted } from 'vue'
import  HttpApi from '@/servers/api.js'
// import { Base64 } from "js-base64";
import { userInfoStore } from "@/store"

	interface loginInfo {
		account?: string,
		password?: string,
		checkCode?: string,
		openId?:string
	}

	const loginInfo:loginInfo = reactive({
	  account: '',
	  password: '',
	  checkCode: '',
	  openId: '',
	  loginType: 'H5'
	})
	
	const state = reactive({
		code: '',
		openId: ''
	})

	const forgetPswBtn = () => {
		uni.navigateTo({
			url: '/pages/login/forgetPsw'
		})
	}
	onMounted(() => {
		
		// 10404  未绑定账号 返回openid 到时候输入账号密码的还是将这个openId传过去
		// 10405  
		// return
		let appId = 'wxf45d669e00111bf7'
		let local =  window.location.href
		let isOpenId = local.indexOf('openId=') !== -1
		// let isOpenId = 'o4dC_6vYy7Shpiws2cGscbh6JvSE'
		if (isOpenId) { // 如果地址链接有openId 调用登录接口验证是否绑定了的用户，是就跳转到首页，不是就登录登录
			state.openId = getUrlCode().openId
			// state.openId = 'o4dC_6vYy7Shpiws2cGscbh6JvSE'
			checkLogin({openId: state.openId, 'loginType': 'H5'}) // 从连接点进去，获取的openid值传openId
		} else {
			WxAuthorize(appId)
		}
	})
	// 截取code
	const getUrlCode = () => {
		var url = location.search;
		let theRequest:Object = new Object()
		if (url.indexOf("?") != -1) {
			var str = url.substr(1)
			var strs = str.split("&")
	 	for (var i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1])
			}
		}
		return theRequest
	}
	//微信授权
	const WxAuthorize = (appId:string) =>{
		let local =  window.location.href
		state.code = getUrlCode().code;
		if (state.code == null || state.code === '') {
			window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${encodeURIComponent(local)}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`
		}else{
			checkLogin({'checkCode': state.code, 'loginType': 'H5'}) // 从底部按钮点击，调用微信授权，然后授权连接里面返回的数据用checkCode传过去，后端好区分
		}
	}
	
	
	const checkLogin = (data:Object) => {
		let params = {...data}
		let userStore = userInfoStore()
		userStore.Login(params).then(res => {
			// console.log('dddd', res)
			uni.switchTab({
				url: '/pages/home/index'
			})
		}).catch(err => {
			console.log('err', err)
			loginInfo.openId = err.message
		})
		// HttpApi.login(params).then(res => {
		// 	if (res.statusCode === 200) {
				
		// 		// 如果有。直接跳到首页
		// 		uni.switchTab({
		// 			url: '/pages/home/index'
		// 		})
		// 	}
		// }).catch(() => {
			
		// })
	}


const loginFunc = () => {
	
	if (!loginInfo.account || !loginInfo.password) {
		Toast('请输入手机号和密码!')
		return
	}
	validateMobile(loginInfo.account, (data) => {
		console.log('data', data)
		if (data) {
			Toast('手机号码格式错误！')
			return
		}
		let params = JSON.parse(JSON.stringify(loginInfo))
		// params.password = Base64.encode(params.password);
		let userStore = userInfoStore()
		userStore.Login(params).then(res => {
			uni.switchTab({
				url: "/pages/home/index"
			})
		}).catch(err => {
			console.log('err', err)
		})
	})
	
	
}
</script>

<style lang="scss">
.login_box .login_input_box {
		.u-input {
			height: 88rpx;
			background-color: #F6F6F6;
			border-radius: 48rpx;
			padding: 0 32rpx!important;
		}
	}
</style>
<style scoped lang="scss">
.login_box {
  width: 100%;
  height: 100vh;
  position: relative;
  .bgIMG {
	  position: absolute;
	  width: 100%;
	  height: 916rpx;
	  z-index: 10;
	  left: 0;
	  top: 0;
  }
  .ipt_box {
	width: 100%;
    // height: 100rpx;
	padding: 48% 70rpx 0 70rpx;
	position: relative;
	z-index: 999;
	.logo_title {
		font-size: 32rpx;
		// @include flex_center;
		margin-bottom: 96rpx;
	}
	.login_input_box {
		margin-bottom: 40rpx;
	}
	.login_btn_box {
		margin-top: 80rpx;
		:deep {
			.u-btn {
				background-color: #35CCB8;
				height: 88rpx;
			}
		}
	}
	.forgetPwBox {
		
	}
  }
}
</style>
