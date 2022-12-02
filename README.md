# convert-to-oklch

CLI tool that converts `rgb()`, `rgba()`, hex, `hsl()` and `hsla()` colors to [**oklch()**](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch) in specified CSS files.

```sh
npx convert-to-oklch ./src/**/*.css
```

```diff
.header {
- background: rgb(102, 173, 221);
+ background: oklch(72% 0.1 240);
}
```

`oklch()` provides better readability since it uses `lightness`, `chroma`, and `hue` components (closer to how people think and work with colors) instead of “magic tokens” like `#4287f5`. In contrast with `hsl()`, OKLCH has no issues with contrast and a11y.

Don’t forget to add `postcss-preset-env` to PostCSS to have `oklch()` polyfill.

# Precision of conversion

Conversion is done with [colorjs](https://colorjs.io/) package by [Lea Verou](https://github.com/LeaVerou). You can specify precision of color conversion by using `-p` or `--precision` option. **The default value is 5**. Available values are 1-21 inclusive.

```bash
npx convert-to-oklch ./src/*.css -p 2
```

# Custom properties

Colors that contain custom properties inside are ignored:

```css
a {
	color: rgb(102, 173, 221, var(--opacity));
}
```

In this case the color will not be converted.

# More

Read more about color spaces in css:

-   [OKLCH in CSS: why we moved from RGB and HSL](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
-   [LCH colors in CSS: what, why, and how?](https://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/)
-   [A Guide To Modern CSS Colors](https://www.smashingmagazine.com/2021/11/guide-modern-css-colors/)
