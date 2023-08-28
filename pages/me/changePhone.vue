<template>
	<view class="changeName">
			<u-form :model="form" ref="uformRef" label-position="top">
				<u-form-item label="请修改联系电话（最多不能超过11个数字）" prop="phone">
					<u-input v-model="form.phone" placeholder="请输入联系电话" clearable />
				</u-form-item>
			</u-form>
			<view class="seve_btn">
				<u-button type="primary" style="background-color: #35CCB8;" hover-class="none" shape="circle" @click="saveInfo">保存</u-button>
			</view>
	</view>
</template>

<script lang="ts">
import { userInfoStore } from "@/store"
import { defineComponent, onMounted, reactive, toRefs, ref } from "vue"
import { onReady } from '@dcloudio/uni-app'
import { validateMobile } from '@/utils/index'
import  HttpApi from '@/servers/api.js'
	export default defineComponent({
		setup() {
			const userInfoObj = uni.getStorageSync('userInfo')
			
			const state = reactive({
				form: {
					phone: '',
				},
				rules: {
					phone: [
						{ 
							required: true, 
							message: '请输入联系电话', 
							trigger: ['change','blur'],
						},
						{
							validator: (rule, value, callback) => {
								 const RegExp = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
								 if(!RegExp.test(value)){
									 return false
								 } else {
									 return true
								 }
								 callback()
							},
							message: '联系号码格式不正确',
							trigger: ['change','blur'],
						}
					],
				}
			})
			
			const uformRef = ref<any>(null)
			onReady(() => {
				uformRef.value.setRules(state.rules);
			})
			
			onMounted(() => {
				state.form.phone = userInfoObj.extData.phone
			})
		
			const saveInfo = () => {
				uformRef.value.validate(valid => {
					if (valid) {
						HttpApi.myCenterEditBase(state.form).then(res => {
							if (res.statusCode === 200) {
								let userInfo = userInfoObj
								let extData = userInfo.extData
								extData['phone'] = state.form.phone
								uni.setStorageSync('userInfo', userInfo)
								uni.navigateBack({
									delta: 1
								})
							}
						})
					} else {
						console.log('失败');
					}
				})
			}
			
			
			return {
				...toRefs(state),
				saveInfo,
				uformRef
			}
		}
	})
	
</script>

<style lang="scss" scoped>
	.changeName { 
		padding: 0 30rpx; 
		border-top: 1rpx solid #eee;
		.seve_btn {
			padding: 0 30rpx;
			margin-top: 72rpx;
		}
		
		
	}
	
</style>