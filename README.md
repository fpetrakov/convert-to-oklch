# convert-to-oklch

CLI tool that converts `rgb()`, `rgba()`, hex and `hsl()` colors to [**oklch()**](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch) in specified CSS files.

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

# More

Read more about color spaces in css:
- [LCH colors in CSS: what, why, and how?](https://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/)
- [A Guide To Modern CSS Colors](https://www.smashingmagazine.com/2021/11/guide-modern-css-colors/)


