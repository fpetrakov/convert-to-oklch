#!/usr/bin/env node
const { program } = require("commander");
const postcss = require("postcss");
const fs = require("fs");
const plugin = require("./plugin");

program.argument("<path>", "path to css files").action(async (path) => {
  const css = fs.readFileSync(path, 'utf-8');

  const result = await postcss([plugin])
    .process(css, { from: path })
    .toString();

  await fs.writeFile(path, result, (err) => {
    if (err) console.error(err);

    console.log("Done!");
  });
});

program.parse();
