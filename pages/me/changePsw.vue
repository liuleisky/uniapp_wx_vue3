<template>
	<view class="changeName">
		<view class="margin-top15">
			<!-- 请设置6-18位包含数字、字母和符号 -->
		</view>
			<u-form :model="form" ref="uformRef" label-position="top" :border-bottom="false">
				<u-form-item label="旧密码：" prop="oldPwd" :border-bottom="false" required>
					<u-input v-model="form.oldPwd" type="password" placeholder="请输入旧密码" :border="border"  clearable />
				</u-form-item>
				<u-form-item label="新密码：" prop="newPwd" :border-bottom="false" required>
					<u-input v-model="form.newPwd" type="password" placeholder="请输入新密码" :border="border" clearable />
				</u-form-item>
				<u-form-item label="确认密码：" prop="verifyPwd" :border-bottom="false" required>
					<u-input v-model="form.verifyPwd" type="password" placeholder="请确认新密码" :border="border" clearable />
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
import { Base64 } from "js-base64";
import  HttpApi from '@/servers/api.js'
import { Toast } from "@/utils/toast";
	export default defineComponent({
		setup() {
			const userInfoObj = userInfoStore()
			
			const state = reactive({
				form: {
					oldPwd: '',
					newPwd: '',
					verifyPwd: '',
				},
				rules: {
					oldPwd: [
						{ 
							required: true, 
							message: '请输入旧密码', 
							trigger: ['change','blur'],
						},
						{
							min: 6,
							max: 18,
							message: '长度不能小于6位和大于18位', 
							trigger: ['change'],
						},
					],
					newPwd: [
						{ 
							required: true, 
							message: '请输入新密码', 
							trigger: ['change','blur'],
						},
						{
							min: 6,
							max: 18,
							message: '长度不能小于6位和大于18位', 
							trigger: ['change'],
						},
					],
					verifyPwd: [
						{ 
							required: true, 
							message: '请确认新密码', 
							trigger: ['change','blur'],
						},
						{
							min: 6,
							max: 18,
							message: '长度不能小于6位和大于18位', 
							trigger: ['change'],
						},
					],
				},
				border: true
			})
			
			const uformRef = ref<any>(null)
			onReady(() => {
				uformRef.value.setRules(state.rules);
			})
			
			onMounted(() => {

			})
		
			const saveInfo = () => {
				uformRef.value.validate(valid => {
					if (valid) {
						let obj = JSON.parse(JSON.stringify(state.form))
						if(obj.newPwd !== obj.verifyPwd) {
							Toast('新密码和确认密码不同，请重新输入')
							return
						}
						obj.oldPwd = Base64.encode(obj.oldPwd);
						obj.newPwd = Base64.encode(obj.newPwd);
						obj.verifyPwd = Base64.encode(obj.verifyPwd);
						HttpApi.revisePwd(obj).then(res => {
							if (res.statusCode === 200) {
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