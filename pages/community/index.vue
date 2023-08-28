<template>
	<view class="communityPage">
		<u-tabs-swiper ref="tabs"
			:current="current" 
			active-color="#35CCB8" 
			:list="tabList" 
			:is-scroll="false"
			@change="changeTab"
			></u-tabs-swiper>
			<view class="content">
				<view class="searchBox paddingLR15 flex_a_c">
					<view class="xiaoquBox margin-right10 flex_spa" @click="organShow = true">
						<view class="chooseXiaoqu">
							{{organName !=='' ? organName : '请选择帮扶组织'}}
						</view><u-icon name="arrow-down-fill" size="24" color="#999"></u-icon>
					</view>
					<u-search
					 placeholder="搜索姓名、小区名称"
					 height="80"
					 shape="round" 
					 bg-color="#fff"
					 :clearabled="true"
					 :show-action="false"
					 v-model="searchForm.personName"
					 @search="searchFunc"
					 ></u-search>
				</view>
				<view class="installed_box" v-if="current === 0">
					<scroll-view scroll-y="true" class="scroll-Y" @scrolltolower="lowerList">
						<view v-if="contentList.length > 0">
							<view class="content_single bgFFF margin-bottom8"
							 v-for="(item, k) in contentList" :key="k"
							 >
								<view class="flex_spa">
									<view class="addressInfo">
										{{item.detailedAddress}}
									</view>
									<view class="font-12" :style="{color: stateTextColor(item.status)}">
										{{ item.status === '1' ? '待处理' : '处理中'}}
									</view>
								</view>
								<view class="font-12 color999">
									{{item.address}}
								</view>
								<view class="margin-top15">
									用户姓名：{{item.personName}}
								</view>
								<view class="margin-top8">
									预警时间：{{item.createGmt}}
								</view>
								<view class="margin-top8">
									预警信息：<text class="colorFF576E">{{item.intro}}</text>
								</view>
								<view class="boxShadowT padding-top12 margin-top15">
									<u-button type="primary"
										:class="[item.status === '1' ? 'btnBase' : 'btnOther']"
									  hover-class="none" 
									  @click="lookInfo(item)">查看详情</u-button>
								</view>
								<!-- <view class="statueBox">
									<image src="../../static/images/yiwancheng.png" class="wanchengImg" mode=""></image>
								</view> -->
							</view>
							<u-loadmore status="nomore" class="paddingTB16" v-if="showNoMore" />
						</view>
						<view v-else class="flexAll padding-top20">
							<u-empty
							        mode="list"
							        icon="http://cdn.uviewui.com/uview/empty/list.png"
									text="暂无内容"
							>
							</u-empty>
						</view>
					</scroll-view>
				</view>
				<view class="installed_box" v-if="current === 1">
					<scroll-view scroll-y="true" class="scroll-Y" @scrolltolower="lowerList">
						<view v-if="contentList.length > 0">
							<view class="content_single bgFFF margin-bottom8"
							 v-for="(item, k) in contentList" :key="k"
							 >
								<view class="flex_spa">
									<view class="addressInfo1">
										{{item.detailedAddress}}
									</view>
								</view>
								<view class="font-12 color999">
									{{item.address}}
								</view>
								<view class="margin-top15">
									用户姓名：{{item.personName}}
								</view>
								<view class="margin-top8">
									预警时间：{{item.createGmt}}
								</view>
								<view class="margin-top8">
									预警信息：{{item.intro}}
								</view>
								<!-- <view class="margin-top8">
									完结时间：2023-02-12 12:45
								</view> -->
								<view class="boxShadowT padding-top12 margin-top15">
									<u-button type="primary"
									  hover-class="none" 
									  class="btnOther"
									  @click="lookInfo(item)">查看详情</u-button>
								</view>
								<view class="statueBox">
									<image :src="item.status === '3' ? yichuliIcon : item.status == '5' ? yishangbaoIcon: wubaoIcon" class="wanchengImg" mode=""></image>
								</view>
							</view>
							<u-loadmore status="nomore" class="paddingTB16" v-if="showNoMore" />
						</view>
						<view v-else class="flexAll padding-top20">
							<u-empty
							        mode="list"
							        icon="http://cdn.uviewui.com/uview/empty/list.png"
									text="暂无内容"
							>
							</u-empty>
						</view>
					</scroll-view>
				</view>
			</view>
			<u-select v-model="organShow" :list="organList"
			value-name="id" label-name="soaName"
			 @confirm="confirmFunc" @cancel="cancelFunc"></u-select>
		</view>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, onMounted } from "vue"
import  HttpApi from '@/servers/api.js'
import { onShow } from "@dcloudio/uni-app"
export default defineComponent({
	setup() {
		let state = reactive({
			current: 0,
			tabList: [
				{ name: '预警', value: 0 },
				{ name: '历史记录', value: 1 },
			],
			searchKey: '',
			contentList: [],
			showNoMore: false,
			yichuliIcon: '../../static/images/yichuli.png',
			yishangbaoIcon: '../../static/images/yishangbao.png',
			wubaoIcon: '../../static/images/wubao.png',
			searchForm: {
				status: '1,2', // 1[待处理],2[处理中],3[已处理],4[误报],5[已上报] 传入多个（用英文逗号分割）
				page: 1,
				size: 10,
				type: '',
				personName: '', //用户姓名
				soaId: '', // 组织Id
			},
			organShow: false, // 组织机构选择
			organList: [],
			organName: ''
		})
		
		onMounted(async() => {
			await func.getOrganList()
			func.searchFunc()
		})
		onShow(() => {
			let num = uni.getStorageSync('zhixing')
			if (num == 1) {
				func.searchFunc()
				uni.removeStorageSync('zhixing')
			}
		})
		
		const func = reactive({
			selectXiaoqu: () => {
				
			},
			lowerList: () => {
				func.getList()
			},
			lookInfo: (item:object) => {
				uni.navigateTo({
					url: '/pages/community/info?id='+item.id
				})
			},
			stateTextColor: (num:number) =>  {
				let str = num == 1 ? '#FF576E' : '#35CCB8'
				return str
			},
			changeTab: (e) => {
				state.current = e
				state.searchForm.page = 1
				state.searchForm.status = e == 0 ? '1,2' : '3,4,5'
				state.contentList = []
				func.getList()
			},
			searchFunc: () => {
				state.searchForm.page = 1
				state.contentList = []
				func.getList()
			},
			getList:() => {
				HttpApi.oasAlarmList(state.searchForm).then(res => {
					if (res.statusCode === 200) {
						if (res.data.list.length > 0) {
							state.contentList = [...state.contentList, ...res.data.list]
							state.searchForm.page = state.searchForm.page + 1
							if (state.contentList.length === res.data.totalCount) {
								state.showNoMore = true
							} else {
								state.showNoMore = false
							}
						}
					}
				}).catch(() => {
					
				})
			},
			confirmFunc: (e) => {
				state.organName = e[0].label
				state.searchForm.soaId = e[0].value
				// console.log('searchForm', state.searchForm)
				func.searchFunc()
			},
			cancelFunc: (e) => {
			},
			getOrganList: async () => {
				await HttpApi.authTreeNodeApp().then(res => {
					if (res.statusCode === 200) {
						state.organList = res.data
						if (res.data.length > 0) {
							state.searchForm.soaId = res.data[0].id
							state.organName = res.data[0].soaName
						}
					}
				})
			}
		})
		

		
		return {
			...toRefs(state),
			...toRefs(func),
		}
	}
})
</script>

<style lang="scss">
.communityPage {
	  width: 100%;
	  height: 100vh;
	  background-color: #F6F6F6;
	  .content {
		  height: calc(100vh - 80rpx);
		  width: 100%;
		  .searchBox {
			  height: 128rpx;
			  .xiaoquBox {
				  height: 80rpx;
				  width: 316rpx;
				  border-radius: 44rpx;
				  background-color: #FFF;
				  padding: 0 24rpx;
				  box-sizing: border-box;
			  }
			  .chooseXiaoqu {
				  // @include omit;
			  }
		  }
	  }
	  .installed_box {
		  .scroll-Y {
		  	height: calc(100vh - 208rpx);
			width: 100%;
			padding: 0 20rpx;
			box-sizing: border-box;
		  	.content_single { 
				width: 100%;
				// height: 304rpx;
				box-sizing: border-box;
				padding:  32rpx 20rpx;
				border-radius: 8rpx;
				position: relative;
				.addressInfo {
					width: 550rpx;
					font-weight: bold;
					// @include omit;
				}
				.addressInfo1 {
					width: 650rpx;
					font-weight: bold;
					// @include omit;
				}
				.statueBox {
					position: absolute;
					top: 100rpx;
					right: 46rpx;
					.wanchengImg {
						width: 128rpx;
						height: 128rpx;
					}
				}
				
				.btnBase {
					background-color: #35CCB8;
					height: 72rpx;
					color: #fff;
				}
				.btnOther {
					background-color: #F6F6F6;
					height: 72rpx;
					color: #000;
				}
		  	}
		  }
	  }
	.popupBox {
		height: 70vh;
		.map_title {
			height: 90rpx;
		}
		.mapBox {
			width: 750rpx;
			height: calc(70vh - 90rpx);
		}
	}
}
</style>
