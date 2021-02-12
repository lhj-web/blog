const querystring = require('querystring');
const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user.js');

// 获取 cookie的有效期
const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
  console.log(d.toGMTString());
  return d.toGMTString();
};

// 处理session数据
const SESSION_DATA = {};

// 处理postData
const getPostData = (req) => new Promise((resolve, reject) => {
  if (req.method !== 'POST') {
    resolve({});
    return;
  }

  if (req.headers['content-type'] !== 'application/json') {
    resolve({});
    return;
  }

  let postData = '';
  req.on('data', (chunk) => {
    postData += chunk.toString();
  });
  req.on('end', () => {
    if (!postData) {
      resolve({});
      return;
    }
    resolve(JSON.parse(postData));
  });
});

const serverHandle = (req, res) => {
  // 处理返回格式
  res.setHeader('content-type', 'application/json');

  // 解析query
  req.query = querystring.parse(req.url.split('?')[1]);

  // 解析cookie
  req.cookie = {};
  const cookieStr = req.headers.cookie || '';
  cookieStr.split(';').forEach(item => {
    if (!item) {
      return;
    }
    const arr = item.split('=');
    const key = arr[0].trim();
    const value = arr[1].trim();
    req.cookie[key] = value;
  });

  // 解析 session
  let needSetCookie = false;
  let userID = req.cookie.userid;
  if (userID) {
    if (!SESSION_DATA[userID]) {
      SESSION_DATA[userID] = {};
    }
  } else {
    needSetCookie = true;
    userID = `${Date.now()}_${Math.random()}`;
    SESSION_DATA[userID] = {};
  }
  req.session = SESSION_DATA[userID];

  // 处理 postData
  getPostData(req).then((postData) => {
    req.body = postData;
    // 处理 blog 路由
    const blogResult = handleBlogRouter(req, res);
    if (blogResult) {
      blogResult.then((blogData) => {
        if (needSetCookie) {
          // 返回cookie
        res.setHeader('Set-Cookie', `userid=${userID}; path=/; httpOnly; expires=${getCookieExpires()}`);
        }
        res.end(JSON.stringify(blogData));
      });
      return;
    }

    // 处理user路由
    const userResult = handleUserRouter(req, res);
    if (userResult) {
      userResult.then(userData => {
        if (needSetCookie) {
          // 返回cookie
        res.setHeader('Set-Cookie', `userid=${userID}; path=/; httpOnly; expires=${getCookieExpires()}`);
        }
        res.end(JSON.stringify(userData));
      });
      return;
    }
    // 未命中路由
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.write('404 not found...\n');
    res.end();
  });
};

module.exports = serverHandle;
