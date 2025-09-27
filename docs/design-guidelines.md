# 设计规范与视觉指南

> 确保代码驱动视频与产品视觉的完美统一

## 🎨 设计理念

### 核心原则
- **视觉一致性**：宣传片与产品界面保持100%视觉统一
- **品牌连贯性**：强化品牌识别，提升记忆点
- **功能导向**：动画服务于信息传达，而非炫技
- **技术美学**：体现开发者工作室的专业性和技术实力

### 视觉语言特征
```
简洁 + 现代 + 技术感 + 高质感
├── 几何化图形语言
├── 清晰的信息层次  
├── 流畅的动效过渡
└── 专业的色彩搭配
```

## 🎯 品牌视觉系统

### 1. 色彩规范

#### 主色调体系
```css
:root {
  /* 主品牌色 */
  --primary: #007AFF;          /* iOS蓝 - 信任、专业 */
  --primary-light: #4DA2FF;    /* 高亮状态 */
  --primary-dark: #0051D4;     /* 深度强调 */
  
  /* 辅助色 */
  --secondary: #34C759;        /* 成功绿 - 完成、正确 */
  --accent: #FF9500;          /* 警示橙 - 重要、行动 */
  --warning: #FF3B30;         /* 错误红 - 警告、删除 */
  
  /* 中性色 */
  --gray-50: #F9FAFB;         /* 背景色 */
  --gray-100: #F3F4F6;        /* 分割线 */
  --gray-300: #D1D5DB;        /* 边框 */
  --gray-600: #4B5563;        /* 次要文字 */
  --gray-900: #111827;        /* 主要文字 */
  
  /* 深色模式 */
  --dark-bg: #0A0A0B;         /* 深色背景 */
  --dark-surface: #1C1C1E;    /* 深色表面 */
  --dark-text: #FFFFFF;       /* 深色文字 */
}
```

#### 色彩使用场景
| 颜色 | 使用场景 | 心理感受 | 示例 |
|------|----------|----------|------|
| Primary Blue | Logo、CTA按钮、链接 | 信任、专业、稳定 | 品牌标识、主要操作 |
| Success Green | 完成状态、正确反馈 | 成功、安全、自然 | 任务完成、验证通过 |
| Accent Orange | 重要提示、新功能 | 活力、创新、引导 | 新特性高亮、重要通知 |
| Warning Red | 错误、警告、删除 | 紧急、危险、注意 | 错误提示、危险操作 |

### 2. 字体系统

#### 字体层次
```css
/* 字体族 */
--font-primary: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
--font-code: 'SF Mono', 'Monaco', 'Cascadia Code', monospace;
--font-cn: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;

/* 字号系统 (基于1.25倍率) */
--text-xs: 0.75rem;    /* 12px - 说明文字 */
--text-sm: 0.875rem;   /* 14px - 次要内容 */
--text-base: 1rem;     /* 16px - 正文 */
--text-lg: 1.25rem;    /* 20px - 小标题 */
--text-xl: 1.5rem;     /* 24px - 标题 */
--text-2xl: 1.875rem;  /* 30px - 大标题 */
--text-3xl: 2.25rem;   /* 36px - 主标题 */
--text-4xl: 3rem;      /* 48px - 超大标题 */

/* 字重 */
--font-light: 300;
--font-normal: 400; 
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

#### 字体使用规范
```typescript
// Typography Components
export const Typography = {
  // 标题层级
  H1: { fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-bold)' },
  H2: { fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-semibold)' },
  H3: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-semibold)' },
  H4: { fontSize: 'var(--text-xl)', fontWeight: 'var(--font-medium)' },
  
  // 正文样式
  Body1: { fontSize: 'var(--text-base)', fontWeight: 'var(--font-normal)' },
  Body2: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-normal)' },
  
  // 特殊用途
  Caption: { fontSize: 'var(--text-xs)', fontWeight: 'var(--font-normal)' },
  Code: { fontFamily: 'var(--font-code)', fontSize: 'var(--text-sm)' }
};
```

### 3. 布局网格系统

#### 基础网格
```css
/* 基于8px网格系统 */
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
  --space-24: 6rem;    /* 96px */
}
```

#### 视频画面构图
```
1920×1080 (16:9) 安全区域划分

┌─────────────────────────────────────┐
│  Safe Zone (1728×972)              │
│  ┌─────────────────────────────────┐ │ 
│  │                                 │ │
│  │  Title Safe (1536×864)          │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │                             │ │ │
│  │  │        Content Area         │ │ │
│  │  │                             │ │ │
│  │  └─────────────────────────────┘ │ │
│  │                                 │ │
│  └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘

Margins: 96px (5%)
Safe Zone: 内容保证在各平台正常显示
Title Safe: 文字内容的安全区域
```

## 🎬 动效设计语言

### 1. 动效原则

#### 功能性动效
- **引导注意力**：通过动效引导用户视线流向
- **状态反馈**：用动效反馈操作结果和系统状态
- **空间关系**：表达界面元素间的层次和关联
- **品牌个性**：通过独特动效强化品牌记忆

#### 动效性格特征
```
AnixOps 动效性格 = 精确 + 流畅 + 智能
├── 精确: 时机准确，节奏恰当
├── 流畅: 过渡自然，无突兀感
└── 智能: 动效有逻辑，服务于功能
```

### 2. 动画时机与节奏

#### 时长标准
```typescript
export const DURATIONS = {
  // 微交互 - 即时反馈
  instant: 150,        // 0.15s - 按钮点击、开关切换
  quick: 300,          // 0.3s  - 消息提示、状态变化
  
  // 转场动画 - 内容切换  
  fast: 500,           // 0.5s  - 页面切换、模态框
  normal: 800,         // 0.8s  - 复杂布局变化
  slow: 1200,          // 1.2s  - 大型内容加载
  
  // 品牌动画 - 情感建立
  dramatic: 2000,      // 2s    - Logo动画、品牌片头
  storytelling: 3000   // 3s    - 故事叙述、复杂演示
};
```

#### 缓动函数库
```typescript
export const EASINGS = {
  // 标准缓动
  linear: 'cubic-bezier(0, 0, 1, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  // 品牌定制缓动
  anixBounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',    // 弹性效果
  anixSmooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',      // 丝滑流畅
  anixSharp: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',      // 锐利精确
  
  // 物理模拟
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',       // 弹簧效果
  elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'        // 弹性回弹
};
```

### 3. 动效模式库

#### 入场动画
```typescript
// 淡入效果组 - 适用于文字、图片
export const fadeAnimations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: DURATIONS.quick,
    easing: EASINGS.easeOut
  },
  
  fadeInUp: {
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    duration: DURATIONS.fast,
    easing: EASINGS.anixSmooth
  },
  
  fadeInScale: {
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
    duration: DURATIONS.normal,
    easing: EASINGS.anixBounce
  }
};

// 滑入效果组 - 适用于界面元素、卡片
export const slideAnimations = {
  slideInRight: {
    from: { transform: 'translateX(100%)' },
    to: { transform: 'translateX(0%)' },
    duration: DURATIONS.fast,
    easing: EASINGS.easeOut
  },
  
  slideInLeft: {
    from: { transform: 'translateX(-100%)' },
    to: { transform: 'translateX(0%)' },
    duration: DURATIONS.fast,
    easing: EASINGS.easeOut
  }
};

// 缩放效果组 - 适用于Logo、重要元素
export const scaleAnimations = {
  scaleIn: {
    from: { transform: 'scale(0)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
    duration: DURATIONS.normal,
    easing: EASINGS.spring
  },
  
  punchIn: {
    keyframes: [
      { transform: 'scale(0)', opacity: 0 },
      { transform: 'scale(1.1)', opacity: 0.8 },
      { transform: 'scale(1)', opacity: 1 }
    ],
    duration: DURATIONS.dramatic,
    easing: EASINGS.anixBounce
  }
};
```

#### 高级动效模式
```typescript
// 路径动画 - Logo描边、图标绘制
export const pathAnimations = {
  drawPath: (pathLength: number) => ({
    strokeDasharray: pathLength,
    strokeDashoffset: pathLength,
    animation: `draw ${DURATIONS.dramatic}ms ${EASINGS.easeInOut} forwards`
  }),
  
  // CSS Keyframes
  '@keyframes draw': {
    to: { strokeDashoffset: 0 }
  }
};

// 粒子效果 - 科技感、连接线
export const particleAnimations = {
  floatingDots: {
    // 实现浮动的连接点效果
    keyframes: [
      { transform: 'translate(0, 0) scale(1)', opacity: 0.3 },
      { transform: 'translate(10px, -20px) scale(1.2)', opacity: 0.8 },
      { transform: 'translate(-5px, -40px) scale(1)', opacity: 0.3 }
    ],
    duration: DURATIONS.storytelling,
    iterationCount: 'infinite',
    direction: 'alternate'
  }
};

// 形变动画 - UI元素变形、状态切换
export const morphAnimations = {
  buttonToLoader: {
    // 按钮变成加载器的形变动画
    stages: [
      { width: '120px', borderRadius: '6px' },      // 初始按钮
      { width: '40px', borderRadius: '20px' },      // 收缩成圆
      { width: '40px', borderRadius: '20px' }       // 保持圆形，内部旋转
    ],
    duration: DURATIONS.fast
  }
};
```

## 📐 组件设计规范

### 1. UI组件视觉标准

#### 按钮组件
```css
/* 主要按钮 */
.button-primary {
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: var(--font-medium);
  transition: all 200ms var(--easing-easeOut);
}

.button-primary:hover {
  background: var(--primary-light);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.button-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 122, 255, 0.2);
}
```

#### 卡片组件
```css
.card {
  background: white;
  border: 1px solid var(--gray-100);
  border-radius: 12px;
  padding: var(--space-6);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 300ms var(--easing-easeOut);
}

.card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: var(--gray-200);
}
```

### 2. 图标设计规范

#### 图标风格特征
- **线条粗细**：2px stroke weight
- **圆角处理**：2px border-radius  
- **尺寸规格**：16px, 20px, 24px, 32px
- **视觉风格**：几何化、现代简约

#### 图标动画模式
```typescript
// 图标hover动效
export const iconAnimations = {
  // 箭头图标 - 指向动画
  arrowHover: {
    transform: 'translateX(4px)',
    transition: '200ms ease-out'
  },
  
  // 齿轮图标 - 旋转动画  
  settingsHover: {
    transform: 'rotate(90deg)',
    transition: '300ms ease-in-out'
  },
  
  // 心形图标 - 脉冲动画
  heartBeat: {
    animation: 'pulse 1.5s ease-in-out infinite'
  }
};

// CSS Keyframes
const iconKeyframes = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;
```

## 🎨 场景视觉设计

### 1. 开场场景
**目标**：建立品牌印象，吸引注意力
```
视觉元素：
├── Logo动画：路径描绘 + 颜色填充
├── 标语文字：打字机效果
├── 背景：简洁渐变 + 几何装饰
└── 音效：轻快的启动音
```

### 2. 问题场景  
**目标**：建立共情，引出需求
```
视觉策略：
├── 色调：偏灰暗，营造问题氛围
├── 动效：混乱、不协调的元素运动
├── UI：显示现有方案的复杂性
└── 情绪：从混乱到有序的过渡
```

### 3. 解决方案场景
**目标**：展示产品价值，建立信任  
```
视觉亮点：
├── 界面：高保真产品界面展示
├── 交互：流畅的操作演示动画
├── 数据：实时数据可视化动效
└── 结果：明显的改善对比展示
```

### 4. 收尾场景
**目标**：强化记忆，引导行动
```
设计要素：
├── 品牌：再次强化Logo和标语
├── CTA：明确的行动召唤按钮
├── 联系：网址、联系方式展示
└── 余韵：优雅的淡出效果
```

## 📏 技术实现规范

### 1. 颜色系统实现
```typescript
// 主题系统类型定义
export interface ThemeColors {
  primary: string;
  secondary: string;
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

// 响应式颜色工具
export const getResponsiveColor = (
  colorKey: keyof ThemeColors,
  theme: 'light' | 'dark' = 'light'
) => {
  const themes = {
    light: lightTheme,
    dark: darkTheme
  };
  
  return themes[theme][colorKey];
};
```

### 2. 动画系统实现
```typescript
// 动画配置接口
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  fill?: 'forwards' | 'backwards' | 'both' | 'none';
}

// 动画组合器
export class AnimationComposer {
  private timeline: gsap.core.Timeline;
  
  constructor() {
    this.timeline = gsap.timeline();
  }
  
  // 添加动画步骤
  addStep(target: string, animation: AnimationConfig, position?: string) {
    this.timeline.to(target, animation, position);
    return this;
  }
  
  // 并行动画
  parallel(animations: Array<{target: string, config: AnimationConfig}>) {
    animations.forEach(({target, config}) => {
      this.timeline.to(target, config, '<');
    });
    return this;
  }
  
  // 播放控制
  play() { return this.timeline.play(); }
  pause() { return this.timeline.pause(); }
  reverse() { return this.timeline.reverse(); }
}
```

### 3. 响应式设计实现
```typescript
// 响应式断点系统
export const BREAKPOINTS = {
  mobile: '(max-width: 768px)',
  tablet: '(min-width: 769px) and (max-width: 1024px)',
  desktop: '(min-width: 1025px)',
  largeDesktop: '(min-width: 1440px)'
};

// 响应式组件Hook
export const useResponsiveDesign = () => {
  const [breakpoint, setBreakpoint] = useState('desktop');
  
  useEffect(() => {
    const updateBreakpoint = () => {
      if (window.matchMedia(BREAKPOINTS.mobile).matches) {
        setBreakpoint('mobile');
      } else if (window.matchMedia(BREAKPOINTS.tablet).matches) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };
    
    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);
  
  return { breakpoint, isMobile: breakpoint === 'mobile' };
};
```

## 📋 设计质量检查清单

### ✅ 视觉一致性检查
- [ ] 色彩使用符合品牌规范
- [ ] 字体层次清晰合理
- [ ] 间距遵循8px网格系统
- [ ] 圆角统一为8px或12px
- [ ] 阴影深度层次分明

### ✅ 动效质量检查  
- [ ] 动画时长适宜（不超过1.2s）
- [ ] 缓动函数选择恰当
- [ ] 动效有明确的功能目的
- [ ] 无多余或炫技式动画
- [ ] 动画性能良好（60fps）

### ✅ 用户体验检查
- [ ] 信息层次清晰
- [ ] 视觉流程符合逻辑
- [ ] 重要信息突出显示
- [ ] 无过度干扰元素
- [ ] 适配多种设备尺寸

### ✅ 品牌传达检查
- [ ] 体现AnixOps专业形象
- [ ] 符合目标受众偏好
- [ ] 突出技术实力特征
- [ ] 建立信任感和专业感
- [ ] 强化品牌记忆点

---

通过严格执行这套设计规范，我们能确保所有代码驱动的视频内容都具备：
- 🎨 **统一的视觉语言**
- 🚀 **专业的品牌形象** 
- 💫 **优秀的用户体验**
- 🔧 **可维护的设计系统**