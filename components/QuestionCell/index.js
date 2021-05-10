// components/QuestionCell/index.js
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
    contentEnum: {
      "1": '选择题',
      "2": '多选题',
      "3": '填空题',
      "4": '判断题',
      "5": '解答题',
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    collect: function (e) {

    },
    support: function (e) {

    }
  }
})