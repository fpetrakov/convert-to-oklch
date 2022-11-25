const Color = require("colorjs.io").default;
const colorsRegex = new RegExp(/(^#[0-9a-f]{3,8}$|(hsla?|rgba?)\([^)]+\))/gi);
const pc = require("picocolors");

module.exports = () => ({
	postcssPlugin: "postcss-convert-to-oklch",
	Declaration(decl) {
		const originalColors = decl.value.match(colorsRegex);
		if (!originalColors) return;

		const colorsToConvert = originalColors.filter(
			(originalColor) => !originalColor.includes("var(--"),
		);

		const convertedAndOriginalColors = colorsToConvert.map(
			(originalColor) => {
				try {
					const converted = getConvertedColor(originalColor);
					return { converted, original: originalColor };
				} catch (e) {
					console.error(
						pc.bgRed(
							`Error during color ${originalColor} conversion: ${e}. It will not be converted.`,
						),
					);
				}
			},
		);

		convertedAndOriginalColors.forEach(({ converted, original }) => {
			try {
				decl.value = decl.value.replace(original, converted);
			} catch (e) {
				console.error(
					pc.bgRed(
						`Error during replacing ${original} with ${converted}: ${e}`,
					),
				);
			}
		});
	},
});

function getConvertedColor(color) {
	return new Color(color).to("oklch").toString();
}

module.exports.postcss = true;
