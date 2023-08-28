<template>
  <view class="forgetPsw_page">
	<view class="flex_a_c margin-top30">
		<image :src="tipIcon" class="widthHeight16" mode=""></image>
		<text class="margin-left4 font-16">提示</text>
	</view>
	<view class="margin-top20 margin-bottom23">
		密码忘记无法自己修改，请联系管理员后台生成新的密码，新生成密码登录时需修改密码！
	</view>
	<view class="margin-bottom20">
		管理人员：王一惠
	</view>
	<view class="margin-bottom20">
		<text @click="callPhone">联系电话：18263704955 <image src="../../static/images/phone_icon.png" class="widthHeight14 margin-left4" mode=""></image></text>
	</view>
	<view @click="goLogin">
		已有密码？<text class="color35CCB8">立即登录</text>
	</view>
  </view>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
	setup() {
		const state = reactive({
		  tipIcon: '../../static/images/tishi.png',
		  password: ''
		})
		
		const goLogin = () => {
			uni.navigateBack({
				delta: 1
			})
		}
		
		const callPhone = () => {
			uni.makePhoneCall({
				phoneNumber: '18263704955'
			});
		}
		
		return {
			...toRefs(state),
			goLogin,
			callPhone
		}
	}
})

</script>

<style scoped lang="scss">
.forgetPsw_page {
  width: 100%;
  height: 100vh;
  padding: 0 40rpx;
  .tipIcon {
	  
  }
}
</style>
