// pages/zuoye/zuoye.js

const {
  getQuestionList
} = require("../../../services/question")

const { getZuoYeShareList } = require("../../../services/zuoye")

const {
  getSubjectTree
} = require("../../../services/common")
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
    show: false,
    isMine: true,
    query: {},
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: getApp().globalData.userInfo
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
    console.log(this.selectComponent("#list"))
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
  cellTap: function (event) {
    const {
      target: {
        dataset: {
          cell
        }
      }
    } = event
    wx.navigateTo({
      url: `/pages/tiku/detail/index?id=${cell.id}`,
    })
  },
  toCreate: function () {
    wx.navigateTo({
      url: `/pages/zuoye/create/index`,
    })
  },
  refresh: function (e, query = {}) {
    this.loadList("refreshing", 1, 10)

  },
  toLoad: function (event) {
    if (this.data.canLoadMore) {
      this.loadList("loading", this.data.pageNum + 1, this.data.pageSize)
    }

  },
  changeListType: function () {
    this.setData({
      isMine: !this.data.isMine
    })
    this.refresh(null, {
      queryType: !this.data.isMine ? 1 : 2
    })
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
          console.log('=============queryDone=======================');
          console.log(data);
          console.log('====================================');
          self.setData({
            query: data
          })
          self.loadList("refreshing", 1, 10, data)
        }
      }
    })
  },
  loadList: function (callKey, pageNum, pageSize) {
    this.setData({
      [callKey]: true
    })
    const query = this.data.query
    getQuestionList({
      pageNum,
      pageSize,
      status: 2,
      ...query,
      leafNodeIds: query.leafNodeIds || (this.data.userInfo.grades.length > 0 ? this.data.userInfo.grades[0] : ''),
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
  }
})