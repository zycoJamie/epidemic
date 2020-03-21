<template>
	<view>
		<view class="location-info">您所在的城市：{{province}}，{{city}}</view>
		<view :style="{paddingLeft:'10rpx'}">
			<link-button @linkClick="toPage">查看全国</link-button>
		</view>
		<view class="wrap">
			<map ref="mapCom" :province="curProvince" mapId='map1'></map>
		</view>
		<info-list v-if="curAreaData && curAreaData.cities" :listTitle="listTitle" :listData="curAreaData.cities || []" :isCity="true"></info-list>
	</view>
</template>

<script>
	import {mapMutations} from 'vuex'
	import map from '../../components/map.vue'
	import { getEpidemic } from '../../api/index.js'
	import uniList from '@dcloudio/uni-ui/lib/uni-list/uni-list.vue'
	import uniListItem from '@dcloudio/uni-ui/lib/uni-list-item/uni-list-item.vue'
	import linkButton from '../../components/link-button.vue'
	import {addCache,getCache} from '../../utils/cache.js'
	import infoList from '../../components/info-list.vue'
	
	export default {
		components:{
			map,uniList,uniListItem,linkButton,infoList
		},
		data() {
			return {
				listTitle:['城市','确诊','疑似','死亡','治愈'],
				curProvince:'',
				data:'',
				curAreaData:'',
				mapData:[],
			}
		},
		computed:{
			city(){
				return this.$store.state.city
			},
			province(){
				return this.$store.state.province
			}
		},
		watch:{
			'curProvince':{
				handler:function(n,o){
					this.showInfo()
				}
			},
			'data':{
				handler:function(n,o){
					this.showInfo()
				}
			}
		},
		onLoad() {
			this.init()
		},
		onReady() {
			const data=getCache()
			const time=getCache('time')
			let date=new Date()
			
			if(!data || time!=(date.getMonth()+1+'.'+date.getDate())){
				this._getEpidemic()
			}else{
				this.data=data
				this.updateChinaData(this.data)
			}
		},
		onHide() {

		},
		onShow(){
			
		},
		methods: {
			...mapMutations(['updateChinaData']),
			init(){
				let _this=this
				uni.authorize({
				    scope: 'scope.userLocation',
				    success() {
				        console.log('成功授权地理位置')
						uni.showLoading({
						    title: '努力加载中'
						})
						uni.getLocation({
						    type: 'gcj02',
						    success: function (res) {
						        console.log('当前位置的经度：' + res.longitude)
						        console.log('当前位置的纬度：' + res.latitude)
								_this.$mapSdk.reverseGeocoder({
									location: {
										latitude:res.latitude,
										longitude:res.longitude,
									},
									success(res){
										console.log(res)
										_this.curProvince=res.result.ad_info.province
										_this.$store.commit('updateCity',res.result.ad_info.city)
										_this.$store.commit('updateProvince',res.result.ad_info.province)
									},
									fail(error){
										console.error(error)
									},
									complete(){
										uni.hideLoading()
									}
								})
						    },
							fail(){
								uni.showToast({
									title:'获取位置信息失败，请检查是否打开GPS'
								})
							}
						})
				    },
					fail(){
						uni.showToast({
						    title: '请授权地理位置才能使用完整功能'
						})
					}
				})
			},
			async _getEpidemic(){
				const res=await getEpidemic()
				let date=new Date()
				if(res.code===200){
					this.data=res.newslist
					addCache(res.newslist)
					addCache(date.getMonth()+1+'.'+date.getDate(),'time')
					this.updateChinaData(this.data)
				}
			},
			showInfo(){
				if(this.data && this.curProvince){
					this.data.map(item=>{
						if(this.curProvince.indexOf(item['provinceName'])!==-1){
							this.curAreaData=item
							console.log(item)
							Array.prototype.push.apply(this.mapData,this.curAreaData.cities.map(i=>{
								return {name:i.cityName,value:i.confirmedCount}
							}))
							console.log('mapData',this.mapData)
							setTimeout(()=>{
								this.$refs['mapCom'].loadData(this.mapData)
							},100)
						}
					})
				}
			},
			toPage(){
				uni.navigateTo({
					url:'/pageB/all/all'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	$margin:30rpx;
	$p-left:10rpx;
	.wrap {
	  width: 100%;
	  height: 750rpx;
	}
	
	.location-info{
		font-size: 0.8em;
		padding-left: $p-left;
	}
</style>
