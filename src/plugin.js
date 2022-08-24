const Color = require("colorjs.io").default;
const colorsRegex = new RegExp(/(^#[0-9a-f]{3,6}$|(hsl|rgba?)\([^)]+\))/gi);

module.exports = () => ({
  postcssPlugin: "postcss-convert-to-oklch",
  Declaration(decl) {
    const colors = decl.value.match(colorsRegex);
    if (colors) {
      for (const color of colors) {
        const oklch = new Color(color).to("oklch").toString();
        decl.value = decl.value.replace(color, oklch);
      }
    }
  },
});

module.exports.postcss = true;
