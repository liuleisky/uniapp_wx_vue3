import Request from './request.ts'

const HttpApi =  {
	login:(param) => {
		return Request('/login', 'post', { ...param })
	},
	oasAlarmList:(param) => { // 预警列表
		return Request('/api/oas-alarm', 'get', { ...param })
	},
	oasAlarmInfo:(param) => { // 预警详情
		return Request('/api/oas-alarm/get', 'get', { ...param })
	},
	oasAlarmHandling:(param) => { // 事件处理
		return Request('/api/oas-alarm/handling', 'post', { ...param })
	},
	oasAlarmProcessLogs:(param) => { // 流程日志
		return Request('/api/oas-alarm/processLogs', 'get', { ...param })
	},
	codeAndItem: (param) => { // 获取码表
		return Request('/sysCode/codeAndItem', 'get', { ...param })
	},
	authTreeNodeApp:(param) => { // 当前用户对应的组织集合
		return Request('/api/ge-model/authTreeNodeApp', 'get')
	},
	
	/* --------------------设备绑定---------------------- */
	
	alreadyInstallListPae: (param) => { // 已安装 | 分页列表
		return Request('/api/oas-install/alreadyInstallListPae', 'get', { ...param })
	},
	scanNumber: (param) => { // 扫码 | 设备编号
		return Request('/api/oas-install/scanNumber', 'get', { ...param })
	},
	userBinding: (param) => { // 安装设备
		return Request('/api/oas-install/userBinding', 'post', { ...param })
	},
	userUnbind: (param) => { // 用户 | 解绑设备
		return Request('/api/oas-install/userUnbind', 'post', { ...param })
	},
	wxToken: (param) => { // 扫码 | 获取公众号Token
		return Request('/api/oas-install/wxToken', 'post', { ...param })
	},
	getAnZhuangInfo: (param) => { // 详情 --当前安装后确认详情
		return Request('/api/oas-install/getView', 'get', { ...param })
	},
	getDeviceViewInfo: (param) => { // 设备 | 详情---还在安装
		return Request('/api/oas-install/getDeviceView', 'get', { ...param })
	},
	getHistoryAnZhuangView: (param) => { // 安装 | 详情
		return Request('/api/oas-install/getHistoryView', 'get', { ...param })
	},
	getHistoryDeviceView: (param) => { // 已安装 设备 | 详情
		return Request('/api/oas-install/getHistoryDeviceView', 'get', { ...param })
	},
	
	treeNodeApp: () => { //组织集合（获取 所有的帮扶组织）
		return Request('/api/ge-model/treeNodeApp', 'get')
	},
	
	treeNodeApp: (param) => { //组织集合（获取 所有的帮扶组织）
		return Request('/api/ge-model/treeNodeApp', 'get', { ...param })
	},
	locationArea: (param) => { // 经纬度获取腾讯地图详细信息
		return Request('/api/ge-model/locationArea', 'get', { ...param })
	},
	oasDataRadarList: (param) => { // 经纬度获取腾讯地图详细信息
		return Request('/api/oas-data/radarList', 'get', { ...param })
	},
	/* --------------------家人监护---------------------- */
	
	homeUserList: (param) => {       //监护人列表
		return Request('/api/oas-monitor/guardianListPage', 'get', { ...param })
	},
	
	addHomeUser: (param) => {       //添加 编辑  监护人 
		return Request('/api/oas-monitor/addGuardian', 'post', { ...param })
	},
	
	oldPeople: (param) => {      	//老年人列表
		return Request('/api/oas-monitor/oldPeopleListPage', 'get', { ...param })
	},
	
	delGuardian: (id) => {      	//移除监护人
		return Request('/api/oas-monitor/delGuardian/'+ id, 'delete')
	},
	
	deviceListPage: (param) => {     //设备列表
		return Request('/api/oas-monitor/deviceListPage', 'get', { ...param })
	},
	
	alarmListPage: (param) => {       //预警预报
		return Request('/api/oas-monitor/alarmListPage', 'get', { ...param })
	},
	radarAlarmList: (param) => {       //雷达(预警心跳)
		return Request('/api/oas-data/radarAlarmList', 'get', { ...param })
	},

	/*-------------------个人中心---------------------------*/ 
	myCenterEditBase: (param) => {       //名称 | 手机号 (修改)
		return Request('/api/my-centre/editBase', 'post', { ...param })
	},
	
	revisePwd: (param) => {       //修改密码
		return Request('/api/my-centre/revisePwd', 'post', { ...param })
	},
	tweetPush: (param) => {       //是否接受推文
		return Request('/api/my-centre/tweetPush', 'get', { ...param })
	},
	tweetView: (param) => {       //获取推文状态推文
		return Request('/api/my-centre/tweetView', 'get', { ...param })
	},
	unbindWx: (param) => {       //解绑微信
		return Request('/api/my-centre/unbindWx', 'get', { ...param })
	},
	updatedAvatar: (param) => {       //更新头像
		return Request('/api/my-centre/updatedAvatar', 'post', { ...param })
	},
	userViewInfo: (param) => {       //用户我的基础信息
		return Request('/api/my-centre/userView', 'get', { ...param })
	},
}

export default HttpApi
