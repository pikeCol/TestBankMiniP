// pages/zuoye/zuoye.js
const {
  paperDownList,
  getZuoYeShareList
} = require("../../../services/zuoye")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    pageNum: 1,
    pageSize: 10,
    refreshing: false,
    loading: false,
    canLoadMore: false,
    isMine: true,
    query: {},
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(getApp().globalData.userInfo);
  },

  onShow: function () {
    this.setData({
      userInfo: getApp().globalData.userInfo
    })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  toFilterPage: function (e) {
    let self = this
    wx.navigateTo({
      url: '/pages/zuoye/filterPage/index',
      success: function (res) {
        // res.eventChannel.emit("setQuery", self.data.query)
      },
      events: {
        queryDone: function (data) {
          // self.loadList('loading', 1, 10, data)
          self.setData({
            query: data
          })
          self.loadList("refreshing", 1, 10, data)
        }
      }
    })
  },
  cellTap: function (event) {
    console.log('点击', event)
    const {
      target: {
        dataset: {
          cell
        }
      }
    } = event
    wx.navigateTo({
      url: `/pages/zuoye/detail/index?id=${cell.id}`,
    })
  },
  toCreate: function () {
    wx.navigateTo({
      url: `/pages/zuoye/create/index`,
    })
  },
  refresh: function (e, query = {}) {
    this.loadList("refreshing", 1, 10, query)

  },
  toLoad: function (event) {
    if (this.data.canLoadMore) {
      this.loadList("loading", this.data.pageNum + 1, this.data.pageSize)
    }

  },
  changeListType: function(event) {
    let now = this.data.isMine
    this.setData({
      isMine: !now
    })
    this.refresh(null, {
      // queryType: !this.data.isMine ? 1 : 2
    })
  },
  loadList: function (callKey, pageNum, pageSize) {
    this.setData({
      [callKey]: true
    })
    const query = this.data.query
    if (this.data.isMine) {
      paperDownList({
        pageNum,
        pageSize,
        ...query
      }).then(res => {
        console.log(callKey, res)
        if (res.code < 300) {
          let list = pageNum > 1 ? this.data.list : []
          this.setData({
            "list": [...list, ...(res.data.records || [])],
            [callKey]: false,
            pageNum,
            pageSize,
            canLoadMore: res.data.records.length >= pageSize
          })
        }
      })
    } else {
      getZuoYeShareList({
        pageNum,
        pageSize,
        status: 6,
        leafNodeIds: this.data.userInfo.grades && this.data.userInfo.grades.length > 0 ? this.data.userInfo.grades[0] : '',
        ...query
      }).then(res => {
        console.log(callKey, res)
        if (res.code < 300) {
          let list = pageNum > 1 ? this.data.list : []
          this.setData({
            "list": [...list, ...(res.data.records || [])],
            [callKey]: false,
            pageNum,
            pageSize,
            canLoadMore: res.data.records.length >= pageSize
          })
        } else {
        }
      })
    }
    // getZuoYeList({
    //   pageNum,
    //   pageSize,
    //   ...query
    // }).then(res => {
    //   console.log(callKey, res)
    //   if (res.code < 300) {
    //     let list = pageNum > 1 ? this.data.list : []
    //     this.setData({
    //       "list": [...list, ...(res.data.records || [])],
    //       [callKey]: false,
    //       pageNum,
    //       pageSize,
    //       canLoadMore: res.data.records.length >= pageSize
    //     })
    //   } else {
    //   }
    // })
  }
})