// pages/tiku/detail/index.js
const {
  getQuestionDetail,
  collectTopic,
} = require("../../../services/question")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    contentEnum: {
      "1": '选择题',
      "2": '多选题',
      "3": '填空题',
      "4": '判断题',
      "5": '解答题',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)

    this.setData({
      id: options.id
    }, () => this.loadDetail(options.id))
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
  support() {
    wx.navigateTo({
      url: `/pages/tiku/wrongPage/index?id=${this.data.id}`,
    })
  },
  loadDetail: function (id) {
    getQuestionDetail({
      id
    }).then(res => {
      if (res.code < 300) {
        this.setData({
          detail: res.data
        })
      }
    })
  }
})