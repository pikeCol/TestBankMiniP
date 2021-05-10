// pages/zuoye/create/index.js
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
    rules: [{
        name: 'paperName',
        rules: {
          required: true,
          message: '名称是必填的'
        }
      },
      {
        name: 'subject',
        rules: {
          required: true,
          message: '请选择科目'
        }
      },
      {
        name: 'version',
        rules: {
          required: true,
          message: '请选择教材版本'
        }
      },
      {
        name: 'class',
        rules: {
          required: true,
          message: '请选择年级'
        }
      },
      // {
      //   name: 'type',
      //   rules: {
      //     required: true,
      //     message: '请选择类型'
      //   }
      // },
    ],
    formData: {

    },
    treeData: [],
    subjectRange: [],
    versionRange: [],
    classRange: [],
    typeSelectIndex: null,
    typeRange: [{
        value: '1',
        title: '试卷'
      },
      {
        value: '2',
        title: '练习题'
      }
    ],
    detailData: undefined

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
    getSubjectTree().then(res => {
      if (res.code < 300) {
        this.formatTreeData(res.data)
      }
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
  formatTreeData: function (treeData) {
    let self = this
    this.setData({
      subjectRange: treeData
    }, () => {
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.on("setDetail", function (data) {
        console.log(data)
        self.setDetail(data)
      })
    })
  },
  formInputChange: function (e) {
    const {
      field
    } = e.currentTarget.dataset
    const input = e.detail.value
    this.setData({
      [`formData.${field}`]: input,
    })
  },
  bindSubjectChange: function (e) {
    const {
      field
    } = e.currentTarget.dataset
    const index = e.detail.value
    const select = this.data.subjectRange[index]
    this.setData({
      [`formData.${field}`]: select.id,
      subjectIndex: index,
      versionRange: select.children
    })
  },
  bindVersionChange: function (e) {
    const {
      field
    } = e.currentTarget.dataset
    const index = e.detail.value
    const select = this.data.versionRange[index]
    this.setData({
      [`formData.${field}`]: select.id,
      versionIndex: index,
      classRange: select.children
    })
  },
  bindClassChange: function (e) {
    const {
      field
    } = e.currentTarget.dataset
    const index = e.detail.value
    const select = this.data.classRange[index]
    this.setData({
      [`formData.${field}`]: select.id,
      classIndex: index,
    })
  },
  bindTypeChange: function (e) {
    const {
      field
    } = e.currentTarget.dataset
    const index = e.detail.value
    const select = this.data.typeRange[index]
    this.setData({
      [`formData.${field}`]: select.value,
      typeSelectIndex: index
    })
  },
  setDetail: function (detail) {
    // 设置formData
    let formData = {
      paperName: detail.paperName,
      subject: detail.nodeIds[0],
      version: detail.nodeIds[1],
      class: detail.nodeIds[2],
      type: detail.type
    }
    // 计算出range
    let subjectIndex = this.data.subjectRange.findIndex(x => x.id === detail.nodeIds[0])
    let subject = this.data.subjectRange[subjectIndex]
    let versions = subject.children
    let versionIndex = versions.findIndex(x => x.id === detail.nodeIds[1])
    let classes = versions[versionIndex].children
    let classIndex = classes.findIndex(x => x.id === detail.nodeIds[2])
    this.setData({
      detailData: detail,
      formData,
      versionRange: versions,
      classRange: classes,
      subjectIndex,
      versionIndex,
      classIndex,
      typeSelectIndex: detail.type - 1
    })
  },
  submitForm: function () {
    let self = this
    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid', valid, errors)
      if (!valid) {} else {
        wx.navigateTo({
          url: '/pages/zuoye/paperSelect/index',
          success: (res) => {
            res.eventChannel.emit('setPaperDefault', {
              formData: self.data.formData,
              detail: self.data.detailData
            })
          }
        })
      }
    })
  },
  update: function () {
    const {
      detailData,
      formData,
      content
    } = this.data
    const params = {
      difficultyLevel: 1,
      leafNodeIds: [formData.class],
      nodeIds: [formData.subject, formData.version, formData.class],
      paperName: formData.paperName,
      type: formData.type
    }
    let fn
    if (detailData && detailData.id) {
      // Update
      params.id = detailData.id
      fn = updateZuoYePaper(params)
    }
    fn && fn.then(res => {
      if (res.code < 300) {
        wx.showToast({
          title: '保存成功',
        })
        wx.navigateBack({
          delta: 10,
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }

    })
  }
})