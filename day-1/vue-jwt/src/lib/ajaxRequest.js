import axios from 'axios';


// 每个请求的拦截器方法可能不一样

class AjaxRequest {
  constructor() {
    this.baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '/';
    this.timeout = 2000;
  }

  request(config) { // 用户请求设置的方法
    const instance = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
    });
    // 设置拦截器
    instance.interceptors.request.use((config) => {
      console.log(1);
      config.headers.Authorization = localStorage.getItem('token');
      return config;
    }, err => Promise.reject(err));
    instance.interceptors.request.use((config) => {
      config.headers.Authorization = localStorage.getItem('token');
      return config;
    }, err => Promise.reject(err));
    // 设置响应拦截器
    instance.interceptors.response.use(res => res.data, err => Promise.reject(err));

    return instance(config);
  }
}

export default new AjaxRequest();
