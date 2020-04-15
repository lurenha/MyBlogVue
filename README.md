# MyBlogVue

> 一个基于Vue的个人博客管理后台。
参考[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)
参考[http://www.ruoyi.vip/](http://www.ruoyi.vip/)

> [线上地址](http://lurenpeng.cn:8088/)
## 开发

```bash
# 克隆项目
git clone git@github.com:lurenha/MyBlogVue.git

# 进入项目目录
cd MyBlogVue

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 http://localhost

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```
