import Vue from 'vue'
import App from './App'
import store from './store'
import QQMapWX from './static/js/qqmap-wx-jssdk.min.js'
import pinyin from 'js-pinyin'

Vue.config.productionTip = false
Vue.prototype.$mapSdk=new QQMapWX({
	key:''
})
pinyin.setOptions({checkPolyphone: false, charCase: 0});
Vue.prototype.$pinyin=pinyin

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
