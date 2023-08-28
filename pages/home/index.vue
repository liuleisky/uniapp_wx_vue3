<template>
  <view class="home" :style="homeBg">
		<view class="userinfo_box flex_a_c">
			<view class="userimg">
				<u-avatar :src="data.src" size="112"></u-avatar>
			</view>
			<view class="userinfo_name margin-left10" @click="jumpUserInfo">
				<view class="font-18 font-weight700">
					{{userInfo.name}}
				</view>
				<view class="flex_a_c margin-top8">
					{{userInfo.phone}} <image src="../../static/images/home_edit.png" class="widthHeight16 margin-left4" mode=""></image>
				</view>
			</view>
		</view>
		<view class="title flex_a_c margin-top34">
			<view class="line_title margin-right6"></view>
			<text class="font-16">角色进入</text>
		</view>
		<view class="margin-top20">
			<image src="@/static/images/yunwei_banner.png" @click="jueSheJump(1)" class="yunwei" mode=""></image>
		</view>
		<view class="flex_spa margin-top15">
			<image src="@/static/images/sequ_banner.png" @click="jueSheJump(2)" class="sequjianhu" mode=""></image>
			<image src="@/static/images/falam_banner.png"  @click="jueSheJump(3)" class="sequjianhu" mode=""></image>
		</view>
  </view>
</template>

<script setup lang="ts">
import { computed, CSSProperties, reactive, onMounted } from 'vue'
import { Toast } from '@/utils/toast';
import { userInfoStore } from "@/store"
import serverConfig from '@/servers/serverConfig.ts'
import { onShow } from '@dcloudio/uni-app';

const data = reactive({
  bgIndex: 0,
  imageBg: '../../static/images/home_bg.png',
  userImg: '../../static/images/default_touxiang.png',
  src: '',
  info: {}
})

const userInfo = reactive({
	name: '',
	phone: ''
})

onShow(() => {
	let userStore = uni.getStorageSync('userInfo')
	console.log('userStore', userStore)
	let info = userStore.extData
	data.info = userStore
	userInfo.name = info.userName
	userInfo.phone = info.phone
	data.src = info.portrait ? serverConfig.file_url + info.portrait : data.userImg
	console.log('userImg', data.userImg)
})


const homeBg = computed<CSSProperties>(() => ({
  backgroundImage: `url(${data.imageBg})`
}))

const jumpUserInfo = () => {
  uni.navigateTo({
    url: '/pages/userInfo/index'
  })
}
 const jueSheJump = (num: number) => { // 1.运维安装  2.社区帮扶  3.家人监护
	// if (num !== 2) {
	// 	Toast('该功能暂未开放')
	// 	return
	// }
	// 1超级管理员  2 系统管理员  3 帮扶人员  4 监护人员  5 普通人员（老人） 6 安装人员
	
	 // let url = num === 1 ? '/pages/operation/index' : num === 2 ? '/pages/community/index' : '/pages/guardian/index'
		// uni.navigateTo({
		// 	url
		// })
		// return
	
	let type = data.info.userType
	if ((type === '1' || type === '6') && num === 1){ // 运维人员
		uni.navigateTo({
			url: '/pages/operation/index'
		})
		return 
	} 
	if ((type === '1' || type === '3') && num === 2){ // 社区帮扶
		uni.navigateTo({
			url: '/pages/community/index'
		})
		return 
	} 
	if ((type === '1' || type === '4') && num === 3){ // 监护人员
		uni.navigateTo({
			url: '/pages/guardian/index'
		})
		return 
	} 

	Toast('暂无当前权限')
	
 }



</script>

<style scoped lang="scss">
.home {
  // @include flex_center();
  min-height: 100vh;
  background-repeat: no-repeat;
  background-size: 100%;
  padding: 0 40rpx;
  .userinfo_box {
	  padding-top: 62rpx;
	  .userimg {
		  width: 116rpx;
		  height: 116rpx;
		  border-radius: 50%;
		  border: 4rpx solid #fff;
	  }
  }
  
  .title {
	  .line_title {
		  width: 8rpx;
		  height: 44rpx;
		  border-radius: 24rpx;
		  background-color: #59CED7;
	  }
  }
  
  .yunwei {
	  width: 100%;
	  height: 310rpx
  }
  .sequjianhu {
	  width: 320rpx;
	  height: 410rpx;
  }
  
  
}
</style>
