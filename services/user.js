const { request } = require("./basic")



const getOpenId = (params) => {
  return request({
    url: 'v1/wx/miniprogram/auth/identity',
    method: 'GET',
    data: params
  })
}
const getPhone = (params) => {
  return request({
    url: 'v1/wx/miniprogram/auth/phoneNumber',
    method: 'POST',
    data: params
  })
}
const getUserInfo = (params) => {
  return request({
    url: 'v1/app/setting/userInfo',
    method: 'GET',
    data: params
  })
}

const updateUserInfo = (params) => {
  return request({
    url: 'v1/app/setting/user',
    method: 'PUT',
    data: params
  })
}

module.exports = {
  getOpenId,
  getPhone,
  getUserInfo,
  updateUserInfo
}