const { execute } = require('../db/mysql');

const getList = (author, keyword) => {
  let sql = `select * from blogs where 1=1 `; // 防止author和keyword为空导致报错
  if (author) {
    sql += `and author='${author}' `;
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `;
  }
  sql += `order by createtime desc`;
  return execute(sql);
};

const getDetail = (id) => {
  const sql = `select * from blogs where id=${id}`;
  return execute(sql).then(row => row[0]);
};

const newBlog = (blogData = {}) => {
  const {
    title, content, author,
  } = blogData;
  const createtime = Date.now();

  const sql = `insert into blogs (title,content,createtime,author) values ('${title}','${content}',${createtime},'${author}')`;

  return execute(sql).then(insertData => ({
    id: insertData.insertId,
  }));
}; // 表示新建博客，插入到数据表的id
// blogData 为一个博客对象（包含title、content等）;

const updateBlog = (id, blogData = {}) => {
  const { title, content } = blogData;
  const sql = `update blogs set title='${title}',content='${content}' where id=${id}`;
  return execute(sql).then(updateData => {
    if (updateData.affectedRows > 0) {
      return true;
    }
    return false;
  });
};

const delBlog = (id, author) => {
  const sql = `update blogs set state=0 where id=${id} and author='${author}'`;
  return execute(sql).then(updateData => {
    if (updateData.affectedRows > 0) {
      return true;
    }
    return false;
  });
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
};
