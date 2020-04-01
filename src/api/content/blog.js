import request from '@/utils/request'

export function fetchBlogList(query) {
  return request({
    url: '/admin/blog/list',
    method: 'get',
    params: query
  })
}

export function setPublished(blId, published) {
  const data = {
    blId,
    published
  }
  return request({
    url: '/admin/blog/setPublished',
    method: 'post',
    data: data
  })
}

export function deleteBlogById(id) {
  return request({
    url: '/admin/blog/delete/' + id,
    method: 'get'
  })
}

export function getBlogById(id) {
  return request({
    url: '/admin/blog/find/' + id,
    method: 'get'
  })
}

// 新增Blog
export function addBlog(data) {
  return request({
    url: '/admin/blog/add',
    method: 'post',
    data: data
  })
}

// 修改Blog
export function updateBlog(data) {
  return request({
    url: '/admin/blog/update',
    method: 'post',
    data: data
  })
}


// 拥有评论的BLog（字典）
export function hasCommentDic() {
  return request({
    url: '/admin/blog/hasCommentDic',
    method: 'get',
  })
}