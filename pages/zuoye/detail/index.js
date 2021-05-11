const {
  getZuoYeDetail,
  cancelZuoYeShare,
  deleteZuoYe
} = require("../../../services/zuoye")
const {
  updateZuoYePaper,
  createZuoYePaper,
  printPaper
} = require("../../../services/zuoye")
// pages/zuoye/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }],
    content: [],
    detail: {},
    id: null,
    isMine: true, // 是否是自己的题目
    isCollect: false, // 是否已经收藏
    dialogShow: false,
    typeEnum: {
      '1': '试卷',
      '2': '练习题'
    },
    contentEnum: {
      "1": '选择题',
      "2": '多选题',
      "3": '填空题',
      "4": '判断题',
      "5": '解答题',
    },
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
    ],
    groups: [
      // {
      //   text: '共享',
      //   value: 1
      // },
      // {
      //   text: '打印',
      //   value: 2
      // },
      {
        text: '删除',
        type: 'warn',
        value: 3
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.loadDetail(options.id)
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
  // 数据加载
  loadDetail: function (id) {
    wx.showLoading({
      title: '加载中',
    })
    getZuoYeDetail({
      id
    }).then(res => {
      wx.hideLoading()
      this.setData({
        content: Object.keys(res.data.content).map(x => {
          return {
            name: x,
            ...res.data.content[x]
          }
        }),
        detail: res.data
      })
    })
  },
  // 跳转编辑
  toEdit: function () {
    let self = this
    wx.navigateTo({
      url: `/pages/zuoye/create/index`,
      success: function (res) {
        res.eventChannel.emit("setDetail", self.data.detail)
      }
    })
  },
  // 删除
  toDelete: function () {
    this.setData({
      dialogShow: true
    })
  },
  tapDialogButton(e) {
    console.log(e)
    this.setData({
      dialogShow: false,
    })
    const {
      detail: {
        index
      }
    } = e
    if (index) {
      // 删除
      wx.showLoading({
        title: '加载中',
      })
      deleteZuoYe({
        id: this.data.id
      }).then(res => {
        wx.hideLoading()
        if (res.code < 300) {
          wx.navigateBack({
            delta: 0,
          })
          wx.showToast({
            icon: 'success',
            title: '删除成功',
          })
        }
      })
    }
  },
  toPrint: function () {
    wx.showLoading()
    printPaper({
      id: this.data.id
    }).then(res => {
      wx.hideLoading()
      if (res.code < 300) {
        wx.showToast({
          title: '已发送试卷到关联邮箱！',
        })
      }
    })
  },
  // 共享 OR 取消共享
  toShare: function () {
    cancelZuoYeShare({
      id: this.data.id,
      status: 6
    }).then(res => {

    })
  },
  // 收藏 OR 取消收藏
  toCollect: function () {

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
    const select = this.data.content[index]
    console.log(select)
    let hasSelectIds = []
    this.data.content.map((x, i) => {
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
        onContentsChange: function (content) {
          console.log(content)
          self.data.content[index].ids = content
          self.setData({
            content: [...self.data.content]
          })
          console.log(index)
        }
      }
    })

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
      let temp = this.data.content[next]
      let tempArr = this.data.content.slice()
      tempArr[next] = tempArr[now]
      tempArr[now] = temp

      this.setData({
        content: [...tempArr]
      })
    }
    if (index === 2) {
      let tempArr = this.data.content.slice()
      tempArr.splice(now, 1)
      this.setData({
        content: [...tempArr]
      })
    }
    if (index === 1) {
      // 设置
      this.toSetting(now)
    }
  },
  save: function () {
    console.log(this.data.formData)
    console.log(this.data.detail)
    console.log(this.data.content)
    const {
      detail,
      formData,
      content
    } = this.data
    // Format Params
    const contenta = {}
    content.map(x => {
      contenta[x.name] = {
        ids: x.ids,
        score: x.score
      }
    })
    const params = {
      content: contenta,
      // difficultyLevel: 1,
      // leafNodeIds: [formData.class],
      // nodeIds: [formData.subject, formData.version, formData.class],
      // paperName: formData.paperName,
      // type: formData.type
    }
    let fn
    if (detail && detail.id) {
      // Update
      params.id = detail.id
      fn = updateZuoYePaper(params)
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
  addBig: function () {
    this.toSetting()
  },
  showMore: function () {
    this.setData({
      showActionsheet: true
    })
  },
  btnClick(e) {
    const {
      detail: {
        value
      }
    } = e
    console.log(value)
    console.log(e.detail.value)
    switch (value) {
      case 1:
        // 分享
        this.toShare()
        break;
      case 2:
        // 打印
        this.toPrint()
        break;
      case 3:
        // 删除
        this.toDelete()
        break;
    }
    this.close()
  },
  close: function () {
    this.setData({
      showActionsheet: false
    })
  },
  toSetting: function (index = undefined) {
    let self = this
    wx.navigateTo({
      url: '/pages/zuoye/bigQuestionSet/index',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
          let content = self.data.content.slice()
          if (index !== undefined) {
            content[index] = data
          } else {
            content.push(data)
          }

          self.setData({
            content: [...content]
          })
        },
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        if (index !== undefined) {
          res.eventChannel.emit('acceptDataFromOpenerPage', self.data.content[index])
        }
      }
    })
  },
})