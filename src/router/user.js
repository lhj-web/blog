const { login } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');

const handleUserRouter = (req, res) => {
  const { method, url } = req;
  const path = url.split('?')[0];

  // 登录
  if (method === 'GET' && path === '/api/user/login') {
    const { username, password } = req.query;
    const result = login(username, password);
    return result.then(data => {
      if (data.username) {
        // 设置session
        req.session.username = data.username;
        req.session.realname = data.realname;
        return new SuccessModel();
      }
      return new ErrorModel('登陆失败');
    });
  }
};

module.exports = handleUserRouter;
