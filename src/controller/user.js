const { execute } = require('../db/mysql');

const login = (username, password) => {
  const sql = `
  select username,realname from users where username='${username}' and password='${password}'`;
  return execute(sql).then(rows => rows[0] || {});
};

module.exports = {
  login,
};
