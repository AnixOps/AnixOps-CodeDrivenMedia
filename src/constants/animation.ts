// 动画时长常量 (毫秒)
export const DURATIONS = {
  // 微交互
  instant: 150,
  quick: 300,
  
  // 标准动画
  fast: 500,
  normal: 800,
  slow: 1200,
  
  // 品牌动画
  dramatic: 2000,
  storytelling: 3000,
  
  // 特殊效果
  typewriter: 50, // 每个字符
  wave: 100,      // 波浪间隔
} as const;

// 缓动函数常量
export const EASINGS = {
  // 标准缓动
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  // 品牌定制缓动
  anixBounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  anixSmooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  anixSharp: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  
  // 物理模拟
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  
  // 特殊效果
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  anticipate: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
} as const;

// 动画预设
export const ANIMATION_PRESETS = {
  // 淡入动画
  fadeIn: {
    name: 'fadeIn',
    keyframes: [
      { offset: 0, styles: { opacity: 0 } },
      { offset: 1, styles: { opacity: 1 } }
    ],
    config: {
      duration: DURATIONS.normal,
      easing: EASINGS.easeOut,
      fillMode: 'forwards' as const
    }
  },
  
  // 滑入动画
  slideInUp: {
    name: 'slideInUp',
    keyframes: [
      { offset: 0, styles: { transform: 'translateY(30px)', opacity: 0 } },
      { offset: 1, styles: { transform: 'translateY(0)', opacity: 1 } }
    ],
    config: {
      duration: DURATIONS.normal,
      easing: EASINGS.anixSmooth,
      fillMode: 'forwards' as const
    }
  },
  
  // 缩放动画
  scaleIn: {
    name: 'scaleIn',
    keyframes: [
      { offset: 0, styles: { transform: 'scale(0.9)', opacity: 0 } },
      { offset: 1, styles: { transform: 'scale(1)', opacity: 1 } }
    ],
    config: {
      duration: DURATIONS.normal,
      easing: EASINGS.anixBounce,
      fillMode: 'forwards' as const
    }
  },
  
  // 弹跳动画
  bounceIn: {
    name: 'bounceIn',
    keyframes: [
      { offset: 0, styles: { transform: 'scale(0)', opacity: 0 } },
      { offset: 0.5, styles: { transform: 'scale(1.1)', opacity: 0.8 } },
      { offset: 1, styles: { transform: 'scale(1)', opacity: 1 } }
    ],
    config: {
      duration: DURATIONS.dramatic,
      easing: EASINGS.bounce,
      fillMode: 'forwards' as const
    }
  },
  
  // 打字机效果
  typewriter: {
    name: 'typewriter',
    keyframes: [
      { offset: 0, styles: { width: '0', opacity: 0 } },
      { offset: 0.1, styles: { opacity: 1 } },
      { offset: 1, styles: { width: '100%', opacity: 1 } }
    ],
    config: {
      duration: DURATIONS.storytelling,
      easing: EASINGS.linear,
      fillMode: 'forwards' as const
    }
  }
} as const;

// 时间轴常量 (帧数，基于30fps)
export const TIMELINE = {
  // 场景时长
  INTRO_DURATION: 5 * 30,        // 5秒
  MAIN_CONTENT_DURATION: 20 * 30, // 20秒
  OUTRO_DURATION: 5 * 30,        // 5秒
  
  // 转场时长
  TRANSITION_DURATION: 1 * 30,    // 1秒
  
  // 动画延迟
  STAGGER_DELAY: 0.2 * 30,       // 0.2秒
  
  // 特殊时间点
  BEAT_SYNC: [0, 15, 30, 45, 60, 75, 90], // 节拍同步点
} as const;