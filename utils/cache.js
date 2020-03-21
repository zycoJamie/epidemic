export const addCache=(val,key='public')=>{
	uni.setStorage({
		key,
		data:val,
		success(){
			console.log('添加缓存成功')
		},
		fail(error){
			console.log('添加缓存失败',error)
		}
	})
}

export const rmCache=(key)=>{
	if(!key){
		uni.clearStorage()
		console.log('清空缓存')
	}else{
		uni.removeStorage({
			key,
			success(res){
				console.log('清除缓存成功',res)
			},
			fail(error){
				console.log('清除缓存失败',error)
			}
		})
	}
}

export const getCache=(key='public')=>{
	try {
	    const value = uni.getStorageSync(key);
	    if (value) {
			console.log(value)
	        return value
	    }
	} catch (e) {
	    // error
		console.log('获取缓存失败',e)
	}
	return ''
}