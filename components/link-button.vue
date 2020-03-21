<template>
	<view>
		<button type="primary" hover-class="none" @click="handler">
			<slot></slot>
		</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods:{
			handler(){
				this.$emit('linkClick')
			}
		}
	}
</script>

<style lang="scss" scoped>
	button{
		background-color: #FFFFFF;
		// text-decoration: underline;
		display: inline;
		color: green;
		font-size: 0.8em;
		padding-left: 0rpx;
		&::after{
			border: none;
		}
	}
</style>
