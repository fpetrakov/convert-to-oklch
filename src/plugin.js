import Color from "colorjs.io";

import { logError } from "./utils.js";

const COLORS_REGEX = new RegExp(/(#[0-9a-f]{3,8}|(hsla?|rgba?)\([^)]+\))/gi);

const processDecl = (decl, precision) => {
	const originalColors = decl.value.match(COLORS_REGEX);
	if (!originalColors) return;

	originalColors
		.filter(doesNotIncludeVar)
		.map((original) => {
			try {
				return {
					original,
					converted: getConvertedColor(original, precision),
				};
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
};

const doesNotIncludeVar = (str) => !str.includes("var(--");

const roundColorComponentsValues = (color) => [
	color.coords[0].toFixed(3),
	color.coords[1].toFixed(3),
	color.coords[2].toFixed(1),
];

const getConvertedColor = (color, precision) => {
	const oklch = new Color(color).to("oklch");

	if (precision) {
		return oklch.toString({ precision });
	}

	oklch.coords = roundColorComponentsValues(oklch);
	return oklch.toString();
};

export default (precision) => ({
	postcssPlugin: "postcss-convert-to-oklch",
	Declaration(decl) {
		processDecl(decl, precision);
	},
});

export const postcss = true;
