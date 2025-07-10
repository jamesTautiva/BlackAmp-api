const bcrypt = require('bcrypt');
const hashPassword = (plain) => bcrypt.hash(plain, 10);
const comparePassword = (plain, hashed) => bcrypt.compare(plain, hashed);
module.exports = { hashPassword, comparePassword };