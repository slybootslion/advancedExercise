import axios from 'axios'

const config = {
  baseURL: 'http://localhost:10003/',
  timeout: 15000,
  crossDomain: true,
  method: 'get',
  validateStatus (status) {
    return status >= 200 && status < 500
  }
}

const instanceAxios = axios.create(config)

instanceAxios.interceptors.request.use(config => {
  if (!config.url) {
    throw new Error({ source: 'axiosInterceptors' })
  }

  config.method = config.method.toLowerCase()

  // 防止字段用错
  if (['get', 'delete'].includes(config.method)) {
    if (!config.params) {
      config.params = config.data || {}
    }
  } else if (['post', 'put', 'patch'].includes(config.method)) {
    if (!config.data) {
      config.data = config.params || {}
    }
  }

  // 判断是否包含文件类型
  if (config.method === 'post') {
    let hasFile = false
    Reflect.ownKeys(config.data).forEach(key => {
      if (typeof config.data[key] === 'object') {
        const item = config.data[key]
        if (item instanceof FileList || item instanceof File || item instanceof Blob) {
          hasFile = true
        }
      }
    })

    // 检测到存在文件使用 FormData 提交数据
    if (hasFile) {
      const formData = new FormData()
      Object.keys(config.data).forEach(key => {
        formData.append(key, config.data[key])
      })
      config.data = formData
    }
  }

  return config
})

instanceAxios.interceptors.response.use(
  async res => {
    const { errorCode, message, data } = res.data
    // 没有异常
    //   res.status.toString().charAt(0)
    if (res.status.toString()[0] === '2') {
      if (message && message !== 'ok') {
        console.log(message)
      }
      return data
    }
    // 服务器主动抛出的异常
    console.log(errorCode)
    console.log(message)
    return false
  },
  error => {
    // 没有返回错误内容
    if (!error.response) {
      console.log('error')
    }

    // 请求超时
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      console.log('error timeout')
    }

    if (error.response.data.message) {
      console.log('error', error.response.data.message)
    }

    return Promise.reject(error)
  })

export default instanceAxios
