const Color = require("colorjs.io").default;
const pc = require("picocolors");

const colorsRegex = new RegExp(/(#[0-9a-f]{3,8}|(hsla?|rgba?)\([^)]+\))/gi);

module.exports = () => ({
	postcssPlugin: "postcss-convert-to-oklch",
	Declaration(decl) {
		processDecl(decl);
	},
});

function processDecl(decl) {
	const originalColors = decl.value.match(colorsRegex);
	if (!originalColors) return;

	originalColors
		.filter(doesNotIncludeVar)
		.map((original) => {
			try {
				return { original, converted: getConvertedColor(original, 5) };
			} catch (e) {
				logError(
					`Error during color ${original} conversion: ${e}. It won't be converted.`,
				);
			}
		})
		.filter(Boolean)
		.forEach(({ converted, original }) => {
			try {
				decl.value = decl.value.replaceAll(original, converted);
			} catch (e) {
				logError(
					`Error during replacing ${original} with ${converted}: ${e}`,
				);
			}
		});
}

function doesNotIncludeVar(color) {
	return !color.includes("var(--");
}

function getConvertedColor(color, precision) {
	return new Color(color).to("oklch").toString({precision});
}

module.exports.postcss = true;
