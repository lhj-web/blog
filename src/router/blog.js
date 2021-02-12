const {
  getList, getDetail, newBlog, updateBlog, delBlog,
} = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');

const handleBlogRouter = (req, res) => {
  const { method, url } = req;
  const { id } = req.query;
  const path = url.split('?')[0];

  // 获取博客列表
  if (method === 'GET' && path === '/api/blog/list') {
    const { author, keyword } = req.query;
    const result = getList(author, keyword);
    return result.then((listData) => new SuccessModel(listData));
  }

  // 获取博客详情
  if (method === 'GET' && path === '/api/blog/detail') {
    const result = getDetail(id);
    return result.then((detailData) => new SuccessModel(detailData));
  }

  // 新建一篇博客
  if (method === 'POST' && path === '/api/blog/new') {
    req.body.author = 'zhangsan';
    const result = newBlog(req.body);
    return result.then(data => new SuccessModel(data));
  }

  // 更新博客
  if (method === 'POST' && path === '/api/blog/update') {
    const result = updateBlog(id, req.body);
    return result.then(val => {
      if (val) {
        return new SuccessModel();
      }
      return new ErrorModel('更新博客失败');
    });
  }

  // 删除博客
  if (method === 'POST' && path === '/api/blog/del') {
    const author = 'zhangsan';
    const result = delBlog(id, author);
    return result.then(val => {
      if (val) {
        return new SuccessModel();
      }
      return new ErrorModel('删除失败');
    });
  }
};

module.exports = handleBlogRouter;
