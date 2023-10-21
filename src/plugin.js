import Color from "colorjs.io";
import { logError } from "./utils.js";

const colorsRegex = new RegExp(/(#[0-9a-f]{3,8}|(hsla?|rgba?)\([^)]+\))/gi);

export default precision => ({
	postcssPlugin: "postcss-convert-to-oklch",
	Declaration(decl) {
		processDecl(decl, precision);
	},
});

export const postcss = true;

function processDecl(decl, precision) {
	const originalColors = decl.value.match(colorsRegex);
	if (!originalColors) return;

	originalColors
		.filter(doesNotIncludeVar)
		.map(original => {
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
}

function doesNotIncludeVar(color) {
	return !color.includes("var(--");
}

function getConvertedColor(color, precision) {
	const clr = new Color(color).to("oklch");

	if (precision) {
		return clr.toString({ precision });
	} else {
		clr.coords[0] = Number(clr.coords[0]).toFixed(3);
		clr.coords[1] = Number(clr.coords[1]).toFixed(3);
		clr.coords[2] = Number(clr.coords[2]).toFixed(1);
		return clr.toString();
	}
}
