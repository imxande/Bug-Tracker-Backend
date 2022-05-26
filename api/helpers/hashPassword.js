// import bcrypt
const bcrypt = require("bcrypt");

const hashPassword = (password) => {
	const saltRounds = 10;
	const hash = bcrypt.hashSync(password, saltRounds);

	return hash;
};

module.exports = hashPassword;
