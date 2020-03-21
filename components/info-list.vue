<template>
	<view>
		<view class="info-title">
			<text v-for="item of listTitle" :key="item">{{item}}</text>
		</view>
		<view class="info-list">
			<view :class="{'info-list-item':true,'focus-item':isCity?city.indexOf(item.cityName)!==-1:province.indexOf(item.provinceName)!==-1}" 
			v-for="(item,index) of listData" 
			:key="index">
				<text>{{item.cityName || item.provinceName}}</text>
				<text class="confirmed">{{item.confirmedCount}}</text>
				<text class="suspected">{{item.suspectedCount}}</text>
				<text class="dead">{{item.deadCount}}</text>
				<text class="cured">{{item.curedCount}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		name:"info-list",
		props:{
			listTitle:{
				type:Array,
				required:true
			},
			listData:{
				type:Array,
				default:()=>[]
			},
			isCity:{
				type:Boolean,
				default:true
			}
		},
		computed:{
			...mapState(['city','province'])
		}
	}
</script>

<style lang="scss" scoped>
	.info-title{
		display: flex;
		text{
			flex: 1;
			text-align: center;
			margin: 10rpx;
		}
	}
	.info-list{
		.info-list-item{
			display: flex;
			font-size: 0.8em;
			text{
				flex: 1;
				text-align: center;
				margin: 10rpx;
			}
			.confirmed{
				color: red;
			}
			.suspected{
				color: rgba($color: #e7ea25, $alpha: 1.0);
			}
			.dead{
				color: black;
			}
			.cured{
				color: rgba($color: #1cd822, $alpha: 1.0);
			}
		}
		.focus-item{
			background-color: rgba($color: #000000, $alpha: 0.2);
		}
		
	}
</style>
