<template>
	<view class="userInfo_page">
		<view class="flex_spa height60 borderBottomLine">
			<text>头像</text>
			<view class="right flex_a_c">
			<!-- 	<u-upload  :custom-btn="true"
				:show-upload-list="showUploadList"
				ref="uUpload" 
				width="80"
				height="80"
				class="curUpload"
				:deletable="false"
				 :action="action"> 
				</u-upload>
				<view slot="addBtn">
					<u-avatar :src="userImg" size="80" @click="uploadImg"></u-avatar>
				</view> -->
				<u-avatar :src="userImg" size="80" @click="uploadImg"></u-avatar>
				<image src="@/static/images/right_jiantou.png" class="margin-left4 widthHeight16" mode=""></image>
			</view>
		</view>
		<view class="flex_spa height60 borderBottomLine" 
			v-for="(item, k) in funcList" :key="k"
			@click="chooseFunc(item)">
			<text>{{item.name}}</text>
			<view class="right flex_a_c">
				
				
				<u-upload :custom-btn="true" ref="uUpload" max-count="1" :show-upload-list="showUploadList" :action="action"> 
					<view slot="addBtn" class="slot-btn" hover-class="slot-btn__hover" hover-stay-time="150">
						<u-icon name="photo" size="60" color="#c0c4cc"></u-icon>
					</view>
				</u-upload>
				<u-avatar :src="item.value" size="80" v-if="item.type === 1"></u-avatar>
				<text v-if="item.type === 2">{{item.value}}</text>
				<u-switch v-model="item.value" size="36" active-color="#35CCB8" @change="switchChange" v-if="item.type === 4"></u-switch>
				<image src="@/static/images/right_jiantou.png" v-if="item.type !== 4" class="margin-left4 widthHeight16" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, ref } from "vue"
import { userInfoStore } from '@/store'
import serverConfig from '@/servers/serverConfig.ts'
import  HttpApi from '@/servers/api.js'
import { Toast } from "@/utils/toast"
import { onShow } from "@dcloudio/uni-app"
	export default defineComponent({
		setup() {
			
			interface funcList {
				name: string, 
				value: string,
				type: number,
				no: number
			}
			const state = reactive({
				userInfo: {},
				url: serverConfig.file_url,
				userImg: '',
				funcList: [
					// { name:'头像', value: '', type: 1, no: 1},
					{ name:'姓名', value: '', type: 2, no: 2},
					{ name:'联系电话', value: '', type: 2, no: 3},
					{ name:'修改密码', value: '', type: 3, no: 4},
					{ name:'接收文章推送', value: false, type: 4, no: 5},
					{ name:'解绑公众号', value: '', type: 3, no: 6},
				],
				action: serverConfig.upload_url,
				showUploadList: false,
				defaultImg: '../../static/images/default_touxiang.png',
			})
			onShow(() => {
				func.showInfo()
				func.getTweetView()
				
			})
			const chooseFunc = (data:funcList) => {
				console.log('data', data.no)
				let num = data.no
				if (num === 2) { // 修改姓名
					uni.navigateTo({
						url: '/pages/me/changeName'
					})
				}
				if (num === 3) { // 修改电话
					uni.navigateTo({
						url: '/pages/me/changePhone'
					})
				}
				if (num === 4) { // 修改密码
					uni.navigateTo({
						url: '/pages/me/changePsw'
					})
				}
				if (num === 6) { // 解绑微信
					uni.showModal({
						title: '提示',
						content: '确认解绑当前公众号吗',
						success: function (res) {
							if (res.confirm) {
								HttpApi.unbindWx().then(res => {
									if (res.statusCode === 200) {
										uni.reLaunch({
											url: '/pages/login/index'
										})
									}
								})
							} else if (res.cancel) {
								
							}
						}
					});
				}
			}
			const uUpload = ref(null)
			
			const func = reactive({
				getTweetView: () => { // 获取推文状态
					HttpApi.tweetView().then(res => {
						if (res.statusCode === 200) {
							state.funcList[4].value = res.data
						}
					})
				},
				switchChange: (value:boolean) => { // 设置推文状态
					console.log('value', value)
					HttpApi.tweetPush({push: value}).then(res => {
						if (res.statusCode === 200) {
							Toast('设置成功')
						}
					})
				},
				updatedAvatar: (url) => {
					HttpApi.updatedAvatar({portrait: url}).then(res => {
						if (res.statusCode === 200) {
							Toast('头像更新成功')
							func.userViewInfo()
						}
					})
				},
				userViewInfo: (type:number) => { // 获取用户基础信息并更新
					HttpApi.userViewInfo().then(res => {
						if (res.statusCode === 200) {
							let userInfo = uni.getStorageSync('userInfo')
							if (userInfo) {
								let extData = userInfo.extData
								let data = res.data
								extData['userName'] = data.name
								extData['phone'] = data.phone
								extData['portrait'] = data.portrait
								userInfo['extData'] = extData
								uni.setStorageSync('userInfo', userInfo)
								func.showInfo()
							}
							
						}
					})
				},
				showInfo: () => { // 展示用户信息
					const userStore = uni.getStorageSync('userInfo')
					let info = userStore.extData
					state.userImg= info.portrait ? state.url + info.portrait : state.defaultImg
					state.funcList[0].value = info.userName
					state.funcList[1].value = info.phone
				},
				uploadImg: () => { // 上传头像
					console.log('uUpload', uUpload.value)
					// uUpload.value[0].upload()
					uni.chooseImage({
						count: 1, //默认9
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						success: function (res) {
							console.log(JSON.stringify(res.tempFilePaths));
							const tempFilePaths = res.tempFilePaths;
							uni.uploadFile({
								url: state.action, //仅为示例，非真实的接口地址
								filePath: tempFilePaths[0],
								name: 'file',
								formData: {
								},
								success: (uploadFileRes) => {
									let parms = JSON.parse(uploadFileRes.data)
									func.updatedAvatar(parms.data)
									console.log(parms);
								}
							});
						}
					});
				}
			})
			
			
			return {
				...toRefs(state),
				...toRefs(func),
				chooseFunc,
				uUpload
			}
		}
	})
	
</script>
<style lang="scss">
	
</style>
<style lang="scss" scoped>
	.userInfo_page { 
		padding: 0 30rpx; 
		border-top: 1rpx solid #ccc;
		
		.slotBtn {
			width: 80rpx;
			height: 80rpx;
			background-color: #ff0000;
		}
		
		.curUpload {
			:deep {
				.u-list-item {
					border-radius: 50%;
				}
				.u-preview-wrap {
					border: none;
				}
			}	
		}
		
		
		
	}
	
</style>