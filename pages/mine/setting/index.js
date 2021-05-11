const { getSubjectTree, getGradeList } = require("../../../services/common");
const { updateUserInfo, getUserInfo } = require("../../../services/user");

// pages/mine/setting/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    rules:[{
      name: 'phone',
      rules: {required: true, message: '请输入手机号'},
    }],
    error: '',
    showTopTips: false,
    options: {},
    gradeData: [],
    multiArray: [[],[],[]],
    multiIndex: [0,0,0],
    subjectList: [], // 科目
    versionList: [], // 教材版本
    gradeList: [], // 年级
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    const userInfo = getApp().globalData.userInfo
    this.setData({
      userInfo: userInfo,
      options
    })
    if (options.type === 'subject') {      
      getGradeList().then(res => {
        if (res.code < 300) {
          const {nodeIds} = userInfo
          const subIds = nodeIds[0]
          let gradeIndex = 0
          const subjectList = [] // 科目
          let versionList = {} // 教材版本
          let gradeList = {} // 年级 
          let gradeData = [] // 年级 
          res.data.forEach(v => {
            if (subIds[0] === v.id) {
              
              subjectList.push(v.name)
              versionList[v.name] = []
  
              if (v.children && v.children.length) {
                // 版本循环
                v.children.forEach(j => {
                  if (subIds[1] === j.id) {
                    
                    versionList[v.name].push(j.name)
                    gradeList[j.name] = []
                    // 年级
                    if (j.children && j.children.length) {
                      j.children.forEach((k, index) => {
                        // 获取第几行
                        if (subIds[2] === k.id) {
                          gradeIndex = index
                        }
                        gradeList[j.name].push(k.name)
                        gradeData.push(k)
                      })
                    }
                  }
  
                })
              }
            }
          })
  
          this.data.multiArray[0] = subjectList
          this.data.multiArray[1] = this.getArr(subjectList[0], versionList)
          this.data.multiArray[2] = this.getArr(this.data.multiArray[1][0], gradeList)
          this.setData({
            multiArray: this.data.multiArray,
            gradeData: gradeData,
            multiIndex: [0,0, gradeIndex]
          })
  
  
          console.log(versionList, gradeList, subjectList);
        }
      })
    }
  },

  bindMultiPickerColumnChange(e) {
    let that=this
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        //第一列改变  设置第二列数据
        let arr = that.getArr(that.data.city[e.detail.value], that.data.station)
        data.multiArray[1]=arr
        that.setData({
          multiArray: data.multiArray
        })
        //从第二列中拿出第一项，设置第三组人员
        let arrColumn2 = that.getArr(arr[0], that.data.perList)
        data.multiArray[2] = arrColumn2
        that.setData({
          multiArray: data.multiArray
        })
        break;
      case 1:
         //第二列改变 设置第三列数据
        let arr2 = that.getArr(data.multiArray[1][e.detail.value], that.data.perList)
        data.multiArray[2] = arr2
        that.setData({
          multiArray: data.multiArray
        })
        break;
      }
  },

  bindMultiPickerChange (e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },
  getArr(value,arr){
    for (let i in arr) {
      if (value == i) {
        return arr[i]
      }
    }
  },

  formInputChange(e) {
    console.log(this.data.userInfo);
    const {field} = e.currentTarget.dataset
    this.setData({
        [`userInfo.${field}`]: e.detail.value
    })
  },
  submitForm() {
    this.selectComponent('#form').validate((valid, err) => {
      console.log(valid, err);
      if (!valid) {
        const firstError = Object.keys(err)
        if (firstError.length) {
          this.setData({
            error: err[firstError[0]].message,
          })
        }
      } else {
        console.log(this.data.multiIndex);
        const [v, j, k] = this.data.multiIndex
        console.log(this.data.gradeData[k].id);
        updateUserInfo({
          grades: [this.data.gradeData[k].id],
          phone: this.data.userInfo.phone
        }).then(res => {
          if (res.code < 300) {            
            getUserInfo().then(result => {
              getApp().globalData.userInfo = result.data
              wx.navigateBack();
            })
          }
        })
      }
    })
  }
})