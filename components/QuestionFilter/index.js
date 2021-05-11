// components/Filter/index.js
const {
  getSubjectTree,
  getAllTags
} = require("../../services/common")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    defaultQuery: {
      type: Object,
      value: {}
    }
  },

  pageLifetimes: {
    show() {
      let self = this
      this.initRange().then(_ => {
        self.setUpFormData()
      })

    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    rules: [],
    formData: {},
    selectIndex: {

    },
    ranges: {
      subject: [],
      version: [],
      class: [],
      unit: [],
      course: [],
      type: [{
          name: "单选题",
          id: '1'
        },
        {
          name: '多选题',
          id: '2'
        },
        {
          name: '填空题',
          id: '3'
        },
        {
          name: '判断题',
          id: '4'
        },
        {
          name: '解答题',
          id: '5'
        },
      ],
      difficulty: [{
          name: '1',
          id: '1'
        },
        {
          name: '2',
          id: '2'
        },
        {
          name: '3',
          id: '3'
        },
        {
          name: '4',
          id: '4'
        },
        {
          name: '5',
          id: '5'
        }
      ],
      tagIds: []
    },
    rangeLinks: {
      subject: "version",
      version: "class",
      class: "unit",
      unit: "course",
      course: "",
      type: "",
      difficulty: "",
      tagIds:""
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindPickerChange: function (e) {
      console.log(e)
      const {
        target: {
          dataset: {
            field
          }
        },
        detail: {
          value
        }
      } = e
      let select = this.data.ranges[field][value]
      let nextRangeField = this.data.rangeLinks[field]
      let update = {
        [`formData.${field}`]: select.id,
        [`selectIndex.${field}`]: value
      }
      if (nextRangeField) {
        update[`ranges.${nextRangeField}`] = select.children
      }
      this.setData(update)
    },
    submit: function () {
      this.selectComponent('#form').validate((valid, errors) => {
        console.log('valid', valid, errors)
        if (valid) {
          // const {subject, version, class, course} = this.data.formData
          const formData = this.data.formData
          // const leafNodeIds = formData.course || formData.unit || formData.class || formData.version || formData.subject || ''
          // let filtersData = {}
          // for (let k in formData) {
          //     filtersData[k] = formData[k]
          // }
          // console.log(filtersData, formData);
          this.triggerEvent("queryDone", {
            ...formData,
            // leafNodeIds,
          })
        }
      })
    },
    initRange: function () {
      let self = this
      return Promise.all([getSubjectTree(), getAllTags()]).then(([sub, tag]) => {
        let update = {}
        if (sub.code < 300) {
          self.data.ranges.subject = sub.data
          update.subject = sub.data
        }
        if (tag.code < 300) {
          update.tagIds = tag.data
        }
        self.setData({
          ranges: {
            ...self.data.ranges,
            ...update
          }
        })
      })
    },
    setUpFormData: function () {
      // 从defaultData 设置formData和selectIndex
      console.log(this.data.formData)
      const {
        ranges,
        rangeLinks
      } = this.data
      const {
        defaultQuery
      } = this.properties

      // 获取index
      let tempKey = "subject"
      let selectIndex = {}
      let nRanges = {}
      while (tempKey) {
        let index = ranges[tempKey].findIndex(x => x.id === defaultQuery[tempKey])
        let next = ranges[tempKey][index]
        let nextKey = rangeLinks[tempKey]
        selectIndex[tempKey] = index
        if (nextKey && next && next.children) {
          nRanges[nextKey] = next.children
        }
        tempKey = nextKey
      }

      Object.keys(rangeLinks).map(x => {
        if(!selectIndex.hasOwnProperty(x)) {
          let i = ranges[x].findIndex(a => a.id === defaultQuery[x])
          selectIndex[x] = i
        }
      })
      this.setData({
        formData: {
          ...this.properties.defaultQuery
        },
        ranges: {
          ...ranges,
          ...nRanges
        },
        selectIndex
      })
      console.log(this.properties.defaultQuery)
    }
  }

})