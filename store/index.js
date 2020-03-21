import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state={
	city:'深圳',
	province:'广东',
	chinaData:''
}

const mutations={
	updateCity(state,city){
		state.city=city
	},
	updateProvince(state,province){
		state.province=province
	},
	updateChinaData(state,data){
		state.chinaData=data
	}
}

export default new Vuex.Store({
	state,
	mutations
})