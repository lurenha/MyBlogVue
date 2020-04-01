import request from '@/utils/request'

export function fetchTypeList() {
  return request({
    url: '/admin/type/list',
    method: 'get'
  })
}


export function deleteTypeById(id) {
  return request({
    url: '/admin/type/delete/' + id,
    method: 'get'
  })
}

// 新增
export function addType(name) {
  const data = {
    name
  }
  return request({
    url: '/admin/type/add',
    method: 'post',
    data: data
  })
}

// 修改
export function updateType(tyId,name) {
  const data = {
    tyId,
    name
  }
  return request({
    url: '/admin/type/update',
    method: 'post',
    data: data
  })
}

