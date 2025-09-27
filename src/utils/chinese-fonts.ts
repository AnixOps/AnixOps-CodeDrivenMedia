/**
 * 中文字体工具函数
 * 提供统一的中文字体处理和样式生成
 */

// 中文字体配置
export const CHINESE_FONTS = {
  // 简体中文字体栈
  simplified: [
    'Noto Sans SC',
    'PingFang SC',
    'Hiragino Sans GB',
    'Microsoft YaHei',
    '微软雅黑',
    'WenQuanYi Zen Hei',
    '文泉驿正黑',
    'WenQuanYi Micro Hei',
    '文泉驿微米黑',
    'sans-serif'
  ].join(', '),

  // 繁体中文字体栈
  traditional: [
    'Noto Sans TC',
    'PingFang TC',
    'Hiragino Sans CNS',
    'Microsoft JhengHei',
    '微軟正黑體',
    'sans-serif'
  ].join(', '),

  // 通用中文字体栈
  universal: [
    'Noto Sans SC',
    'Noto Sans TC',
    'PingFang SC',
    'PingFang TC',
    'Hiragino Sans GB',
    'Hiragino Sans CNS',
    'Microsoft YaHei',
    '微软雅黑',
    'Microsoft JhengHei',
    '微軟正黑體',
    'WenQuanYi Zen Hei',
    '文泉驿正黑',
    'WenQuanYi Micro Hei',
    '文泉驿微米黑',
    'sans-serif'
  ].join(', '),

  // 等宽中文字体栈
  monospace: [
    'Noto Sans Mono CJK SC',
    'SF Mono',
    'Monaco',
    'Inconsolata',
    'Fira Code',
    'Source Code Pro',
    'Consolas',
    '等距更纱黑体',
    'Sarasa Mono SC',
    'monospace'
  ].join(', ')
};

// 字体权重映射
export const FONT_WEIGHTS = {
  thin: 100,
  extraLight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900
} as const;

// 生成中文友好的文本样式
export const getChineseTextStyle = (options: {
  fontType?: 'simplified' | 'traditional' | 'universal' | 'monospace';
  fontSize?: number | string;
  fontWeight?: keyof typeof FONT_WEIGHTS | number;
  lineHeight?: number | string;
  letterSpacing?: string;
  color?: string;
} = {}): React.CSSProperties => {
  const {
    fontType = 'universal',
    fontSize = '16px',
    fontWeight = 'normal',
    lineHeight = 1.6,
    letterSpacing = '0.02em',
    color = 'inherit'
  } = options;

  return {
    fontFamily: CHINESE_FONTS[fontType],
    fontSize,
    fontWeight: typeof fontWeight === 'string' ? FONT_WEIGHTS[fontWeight] : fontWeight,
    lineHeight,
    letterSpacing,
    color,
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
  };
};

// 为 Remotion 视频优化的中文文本样式
export const getVideoChineseTextStyle = (options: {
  fontType?: 'simplified' | 'traditional' | 'universal' | 'monospace';
  fontSize?: number | string;
  fontWeight?: keyof typeof FONT_WEIGHTS | number;
  lineHeight?: number | string;
  letterSpacing?: string;
  color?: string;
  textShadow?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
} = {}): React.CSSProperties => {
  const baseStyle = getChineseTextStyle(options);
  const { textShadow, textAlign = 'left' } = options;

  return {
    ...baseStyle,
    // 视频渲染优化
    textShadow: textShadow || '0 1px 2px rgba(0, 0, 0, 0.1)',
    textAlign,
    // 确保在视频中清晰显示
    WebkitTextStroke: '0.5px transparent',
    paintOrder: 'stroke fill',
  };
};

// 检测中文字符
export const containsChinese = (text: string): boolean => {
  return /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/.test(text);
};

// 检测繁体中文
export const containsTraditionalChinese = (text: string): boolean => {
  // 常见繁体字符范围（简化版检测）
  const traditionalChars = /[繁體中文檢測測試]/;
  return traditionalChars.test(text);
};

// 根据文本内容自动选择字体
export const getAutoChineseFont = (text: string): string => {
  if (!containsChinese(text)) {
    return 'system-ui, -apple-system, sans-serif';
  }
  
  if (containsTraditionalChinese(text)) {
    return CHINESE_FONTS.traditional;
  }
  
  return CHINESE_FONTS.simplified;
};

// 预定义的中文文本样式类型
export const CHINESE_TEXT_STYLES = {
  // 标题样式
  heading1: getVideoChineseTextStyle({
    fontSize: '48px',
    fontWeight: 'bold',
    lineHeight: 1.2,
    letterSpacing: '0.01em'
  }),
  
  heading2: getVideoChineseTextStyle({
    fontSize: '36px',
    fontWeight: 'semiBold',
    lineHeight: 1.3,
    letterSpacing: '0.01em'
  }),
  
  heading3: getVideoChineseTextStyle({
    fontSize: '24px',
    fontWeight: 'medium',
    lineHeight: 1.4,
    letterSpacing: '0.02em'
  }),
  
  // 正文样式
  body: getVideoChineseTextStyle({
    fontSize: '16px',
    fontWeight: 'normal',
    lineHeight: 1.6,
    letterSpacing: '0.02em'
  }),
  
  bodyLarge: getVideoChineseTextStyle({
    fontSize: '18px',
    fontWeight: 'normal',
    lineHeight: 1.6,
    letterSpacing: '0.02em'
  }),
  
  bodySmall: getVideoChineseTextStyle({
    fontSize: '14px',
    fontWeight: 'normal',
    lineHeight: 1.5,
    letterSpacing: '0.02em'
  }),
  
  // 标签样式
  caption: getVideoChineseTextStyle({
    fontSize: '12px',
    fontWeight: 'medium',
    lineHeight: 1.4,
    letterSpacing: '0.03em'
  }),
  
  // 代码样式
  code: getVideoChineseTextStyle({
    fontType: 'monospace',
    fontSize: '14px',
    fontWeight: 'normal',
    lineHeight: 1.5,
    letterSpacing: '0em'
  })
} as const;

// 导出类型
export type ChineseFontType = keyof typeof CHINESE_FONTS;
export type FontWeightKey = keyof typeof FONT_WEIGHTS;
export type ChineseTextStyleKey = keyof typeof CHINESE_TEXT_STYLES;