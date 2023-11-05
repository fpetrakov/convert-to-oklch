#!/usr/bin/env node
import { Command, Option } from "commander";
import postcss from "postcss";
import fs from "fs";
import pc from "picocolors";

import plugin from "./plugin.js";
import { logError } from "./utils.js";

const program = new Command();

const PRECISION_VALUES = Array.from(Array(21), (_, index) => String(index + 1));

const precisionOption = new Option(
	"-p, --precision <number>",
	"precision of color conversion",
).choices(PRECISION_VALUES);

program
	.name("convert-to-oklch")
	.description(
		"CLI tool that converts rgb(), rgba(), hex, hsl() and hsla() colors to oklch() in specified CSS files.",
	)
	.version("1.2.4")
	.argument("<path>", "path to css files")
	.addOption(precisionOption)
	.parse();

const { args: cssFilePaths } = program;
const { precision } = program.opts();

const processCssFile = async (path) => {
	if (!fs.existsSync(path)) {
		logError("File doesn't exist: " + path);
		return;
	}

	const css = fs.readFileSync(path, "utf-8");

	const convertedCss = await postcss([plugin(precision)])
		.process(css, { from: path })
		.toString();

	fs.writeFile(path, convertedCss, (err) => {
		if (err) {
			logError(err);
			fs.writeFileSync(path, css);
		}
	});
};

const processFiles = async (cssFilePaths) => {
	cssFilePaths.map(processCssFile);
	await Promise.allSettled(cssFilePaths);
	console.log(pc.bgGreen(pc.black("Done!")));
};

processFiles(cssFilePaths);
