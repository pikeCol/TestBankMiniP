// pages/zuoye/paperSelect/index.js
const {
  getSubjectTree
} = require("../../../services/common")
const {
  updateZuoYePaper,
  createZuoYePaper
} = require("../../../services/zuoye")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contents: [],
    show: false,
    ranges: {},
    slideButtons: [{
        text: '上移'
      },
      {
        text: '设置'
      },
      {
        text: '删除',
        type: 'warn',
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const defaultContents = [{
        key: '1',
        name: '选择题'
      },
      {
        key: '2',
        name: '填空题'
      },
      {
        key: '3',
        name: '多选题'
      },
      {
        key: '4',
        name: '解答题'
      },
    ]
    let self = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on("setPaperDefault", function ({
      formData,
      detail
    }) {
      let contents = defaultContents
      if (detail && detail.content) {
        contents = Object.keys(detail.content).map(x => {
          return {
            ...detail.content[x],
            name: x
          }
        })
      }
      self.setData({
        formData,
        detail,
        contents
      })
    })
    getSubjectTree().then(res => {
      if (res.code < 300) {
        self.data.ranges.subject = res.data
        self.setData({
          ranges: {
            ...self.data.ranges
          }
        })
      }
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
  slideButtonTap(e) {
    console.log('slide button tap', e.detail)
    console.log('slide button tap', e.target.dataset.index)
    const {
      index
    } = e.detail
    let now = e.target.dataset.index
    if (index === 0) {
      // 上移
      let next = Math.max(0, now - 1)
      if (now === next) return
      let temp = this.data.contents[next]
      let tempArr = this.data.contents.slice()
      tempArr[next] = tempArr[now]
      tempArr[now] = temp

      this.setData({
        contents: [...tempArr]
      })
    }
    if (index === 2) {
      let tempArr = this.data.contents.slice()
      tempArr.splice(now, 1)
      this.setData({
        contents: [...tempArr]
      })
    }
    if (index === 1) {
      // 设置
      this.toSetting(now)
    }
  },
  addBig: function () {
    this.toSetting()
  },
  save: function () {
    console.log(this.data.formData)
    console.log(this.data.detail)
    console.log(this.data.contents)
    const {
      detail,
      formData,
      contents
    } = this.data
    // Format Params
    const content = {}
    contents.map(x => {
      content[x.name] = {
        ids: x.ids,
        score: x.score
      }
    })
    const params = {
      content,
      difficultyLevel: 1,
      leafNodeIds: [formData.class],
      nodeIds: [formData.subject, formData.version, formData.class],
      paperName: formData.paperName,
      type: formData.type
    }
    let fn
    if (detail && detail.id) {
      // Update
      params.id = detail.id
      fn = updateZuoYePaper(params)
    } else {
      // Create
      fn = createZuoYePaper(params)
    }
    fn && fn.then(res => {
      wx.showToast({
        title: '保存成功',
      })
      wx.navigateBack({
        delta: 10,
      })
    })
  },

  toSetting: function (index = undefined) {
    let self = this
    wx.navigateTo({
      url: '/pages/zuoye/bigQuestionSet/index',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
          let contents = self.data.contents.slice()
          if (index !== undefined) {
            contents[index] = data
          } else {
            contents.push(data)
          }

          self.setData({
            contents: [...contents]
          })
        },
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        if (index !== undefined) {
          res.eventChannel.emit('acceptDataFromOpenerPage', self.data.contents[index])
        }
      }
    })
  },
  cellTap: function (e) {
    const {
      target: {
        dataset: {
          index
        }
      }
    } = e
    const self = this
    const select = this.data.contents[index]
    console.log(select)
    let hasSelectIds = []
    this.data.contents.map((x, i) => {
      if (i !== index) {
        hasSelectIds = [...hasSelectIds, ...(x.ids || [])]
      }
    })
    wx.navigateTo({
      url: '/pages/zuoye/bigQuetionDetail/index',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        if (select) {
          res.eventChannel.emit('acceptDataFromOpenerPage', {
            selectIds: select.ids || [],
            hasSelectIds
          })
        }
      },
      events: {
        onContentsChange: function (contents) {
          console.log(contents)
          self.data.contents[index].ids = contents
          self.setData({
            contents: [...self.data.contents]
          })
          console.log(index)
        }
      }
    })

  }
})