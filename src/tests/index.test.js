const postcss = require("postcss");
const fs = require("fs");
const path = require('path')

const plugin = require("../plugin");

it("works", async () => {
  const input = fs.readFileSync(path.join(__dirname, "./fixtures/input.css"), 'utf-8');
  const output = fs.readFileSync(path.join(__dirname, "./fixtures/output.css"), 'utf-8');

  let result = await postcss([plugin]).process(input, {
    from: undefined,
  });

  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
});
