const {
  getPhone,
  getUserInfo
} = require("../../services/user")

// pages/login/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getPhoneNumber: function (e) {

    const {
      detail: {
        errMsg,
        iv,
        encryptedData
      }
    } = e
    getPhone({
      sessionRedisKey: getApp().globalData.sessionRedisKey,
      iv,
      encryptedData
    }).then(res => {
      if (res.code < 300) {
        getApp().globalData.token = res.data.token
        wx.setStorageSync('token', res.data.token)
        wx.navigateBack({
          delta: 0,
        })
        return getUserInfo()
      }
    }).then(res => {
      console.log(res)
      if (res.code < 300) {
        getApp().globalData.userInfo = {
          ...res.data
        }
      }
    })
  }
})