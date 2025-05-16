import * as echarts from 'echarts/core';
import trim from 'lodash/trim';
import { Color } from 'tvision-color';
import { s } from 'vite/dist/node/types.d-aGj9QkWt';

import { TColorToken } from '@/config/color';
import { ModeType } from '@/types/interface';

/**
 * 依据主题类型获取颜色
 *
 * @export
 * @param {string} theme
 * @returns {}
 */
export function getColorFromTheme(): Array<string> {
  const theme = trim(getComputedStyle(document.documentElement).getPropertyValue('--td-brand-color'));
  const themeColorList = Color.getRandomPalette({
    color: theme,
    colorGamut: 'bright',
    number: 8,
  });

  return themeColorList;
}

/** 图表颜色 */
export function getChartListColor(): Array<string> {
  const res = getColorFromTheme();

  return res;
}

/**
 * 更改图表主题颜色
 *
 * @export
 * @param {Array<string>} chartsList
 * @param {string} theme
 */
export function changeChartsTheme(chartsList: echarts.EChartsType[]): void {
  if (chartsList && chartsList.length) {
    const chartChangeColor = getChartListColor();

    for (let index = 0; index < chartsList.length; index++) {
      const elementChart = chartsList[index];

      if (elementChart) {
        const optionVal = elementChart.getOption();

        // 更改主题颜色
        optionVal.color = chartChangeColor;

        elementChart.setOption(optionVal, true);
      }
    }
  }
}

/**
 * 根据当前主题色、模式等情景 计算最后生成的色阶
 */
export function generateColorMap(theme: string, colorPalette: Array<string>, mode: ModeType, brandColorIdx: number) {
  const isDarkMode = mode === 'dark';

  if (isDarkMode) {
    // eslint-disable-next-line no-use-before-define
    colorPalette.reverse().map((color) => {
      const [h, s, l] = Color.colorTransform(color, 'hex', 'hsl');
      return Color.colorTransform([h, Number(s) - 4, l], 'hsl', 'hex');
    });
    brandColorIdx = 5;
    colorPalette[0] = `${colorPalette[brandColorIdx]}20`;
  }

  const colorMap: TColorToken = {
    '--td-brand-color': colorPalette[brandColorIdx], // 主题色
    '--td-brand-color-1': colorPalette[0], // light
    '--td-brand-color-2': colorPalette[1], // focus
    '--td-brand-color-3': colorPalette[2], // disabled
    '--td-brand-color-4': colorPalette[3],
    '--td-brand-color-5': colorPalette[4],
    '--td-brand-color-6': colorPalette[5],
    '--td-brand-color-7': brandColorIdx > 0 ? colorPalette[brandColorIdx - 1] : theme, // hover
    '--td-brand-color-8': colorPalette[brandColorIdx], // 主题色
    '--td-brand-color-9': brandColorIdx > 8 ? theme : colorPalette[brandColorIdx + 1], // click
    '--td-brand-color-10': colorPalette[9],
  };
  return colorMap;
}

/**
 * 将生成的样式嵌入头部
 */
export function insertThemeStylesheet(theme: string, colorMap: TColorToken, mode: ModeType) {
  const isDarkMode = mode === 'dark';
  const root = !isDarkMode ? `:root[theme-color='${theme}']` : `:root[theme-color='${theme}'][theme-mode='dark']`;

  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = `${root}{
    --td-brand-color: ${colorMap['--td-brand-color']};
    --td-brand-color-1: ${colorMap['--td-brand-color-1']};
    --td-brand-color-2: ${colorMap['--td-brand-color-2']};
    --td-brand-color-3: ${colorMap['--td-brand-color-3']};
    --td-brand-color-4: ${colorMap['--td-brand-color-4']};
    --td-brand-color-5: ${colorMap['--td-brand-color-5']};
    --td-brand-color-6: ${colorMap['--td-brand-color-6']};
    --td-brand-color-7: ${colorMap['--td-brand-color-7']};
    --td-brand-color-8: ${colorMap['--td-brand-color-8']};
    --td-brand-color-9: ${colorMap['--td-brand-color-9']};
    --td-brand-color-10: ${colorMap['--td-brand-color-10']};
  }`;

  document.head.appendChild(styleSheet);
}

export function insertThemeColor(colorMap: any) {
  let styleText = '';
  for (const key in colorMap) {
    styleText += `${key}: ${colorMap[key]};`;
  }
  const styleSheet = document.createElement('style');
  styleSheet.innerText = `:root{${styleText}}`;
  document.head.appendChild(styleSheet);
}

/**
 * @description: 如果是简写格式（如 #fff），将其扩展为标准格式（如 #ffffff）
 * @param {string} hex
 * @return {*}
 */
function expandHex(hex: string) {
  if (hex.length === 4) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return hex;
}

/**
 * @description: 将十六进制颜色转换为 RGB
 * @param {string} hex
 * @return {*}
 */
function hexToRgb(hex: string) {
  hex = expandHex(hex);
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

/**
 * @description: 计算色阶
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @return {*}
 */
function getLuminance(r: number, g: number, b: number) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * @description: 计算对比度比值
 * @param {number} l1
 * @param {number} l2
 * @return {*}
 */
function getContrastRatio(l1: number, l2: number) {
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

/**
 * @description: 检查文本颜色和背景颜色的对比度是否满足最小对比度要求
 * @param {string} textColorHex
 * @param {string} backgroundColorHex
 * @param {*} minContrast
 * @return {*}
 */
export function isReadableColor(textColorHex: string, backgroundColorHex: string, minContrast = 4.5) {
  const textColorRgb = hexToRgb(textColorHex);
  const backgroundColorRgb = hexToRgb(backgroundColorHex);

  const textLuminance = getLuminance(textColorRgb.r, textColorRgb.g, textColorRgb.b);
  const backgroundLuminance = getLuminance(backgroundColorRgb.r, backgroundColorRgb.g, backgroundColorRgb.b);

  const contrastRatio = getContrastRatio(textLuminance, backgroundLuminance);
  return contrastRatio >= minContrast;
}

/**
 * @description: 调整亮度
 * @param {string} hex
 * @param {number} adjustment
 * @return {*}
 */
export function adjustBrightness(hex: string, adjustment: number) {
  hex = expandHex(hex); // 确保是标准格式
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  console.log('亮度调整', hex, r, g, b);

  // 调整亮度
  const newR = Math.max(0, Math.min(255, r + adjustment));
  const newG = Math.max(0, Math.min(255, g + adjustment));
  const newB = Math.max(0, Math.min(255, b + adjustment));

  // 将 RGB 转换回十六进制
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

/**
 * @description: 根据主色生成四个色阶，主要用于字体颜色
 * @param {string} mainColorHex
 * @return {*}
 */
export function generateTextColorScheme(mainColorHex: string, backgroundColorHex: string) {
  // 主要颜色
  const mainColor = expandHex(mainColorHex);
  const isLightBg = isLightColor(backgroundColorHex);

  // 次要字体颜色
  const secondaryColor = isLightBg ? adjustBrightness(mainColor, -50) : adjustBrightness(mainColor, 50);

  // placeholder 字体颜色
  const placeholderColor = isLightBg ? adjustBrightness(mainColor, 50) : adjustBrightness(mainColor, -50);

  // disable 字体颜色
  const disableColor = isLightBg ? adjustBrightness(mainColor, 100) : adjustBrightness(mainColor, -100);

  return [mainColor, secondaryColor, placeholderColor, disableColor];
}

/**
 * @description: 判断颜色是深色还是浅色
 * @param {string} hexColor
 * @return {*}
 */
export function isLightColor(hexColor: string) {
  hexColor = expandHex(hexColor);
  const { r, g, b } = hexToRgb(hexColor);
  const luminance = getLuminance(r, g, b);
  return luminance > 128; // 亮度大于 128 为浅色，否则为深色
}
