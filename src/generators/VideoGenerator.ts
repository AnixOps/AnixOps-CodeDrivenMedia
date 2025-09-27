import React from 'react';
import { Composition } from 'remotion';
import { VideoConfig, SceneConfig, ProjectConfig } from '../types/config';
import { SceneGenerator } from './SceneGenerator';
import { CodeGenerator } from './CodeGenerator';

/**
 * 视频生成器 - 根据配置自动生成视频组件
 */
export class VideoGenerator {
  private sceneGenerator: SceneGenerator;
  private codeGenerator: CodeGenerator;

  constructor() {
    this.sceneGenerator = new SceneGenerator();
    this.codeGenerator = new CodeGenerator();
  }

  /**
   * 根据项目配置生成所有视频组件
   */
  generateProject(config: ProjectConfig): {
    compositions: JSX.Element[];
    requirements: string[];
    codeFiles: { [filename: string]: string };
  } {
    const compositions: JSX.Element[] = [];
    const requirements: string[] = [];
    const codeFiles: { [filename: string]: string } = {};

    // 生成每个视频的组件
    config.videos.forEach(videoConfig => {
      const { composition, requirements: videoRequirements, codeFiles: videoCodeFiles } = this.generateVideo(videoConfig);
      compositions.push(composition);
      requirements.push(...videoRequirements);
      Object.assign(codeFiles, videoCodeFiles);
    });

    // 生成全局需求
    const globalRequirements = this.codeGenerator.generateGlobalRequirements(config);
    requirements.push(...globalRequirements);

    return {
      compositions,
      requirements,
      codeFiles
    };
  }

  /**
   * 生成单个视频组件
   */
  generateVideo(config: VideoConfig): {
    composition: JSX.Element;
    requirements: string[];
    codeFiles: { [filename: string]: string };
  } {
    const requirements: string[] = [];
    const codeFiles: { [filename: string]: string } = {};

    // 生成视频组件代码
    const componentCode = this.generateVideoComponent(config);
    const componentFilename = `src/compositions/Generated${config.id}.tsx`;
    codeFiles[componentFilename] = componentCode;

    // 分析场景需求
    config.scenes.forEach(sceneConfig => {
      const sceneRequirements = this.analyzeSceneRequirements(sceneConfig);
      requirements.push(...sceneRequirements);
    });

    // 创建 Remotion Composition
    const VideoComponent = this.renderVideo(config);
    const composition = React.createElement(Composition, {
      id: config.id,
      component: VideoComponent,
      durationInFrames: Math.floor(config.duration * (config.fps || 30)),
      fps: config.fps || 30,
      width: config.width || 1920,
      height: config.height || 1080,
      defaultProps: {
        config: config
      }
    });

    return {
      composition,
      requirements,
      codeFiles
    };
  }

  /**
   * 渲染视频组件
   */
  private renderVideo(config: VideoConfig): React.FC {
    return () => {
      const scenes = config.scenes.map((sceneConfig, index) => 
        this.sceneGenerator.generateScene(sceneConfig, index, config.theme)
      );
      
      return React.createElement('div', {
        style: {
          width: '100%',
          height: '100%',
          position: 'relative',
          backgroundColor: config.theme?.background || '#000000'
        }
      }, scenes);
    };
  }

  /**
   * 生成视频组件代码字符串
   */
  private generateVideoComponent(config: VideoConfig): string {
    const imports = this.generateImports(config);
    const sceneComponents = config.scenes.map(scene => 
      this.sceneGenerator.generateSceneCode(scene)
    ).join('\n\n');

    return `${imports}

export interface ${config.id}Props {
  config: VideoConfig;
}

const ${config.id}: React.FC<${config.id}Props> = ({ config }) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: config.theme?.background || '#000000'
    }}>
      ${this.generateSceneRenderCode(config.scenes)}
    </div>
  );
};

${sceneComponents}

export default ${config.id};
`;
  }

  /**
   * 生成导入语句
   */
  private generateImports(config: VideoConfig): string {
    const baseImports = [
      "import React from 'react';",
      "import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';",
      "import { VideoConfig } from '../types/config';"
    ];

    // 根据使用的元素类型添加导入
    const elementTypes = new Set<string>();
    config.scenes.forEach(scene => {
      scene.elements.forEach(element => {
        elementTypes.add(element.type);
      });
    });

    elementTypes.forEach(type => {
      switch (type) {
        case 'text':
          baseImports.push("import { AnimatedText } from '../components/atoms/AnimatedText';");
          break;
        case 'logo':
          baseImports.push("import { Logo } from '../components/atoms/Logo';");
          break;
        case 'button':
          baseImports.push("import { Button } from '../components/atoms/Button';");
          break;
      }
    });

    return baseImports.join('\n');
  }

  /**
   * 生成场景渲染代码
   */
  private generateSceneRenderCode(scenes: SceneConfig[]): string {
    return scenes.map((scene, index) => `
      <Scene${index}
        key="${scene.id}"
        config={scene}
        visible={currentFrame >= ${scene.startTime * 30} && currentFrame < ${(scene.startTime + scene.duration) * 30}}
      />`
    ).join('');
  }

  /**
   * 分析场景代码需求
   */
  private analyzeSceneRequirements(sceneConfig: SceneConfig): string[] {
    const requirements: string[] = [];

    // 分析元素需求
    sceneConfig.elements.forEach(element => {
      switch (element.type) {
        case 'text':
          requirements.push('需要文本动画组件 (AnimatedText)');
          break;
        case 'logo':
          requirements.push('需要Logo组件，支持多种变体');
          break;
        case 'image':
          requirements.push('需要图片处理和动画能力');
          break;
        case 'chart':
          requirements.push('需要图表渲染库 (如 Chart.js 或 D3.js)');
          break;
        case 'code':
          requirements.push('需要代码高亮组件 (如 Prism.js)');
          break;
      }
    });

    return [...new Set(requirements)]; // 去重
  }
}

export default VideoGenerator;