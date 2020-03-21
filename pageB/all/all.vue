<template>
	<view>
		<view class="wrap">
			<map ref="mapCom" :province="'china'" mapId='map2'></map>
		</view>
		<view class="grid">
			<uni-grid :column="3" :show-border="false"  :square="false">
			    <uni-grid-item index="confirmedCount">
					<text class="text-second">新增&nbsp;<text>{{nationalScope.confirmedIncr | confirmedIncr}}</text></text>
			        <text class="text-red">{{nationalScope.confirmedCount}}</text>
			        <text class="text">全国累计确诊</text>
			    </uni-grid-item>
				<uni-grid-item index="currentConfirmedCount">
					<view>
						<view class="divider" :style="{float:'left'}"><view></view></view>
						<view class="divider" :style="{float:'right'}"><view></view></view>	
						<view class="text-second">{{nationalScope.currentConfirmedIncr | currentConfirmedIncr}}<text>{{nationalScope.currentConfirmedIncr}}</text></view>
						<view class="text-red">{{nationalScope.currentConfirmedCount}}</view>
						<view class="text">全国现存确诊</view>
					</view>
				</uni-grid-item>
			    <uni-grid-item index="seriousCount">
					<text class="text-second">{{nationalScope.seriousIncr | seriousIncr}}<text>{{nationalScope.seriousIncr}}</text></text>
			    	<text class="text-red">{{nationalScope.seriousCount}}</text>
			    	<text class="text">全国现存重症</text>
			    </uni-grid-item>
				
				<uni-grid-item index="suspectedCount">
					<text class="text-second">{{nationalScope.suspectedIncr | suspectedIncr}}<text>{{nationalScope.suspectedIncr}}</text></text>
					<text class="text-red">{{nationalScope.suspectedCount}}</text>
					<text class="text">全国现存疑似</text>
				</uni-grid-item>
				<uni-grid-item index="curedCount">
					<view>
						<view class="divider" :style="{float:'left'}"><view></view></view>
						<view class="divider" :style="{float:'right'}"><view></view></view>
						<view class="text-second">新增&nbsp;<text>{{nationalScope.curedIncr | curedIncr}}</text></view>
						<view class="text-red">{{nationalScope.curedCount}}</view>
						<view class="text">全国累计治愈</view>
					</view>
				</uni-grid-item>
				<uni-grid-item index="deadCount">
					<text class="text-second">新增&nbsp;<text>{{nationalScope.deadIncr | deadIncr}}</text></text>
					<text class="text-red">{{nationalScope.deadCount}}</text>
					<text class="text">全国累计死亡</text>
				</uni-grid-item>
			</uni-grid>
		</view>
		<info-list :listTitle="listTitle" :listData="data || []" :isCity="false"></info-list>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import map from '../../components/map.vue'
	import uniGrid from '@dcloudio/uni-ui/lib/uni-grid/uni-grid.vue'
	import uniGridItem from '@dcloudio/uni-ui/lib/uni-grid-item/uni-grid-item.vue'
	import {getNationalScope} from '../../api'
	import {getCache, addCache} from '../../utils/cache.js'
	import infoList from '../../components/info-list.vue'
	
	export default {
		components:{
			map,uniGrid,uniGridItem,infoList
		},
		computed:{
			...mapState({
				data:(state)=>state.chinaData
			})
		},
		data() {
			return {
				listTitle:['省份','确诊','疑似','死亡','治愈'],
				mapData:null,
				nationalScope:''
			}
		},
		filters:{
			confirmedIncr(confirmedIncr){
				return `+${confirmedIncr}`
			},
			currentConfirmedIncr(currentConfirmedIncr){
				return currentConfirmedIncr>0?`新增 +`:`减少 `
			},
			seriousIncr(seriousIncr){
				return seriousIncr>0?'新增 +':`减少 `
			},
			suspectedIncr(suspectedIncr){
				return suspectedIncr>0?`新增 +`:`减少 `
			},
			curedIncr(curedIncr){
				return `+${curedIncr}`
			},
			deadIncr(deadIncr){
				return `+${deadIncr}`
			}
		},
		onLoad(){
			console.log('全国页面',this.data)
		},
		onReady(){
			this.initData()
			this._getNationalScope()
		},
		onUnload() {
			console.log('onUnload')
			// this.$refs['mapCom'].clear()
		},
		methods: {
			initData(){
				// const mapData=this.data.list.map(province=>{
				// 	let name=province.match(/\S{1,}(?=\s)/)[0]
					
				// 	let value=province.match(/(?<=确诊\s*)\d{1,}(?=\s)/)[0]
				// 	return {
				// 		name,
				// 		value
				// 	}
				// })
				const mapData=this.data.map(province=>{
					return {
						name:province.provinceShortName,
						value:province.confirmedCount
					}
				})
				this.mapData=mapData
				setTimeout(()=>{
					this.$refs['mapCom'].loadData(mapData,true)
				},200)
			},
			async _getNationalScope(){
				const nationalScope=getCache('all')
				if(!nationalScope){
					const res=await getNationalScope()
					if(res.code===200){
						this.nationalScope=res.newslist[0].desc
						addCache(res.newslist[0].desc,'all')
					}else{
						uni.showToast({
							title:'获取全国详细数据失败'
						})
					}
				}else{
					let date=new Date(nationalScope.modifyTime)
					let curDate=new Date()
					if(date.getMonth()!=curDate.getMonth() || date.getDate()!=curDate.getDate()){
						const res=await getNationalScope()
						if(res.code===200){
							this.nationalScope=res.newslist[0].desc
							addCache(res.newslist[0].desc,'all')
						}else{
							uni.showToast({
								title:'获取全国详细数据失败'
							})
						}
					}else{
						this.nationalScope=nationalScope
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
	  width: 100%;
	  height: 750rpx;
	}
	.grid{
		width: 750rpx;
		.divider{
			width: 2px;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			view{
				background-color: #e1e1e1;
				width: 1px;
				height: 40%;
			}
		}
		.text{
			text-align: center;
			color: #000;
			font-size: 16px;
		}
		.text-second{
			text-align: center;
			color: grey;
			font-size: 13px;
			text{
				color: red;
			}
		}
		.text-red{
			text-align: center;
			color: red;
			font-size: 20px;
		}
		uni-grid-item{
			margin-bottom: 10px;
		}
	}
</style>
