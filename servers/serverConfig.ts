import { BaseUrlOption } from './request-type'
if(process.env.NODE_ENV == 'development'){

	var api_url = 'http://192.168.20.21:8092';// 邓小明地址
	// var api_url = 'https://5d9c-171-212-243-141.ngrok.io';// 邓小明地址
	// var api_url = 'http://www.test.com:18542';//邓小明地址
	// var api_url = 'https://xlgc.honggv.cn:19040';//线上地址
} else {
	// 打包地址
	// var api_url = 'https://pengxi.xl02.cn:20018';//测试环境
	var api_url = 'https://xlgc.honggv.cn:19040';//线上地址
};
	var file_url = 'http://60.255.73.109:9000/'; //视频、图片地址
	var upload_url = 'http://192.168.20.21:8092/oss/upload'; //上传地址
const serverConfig:BaseUrlOption = {
  api_url: api_url,
  file_url:file_url,
  upload_url:upload_url
}
export default serverConfig
