<template>
	<view class="wrap">
		<mpvue-echarts @onInit="onInit" :canvasId="mapId" ref="mapChart" />
	</view>
</template>

<script>
	// 引入echarts, 注意需要修改mpvueEcharts中echarts.vue的源码，才能正常显示
	import * as echarts from 'echarts/dist/echarts.min'
	import mpvueEcharts from 'mpvue-echarts'
	
	export default {
		components:{
			mpvueEcharts
		},
		props:{
			province:{
				type:String
			},
			mapId:{
				type:String
			}
		},
		watch:{
			'province':{
				handler:function(n,o){
					if(!n){
						this.loadMap()
					}else{
						this.loadMap(n)
					}
				},
				immediate:true
			}
		},
		beforeCreate(){
			this.files=require.context('../static/json',true,/.json$/)
			this.mapJson=null
			this.mapChart=null
			this.option={
				series:{
					name:'epidemic',
					type:'map',
					mapType:'epidemic',
				}
			}
		},
		data() {
			return {
				echarts,
				onInit(e) {
					console.log('onInit map')
					let { width, height } = e;
					let canvas = this.$refs['mapChart'].canvas;
					echarts.setCanvasCreator(() => canvas);
					this.mapChart = echarts.init(canvas, null, {
						width: width,
						height: height
					});
					canvas.setChart(this.mapChart);
					this.mapChart.setOption(this.option);
					this.$refs['mapChart'].setChart(this.mapChart);
				}
			};
		},
		methods:{
			loadMap(province='广东省'){
				let mIndex=0
				if(province==='china'){
					this.files.keys().forEach((item,index)=>{
						if(item.indexOf(province)!==-1){
							mIndex=index
						}
					})
				}else{
					this.files.keys().map((item,index)=>{
						if(province==='陕西省' && item.indexOf('shanxi1')){
							mIndex=index
						}else if(item.indexOf(this.$pinyin.getFullChars(province.slice(0,-1)).toLowerCase())!==-1){
							mIndex=index
						}
					})
				}
				
				this.mapJson=this.files(this.files.keys()[mIndex])
				console.log('mapIndex:',mIndex,province)
				echarts.registerMap('epidemic',this.mapJson,{})
				if(this.mapChart){
					this.mapChart.setOption({
						series:{
							name:'epidemic',
							roam:true,
							zoom:1.25,
							label:{
								show:true,
								fontSize:10,
							}
						},
						
					})
				}
			},
			loadData(mapData,isAllOfChina=false){
				const option={
					tooltip:{
						trigger:'item',
						formatter:'{c}'
					},
					visualMap: {
						min: 0,
						max: 500,
						realtime: false,
						calculable: false,
						inRange: {
							color: ['white','red']
						}
					},
					series:{
						name:'epidemic',
						roam:true,
						zoom:1.25,
						label:{
							show:true,
							fontSize:10,
						},
						data:mapData
					},
				}
				if(this.mapJson && !isAllOfChina){
					this.mapJson.features.forEach(city=>{
						mapData=mapData.map(item=>{
							if(city.properties.name.replace(/自治州|市/,'').indexOf(item.name.replace(/州/,''))!==-1){
								item.name=city.properties.name
							}
							return item
						})
					})
					console.log(mapData)
					option.series.data=mapData
					this.mapChart.setOption(option)
				}else if(this.mapJson){
					Object.assign(option.visualMap,{
						max:2000,
						inRange: {
							color: ['white','red','#8B0000']
						}
					})
					Object.assign(option.series,{
						zoom:1.3,
					})
					this.mapChart.setOption(option)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
	  width: 750rpx;
	  height: 750rpx;
	}
</style>
