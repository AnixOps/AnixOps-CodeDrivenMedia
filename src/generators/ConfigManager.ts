import fs from 'fs';
import path from 'path';
import { ProjectConfig, VideoConfig } from '../types/config';
import { VideoGenerator } from './VideoGenerator';

/**
 * 配置管理器 - 加载和管理视频配置文件
 */
export class ConfigManager {
  private templateDir: string;
  private outputDir: string;
  private videoGenerator: VideoGenerator;

  constructor(templateDir: string = 'templates', outputDir: string = 'src/compositions') {
    this.templateDir = templateDir;
    this.outputDir = outputDir;
    this.videoGenerator = new VideoGenerator();
  }

  /**
   * 从JSON文件加载配置
   */
  async loadConfig(configPath: string): Promise<ProjectConfig> {
    try {
      const configContent = await fs.promises.readFile(configPath, 'utf-8');
      const config = JSON.parse(configContent) as ProjectConfig;
      this.validateConfig(config);
      return config;
    } catch (error) {
      throw new Error(`Failed to load config from ${configPath}: ${error}`);
    }
  }

  /**
   * 保存配置到文件
   */
  async saveConfig(config: ProjectConfig, configPath: string): Promise<void> {
    try {
      const configContent = JSON.stringify(config, null, 2);
      await fs.promises.writeFile(configPath, configContent, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to save config to ${configPath}: ${error}`);
    }
  }

  /**
   * 扫描模板目录，加载所有配置文件
   */
  async loadAllConfigs(): Promise<ProjectConfig[]> {
    const configs: ProjectConfig[] = [];
    
    try {
      const files = await fs.promises.readdir(this.templateDir);
      const configFiles = files.filter(file => file.endsWith('.json'));

      for (const file of configFiles) {
        const configPath = path.join(this.templateDir, file);
        try {
          const config = await this.loadConfig(configPath);
          configs.push(config);
        } catch (error) {
          console.warn(`Warning: Failed to load config ${file}:`, error);
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not read template directory ${this.templateDir}:`, error);
    }

    return configs;
  }

  /**
   * 根据配置生成视频组件文件
   */
  async generateVideoFiles(config: ProjectConfig): Promise<{
    generatedFiles: string[];
    requirements: string[];
  }> {
    const { codeFiles, requirements } = this.videoGenerator.generateProject(config);
    const generatedFiles: string[] = [];

    // 确保输出目录存在
    await this.ensureDirectoryExists(this.outputDir);

    // 写入生成的代码文件
    for (const [filename, content] of Object.entries(codeFiles)) {
      const fullPath = path.resolve(filename);
      await this.ensureDirectoryExists(path.dirname(fullPath));
      await fs.promises.writeFile(fullPath, content, 'utf-8');
      generatedFiles.push(fullPath);
    }

    // 生成索引文件
    const indexContent = this.generateIndexFile(config);
    const indexPath = path.join(this.outputDir, 'index.ts');
    await fs.promises.writeFile(indexPath, indexContent, 'utf-8');
    generatedFiles.push(indexPath);

    return { generatedFiles, requirements };
  }

  /**
   * 生成开发指南文件
   */
  async generateDevelopmentGuide(config: ProjectConfig): Promise<string> {
    const guide = this.videoGenerator['codeGenerator'].generateDevelopmentGuide(config);
    const guidePath = path.join('docs', 'generated-guide.md');
    
    await this.ensureDirectoryExists(path.dirname(guidePath));
    await fs.promises.writeFile(guidePath, guide, 'utf-8');
    
    return guidePath;
  }

  /**
   * 验证配置文件格式
   */
  private validateConfig(config: ProjectConfig): void {
    if (!config.name) {
      throw new Error('Project config must have a name');
    }

    if (!config.videos || !Array.isArray(config.videos)) {
      throw new Error('Project config must have a videos array');
    }

    config.videos.forEach((video, index) => {
      this.validateVideoConfig(video, index);
    });
  }

  /**
   * 验证视频配置
   */
  private validateVideoConfig(video: VideoConfig, index: number): void {
    if (!video.id) {
      throw new Error(`Video at index ${index} must have an id`);
    }

    if (!video.duration || video.duration <= 0) {
      throw new Error(`Video ${video.id} must have a positive duration`);
    }

    if (!video.scenes || !Array.isArray(video.scenes)) {
      throw new Error(`Video ${video.id} must have a scenes array`);
    }

    video.scenes.forEach((scene, sceneIndex) => {
      if (!scene.id) {
        throw new Error(`Scene at index ${sceneIndex} in video ${video.id} must have an id`);
      }

      if (!scene.elements || !Array.isArray(scene.elements)) {
        throw new Error(`Scene ${scene.id} must have an elements array`);
      }
    });
  }

  /**
   * 生成索引文件内容
   */
  private generateIndexFile(config: ProjectConfig): string {
    const imports = config.videos.map(video => 
      `import Generated${video.id} from './Generated${video.id}';`
    ).join('\n');

    const exports = config.videos.map(video => 
      `  Generated${video.id},`
    ).join('\n');

    return `${imports}

export {
${exports}
};

export const generatedCompositions = [
${config.videos.map(video => `  '${video.id}',`).join('\n')}
];
`;
  }

  /**
   * 确保目录存在
   */
  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.promises.mkdir(dirPath, { recursive: true });
    } catch (error) {
      // 忽略目录已存在的错误
      if ((error as any).code !== 'EEXIST') {
        throw error;
      }
    }
  }

  /**
   * 创建示例配置
   */
  createExampleConfig(): ProjectConfig {
    return {
      name: "示例项目",
      description: "这是一个自动生成视频的示例项目",
      version: "1.0.0",
      videos: [
        {
          id: "ExampleVideo",
          name: "示例视频",
          description: "展示基本功能的示例视频",
          duration: 10,
          scenes: [
            {
              id: "intro",
              type: "intro",
              duration: 5,
              startTime: 0,
              elements: [
                {
                  id: "title",
                  type: "text",
                  content: {
                    text: "欢迎使用视频生成器"
                  },
                  position: {
                    x: "50%",
                    y: "40%"
                  },
                  animation: {
                    type: "fadeIn",
                    duration: 2,
                    delay: 0
                  },
                  timing: {
                    start: 0,
                    duration: 5
                  },
                  style: {
                    fontSize: "48px",
                    color: "#ffffff",
                    textAlign: "center"
                  }
                }
              ]
            },
            {
              id: "outro",
              type: "outro",
              duration: 5,
              startTime: 5,
              elements: [
                {
                  id: "goodbye",
                  type: "text",
                  content: {
                    text: "谢谢观看"
                  },
                  position: {
                    x: "50%",
                    y: "50%"
                  },
                  animation: {
                    type: "slideIn",
                    duration: 2,
                    delay: 1
                  },
                  timing: {
                    start: 1,
                    duration: 4
                  },
                  style: {
                    fontSize: "36px",
                    color: "#ffffff",
                    textAlign: "center"
                  }
                }
              ]
            }
          ],
          theme: {
            primary: "#007acc",
            secondary: "#ff6b6b",
            accent: "#4ecdc4",
            background: "#1a1a1a",
            text: "#ffffff"
          }
        }
      ],
      globalTheme: {
        primary: "#007acc",
        secondary: "#ff6b6b",
        accent: "#4ecdc4",
        background: "#1a1a1a",
        text: "#ffffff"
      },
      requirements: [
        {
          file: "src/components/atoms/AnimatedText.tsx",
          description: "需要动画文本组件"
        }
      ]
    };
  }
}

export default ConfigManager;