const {
  getQuestionList
} = require("../../../services/question")
const {
  request
} = require("../../../services/basic")

// pages/zuoye/selectQuesitons/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    pageNum: 1,
    pageSize: 10,
    refreshing: false,
    showLoadMore: false,
    canLoadMore: false,
    loading: false,
    slideButtons: [{
        text: '上移'
      },
      {
        text: '下移'
      },
      {
        text: '取消选择'
      },
    ],
    contentEnum: {
      "1": '选择题',
      "2": '多选题',
      "3": '填空题',
      "4": '判断题',
      "5": '解答题',
    },
    selectIds: [],
    hasSelectIds: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    let self = this
    eventChannel.on('acceptDataFromOpenerPage', function (data = {}) {
      console.log(data)
      const {
        selectIds = [], hasSelectIds = [], query
      } = data
      self.setData({
        selectIds,
        hasSelectIds,
        query
      })
      self.loadList("refreshing", 1, 10, query)
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
    console.log('aaaaa')
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
  loadList: function (callKey, pageNum, pageSize, query) {
    // format query
    const formatQuery = (q) => {
      let keys = ['course',
        'unit',
        'class',
        'version',
        'subject',
      ]
      let last = keys.find(key => q.hasOwnProperty(key))
      let result = {
        ...q
      }
      if (last) {
        result.leafNodeIds = q[last]
      }
      return result

    }
    this.setData({
      [callKey]: true
    })
    getQuestionList({
      pageNum: pageNum,
      pageSize: pageSize,
      ...formatQuery(query)
    }).then(res => {
      if (res.code < 300) {
        let format = res.data.records.map(x => this.formatQuestionItem(x))
        this.setData({
          list: [...this.data.list, ...format],
          pageNum,
          pageSize,
          canLoadMore: format.length >= pageSize,
          [callKey]: false
        })
      }
    })
  },
  save: function () {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('acceptDataFromOpenedPage', this.data.selectIds);
    wx.navigateBack()
  },
  select: function (e) {
    const {
      target: {
        dataset: {
          index
        }
      }
    } = e
    const selectIds = this.data.selectIds.slice()
    const selectedItem = this.data.list[index]
    const hasSelect = selectIds.findIndex(x => x === selectedItem.id)
    if (hasSelect !== -1) {
      selectIds.splice(hasSelect, 1)
      selectedItem.selectType = 0
    } else {
      selectIds.push(selectedItem.id)
      selectedItem.selectType = 1
    }
    this.setData({
      selectIds: [...selectIds],
      list: [...this.data.list]
    })
  },
  formatQuestionItem: function (item) {
    let selected = this.data.selectIds.findIndex(x => item.id === x)
    if (selected !== -1) {
      item.selectType = 1
      return item
    }
    selected = this.data.hasSelectIds.findIndex(x => item.id === x)
    if (selected !== -1) {
      item.selectType = 2
      return item
    }
    return item
  },
  toFilterPage: function (e) {
    let self = this
    wx.navigateTo({
      url: '/pages/zuoye/filterPage/index',
      success: function (res) {
        res.eventChannel.emit("setQuery", self.data.query)
      },
      events: {
        queryDone: function (data) {
          self.setData({
            query: data
          })
          self.loadList("refreshing", 1, 10, data)
        }
      }
    })
  },
  refresh: function (event) {
    this.loadList("refreshing", 1, 10, {})

  },
  toLoad: function (event) {
    if (this.data.canLoadMore) {
      this.loadList("loading", this.data.pageNum + 1, this.data.pageSize, {})
    }

  },
})