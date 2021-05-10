const { request } = require("./basic")
const getSubjectTree = (params) => {
  return request({
    url: 'v1/subjectDictionary/directories',
    method: 'GET',
    data: params
  })
}
const getAllTags = (params) => {
  return request({
    url: 'v1/tag/list',
    method: 'GET',
    data: params
  })
}
const getGradeList = (params) => {
  return request({
    url: 'v1/subjectDictionary/grade/list',
    method: 'GET',
    data: params
  })
}
// v1/subjectDictionary/grade/list
module.exports = {
  getSubjectTree,
  getAllTags,
  getGradeList
}