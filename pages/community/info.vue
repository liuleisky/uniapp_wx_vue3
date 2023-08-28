<template>
	<view class="bangfu_info_page">
		<view class="topContent" :class="{haveBtn: infoStatus === '1' || (infoStatus === '2' && oneself) }">
			<view class="stateu_top flexAll" 
			v-if="infoStatus === '1' || infoStatus === '2'"
			:class="{'chuliIng': infoStatus === '1', 'yichuli': infoStatus == '2'}">
				{{infoStatus === '1' ? '待处理' : '处理中'}}
			</view>
			<view class="paddingLR10">
				<view class="bgFFF margin-top4" v-if="!isJhrPage">
					<view class="flex_spa paddingLR15 height44 boxShadowB">
						<text>姓名</text>
						<text>{{info.personName}}</text>
					</view> 
					<!-- <view class="flex_spa paddingLR15 height44 boxShadowB">
						<text>地区</text>
						<text>四川省成都市高新区</text>
					</view> -->
					<view class="flex_spa paddingLR15 height44 boxShadowB">
						<text>详细地址</text>
						<text>{{info.address}}{{info.detailedAddress}}</text>
					</view>
					<view class="flex_spa paddingLR15 height44">
						<text>电话</text>
						<view class="flex_a_c" @click="callPhone">
							<text>{{info.assistPhone}}</text>
							<image src="../../static/images/phone_icon.png" class="widthHeight16 margin-left6" mode=""></image>
						</view>
					</view>
				</view>
				
				<view class="boxBase" v-if="info.dataType === '2' || info.dataType === '3'">
					<view class="padding-left16 height62 flex_spa padding-right15 boxShadowB">
						<view class="base_title_g">
							<view class="base_line"></view>回放记录
						</view>
						<view class="huakaui flex_a_c">
							<view class="single_tab flexAll"
							 :class="{tabActive: tabsCurrent === item.value}"
							v-for="(item, k) in tabs"
							:key="k" 
							@click="chooseTabs(item.value)">
								{{item.name}}
							</view>
						</view> 
					</view>
					<view class="flex_spa paddingLR15 height44 boxShadowB">
						<text>预警时间</text>
						<text>{{info.createGmt}}</text>
					</view>
					<view class="flexAll paddingTB15" v-if="tabsCurrent === 1">
						<u-swiper :list="jkImgList" height="370" class="swiperBox" v-if="jkImgList.length > 0"></u-swiper>
						<view class="flexAll" v-else>
							暂无截图
						</view>
					</view>
					<view class="flexAll paddingTB15" v-else>
						<image src="https://img0.baidu.com/it/u=981218435,2998857702&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1677949200&t=9cc55c9c6205a205f13f97c299bf1e26" class="yujinImg" mode=""></image>
					</view>
					<view class="tipText paddingLR15">
						{{info.intro}}
					</view>
				</view>
				
				<view class="boxBase" v-if="info.dataType === '1'">
					<view class="padding-left16 height62 flex_a_c padding-right15 boxShadowB">
						<view class="base_title_g">
							<view class="base_line"></view>心率记录
						</view>
					</view>
					<view class="flex_spa paddingLR15 height44 boxShadowB">
						<text>预警时间</text>
						<text>{{info.createGmt}}</text>
					</view>
					<view class="xinglv margin-top6" v-if="info.dataType === '1'">
						<view class="charts-box">
						 <qiun-data-charts 
							  type="line"
							  :opts="opts"
							  :chartData="chartData"
							  :ontouch="true"
							/>
						</view>
					</view>

					
					<view class="tipText margin-top15 paddingLR15">
						{{info.intro}}
					</view>
				</view>
				<!-- 上报信息 -->
				<view class="boxBase margin-bottom20" v-if="infoStatus === '2' && oneself">
					<view class="padding-left16 height62 flex_spa padding-right15">
						<view class="base_title_g">
							<view class="base_line"></view>上报信息
						</view>
					</view>
					<view class="paddingLR15">
						<view class="margin-bottom8 font-12"><text class="colorFF576E">*</text>情况简述：</view>
						<view class="textareaIn paddingLR14">
							<u-input v-model="handleForm.intro" placeholder="请描述现场具体情况和老人状况"
							 height="80" type="textarea" maxlength="200" :border="false" />
						</view>
						<view class="margin-bottom8 margin-top15 font-12">
							<text class="colorFF576E">*</text>现场图片：（{{fileList.length}}/3)
						</view>
						<view class="">
							<u-upload :action="action"
							max-count="3"
							width="160"
							height="160"
							  @on-remove="removeImg"
							  @on-success="fileUploadSuccess"
							   :file-list="fileList" ></u-upload>
						</view>
					</view>
				</view>
				<!-- 事件日志 -->
				<view class="boxBase teshuBox margin-bottom20" v-if="isJhrPage ? ((infoStatus === '2' && !oneself) || infoStatus > 2 || infoStatus == 1 ): ((infoStatus === '2' && !oneself) || infoStatus > 2)">
					<view class="finishImg" v-if="infoStatus === '3' || infoStatus === '4' || infoStatus === '5'">
						<u-image width="154rpx" height="154rpx" :src="filterStatusImg()"></u-image>
					</view> 
					<view class="padding-left16 height62 flex_spa padding-right15"> 
						<view class="base_title_g">
							<view class="base_line"></view>事件日志
						</view>
					</view>
					<view class="flex" v-for="(item, k) in logList" :key="k">
						<view class="leftTime padding">
							<view class="font-16"> {{ item.ri }} </view>
							<view class="color999">  {{ item.timeStr }}</view>
						</view>
						<view class="right_info paddingLR20" :class="{'padding-bottom34': k !== 2}">
							<view class="listNum flexAll font-12">{{k+1}}</view>
							<view class="font-weight700"> {{item.title}}【 {{item.statusName}} 】</view>
							<!-- <view class="color666 margin-top8">
								预警信息：跌倒
							</view> -->
							<div class="color666 margin-top8">
								处理人：{{item.creatorName}}
							</div>
							<view class="color666 margin-top8 tipJingInfo">
								{{ item.content }}
							</view>
							<view class="log_img margin-top8 flex_a_c">
								<u-image width="146rpx" height="146rpx"
								 class="margin-right8" border-radius="8rpx"
								 :src="itemV" v-for="(itemV, ki) in item.imgArr" 
								 :key="ki"
								 @click="lookTipInfoImg(itemV, item.imgArr)"
								 ></u-image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom_box bgFFF flex_a_c paddingLR20" v-if="infoStatus == '1' ||  (infoStatus === '2' && oneself)">
			<view class="goChuli flex_a_c" v-if="infoStatus === '1'">
				<view class="flex_a_c margin-right20" @click="callPhone" v-if="!isJhrPage"> 
					<image src="../../static/images/phone_icon.png" class="widthHeight16 margin-right8" mode=""></image>
					联系监护人
				</view>
				<view class="flex1">
					<u-button type="primary" style="background-color: #35CCB8;" hover-class="none" :disabled="btnDisabled" @click="toHandle">去处理</u-button>
				</view>
			</view>
			<view class="flex_a_c width100" v-if="infoStatus === '2' && oneself">
				<view class="wubaoBox flex1 margin-right16">
					<u-button plain style="background-color: #fff;" :disabled="btnDisabled" hover-class="none" @click="falseAlarm">误报</u-button>
				</view>
				<view class="flex1">
					<u-button type="primary" style="background-color: #35CCB8;" :disabled="btnDisabled" hover-class="none" @click="processed">已处理</u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, CSSProperties, computed } from "vue"
import { onLoad, onHide, onUnload  } from '@dcloudio/uni-app'
import { Confirm, Toast } from '@/utils/toast'
import  HttpApi from '@/servers/api.js'
import serverConfig from '@/servers/serverConfig.ts'
	export default defineComponent({
		setup() {
			const state = reactive({
				infoStatus: '',
				oneself: false, // 判断是不是自己处理的，处理中的状态显示上报信息，其他人显示事件日志
				tabs: [
					{ name:'截图', value: 1 },
					{ name:'视频', value: 2 },
				],
				tabsCurrent: 1,
				deviceType: 1,
				imageBg: '../../static/images/xinglvtu.png',
				action: serverConfig.upload_url,
				fileList: [
					// { url: "https://img2.baidu.com/it/u=175449109,3788073609&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1677949200&t=fd01e9b58265719e9d66fd6415e92e6e"},
					// { url: "https://img1.baidu.com/it/u=3486651663,3991438881&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1677949200&t=f2c36aa62812fec90e2feaa90d23dddc"},
					// { url: "https://img2.baidu.com/it/u=2421090168,324781765&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1677949200&t=71963374ac16ea00f0e8122a3e2878fa"},
				],
				yichuliImg: '../../static/images/yichuli.png',
				yishangbaoImg: '../../static/images/yishangbao.png',
				wubaoImg: '../../static/images/wubao.png',
				eventStatus:  1,
				currentId: '',
				info: {},
				handleForm: {
					fileUrl: '',
					id: '',
					intro: '',
					status: '', // 1[待处理],2[处理中],3[已处理],4[误报],5[已上报]	
				},
				logList: [],
				jkImgList: [
					//  'https://img2.baidu.com/it/u=2421090168,324781765&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1677949200&t=71963374ac16ea00f0e8122a3e2878fa',
					// 'https://img2.baidu.com/it/u=3202947311,1179654885&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1677949200&t=badedca3bdff436f359947c494be0140'
				],
				videoUrl: '',
				isJhrPage: false, // 手否是监护人预警那边进来的
				chartData: {},
				chartTimer: null,
				opts: {
					color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
					padding: [15,10,0,15],
					enableScroll: true,
					legend: {},
					xAxis: {
					  // disableGrid: true,
					  scrollShow: true,
					  itemCount: 8
					},
					yAxis: {
					  gridType: "dash",
					  dashLength: 2
					},
					extra: {
					  line: {
						type: "curve",
						width: 2,
						activeType: "hollow",
						linearType: "custom",
						onShadow: true,
						animation: "horizontal"
					  }
					}
				  },
				  breathe: [], // 呼吸值
				  heartRate: [], // 	心率值
				  sleepQuality: [], // 	睡眠质量
				  title: [],
				  btnDisabled: false,
			})
			
			onLoad(async (e) => {
				state.currentId = e.id
				state.handleForm.id = e.id
				state.isJhrPage = e.form && e.form == 'jhr' ? true: false
				await func.getInfo()
				func.getLogList()
				func.getCodeAndItem()
				if (state.info.dataType === '1') {
					func.getheartRate()
				}
			})
			onHide(() =>{
				clearInterval(state.chartTimer)
			})
			onUnload(() => {
				clearInterval(state.chartTimer)
			})

			const homeBg = computed<CSSProperties>(() => ({
			  backgroundImage: `url(${state.imageBg})`
			}))
			const func = reactive({
				getInfo: async () => {
					await HttpApi.oasAlarmInfo({id: state.currentId}).then(res => {
						if (res.statusCode === 200) {
							state.info = res.data
							state.infoStatus = res.data.status
							state.oneself = res.data.oneself
							
							if (res.data.fileUrl !== '') {
								let urlArr:string[] = res.data.fileUrl.split(',')
								
								let lsImg:string[] = urlArr.filter(item => {
									return item.indexOf('.jpg') > -1 || item.indexOf('.png') > -1 || item.indexOf('.webp') > -1
								})
								state.jkImgList = lsImg.map(val => {
									return serverConfig.file_url + val
								})
								
								let videoArr:string[] = urlArr.filter(item => {
									return item.indexOf('.mp4') > -1 || item.indexOf('.mu38') > -1
								})
								state.videoUrl = videoArr[0]
							}
						}
					})
				},
				chooseTabs: (data:number) => { // 选择图片还是视频
					state.tabsCurrent = data
				},
				toHandle: () => { // 去处理
					state.handleForm.status = 2
					func.handleFunc()
				},
				callPhone: () => {
					uni.makePhoneCall({
						phoneNumber: state.info.assistPhone //仅为示例
					});
				},
				fileUploadSuccess: (data, index, lists, name) => {
					console.log('data', data)
					// return
					let obj = {url: data.data}
					state.fileList.push(obj)
				},
				removeImg: (index, lists, name) => {
					state.fileList.splice(index, 1)
				},
				falseAlarm: () => { // 误报
					Confirm('是否预警误报？').then(res => {
						state.handleForm.status = 4
						if (state.handleForm.intro === '') {
							Toast('请输入情况简述')
							return
						}
						if (state.fileList.length === 0) {
							Toast('请上传现场图片')
							return
						}
						let arr = state.fileList.map(res => res.url)
						state.handleForm.fileUrl = arr.join(',')
						func.handleFunc(1)
					}).catch(err => {
						console.log('err', err)
					})
				},
				processed: () => { // 已处理
					state.handleForm.status = 3
					if (state.handleForm.intro === '') {
						Toast('请输入情况简述')
						return
					}
					if (state.fileList.length === 0) {
						Toast('请上传现场图片')
						return
					}
					let arr = state.fileList.map(res => res.url)
					state.handleForm.fileUrl = arr.join(',')
					func.handleFunc(1)
					
				},
				lookTipInfoImg(item, list) { // 查看事件日志图片
					uni.previewImage({
						current: item,
						urls:list
					})
				},
				filterStatusImg: () => {
					let str = ''
					if (state.infoStatus === '3') {
						str = state.yichuliImg
					}
					if (state.infoStatus === '4') {
						str = state.wubaoImg
					}
					if (state.infoStatus === '5') {
						str = state.yishangbaoImg
					}
					return str
				},
				handleFunc: (num:number) => { // 事件处理
					state.btnDisabled = true
					HttpApi.oasAlarmHandling(state.handleForm).then(res => {
						if (res.statusCode === 200) {
							func.getInfo()
							state.btnDisabled = false
							uni.setStorageSync('zhixing', 1)
							if (num) {
								func.getLogList()
							}
						}
					}).catch(() => {
						state.btnDisabled = false
					})
				},
				getLogList: () => { // 获取报警日志
					HttpApi.oasAlarmProcessLogs({id: state.currentId}).then(res => {
						if (res.statusCode === 200) {
							 res.data.forEach(item => {
								let strRi  = item.createGmt.split(' ')[0].split('-')
								let strTime  = item.createGmt.split(' ')[1].split(':')
								item['ri'] = strRi[1] + '-' + strRi[2]
								item['timeStr'] = strTime[0] + ':' + strTime[1]
	
								let imgArr = [], videoArr = [] ;
								let arr = item.fileUrl.split(',')
								if (arr.length > 0) {
									let lsImg = arr.filter(item => {
										return item.indexOf('.jpg') > -1 || item.indexOf('.png') > -1 || item.indexOf('.webp') > -1
									})
									imgArr = lsImg.map(val => {
										return serverConfig.file_url + val
									})
									videoArr = arr.filter(item => {
										return item.indexOf('.mp4') > -1 || item.indexOf('.mu38') > -1
									})
								}
								item['imgArr'] = imgArr
								item['videoUrl'] = videoArr[0]
							})
							state.logList = res.data
							
							
							
						}
					})
				},
				getCodeAndItem: ()=> { // 获取码表
					HttpApi.codeAndItem({'codeValue': 'DEVICE_TYPE'}).then(res => {
						if (res.statusCode === 200) {
							
						}
					})
				},
				getheartRate: (type:number) => { // 获取心率接口数据
					let obj = {
						deviceNo: state.info.dataId,
						dateTime: state.info.createGmt
					}
					HttpApi.radarAlarmList(obj).then(res => {
						if (res.statusCode === 200) {
							let arr = res.data
							arr.forEach(item => {
								state.breathe.push(item.breathe)
								state.heartRate.push(item.heartRate)
								state.sleepQuality.push(item.sleepQuality)
								state.title.push(item.createGmt)
							})
							let options = {
								categories: state.title,
								series: [
								  {
									name: "呼吸值",
									linearColor: [
									    [ 0,  "#1890FF" ],
									    [0.25,"#00B5FF"],
									    [0.5, "#00D1ED"],
									    [0.75,"#00E6BB"],
									    [ 1,"#90F489"]
									],
									setShadow: [3,8,10,"#1890FF"],
									data: state.breathe
								  },
								  {
									name: "心率值",
									linearColor: [
									    [ 0,  "#FAC858" ],
									    [0.33,"#FFC371"],
									    [0.66, "#FFC2B2"],
									    [ 1,"#FA7D8D"]
									],
									setShadow: [3,8,10,"#FC8452"],
									data: state.heartRate
								  },
								  {
									name: "睡眠质量",
									data: state.sleepQuality
								  }
								]
								};
							state.chartData = JSON.parse(JSON.stringify(options));
						}
					})				
				},
			})
			
			
			return {
				...toRefs(state),
				...toRefs(func),
				homeBg
			}
		}
	})
	
</script>

<style lang="scss" scoped>
	.bangfu_info_page {
		width: 100vw;
		min-height: 100vh;
		background: #F6F6F6;
		.topContent {
			overflow-y: auto;
			width: 750rpx;
			.boxBase {
				background-color: #fff;
				border-radius: 32rpx;
				width: 100%;
				// height: 500rpx;
				margin-top: 20rpx;
				padding-bottom: 40rpx;
				.huakaui {
					width: 300rpx;
					height: 64rpx;
					border-radius: 32rpx;
					background-color: #F6F6F6;
					.single_tab {
						width: 150rpx;
						height: 64rpx;
						border-radius: 32rpx;
						color: #35CCB8;
					}
					.tabActive {
						background-color: #35CCB8;
						color: #fff;
					}
				}
				
				.yujinImg {
					width: 650rpx;
					height: 370rpx;
				}
				.textareaIn {
					background-color: #F6F6F6;
					border-radius: 8rpx;
					height: 192rpx;
					overflow: auto;
					:deep {
						.uni-textarea-textarea {
							
						}
					}
				}
				
				.leftTime {
					width: 146rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
				}
				.right_info {
					position: relative;
					border-left: 1rpx dashed #D6D6D6;
					.listNum {
						position: absolute;
						width: 48rpx;
						height: 48rpx;
						border-radius: 50%;
						background-color: #EEFFFD;
						color: #35CCB8;
						top: 0;
						left: -24rpx;
					}
					.tipJingInfo {
						width: 470rpx;
					}
				}
				
				
			}
			.teshuBox {
				position: relative;
				.finishImg {
					position: absolute;
					left: calc(50% - 77rpx);
					top: -77rpx;
				}
			}
		}
		.xinglv {
			width: 100%;
			height: 410rpx;
			background-size: 100%;
			.xingluNum {
				color: #FF8293;
			}
		}
		.charts-box {
			width: 100%;
			height: 400rpx;
		}
		.haveBtn {
			height: calc(100vh - 118rpx);
		}
		.noHaveBtn {
			height: 100vh;
		}
		.stateu_top {
			width: 750rpx;
			height: 80rpx;
		}
		.chuliIng {
			color:#FF8293;	
			background: rgba(255,214,214,0.34);
		}
		.yichuli {
			color: #35CCB8;
			background: rgba(53,204,184,0.08);
		}
		.goChuli {
			width: calc(100vw - 80rpx);
		}
		.bottom_box {
			height: 118rpx;
			:deep {
				.u-btn--primary--disabled {
					background-color: #35CCB8!important;
					opacity: .5;
				}
			}
		}
		.swiperBox {
			width: 650rpx;
			height: 370rpx;
		}
		
	}
</style>