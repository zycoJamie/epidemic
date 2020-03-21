export default function ajax(url,data={},method='GET'){
	return new Promise(async(resolve)=>{
		const [error,res]=await uni.request({url,data,method})
		if(error){
			console.log(error)
			uni.showToast({
				title: '网络请求失败'
			})
		}else{
			resolve(res.data)
		}
	})
}