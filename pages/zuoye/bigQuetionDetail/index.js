// pages/zuoye/bigQuetionDetail/index.js
const {
  getQuestionList
} = require("../../../services/question")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contents: [],
    selectIds: [],
    hasSelectIds: [],
    show: false,
    slideButtons: [{
        text: '上移'
      },
      {
        text: '下移'
      },
      {
        text: '取消选择'
      }
    ]
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
    let self = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      self.loadContents(data.selectIds)
      self.setData({
        selectIds: data.selectIds,
        hasSelectIds: data.hasSelectIds
      })
    })
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
  loadContents: function (ids = [-1]) {
    if(ids.length === 0) {
      ids = [-1]
    }
    getQuestionList({
      pageNum: 1,
      pageSize: 50,
      ids: ids.join(",")
    }).then(res => {
      if (res.code < 300) {
        this.setData({
          contents: res.data.records
        })
      }
    })
  },
  slideButtonTap(e) {
    const {
      index
    } = e.detail
    let now = e.target.dataset.index
    if (index === 0) {
      // 上移


    }
    if (index === 1) {
      // 设置
    }
    if (index === 2) {

    }

  },
  showFilter: function () {
    // this.setData({
    //   show: true
    // })
    let user = getApp().globalData.userInfo || {}
    this.onFilterSure({
      detail: user.defaultQuery || {}
    })
  },
  goback: function() {
    wx.navigateBack();
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
    
    wx.navigateTo({
      url: '/pages/zuoye/selectQuesitons/index',
      success: function (res) {
        res.eventChannel.emit("acceptDataFromOpenerPage",{
          selectIds: self.data.selectIds,
          hasSelectIds: self.data.hasSelectIds,
          query:detail
        })
      },
      events: {
        acceptDataFromOpenedPage: function (data) {
          self.loadContents(data)
          eventChannel.emit("onContentsChange", data)
          console.log('onContentsChange', data, eventChannel);
          self.setData({
            selectIds: data
          })
        },
      },
    })
  },
})