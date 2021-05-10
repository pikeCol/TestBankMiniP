Component({
  options: {
    multipleSlots: true, // 在组建定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    refreshing: {
      type: Boolean,
      value: false
    },
    loading: {
      type: Boolean,
      value: false
    },
    showLoadMore: {
      type: Boolean,
      value: false
    }
  },
  /**组件所在页面的生命周期声明对象 */
  pageLifetimes: {
    show() { // 页面被展示
      this.triggerEvent("refresh", true)
    },
  },
  /**
   * 组件的初始数据
   */
  data: {},
  /**自定义方法 */
  methods: {
    refresh: function (e) {
      console.log(e)
      this.triggerEvent("refresh", true)
    },
    loadMore: function (e) {
      this.triggerEvent("loadMore", true)
    }
  }
})