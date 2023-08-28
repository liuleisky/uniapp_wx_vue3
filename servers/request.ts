// import { Toast } from '../utils/toast.js'
import { THeaderOption } from './request-type'
import serverConfig from './serverConfig'

const baseURL = serverConfig.api_url

/**
 * Get参数处理
 * @param {String} url 接口地址
 * @param {Object} param 参数
 * @return {String} 处理后的接口地址
 */
const getParamDispose = (url: string, param: TDict) => {
  const keyArr = Object.keys(param)
  const valueArr = Object.values(param)
  const leng = keyArr.length
  let newUrl = url
  for (let i = 0; i < leng; i++) {
    if (i === 0) {
      newUrl += `?${keyArr[i]}=${valueArr[i]}`
    } else {
      newUrl += `&${keyArr[i]}=${valueArr[i]}`
    }
  }
  return newUrl
}
const Request = (
	api:string,
    method: string,
    param:TDict = {}, 
	headerinfo:object = {},
	isUpload:Boolean = false) => {
	/* 请求头 */
	var _header:THeaderOption = {
		'content-type': 'application/x-www-form-urlencoded',
		'version': '1.0.0',
		'clientType': 'H5',
		// 'Authorization': 'Bearer'
		// 'satoken': null
	}
	
	if (method == 'post' || method == 'POST') _header['content-type'] = "application/json"
	if(headerinfo){
		for (let i in headerinfo) {
			if(i =='content_type'){
				_header['content-type'] = headerinfo[i]
			}else{
				_header[i] = headerinfo[i]
			}
		}
	}
	let url:string = ''
	if (method === 'post') {
		url = `${baseURL}${api}`
	} else {
		url = getParamDispose(`${baseURL}${api}`, param)
	}
	if(uni.getStorageSync('token')){
		_header.satoken= uni.getStorageSync('token');
	}
	return new Promise((resolve, reject) => {
		if (!isUpload) {
			uni.request({
				url,
				data: param,
				method: method,
				timeout: 30000,
				header: _header,
				success: (res) => { //具体捕获请看自己接口返回的形式
					if (res.data.statusCode === 200) {
						resolve(res.data)
					} else if(res.statusCode ==="401" || res.data.statusCode==-1){ 
						uni.showModal({
							title: '提示',
							content: '登录已过期,请重新登录',
							showCancel: false,
							success: function (res) {
								uni.reLaunch({
									url: '/pages/login/login'
								});
							}
						});
						reject(res.data)
					} else if(res.data.statusCode == 40401) { // 授权登录失败
						let data = JSON.parse(res.data.message)
						let openId = data.openId
						uni.setStorageSync('openId', openId)
						uni.navigateTo({
							url: '/pages/login/loginPassword'
						})
						// uni.showToast({
						//   title: data.msg,
						//   icon: 'none',
						//   duration: 2000
						// })
						reject(res.data)
					} else if (res.data.statusCode == 10404) { // 授权登录的时候 未绑定账号 返回openid 到时候输入账号密码的还是将这个openId传过去
						reject(res.data)
					} else {
						uni.showToast({
						  title: res.data.message,
						  icon: 'none',
						  duration: 2000
						})
						reject(res.data)
					} 
				},
				fail(error) {
					uni.showToast({
					  title: error,
					  icon: 'none',
					  duration: 2000
					})
					reject(error)
				},
				complete() {
					// showLoading(false)
				}
			});
		} else {
			uni.uploadFile({
				url: serverConfig.upload_url,
				filePath: data,
				name: 'file',
				// header: _header,
				formData: {
					// file: data
				},
				success: (uploadFileRes) => {
					// console.log('uploadFileRes', uploadFileRes)
					let parms = JSON.parse(uploadFileRes.data)
					// let imgurls = parms.result.filePath
					resolve(parms)
				},
				fail: () => {
					uni.showToast({
						title: '文件上传失败',
						icon: 'none'
					})
				}
			});
		}
	})
}



export default Request
