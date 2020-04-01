import request from '@/utils/request'

export function fetchTagList() {
  return request({
    url: '/admin/tag/list',
    method: 'get'
  })
}

export function deleteTagById(id) {
  return request({
    url: '/admin/tag/delete/' + id,
    method: 'get'
  })
}

// 新增
export function addTag(name) {
  const data = {
    name
  }
  return request({
    url: '/admin/tag/add',
    method: 'post',
    data: data
  })
}

// 修改
export function updateTag(taId, name) {
  const data = {
    taId,
    name
  }
  return request({
    url: '/admin/tag/update',
    method: 'post',
    data: data
  })
}