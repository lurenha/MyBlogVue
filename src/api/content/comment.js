import request from '@/utils/request'

export function getCommentWithChildById(id) {
    return request({
      url: '/admin/comment/getCommentWithChildById/' + id,
      method: 'get'
    })
  }

  export function setDeleted(coId, isDelete) {
    const data = {
        coId,
        isDelete
    }
    return request({
      url: '/admin/comment/setDeleted',
      method: 'post',
      data: data
    })
  }