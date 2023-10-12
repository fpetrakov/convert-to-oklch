export default {
	env: {
		node: true,
		commonjs: false,
		module: true,
		es2021: true,
		jest: true,
	},
	extends: "eslint:recommended",
	overrides: [],
	parserOptions: {
		ecmaVersion: "latest",
	},
	rules: {},
};
