// pages/zuoye/filterPage/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    query: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initEventListener()
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
  initEventListener: function () {
    const self = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on("setQuery", function (data) {
      self.setData({
        query: data
      })
    })
  },
  onFilterSure: function (e) {
    console.log(e)
    let self = this
    const {
      detail
    } = e
    this.setData({
      show: false
    })
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit("queryDone", detail)
    wx.navigateBack({
      delta: 0,
    })
  }
})