#!/usr/bin/env node
const { program } = require("commander");
const packageVersion = require("../package.json").version;
const postcss = require("postcss");
const fs = require("fs");
const pc = require("picocolors");
const plugin = require("./plugin");

program
	.name("convert-to-oklch")
	.description(
		"CLI tool that converts rgb(), rgba(), hex, hsl() and hsla() colors to oklch() in specified CSS files.",
	)
	.version(packageVersion);

program.argument("<path>", "path to css files");
program.parse();

const { args: cssFilePaths } = program;

const convertColors = async (path) => {
	if (!fs.existsSync(path)) {
		console.error(pc.bgRed(pc.black("File doesn't exist: " + path)));
		process.exit(1);
	}

	const css = fs.readFileSync(path, "utf-8");

	const result = await postcss([plugin])
		.process(css, { from: path })
		.toString();

	await fs.writeFile(path, result, (err) => {
		if (err) console.error(pc.bgRed(err));
	});
};

cssFilePaths.forEach(convertColors);

console.log(pc.bgGreen(pc.black("Done!")));
