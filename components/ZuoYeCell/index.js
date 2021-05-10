// components/ZuoYeCell/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    data: {}
  },
  pageLifetimes: {
    show() {
      console.log(this.properties.data)
      this.setData({
        data: this.properties.data
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})