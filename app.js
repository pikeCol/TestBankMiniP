const {
  getOpenId,
  getPhone,
  getUserInfo
} = require("./services/user")

//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    let token = wx.getStorageSync('token')
    this.globalData.token = token
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res)
        getOpenId({
          code: res.code
        }).then(r => {
          console.log(r)
          this.globalData.openId = r.data.openId
          this.globalData.sessionRedisKey = r.data.sessionRedisKey
          this.globalData.token = r.data.token
          wx.setStorageSync('token', r.data.token)
          return getUserInfo()
        }).then(res => {
          console.log(res)
          if(res.code < 300) {
            this.globalData.userInfo = {
              ...res.data
            }
          }
        })

      }
    })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     console.log(res)
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo
    //           console.log(res.userInfo)
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    userInfo: {},
    token: null,
    openId: null,
    sessionRedisKey: null
  }
})