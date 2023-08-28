<template>
	<view class="changeName">
			<u-form :model="form" ref="uformRef" label-position="top">
				<u-form-item label="请修改姓名（最多不能超过6个字符）" prop="name">
					<u-input v-model="form.name" placeholder="请输入姓名" clearable />
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
import  HttpApi from '@/servers/api.js'
	export default defineComponent({
		setup() {
			
			const state = reactive({
				form: {
					name: '',
				},
				rules: {
					name: [
						{ 
							required: true, 
							message: '请输入姓名', 
							trigger: ['change','blur'],
						},
						{
							max: 6,
							message: '姓名不能超过6个字符',
							trigger: 'change'
						}
					],
				}
			})
			
			const uformRef = ref<any>(null)
			onReady(() => {
				uformRef.value.setRules(state.rules);
			})
			
			onMounted(() => {
				const userStore = uni.getStorageSync('userInfo').extData
				state.form.name = userStore.userName
			})
		
			const saveInfo = () => {
				uformRef.value.validate(valid => {
					if (valid) {
						HttpApi.myCenterEditBase(state.form).then(res => {
							if (res.statusCode === 200) {
								let userInfo = uni.getStorageSync('userInfo')
								let extData = userInfo.extData
								extData['userName'] = state.form.name
								uni.setStorageSync('userInfo', userInfo)
								uni.navigateBack({
									delta: 1
								})
							}
						})
					} else {
						// console.log('失败');
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