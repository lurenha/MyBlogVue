import request from '@/utils/request'
export function fetchFriendList() {
  return request({
    url: '/admin/friend/list',
    method: 'get'
  })
}
export function deleteFriendById(id) {
  return request({
    url: '/admin/friend/delete/' + id,
    method: 'get'
  })
}

export function getFriendByid(id) {
  return request({
    url: '/admin/friend/find/' + id,
    method: 'get'
  })
}

// 新增
export function addFriend(data) {
  return request({
    url: '/admin/friend/add',
    method: 'post',
    data: data
  })
}

// 修改
export function updateFriend(data) {
  return request({
    url: '/admin/friend/update',
    method: 'post',
    data: data
  })
}