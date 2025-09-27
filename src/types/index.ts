import { CSSProperties } from 'react';

// 动画相关类型
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

export interface AnimationPreset {
  name: string;
  keyframes: Keyframe[];
  config: AnimationConfig;
}

export interface Keyframe {
  offset: number; // 0-1
  styles: CSSProperties;
}

// 场景相关类型
export interface SceneProps {
  frame: number;
  fps: number;
  progress: number; // 0-1
}

export interface SceneConfig {
  name: string;
  startFrame: number;
  duration: number;
  background?: string | {
    type: 'solid' | 'gradient' | 'image';
    value: string | string[];
  };
  music?: string;
  transitions?: {
    in?: TransitionType;
    out?: TransitionType;
  };
}

export type TransitionType = 
  | 'fade'
  | 'slide'
  | 'zoom'
  | 'blur'
  | 'wipe';

// 组件相关类型
export interface BaseComponentProps {
  className?: string;
  style?: CSSProperties;
  animate?: boolean;
  animationConfig?: Partial<AnimationConfig>;
}

export interface LogoProps extends BaseComponentProps {
  variant: 'full' | 'icon' | 'text';
  size: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}

export interface TextAnimatedProps extends BaseComponentProps {
  text: string;
  variant: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  animationType?: 'typewriter' | 'fadeIn' | 'slideIn' | 'scaleIn';
  speed?: number;
}

// 主题相关类型
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  typography: {
    fontFamily: {
      primary: string;
      secondary: string;
      mono: string;
    };
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
}

// 视频组合相关类型
export interface VideoComposition {
  id: string;
  name: string;
  description: string;
  duration: number;
  fps: number;
  width: number;
  height: number;
  scenes: SceneConfig[];
  defaultProps?: Record<string, any>;
}

// 渲染相关类型
export interface RenderConfig {
  quality: 'low' | 'medium' | 'high' | 'ultra';
  format: 'mp4' | 'webm' | 'gif' | 'png-sequence';
  codec?: string;
  bitrate?: string;
  scale?: number;
}

export interface RenderJob {
  id: string;
  compositionId: string;
  config: RenderConfig;
  status: 'pending' | 'rendering' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  completedAt?: Date;
  outputPath?: string;
  error?: string;
}