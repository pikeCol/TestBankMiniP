// pages/tiku/detail/index.js
const {
  topiCorrection,
} = require("../../../services/question")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    remark: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id
    })
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
  collect: function() {
    collectTopic({
      topicId: this.data.id
    }).then(res => {
      if (res.code < 300) {
        wx.showToast({
          title: '收藏成功'
        })
      }
    })
  },
  bindTextAreaBlur(e) {
    console.log(e);
    this.setData({
      remark: e.detail.value
    })
  },
  support() {
    wx.showModal({
      title: '提交',
      content: '确定提交吗？',
      success: () => {
        topiCorrection({
          remark: this.data.remark,
          topicId: this.data.id
        }).then(() => {
          wx.navigateBack();
        })
      }
    })
  },
  // bindTextAreaBlur: function(e) {
  //   console.log(e.detail.value)
  // },
})