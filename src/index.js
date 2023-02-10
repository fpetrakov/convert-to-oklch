#!/usr/bin/env node
const { program, Option } = require('commander')
const packageVersion = require('../package.json').version
const postcss = require('postcss')
const fs = require('fs')
const pc = require('picocolors')
const plugin = require('./plugin')
const { logError } = require('./utils')

const PRECISION_VALUES = Array.from(Array(21), (_, index) => String(index + 1))

const precisionOption = new Option(
	'-p, --precision <number>',
	'precision of color conversion',
	'5',
).choices(PRECISION_VALUES)

program
	.name('convert-to-oklch')
	.description(
		'CLI tool that converts rgb(), rgba(), hex, hsl() and hsla() colors to oklch() in specified CSS files.',
	)
	.version(packageVersion)
	.argument('<path>', 'path to css files')
	.addOption(precisionOption)
	.parse()

const { args: cssFilePaths } = program
const { precision } = program.opts()

const processCssFile = async path => {
	if (!fs.existsSync(path)) {
		logError("File doesn't exist: " + path)
		return
	}

	const css = fs.readFileSync(path, 'utf-8')

	const convertedCss = await postcss([plugin(precision)])
		.process(css, { from: path })
		.toString()

	fs.writeFile(path, convertedCss, err => {
		if (err) {
			logError(err)
			fs.writeFileSync(path, css)
		}
	})
}

const processFiles = async () => {
	cssFilePaths.map(file => processCssFile(file))
	await Promise.allSettled(cssFilePaths)
	console.log(pc.bgGreen(pc.black('Done!')))
}

processFiles()
