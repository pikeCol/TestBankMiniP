const { request } = require("./basic")



const getZuoYeList = (params) => {
  return request({
    url: 'v1/paper/list',
    method: 'GET',
    data: params
  })
}

const getZuoYeShareList = (params) => {
  return request({
    url: 'v1/paper/share/list',
    method: 'GET',
    data: params
  })
}


const getZuoYeDetail = (params) => {
  const {
    id
  } = params
  return request({
    url: `v1/paper/${id}`,
    method: 'GET',
    data: params
  })
}
const deleteZuoYe = (params) => {
  const {
    id
  } = params
  return request({
    url: `v1/paper/${id}`,
    method: 'DELETE'
  })
}
const cancelZuoYeShare = (params) => {
  return request({
    url: `v1/paper/share/cancel`,
    method: 'POST',
    data: params
  })
}
const createZuoYePaper = (params) => {
  return request({
    url: `v1/paper`,
    method: 'POST',
    data: params
  })
}
const updateZuoYePaper = (params) => {
  return request({
    url: `v1/paper`,
    method: 'PUT',
    data: params
  })
}
const printPaper = (params) => {
  return request({
    url: `v1/paper/print`,
    method: 'GET',
    data: params
  })
}
const paperDownList = (params) => {
  return request({
    url: `v1/paper/own/list`,
    method: 'GET',
    data: params
  })
}
module.exports = {
  getZuoYeList,
  getZuoYeDetail,
  cancelZuoYeShare,
  createZuoYePaper,
  updateZuoYePaper,
  deleteZuoYe,
  getZuoYeShareList,
  paperDownList,
  printPaper
}