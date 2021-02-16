# node笔记

> name: HJ Liu
e-mail: 1871731528@qq.com

## 一、http请求概述

* DNS解析为**ip地址**，客户端与服务器建立TCP连接，进行三次握手，发送http请求

* server接受到http请求，处理并返回

* 客户端接收到返回数据，处理数据

## 二、Promise

### 1.封装一个读取文件的函数

* 参数：path 文件路径
* 返回：promise 对象

```js
function mineReadFile() {
  return new Promise((resolve, reject) => {
    require('fs').readfile('path', (err, data) => {
      if (err) reject(err);
      resolve(data);
    })
  })
}
```

### 2.封装Ajax发送get请求

* 参数：URL
* 返回结果：Promise对象

```js
function sendAjax() {
  return new Promise((resolve, reject) => {
    const xhr = XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.status);
        }
      }
    }
  })
}
```

### 3.Promise的状态

该状态是实例对象中的一个属性**promise.state**， 分为：

* pending 未决定的
* resolved /fullfiled （成功）
* rejected 失败

## 三、MySql

### Sql增删改查

```sql

show databases -- 查看数据库

use <dbname> -- 切换数据库

show tables -- 查看表

-- 增加
insert into users (username, `password`, realname) values ('lisi','123','李四'); -- 往表中插入数据

-- 查询
select id,username from users; -- 查询表中的列

select * from users where username='zhangsan' and `password`='123';  -- 加入判断条件

select * from users where username like '%zhang%'; -- 查找部分关键字

select * from users where `password` like '%1%' order by id; -- 按照id排序 倒序+desc

-- 更新
SET SQL_SAFE_UPDATES=0; -- 出现安全问题时执行

update users set realname='李四1' where username='lisi';
```

## 四、cookie与session

### 1.cookie介绍

* cookie是存储在浏览器端的一段字符串（最大4kb）

* 跨域不共享

* 格式如 k1=v1，k2=v2, k3=v3，因此可以存储结构化数据

* 每次发送http请求，会将请求域的cookie一起发送到server

* server可以修改并返回给浏览器，浏览器中也可以通过JavaScript修改cookie（有限制）

### 2.session介绍

* cookie中不会存放实际的用户信息，只是一个表示，通过解析后存储到server中的session

* session是存在于服务端的，安全性较强，存储的大小也没有限制

## 五、redis

redis是内存中的数据库，十分适合存储session的原因：

* session访问频繁，对性能要求极高

* session可不考虑断电丢失的情况（比如登录时丢失重新登录即可）

* session数据量不会太大

网站数据不适合用redis：

* 操作频率不是太高（相比于session操作）

* 断电数据不能丢失

* 数据量太大，内存成本高

基本语句：
```redis

redis-cli.exe -h 127.0.0.1 -p 6379 // 连接数据库

set key value //设置键值

get key //获取键值

keys * // 查询所有键

config set stop-writes-on-bgsave-error no // 进行配置，使得能够删除键值

del key 删除键值
