const Color = require("colorjs.io").default;
const colorsRegex = new RegExp(/(#[0-9a-f]{3,8}|(hsla?|rgba?)\([^)]+\))/gi);
const pc = require("picocolors");

module.exports = () => ({
	postcssPlugin: "postcss-convert-to-oklch",
	Declaration(decl) {
		processDecl(decl);
	},
});

function processDecl(decl) {
	const originalColors = decl.value.match(colorsRegex);
	if (!originalColors) return;

	const colorsToConvert = originalColors.filter(
		(originalColor) => !originalColor.includes("var(--"),
	);
	if (!colorsToConvert.length) return;

	const convertedAndOriginalColors = colorsToConvert.map((originalColor) => {
		try {
			const converted = getConvertedColor(originalColor);
			return { converted, original: originalColor };
		} catch (e) {
			logError(e);
		}
	});
	if (!convertedAndOriginalColors.length) return;

	convertedAndOriginalColors.forEach(({ converted, original }) => {
		try {
			decl.value = decl.value.replaceAll(original, converted);
		} catch (e) {
			logError(e);
		}
	});
}

function getConvertedColor(color) {
	return new Color(color).to("oklch").toString();
}

function logError(error) {
	console.error(
		pc.bgRed(`Error during replacing ${original} with ${converted}: ${e}`),
	);
}

module.exports.postcss = true;
