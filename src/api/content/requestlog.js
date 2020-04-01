import request from '@/utils/request'

// 查询日志列表
export function listLog(query) {
    return request({
        url: '/admin/log/list',
        method: 'get',
        params: query
    })
}

// 删除日志
export function delLog(logId) {
    return request({
        url: '/admin/log/delete/' + logId,
        method: 'get'
    })
}
