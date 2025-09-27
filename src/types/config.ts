// 视频配置类型定义
export interface VideoConfig {
  id: string;
  name: string;
  description?: string;
  duration: number; // 秒数
  width?: number;
  height?: number;
  fps?: number;
  scenes: SceneConfig[];
  theme?: ThemeConfig;
  audio?: AudioConfig;
}

// 场景配置
export interface SceneConfig {
  id: string;
  type: SceneType;
  duration: number; // 秒数
  startTime: number; // 开始时间（秒）
  elements: ElementConfig[];
  transition?: TransitionConfig;
  background?: BackgroundConfig;
}

// 场景类型
export type SceneType = 
  | 'intro' 
  | 'feature' 
  | 'demo' 
  | 'outro' 
  | 'brand' 
  | 'custom';

// 元素配置
export interface ElementConfig {
  id: string;
  type: ElementType;
  content: any;
  position: PositionConfig;
  animation: AnimationConfig;
  style?: StyleConfig;
  timing: TimingConfig;
}

// 元素类型
export type ElementType = 
  | 'text' 
  | 'logo' 
  | 'image' 
  | 'video' 
  | 'shape' 
  | 'button' 
  | 'chart' 
  | 'code' 
  | 'custom';

// 位置配置
export interface PositionConfig {
  x: number | string; // 支持像素值或百分比
  y: number | string;
  width?: number | string;
  height?: number | string;
  zIndex?: number;
}

// 动画配置
export interface AnimationConfig {
  type: AnimationType;
  duration?: number;
  delay?: number;
  easing?: string;
  from?: any;
  to?: any;
  trigger?: 'auto' | 'manual';
}

// 动画类型
export type AnimationType = 
  | 'fadeIn' 
  | 'fadeOut' 
  | 'slideIn' 
  | 'slideOut' 
  | 'zoomIn' 
  | 'zoomOut' 
  | 'rotate' 
  | 'scale' 
  | 'typewriter' 
  | 'bounce' 
  | 'elastic' 
  | 'custom';

// 时间配置
export interface TimingConfig {
  start: number; // 相对于场景开始时间的秒数
  duration: number; // 元素持续时间（秒）
}

// 样式配置
export interface StyleConfig {
  color?: string;
  backgroundColor?: string;
  fontSize?: number | string;
  fontFamily?: string;
  fontWeight?: string | number;
  borderRadius?: number;
  border?: string;
  shadow?: string;
  opacity?: number;
  [key: string]: any;
}

// 主题配置
export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  fontFamily?: string;
  gradients?: { [key: string]: string };
}

// 背景配置
export interface BackgroundConfig {
  type: 'color' | 'gradient' | 'image' | 'video';
  value: string;
  opacity?: number;
  animation?: AnimationConfig;
}

// 转场配置
export interface TransitionConfig {
  type: 'fade' | 'slide' | 'wipe' | 'zoom' | 'dissolve';
  duration: number;
  easing?: string;
}

// 音频配置
export interface AudioConfig {
  src?: string;
  volume?: number;
  loop?: boolean;
  fadeIn?: number;
  fadeOut?: number;
}

// 代码要求配置
export interface CodeRequirement {
  file: string;
  description: string;
  template?: string;
  dependencies?: string[];
  imports?: string[];
  exports?: string[];
}

// 项目配置
export interface ProjectConfig {
  name: string;
  description?: string;
  version: string;
  videos: VideoConfig[];
  globalTheme?: ThemeConfig;
  requirements: CodeRequirement[];
  templates?: { [key: string]: any };
}