import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import TreeTable from 'vue-table-with-tree-grid'

//引用 富文本
import VueQuillEditor from 'vue-quill-editor'
// 引入相关css
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor);


//注册table-tree组件
Vue.component('tree-table', TreeTable)
//导入element ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//引入并使用axios
import axios from 'axios';
import VueAxios from 'vue-axios'
//设置根路径
axios.defaults.baseURL = 'http://www.chenfuguo.cn:8899/api/private/v1'
Vue.use(VueAxios, axios)


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  let token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response.data;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

//定义一个全局的时间过滤器
Vue.filter("dateFormat", function (originVal) {
  let dt = new Date(originVal);
  let y = dt.getFullYear();
  let m = (dt.getMonth() + 1 + '').padStart(2, '0');
  let d = (dt.getDate() + '').padStart(2, '0');
  let hh = (dt.getHours() + '').padStart(2, '0');
  let mm = (dt.getMinutes() + '').padStart(2, '0');
  let s = (dt.getSeconds() + '').padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}:${s}`
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
