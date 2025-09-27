import { ProjectConfig } from '../types/config';

/**
 * 代码生成器 - 分析配置并生成代码需求说明
 */
export class CodeGenerator {
  
  /**
   * 生成全局代码需求
   */
  generateGlobalRequirements(config: ProjectConfig): string[] {
    const requirements: string[] = [
      '需要安装 Remotion 框架进行视频渲染',
      '需要 React 18+ 和 TypeScript 支持',
      '建议安装 GSAP 或 Framer Motion 用于复杂动画'
    ];

    // 分析全局依赖
    const elementTypes = this.extractElementTypes(config);
    
    if (elementTypes.has('chart')) {
      requirements.push('需要图表库: npm install recharts 或 npm install chart.js');
    }
    
    if (elementTypes.has('code')) {
      requirements.push('需要代码高亮: npm install prismjs react-syntax-highlighter');
    }

    if (elementTypes.has('video')) {
      requirements.push('需要视频播放支持和编解码器');
    }

    return requirements;
  }

  /**
   * 生成项目结构建议
   */
  generateProjectStructure(config: ProjectConfig): { [path: string]: string } {
    const structure: { [path: string]: string } = {};

    // 生成基础目录结构
    structure['src/compositions/'] = '存放自动生成的视频组件';
    structure['src/scenes/'] = '存放场景组件';
    structure['src/elements/'] = '存放元素组件';
    structure['src/templates/'] = '存放模板配置文件';
    structure['scripts/'] = '存放自动化脚本';

    // 为每个视频生成专门的文件
    config.videos.forEach(video => {
      structure[`src/compositions/Generated${video.id}.tsx`] = 
        `${video.name} 的视频组件`;
      structure[`templates/${video.id}.config.json`] = 
        `${video.name} 的配置文件`;
    });

    return structure;
  }

  /**
   * 生成开发指南
   */
  generateDevelopmentGuide(config: ProjectConfig): string {
    return `
# ${config.name} 开发指南

## 项目概述
${config.description || '基于配置的视频生成项目'}

## 快速开始

### 1. 安装依赖
\`\`\`bash
npm install
\`\`\`

### 2. 启动开发服务器
\`\`\`bash
npm run dev
\`\`\`

### 3. 编辑配置文件
在 \`templates/\` 目录下修改对应的配置文件，系统会自动重新生成视频组件。

## 视频配置

### 支持的元素类型
${this.generateElementTypeDoc()}

### 支持的动画类型
${this.generateAnimationTypeDoc()}

## 自定义组件

如果需要添加自定义元素类型，请：

1. 在 \`src/elements/\` 目录下创建新的组件
2. 在 \`ElementGenerator.ts\` 中添加对应的生成逻辑
3. 更新类型定义文件

## 渲染视频

### 预览模式
\`\`\`bash
npm run preview
\`\`\`

### 渲染到文件
\`\`\`bash
npm run render -- --id="VideoId" --output="output.mp4"
\`\`\`

## 批量处理

使用提供的脚本可以批量处理多个配置文件：

\`\`\`bash
node scripts/batch-render.js
\`\`\`
`;
  }

  /**
   * 生成代码模板
   */
  generateComponentTemplate(elementType: string): string {
    switch (elementType) {
      case 'text':
        return this.generateTextComponentTemplate();
      case 'chart':
        return this.generateChartComponentTemplate();
      case 'code':
        return this.generateCodeComponentTemplate();
      default:
        return this.generateDefaultComponentTemplate(elementType);
    }
  }

  /**
   * 提取所有使用的元素类型
   */
  private extractElementTypes(config: ProjectConfig): Set<string> {
    const types = new Set<string>();
    
    config.videos.forEach(video => {
      video.scenes.forEach(scene => {
        scene.elements.forEach(element => {
          types.add(element.type);
        });
      });
    });

    return types;
  }

  /**
   * 生成元素类型文档
   */
  private generateElementTypeDoc(): string {
    return `
- **text**: 文本元素，支持多种动画效果
- **logo**: Logo展示，支持多种变体
- **image**: 图片元素，支持缩放和滤镜
- **video**: 视频元素，支持播放控制
- **button**: 按钮元素，支持交互样式
- **chart**: 图表元素，支持动态数据展示
- **code**: 代码块，支持语法高亮
- **shape**: 基础图形，支持各种形状
`;
  }

  /**
   * 生成动画类型文档
   */
  private generateAnimationTypeDoc(): string {
    return `
- **fadeIn/fadeOut**: 淡入淡出效果
- **slideIn/slideOut**: 滑动进入退出
- **zoomIn/zoomOut**: 缩放动画
- **rotate**: 旋转动画
- **typewriter**: 打字机效果
- **bounce**: 弹跳效果
- **elastic**: 弹性动画
`;
  }

  /**
   * 生成文本组件模板
   */
  private generateTextComponentTemplate(): string {
    return `
import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface AnimatedTextProps {
  text: string;
  animation: 'fadeIn' | 'slideIn' | 'typewriter';
  duration: number;
  delay?: number;
  style?: React.CSSProperties;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  animation,
  duration,
  delay = 0,
  style = {}
}) => {
  const frame = useCurrentFrame();
  const fps = 30;
  
  const animationProgress = interpolate(
    frame,
    [delay * fps, (delay + duration) * fps],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  let animatedStyle: React.CSSProperties = {};

  switch (animation) {
    case 'fadeIn':
      animatedStyle.opacity = animationProgress;
      break;
    case 'slideIn':
      animatedStyle.transform = \`translateX(\${(1 - animationProgress) * -100}px)\`;
      animatedStyle.opacity = animationProgress;
      break;
    case 'typewriter':
      const visibleLength = Math.floor(text.length * animationProgress);
      return (
        <div style={{ ...style, ...animatedStyle }}>
          {text.substring(0, visibleLength)}
        </div>
      );
  }

  return (
    <div style={{ ...style, ...animatedStyle }}>
      {text}
    </div>
  );
};

export default AnimatedText;
`;
  }

  /**
   * 生成图表组件模板
   */
  private generateChartComponentTemplate(): string {
    return `
import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface AnimatedChartProps {
  data: any[];
  duration: number;
  delay?: number;
  style?: React.CSSProperties;
}

const AnimatedChart: React.FC<AnimatedChartProps> = ({
  data,
  duration,
  delay = 0,
  style = {}
}) => {
  const frame = useCurrentFrame();
  const fps = 30;
  
  const progress = interpolate(
    frame,
    [delay * fps, (delay + duration) * fps],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const visibleDataPoints = Math.floor(data.length * progress);
  const animatedData = data.slice(0, visibleDataPoints);

  return (
    <div style={style}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={animatedData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnimatedChart;
`;
  }

  /**
   * 生成代码组件模板
   */
  private generateCodeComponentTemplate(): string {
    return `
import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface AnimatedCodeProps {
  code: string;
  language: string;
  duration: number;
  delay?: number;
  style?: React.CSSProperties;
}

const AnimatedCode: React.FC<AnimatedCodeProps> = ({
  code,
  language,
  duration,
  delay = 0,
  style = {}
}) => {
  const frame = useCurrentFrame();
  const fps = 30;
  
  const progress = interpolate(
    frame,
    [delay * fps, (delay + duration) * fps],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const visibleLength = Math.floor(code.length * progress);
  const visibleCode = code.substring(0, visibleLength);

  return (
    <div style={style}>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers
      >
        {visibleCode}
      </SyntaxHighlighter>
    </div>
  );
};

export default AnimatedCode;
`;
  }

  /**
   * 生成默认组件模板
   */
  private generateDefaultComponentTemplate(elementType: string): string {
    return `
import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface ${elementType}Props {
  duration: number;
  delay?: number;
  style?: React.CSSProperties;
  // 添加其他特定属性
}

const ${elementType}: React.FC<${elementType}Props> = ({
  duration,
  delay = 0,
  style = {}
}) => {
  const frame = useCurrentFrame();
  const fps = 30;
  
  const progress = interpolate(
    frame,
    [delay * fps, (delay + duration) * fps],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  return (
    <div style={{
      ...style,
      opacity: progress
    }}>
      {/* ${elementType} content */}
    </div>
  );
};

export default ${elementType};
`;
  }
}

export default CodeGenerator;