#!/usr/bin/env node
const { program } = require("commander");
const packageVersion = require("../package.json").version;
const postcss = require("postcss");
const fs = require("fs");
const pc = require("picocolors");
const plugin = require("./plugin");
const { logError } = require("./utils");

program
	.name("convert-to-oklch")
	.description(
		"CLI tool that converts rgb(), rgba(), hex, hsl() and hsla() colors to oklch() in specified CSS files.",
	)
	.version(packageVersion);

program.argument("<path>", "path to css files");
program.parse();

const { args: cssFilePaths } = program;

processFiles();

async function processFiles() {
	for (const file of cssFilePaths) {
		await processCssFile(file);
	}
}

console.log(pc.bgGreen(pc.black("Done!")));

async function processCssFile(path) {
	if (!fs.existsSync(path)) {
		logError("File doesn't exist: " + path);
		return;
	}

	const css = fs.readFileSync(path, "utf-8");

	const convertedCss = await getConvertedCss(css, path);
	await replaceCssFiles(path, convertedCss);
}

async function getConvertedCss(css, path) {
	return await postcss([plugin]).process(css, { from: path }).toString();
}

async function replaceCssFiles(cssFilePath, convertedCss) {
	fs.writeFile(cssFilePath, convertedCss, (err) => {
		if (err) logError(err);
	});
}
