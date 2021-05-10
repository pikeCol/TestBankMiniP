const { throttle } = require("../utils/util")

const globalProperty = {
  urlMain: 'https://www.sengloo.com/api/'
  // urlMain: 'https://ashuteacher-daily.aliqi.club/api/'
}
const toLogin = throttle(() => {
  wx.navigateTo({
    url: '/pages/login/index',
  })
}, 10000)
const request = ({
  url,
  method,
  header,
  data
}) => {

  // 获取全局配置
  const merginHeader = {
    ...header
  }
  if (getApp().globalData.token) {
    merginHeader.token = getApp().globalData.token
  }
  
  return new Promise((resolve, reject) => {

    try {
      wx.request({
        url: globalProperty.urlMain + url,
        method,
        header: {
          ...merginHeader,
          way:'weChat'
        },
        data,
        success: (response) => {
          const {
            data
          } = response
          const {
            code
          } = data
          if (code === 403 || code === 401) {
            // 需要重新获取token
            toLogin()
          }
          resolve(response.data)
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}
module.exports = {
  request
}