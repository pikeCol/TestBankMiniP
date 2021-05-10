const {
  request
} = require("./basic")


const getQuestionList = (params) => {
  return request({
    url: 'v1/topic/list',
    method: 'GET',
    data: params
  })
}
// 审核通过
const getPassQuestionList = (params) => {
  return request({
    url: 'v1/audit/list',
    method: 'GET',
    data: params
  })
}


const getQuestionDetail = (params) => {
  const {
    id
  } = params
  return request({
    url: `v1/topic/${id}`,
    method: 'GET',
    data: params
  })
}

const collectTopic = (params) => {
  return request({
    url: '/v1/topic/collect',
    method: 'GET',
    data: params
  })
}

const topiCorrection = (params) => {
  return request({
    url: '/v1/topic/correction',
    method: 'POST',
    data: params
  })
}
module.exports = {
  getQuestionList,
  getQuestionDetail,
  collectTopic,
  topiCorrection,
  getPassQuestionList
}