// #ifndef VUE3
import Vue from 'vue'
import App from './App'

// 导入网络请求的包
import {
    $http
} from '@escook/request-miniprogram'

// 挂载到uni中
uni.$http = $http

$http.baseUrl = 'https://www.uinav.com'

// 配置请求拦截器
$http.beforeRequest = function(options) {
    uni.showLoading({
        title: '数据加载中...'
    })
}

// 配置响应拦截器
$http.afterRequest = function() {
    uni.hideLoading()
}

// 封装showMsg方法
uni.$showMsg = function(title = '获取数据失败T_T', duration = 1000) {
    uni.showToast({
        duration,
        title,
        icon: 'none'
    })
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
    createSSRApp
} from 'vue'
import App from './App.vue'
export function createApp() {
    const app = createSSRApp(App)
    return {
        app
    }
}
// #endif
