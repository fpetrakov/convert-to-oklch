const postcss = require("postcss");
const fs = require("fs");
const path = require("path");

const plugin = require("../plugin");

it("works with default precision", async () => {
	const input = readFixture("input.css");
	const output = readFixture("output.css");
	const result = await getResult(input, 5);
	expect(result.css).toEqual(output);
	expect(result.warnings()).toHaveLength(0);
});

it("works with precision 3", async () => {
	const input = readFixture("precision-3-input.css");
	const output = readFixture("precision-3-output.css");
	const result = await getResult(input, 3);
	expect(result.css).toEqual(output);
	expect(result.warnings()).toHaveLength(0);
});

function readFixture(name) {
	const fixturePath = path.join(__dirname, "fixtures", name);
	return fs.readFileSync(fixturePath, "utf-8");
}

async function getResult(input, precision) {
	return await postcss([plugin(precision)]).process(input, {
		from: undefined,
	});
}
