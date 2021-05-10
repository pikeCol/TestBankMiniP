// components/Collapse/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    contents: {
      type: Array,
      value: []
    },
    title: {
      type: String,
      value: ''
    },
    num: {
      type: Number,
      value: 0
    },
    score: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    labelTap: function() {
      this.setData({
        show: !this.data.show
      })
    }
  }
})